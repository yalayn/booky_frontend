import { useColorScheme as RNUseColorScheme } from 'react-native';

export const useColorScheme = () => {
  const scheme = RNUseColorScheme();
  return scheme === 'dark' ? 'dark' : 'light';
};