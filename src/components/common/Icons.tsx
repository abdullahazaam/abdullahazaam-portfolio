import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GithubIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const LinkedinIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const CSharpIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M11 7a5 5 0 0 0-5 5v0a5 5 0 0 0 5 5" />
    <path d="M15 8v8" />
    <path d="M19 8v8" />
    <path d="M13.5 10.5h7" />
    <path d="M13.5 13.5h7" />
  </svg>
);

export const DotNetIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <rect x="2" y="4" width="20" height="16" rx="4" />
    <path d="M7 15V9l4 6V9" />
    <circle cx="14" cy="14" r="1" fill="currentColor" />
    <path d="M16 11v4" />
    <path d="M16 13h2" />
  </svg>
);

export const DatabaseIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
  </svg>
);

export const PhpIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <ellipse cx="12" cy="12" rx="10" ry="7" />
    <path d="M8 9v6" />
    <path d="M8 9h2a2 2 0 0 1 0 4H8" />
    <path d="M13 9v6" />
    <path d="M13 12h2a1.5 1.5 0 0 0 0-3h-2" />
    <path d="M13 12v3" />
  </svg>
);

export const LaravelIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="m3 7 8.5-4 8.5 4v10l-8.5 4L3 17Z" />
    <path d="m11.5 3 8.5 4-8.5 4.5L3 7" />
    <path d="M11.5 11.5v10" />
    <path d="m7.5 9.5 8.5 4" />
  </svg>
);

export const ReactIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <ellipse cx="12" cy="12" rx="10" ry="4.5" />
    <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)" />
    <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)" />
    <circle cx="12" cy="12" r="1.75" fill="currentColor" />
  </svg>
);

export const TypeScriptIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M7 9h6" />
    <path d="M10 9v7" />
    <path d="M14 14.5c.5.5 1.2.8 2 .8 1 0 1.8-.6 1.8-1.5 0-1.8-3.6-1.2-3.6-3.3 0-.8.7-1.5 1.8-1.5.8 0 1.5.3 2 .8" />
  </svg>
);

export const JavaScriptIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M9 13.5c0 1.5-.8 2.5-2.2 2.5-.8 0-1.5-.4-1.8-.8" />
    <path d="M13 14.5c.5.5 1.2.8 2 .8 1 0 1.8-.6 1.8-1.5 0-1.8-3.6-1.2-3.6-3.3 0-.8.7-1.5 1.8-1.5.8 0 1.5.3 2 .8" />
  </svg>
);

export const ThreeJsIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <polygon points="12 3 21 8.5 21 15.5 12 21 3 15.5 3 8.5 12 3" />
    <line x1="12" y1="3" x2="12" y2="21" />
    <polyline points="3 8.5 12 13.5 21 8.5" />
  </svg>
);

export const GsapIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

export const Html5Icon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="m4 3 1.5 15.5L12 21l6.5-2.5L20 3H4Z" />
    <path d="M16.5 7.5H7.5l.5 5h8l-.5 4.5-3.5 1-3.5-1-.2-2" />
  </svg>
);

export const Css3Icon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="m4 3 1.5 15.5L12 21l6.5-2.5L20 3H4Z" />
    <path d="M16 8H8l.5 4h7l-.5 4.5L12 18l-3-1.5-.2-2" />
  </svg>
);

export const TailwindIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M6 12c1.5-3 3.5-4 6-3s3.5 3 6 3 3.5-1 4-2c-1.5 3-3.5 4-6 3s-3.5-3-6-3-3.5 1-4 2Z" />
    <path d="M2 17c1.5-3 3.5-4 6-3s3.5 3 6 3 3.5-1 4-2c-1.5 3-3.5 4-6 3s-3.5-3-6-3-3.5 1-4 2Z" />
  </svg>
);

export const BootstrapIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <path d="M8 8h4.5a2.5 2.5 0 0 1 0 5H8" />
    <path d="M8 12h5a2.5 2.5 0 0 1 0 5H8" />
  </svg>
);

export const GitIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <circle cx="12" cy="4" r="2" />
    <circle cx="6" cy="12" r="2" />
    <circle cx="12" cy="20" r="2" />
    <path d="M12 6v12" />
    <path d="M6 14c0 3 3 5 6 6" />
  </svg>
);
