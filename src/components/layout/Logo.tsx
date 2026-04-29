import { useId } from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 32, className = '' }: LogoProps) {
  const reactId = useId();
  const uid = `ci-${reactId.replace(/:/g, '')}`;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      fill="none"
      aria-label="CloudInfra"
    >
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6366f1" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
        <linearGradient id={`${uid}-cloud`} x1="12" y1="20" x2="52" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#f1f5ff" />
        </linearGradient>
        <linearGradient id={`${uid}-na`} x1="0" y1="0" x2="6" y2="6" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6366f1" />
          <stop offset="1" stopColor="#4f46e5" />
        </linearGradient>
        <linearGradient id={`${uid}-nb`} x1="0" y1="0" x2="6" y2="6" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#a855f7" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>

      <rect width="64" height="64" rx="14" fill={`url(#${uid}-bg)`} />
      <rect width="64" height="64" rx="14" fill="#ffffff" fillOpacity="0.06" />

      <path
        d="M19 44.5c-4 0-7-3-7-6.8 0-3.3 2.3-6 5.5-6.6.1-5.4 4.6-9.6 10.1-9.6 3.7 0 7 2 8.7 5 1.4-1.2 3.3-2 5.4-2 4.7 0 8.5 3.8 8.5 8.5 0 .5 0 1-.1 1.4 2.7.8 4.6 3.3 4.6 6.2 0 3.6-3 6.5-6.6 6.5h-29z"
        fill={`url(#${uid}-cloud)`}
      />

      <line x1="23" y1="36" x2="32" y2="30" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.45" />
      <line x1="32" y1="30" x2="41" y2="36" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.45" />

      <circle cx="23" cy="36" r="3.2" fill={`url(#${uid}-na)`} />
      <circle cx="32" cy="30" r="3.6" fill={`url(#${uid}-nb)`} />
      <circle cx="41" cy="36" r="3.2" fill={`url(#${uid}-na)`} />

      <circle cx="23" cy="36" r="1.1" fill="#ffffff" fillOpacity="0.7" />
      <circle cx="32" cy="30" r="1.3" fill="#ffffff" fillOpacity="0.7" />
      <circle cx="41" cy="36" r="1.1" fill="#ffffff" fillOpacity="0.7" />
    </svg>
  );
}
