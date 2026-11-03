type IconName = "home" | "camera" | "flower" | "focus" | "cloud" | "sparkle" | "arrow";
const paths: Record<IconName, React.ReactNode> = {
  home: <><path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z"/><path d="M9 21v-7h6v7"/></>,
  camera: <><path d="M4 7h4l2-3h4l2 3h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"/><circle cx="12" cy="14" r="4"/><path d="M18 10h1"/></>,
  flower: <><path d="M12 7C7-3 1 7 7 10c-11 0-5 12 1 7-4 10 9 10 8 1 8 6 12-6 3-7 7-7-5-12-7-4Z"/><circle cx="12" cy="12" r="2"/></>,
  focus: <><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/><circle cx="12" cy="12" r="4"/></>,
  cloud: <><path d="M7 18a5 5 0 1 1 0-10 6 6 0 0 1 11-1 5.5 5.5 0 0 1 0 11"/><path d="m9 16 6 6m0-6-6 6"/></>,
  sparkle: <path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z"/>,
  arrow: <path d="M5 12h14m-5-5 5 5-5 5"/>,
};
export function Icon({ name }: { name: IconName }) {
  return <svg className="cute-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{paths[name]}</svg>;
}