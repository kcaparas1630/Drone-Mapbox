// Opens the popup for a fire clicked or tapped on the map (behaviour §7).
import { fireSelected } from '@/entities/fire';

// Selects the fire by its BCWS number so the popup can show it.
export function selectFire(fireNumber: string): AppThunk {
  return (dispatch) => {
    dispatch(fireSelected(fireNumber));
  };
}
