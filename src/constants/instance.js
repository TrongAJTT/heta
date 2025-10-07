/**
 * Instance-related constants
 */

// 15 soft pastel-like colors for better visibility
export const INSTANCE_COLORS = [
  "#000000", // Black
  "#42A5F5", // Blue 400
  "#66BB6A", // Green 400
  "#EF5350", // Red 400
  "#FFA726", // Orange 400
  "#AB47BC", // Purple 400
  "#26C6DA", // Cyan 400
  "#EC407A", // Pink 400
  "#8D6E63", // Brown 400
  "#78909C", // Blue Grey 400
  "#5C6BC0", // Indigo 400
  "#FFEE58", // Yellow 400
  "#D4E157", // Lime 400
  "#29B6F6", // Light Blue 400
  "#7E57C2", // Deep Purple 400
  "#FFCA28", // Amber 400
];

export const INSTANCE_ICONS = [
  "WorkspacesIcon",
  "WorkIcon",
  "HomeIcon",
  "SchoolIcon",
  "ShoppingCartIcon",
  "SportsEsportsIcon",
  "CodeIcon",
  "DesignServicesIcon",
  "MusicNoteIcon",
  "LocalCafeIcon",
];

export const DEFAULT_INSTANCE = {
  NAME: "Default Instance",
  COLOR: INSTANCE_COLORS[0],
  ICON: "WorkspacesIcon",
};

export default {
  INSTANCE_COLORS,
  INSTANCE_ICONS,
  DEFAULT_INSTANCE,
};
