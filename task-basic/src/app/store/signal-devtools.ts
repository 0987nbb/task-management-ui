declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: {
      connect: (options: { name: string }) => ReduxDevtoolsConnection;
    };
  }
}

interface ReduxDevtoolsConnection {
  init: (state: unknown) => void;
  send: (action: string, state: unknown) => void;
}

export function connectSignalDevtools(name: string): ReduxDevtoolsConnection | null {
  if (typeof window === 'undefined' || !window.__REDUX_DEVTOOLS_EXTENSION__) {
    return null;
  }

  return window.__REDUX_DEVTOOLS_EXTENSION__.connect({ name });
}
