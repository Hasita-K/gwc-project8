import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";

type Props = {
  distance: string;
  driveTime: string;
  fuelCost: string;
  savings: string;
};

export default function SummaryBox({
  distance,
  driveTime,
  fuelCost,
  savings,
}: Props) {
  const metrics = [
    { label: "Distance", value: distance },
    { label: "Drive time", value: driveTime },
    { label: "Fuel cost", value: fuelCost },
    { label: "Est. savings", value: savings, green: true },
  ];

  return (
    <View style={styles.box}>
      {metrics.map((m, i) => (
        <View key={m.label} style={styles.metric}>
          {i > 0 && <View style={styles.divider} />}
          <Text style={styles.label} numberOfLines={1}>
            {m.label}
          </Text>
          <Text style={[styles.value, m.green && { color: colors.primary }]}>
            {m.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    minHeight: 92,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "rgba(219,232,222,0.95)",
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.96)",
    paddingVertical: 14,
    paddingHorizontal: 8,
    shadowColor: colors.primary,
    shadowOpacity: 0.13,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  metric: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  divider: {
    position: "absolute",
    top: 7,
    bottom: 7,
    left: 0,
    width: 1,
    backgroundColor: colors.line,
  },
  label: { marginBottom: 5, color: colors.muted, fontSize: 8, fontWeight: "600" },
  value: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
});
