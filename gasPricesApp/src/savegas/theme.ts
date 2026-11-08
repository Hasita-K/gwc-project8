export const colors = {
  primary: "#1f4d36",
  primaryDark: "#173e2b",
  primarySoft: "#e4efe8",
  primaryPale: "#f0f6f2",
  orange: "#ed7d45",
  orangeSoft: "#fff0e8",
  cream: "#f8f7f2",
  white: "#ffffff",
  ink: "#17221c",
  muted: "#737d77",
  line: "#e5e9e5",
};

// Soft green-tinted shadow (iOS uses shadow*, Android uses elevation)
export const shadow = (opacity = 0.12, radius = 12, y = 6, elevation = 3) => ({
  shadowColor: "#1f4d36",
  shadowOpacity: opacity,
  shadowRadius: radius,
  shadowOffset: { width: 0, height: y },
  elevation,
});
