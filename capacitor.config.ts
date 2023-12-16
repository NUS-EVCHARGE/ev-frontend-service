import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ev.app',
  appName: 'ev-frontend',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;
