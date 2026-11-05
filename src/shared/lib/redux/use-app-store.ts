// Typed useStore, used only by the map view to hand the store to the frame loop, which reads getState().
import { useStore } from 'react-redux';

export const useAppStore = useStore.withTypes<AppStore>();
