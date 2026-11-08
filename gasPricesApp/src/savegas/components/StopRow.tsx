import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";
import type { FuelStop } from "../types";

type Props = {
  stop: FuelStop;
  selected: boolean;
  cheapest?: boolean;
  onPress: () => void;
};

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
          <Text style={styles.station}>{stop.station}</Text>
          <Text style={styles.location}> · {stop.location}</Text>
        </Text>
        <Text style={styles.meta}>{stop.detour}</Text>
        {stop.tag && (
          <View style={styles.tag}>
            <Text numberOfLines={1} style={styles.tagText}>
              {stop.tag}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.numbers}>
        <Text style={styles.price}>
          {stop.price}
          <Text style={styles.perGal}>/gal</Text>
        </Text>
        <Text style={styles.sub}>
          {stop.gallons} gal · {stop.cost}
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
  tag: {
    alignSelf: "flex-start",
    marginTop: 4,
    borderRadius: 999,
    backgroundColor: colors.orangeSoft,
    paddingVertical: 3,
    paddingHorizontal: 6,
  },
  tagText: { color: "#bd5f31", fontSize: 8, fontWeight: "700" },
  numbers: { alignItems: "flex-end" },
  price: { color: colors.primary, fontSize: 13, fontWeight: "700" },
  perGal: { color: colors.muted, fontSize: 8, fontWeight: "500" },
  sub: { marginTop: 5, color: colors.muted, fontSize: 9 },
});
