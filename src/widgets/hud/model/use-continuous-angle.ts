// Unwraps a 0–360° heading into a continuous angle so a CSS rotation never spins the long way round.
import { useState } from 'react';

// Returns an angle equal to angleDeg modulo 360 that moves by the shortest turn from the previous one.
export function useContinuousAngle(angleDeg: number): number {
  const [tracked, setTracked] = useState({ inputDeg: angleDeg, outputDeg: angleDeg });
  if (tracked.inputDeg === angleDeg) {
    return tracked.outputDeg;
  }
  const turnDeg = ((((angleDeg - tracked.inputDeg) % 360) + 540) % 360) - 180;
  const next = { inputDeg: angleDeg, outputDeg: tracked.outputDeg + turnDeg };
  setTracked(next);
  return next.outputDeg;
}
