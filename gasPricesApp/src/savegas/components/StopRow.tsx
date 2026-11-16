import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";
import type { PlanStop } from "../types";

type Props = {
  stop: PlanStop;
  selected: boolean;
  cheapest?: boolean;
  onPress: () => void;
};

const money = (n: number) => `$${n.toFixed(2)}`;

export default function StopRow({ stop, selected, cheapest, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.row, selected && styles.selected]}
    >
      <View style={[styles.num, cheapest && { backgroundColor: colors.orange }]}>
        <Text style={styles.numText}>{stop.id}</Text>
      </View>

      <View style={styles.main}>
        <Text numberOfLines={1} style={styles.title}>
          <Text style={styles.station}>{stop.name}</Text>
          <Text style={styles.location}> · Mile {stop.mile_marker}</Text>
        </Text>
        <Text style={styles.meta}>
          Arrive {stop.arrive_fuel_pct}% → leave {stop.leave_fuel_pct}%
        </Text>
        <Text numberOfLines={2} style={styles.reason}>
          {stop.reason}
        </Text>
      </View>

      <View style={styles.numbers}>
        <Text style={styles.price}>
          {money(stop.price)}
          <Text style={styles.perGal}>/gal</Text>
        </Text>
        <Text style={styles.sub}>
          {stop.gallons.toFixed(1)} gal · {money(stop.cost)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 17,
    backgroundColor: colors.white,
    padding: 10,
  },
  selected: {
    borderColor: "#8ab69c",
    shadowColor: colors.primary,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    transform: [{ translateY: -1 }],
  },
  num: {
    width: 27,
    height: 27,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: colors.primary,
  },
  numText: { color: colors.white, fontSize: 11, fontWeight: "800" },
  main: { flex: 1, minWidth: 0 },
  title: { fontSize: 11 },
  station: { fontSize: 12, fontWeight: "700", color: colors.ink },
  location: { color: colors.muted },
  meta: { marginTop: 3, color: colors.muted, fontSize: 9 },
  reason: { marginTop: 3, color: "#bd5f31", fontSize: 9, fontWeight: "600" },
  numbers: { alignItems: "flex-end" },
  price: { color: colors.primary, fontSize: 13, fontWeight: "700" },
  perGal: { color: colors.muted, fontSize: 8, fontWeight: "500" },
  sub: { marginTop: 5, color: colors.muted, fontSize: 9 },
});
