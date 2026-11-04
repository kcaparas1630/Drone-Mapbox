// Root component: gates on configuration and WebGL2, then provides the store and renders the map page.
import { Provider } from 'react-redux';

import { MapPage } from '@/pages/map-page';
import type { EnvConfig } from '@/shared/config';
import type { Result } from '@/shared/lib/result';
import { Toaster } from '@/shared/ui';

import { store } from './store';
import { ConfigErrorScreen } from './ui/config-error-screen';
import { UnsupportedBrowserScreen } from './ui/unsupported-browser-screen';

export type AppProps = { env: Result<EnvConfig, string>; isWebgl2Available: boolean };

// Renders the configuration error, the unsupported-browser message or the app.
export function App({ env, isWebgl2Available }: AppProps) {
  if (!env.isOk) {
    return <ConfigErrorScreen message={env.error} />;
  }
  if (!isWebgl2Available) {
    return <UnsupportedBrowserScreen />;
  }
  return (
    <Provider store={store}>
      <MapPage mapboxToken={env.value.mapboxToken} isDevBuild={env.value.isDevBuild} />
      <Toaster />
    </Provider>
  );
}
