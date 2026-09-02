export type SocialLink = {
  id?: string | null;
  platform: string;
  link: string;
  iconStyle?: "fill" | "outline" | null;
  cursorGrow?: boolean | null;
};

export const socialLabels: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  x: "X / Twitter",
};
