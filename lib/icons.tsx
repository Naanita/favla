import { Sprout, Users, Droplets, Heart, Leaf, Compass, type LucideProps } from "lucide-react";

const iconRegistry = {
  sprout: Sprout,
  users: Users,
  droplets: Droplets,
  heart: Heart,
  leaf: Leaf,
  compass: Compass,
};

/**
 * Renders the icon for a Payload-authored icon key. Kept as its own stable
 * component (rather than resolving to a component reference inline) so
 * selecting which icon to show doesn't read as "creating a component during
 * render" to React's static-components lint rule.
 */
export function DynamicIcon({ iconName, ...props }: { iconName?: string | null } & LucideProps) {
  const Icon = (iconName && iconRegistry[iconName as keyof typeof iconRegistry]) || Sprout;
  return <Icon {...props} />;
}
