import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: "1em",
  height: "1em",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Instagram(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Facebook(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M15 8.5h-2a1.5 1.5 0 0 0-1.5 1.5v2h3.3l-.4 3H11.5V21" />
      <path d="M11.5 21v-6h-2v-3h2v-2A3.5 3.5 0 0 1 15 6.5h2v3h-2a.5.5 0 0 0-.5.5v2h2.4l-.4 3h-2v6" />
    </svg>
  );
}

function Linkedin(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <line x1="7.5" y1="10.5" x2="7.5" y2="16.5" />
      <circle cx="7.5" cy="7.2" r="0.4" fill="currentColor" stroke="none" />
      <path d="M11.5 16.5v-4a2 2 0 0 1 4 0v4" />
      <line x1="11.5" y1="10.5" x2="11.5" y2="16.5" />
    </svg>
  );
}

function YouTube(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="6" width="18" height="12" rx="4" />
      <path d="M10.5 9.5v5l4.5-2.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function X(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <line x1="5" y1="5" x2="19" y2="19" />
      <line x1="19" y1="5" x2="5" y2="19" />
    </svg>
  );
}

export const socialIcons: Record<string, (props: IconProps) => React.JSX.Element> = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  youtube: YouTube,
  x: X,
};

export function SocialIcon({ platform, ...props }: { platform: string } & IconProps) {
  const IconComponent = socialIcons[platform];
  if (!IconComponent) return null;
  return <IconComponent {...props} />;
}
