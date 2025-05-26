import { AppState } from 'react-native';
import { useState, useEffect } from 'react';

export default function useIsAppActive() {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      setAppState(nextAppState);
    });
    return () => subscription.remove();
  }, []);

  return appState === 'active';
}
