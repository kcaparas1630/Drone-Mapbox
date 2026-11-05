// The hold-to-boost button between the touch sticks; boost lasts only while a finger is down (§3.2).
import { setTouchDroneInput } from '@/features/control-drone';
import { Button } from '@/shared/ui';

// Renders the button and sets or clears the touch boost on press, release, cancel and slide-off.
export function BoostButton() {
  const stopBoost = () => {
    setTouchDroneInput({ isBoosting: false });
  };
  return (
    <Button
      variant="secondary"
      className="pointer-events-auto mb-2 rounded-full select-none"
      aria-label="Boost (hold)"
      onPointerDown={() => {
        setTouchDroneInput({ isBoosting: true });
      }}
      onPointerUp={stopBoost}
      onPointerCancel={stopBoost}
      onPointerLeave={stopBoost}
    >
      Boost
    </Button>
  );
}
