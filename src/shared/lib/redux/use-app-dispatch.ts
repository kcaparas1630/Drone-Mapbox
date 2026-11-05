// Typed useDispatch for the app store, so thunks are typed at every call site (convention 005).
import { useDispatch } from 'react-redux';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
