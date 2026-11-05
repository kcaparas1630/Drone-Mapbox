// Closes the fire popup (close button, Esc, or after "Fly here").
import { fireDeselected } from '@/entities/fire';

// Clears the selected fire.
export function closeFirePopup(): AppThunk {
  return (dispatch) => {
    dispatch(fireDeselected());
  };
}
