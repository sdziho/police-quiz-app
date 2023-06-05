import { CardStyleInterpolators } from '@react-navigation/stack';

export const commonNavigationOptions = {
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};

export const linking = {
  prefixes: ['app://police-quiz/'],
  config: {
    screens: {
      Home: {
        path: '/payment-status/:status',
        parse: {
          status: status => status,
        },
      },
    },
  },
};
