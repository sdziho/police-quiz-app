import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {updateUserFcmToken} from '../Firestore';

const ANDROID_POST_NOTIFICATIONS =
  PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS ??
  'android.permission.POST_NOTIFICATIONS';

const STORAGE_PREMIUM_NOTIFICATION_SETTINGS_PROMPT =
  '@pq/premium_notification_settings_prompt_once';

function promptOpenAppSettingsForNotifications() {
  Alert.alert(
    'Notifications off',
    'Enable notifications in Settings so we can send you alerts.',
    [
      {text: 'Not now', style: 'cancel'},
      {
        text: 'Open settings',
        onPress: () => {
          void Linking.openSettings();
        },
      },
    ],
  );
}

/** Non-premium: prompt whenever permission is missing. Premium: at most one prompt (persisted). */
async function maybePromptOpenAppSettingsForNotifications(isPremium) {
  if (isPremium) {
    const seen = await AsyncStorage.getItem(
      STORAGE_PREMIUM_NOTIFICATION_SETTINGS_PROMPT,
    );
    if (seen === '1') {
      return;
    }
    await AsyncStorage.setItem(
      STORAGE_PREMIUM_NOTIFICATION_SETTINGS_PROMPT,
      '1',
    );
  }
  promptOpenAppSettingsForNotifications();
}

const ANDROID_CHANNEL_ID = 'default';

async function ensureAndroidNotificationChannel() {
  if (Platform.OS !== 'android') {
    return;
  }
  await notifee.createChannel({
    id: ANDROID_CHANNEL_ID,
    name: 'General',
    importance: AndroidImportance.DEFAULT,
  });
}

/**
 * FCM does not show system banners while the app is in the foreground — display a local notification.
 */
async function displayForegroundNotification(remoteMessage) {
  const n = remoteMessage.notification;
  const d = remoteMessage.data ?? {};
  const title = n?.title ?? d.title ?? '';
  const body = n?.body ?? d.body ?? '';
  if (!title && !body) {
    return;
  }

  await ensureAndroidNotificationChannel();

  await notifee.displayNotification({
    title: title || 'Notification',
    body,
    data: d,
    android: {
      channelId: ANDROID_CHANNEL_ID,
      pressAction: {id: 'default'},
    },
    ios: {
      foregroundPresentationOptions: {
        banner: true,
        list: true,
        sound: true,
        badge: true,
      },
    },
  });
}

/**
 * Requests notification permission, registers with FCM, and saves the token to Firestore.
 * @param {{ isPremium?: boolean }} options — when `isPremium`, settings prompt is shown at most once.
 */
export async function registerDeviceForPush(options = {}) {
  const {isPremium = false} = options;

  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      ANDROID_POST_NOTIFICATIONS,
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      await maybePromptOpenAppSettingsForNotifications(isPremium);
      return;
    }
  }

  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (!enabled) {
    await maybePromptOpenAppSettingsForNotifications(isPremium);
    return;
  }

  await ensureAndroidNotificationChannel();

  try {
    const token = await messaging().getToken();
    if (token) {
      await updateUserFcmToken(token);
    }
  } catch (e) {
    console.log('FCM registerDeviceForPush', e);
  }
}

/**
 * Subscribes to token refresh and foreground messages. Returns a cleanup function.
 */
export function subscribeMessagingListeners() {
  const unsubToken = messaging().onTokenRefresh(token => {
    void updateUserFcmToken(token);
  });

  const unsubMsg = messaging().onMessage(async remoteMessage => {
    if (__DEV__) {
      console.log('FCM foreground', remoteMessage);
    }
    await displayForegroundNotification(remoteMessage);
  });

  return () => {
    unsubToken();
    unsubMsg();
  };
}
