/**
 * PLACEHOLDER partners. These names are made up so the layout can be reviewed.
 * Replace them with real organisations only after partnerships are signed.
 */
export interface Partner {
  id: string;
  name: string;
  initials: string;
  hue: string;
}

export const partners: Partner[] = [
  { id: "p1", name: "Partner NGO One", initials: "N1", hue: "#FF3D77" },
  { id: "p2", name: "Safety Collective", initials: "SC", hue: "#E0299B" },
  { id: "p3", name: "Digital Rights Org", initials: "DR", hue: "#8B2FC9" },
  { id: "p4", name: "Women's Helpline Partner", initials: "WH", hue: "#FF8A3D" },
  { id: "p5", name: "Campus Outreach", initials: "CO", hue: "#FF3D77" },
  { id: "p6", name: "Cyber Safety Lab", initials: "CS", hue: "#8B2FC9" },
];
