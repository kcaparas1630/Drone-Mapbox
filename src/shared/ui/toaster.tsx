// The shadcn/ui toaster (sonner) themed for the dark map overlay; mounted once by the app.
import { Toaster as SonnerToaster } from 'sonner';

// Renders the toast region at the bottom centre, above the joystick on touch devices.
export function Toaster() {
  return <SonnerToaster theme="dark" position="bottom-center" richColors closeButton />;
}
