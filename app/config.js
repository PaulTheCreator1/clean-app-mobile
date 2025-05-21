import Constants from 'expo-constants';

const debuggerHost = Constants.expoConfig?.hostUri?.split(':')[0];

export const BASE_URL = `http://${debuggerHost}:5000`;
