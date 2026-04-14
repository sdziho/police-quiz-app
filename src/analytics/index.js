import {AppState} from 'react-native';
import analytics from '@react-native-firebase/analytics';

let lastAppState = AppState.currentState;

/**
 * Logs Firebase `app_open` on cold start and when the app returns to the foreground.
 * Data appears in Firebase Analytics and in GA4 after the Firebase project is linked to a GA4 property.
 */
export function initAppOpenTracking() {
  const logAppOpen = () => {
    analytics()
      .logAppOpen()
      .catch(() => {});
  };

  logAppOpen();

  const sub = AppState.addEventListener('change', nextState => {
    if (nextState === 'active' && /inactive|background/.test(lastAppState)) {
      logAppOpen();
    }
    lastAppState = nextState;
  });

  return () => sub.remove();
}
