// Typed useSelector for the app store; the only selector hook components may use (convention 005).
import { useSelector } from 'react-redux';

export const useAppSelector = useSelector.withTypes<AppRootState>();
