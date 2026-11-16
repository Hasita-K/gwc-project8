import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";

type Props = {
  totalCost: number;
  savings: number;
  stopCount: number;
};

export default function SummaryBox({ totalCost, savings, stopCount }: Props) {
  const saved = savings > 0.005;
  const badge =
    stopCount === 0
      ? "No stops needed"
      : saved
      ? `You saved $${savings.toFixed(2)}`
      : `${stopCount} fuel stop${stopCount === 1 ? "" : "s"}`;
  const note =
    stopCount === 0
      ? "Your current fuel gets you there with the reserve to spare"
      : saved
      ? "vs. paying the average price along this route"
      : "Cheapest reachable stops along your route";

  return (
    <View style={styles.box}>
      <View style={styles.top}>
        <View>
          <Text style={styles.small}>Total fuel cost</Text>
          <Text style={styles.big}>${totalCost.toFixed(2)}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      </View>
      <Text style={[styles.small, styles.note]}>{note}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderColor: "#dbe8de",
    borderRadius: 20,
    backgroundColor: "#f7fbf8",
    paddingVertical: 14,
    paddingHorizontal: 15,
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  small: { color: colors.muted, fontSize: 10, fontWeight: "600" },
  big: {
    marginTop: 2,
    color: colors.primary,
    fontSize: 25,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  badge: {
    borderRadius: 999,
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  badgeText: { color: colors.white, fontSize: 10, fontWeight: "700" },
  note: { marginTop: 7, fontWeight: "400" },
});
