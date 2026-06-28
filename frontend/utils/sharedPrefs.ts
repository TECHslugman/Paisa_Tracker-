import { NativeModules } from 'react-native';

const { SharedPrefs } = NativeModules;

export const saveUserId = (userId: string) => {
  if (SharedPrefs?.saveUserId) {
    SharedPrefs.saveUserId(userId);
  }
};