import { Pressable, StyleSheet, Text, View } from "react-native";
import Icon from "./Icon";
import { colors } from "../theme";
import type { FuelStop } from "../types";

type Props = {
  stop: FuelStop;
  selected: boolean;
  navigating?: boolean;
  onPress: () => void;
  onNavigate: () => void;
};

export default function StopRow({
  stop,
  selected,
  navigating,
  onPress,
  onNavigate,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.row, selected && styles.selected]}
    >
      <View style={styles.num}>
        <Text style={styles.numText}>{stop.id}</Text>
      </View>

      <View style={styles.main}>
        <View style={styles.title}>
          <Text numberOfLines={1} style={styles.station}>
            {stop.station}
          </Text>
          <Text numberOfLines={1} style={styles.brand}>
            {stop.brand}
          </Text>
        </View>
        <Text numberOfLines={1} style={styles.address}>
          {stop.address}
        </Text>
        <Text style={styles.meta}>{stop.detour}</Text>
      </View>

      <View style={styles.numbers}>
        <Text style={styles.price}>
          {stop.price}
          <Text style={styles.perGal}>/gal</Text>
        </Text>
        <Pressable onPress={onNavigate} style={styles.navButton}>
          <Icon name="navigation" size={12} color={colors.primary} />
          <Text style={styles.navText}>{navigating ? "Ready" : "Navigate"}</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 94,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 17,
    backgroundColor: colors.white,
    paddingVertical: 12,
    paddingHorizontal: 11,
  },
  selected: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  num: {
    width: 27,
    height: 27,
    marginRight: 3,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: colors.primary,
  },
  numText: { color: colors.white, fontSize: 11, fontWeight: "800" },
  main: { flex: 1, minWidth: 0 },
  title: { flexDirection: "row", alignItems: "baseline", gap: 6 },
  station: { flexShrink: 1, color: colors.ink, fontSize: 13, fontWeight: "700" },
  brand: { color: colors.primary, fontSize: 9, fontWeight: "700" },
  address: { marginTop: 5, color: colors.muted, fontSize: 9, lineHeight: 12 },
  meta: { marginTop: 5, color: colors.primary, fontSize: 9, fontWeight: "600" },
  numbers: {
    alignSelf: "stretch",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  price: { color: colors.primary, fontSize: 14, fontWeight: "700" },
  perGal: { color: colors.muted, fontSize: 8, fontWeight: "500" },
  navButton: {
    minHeight: 31,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 10,
    backgroundColor: colors.primaryPale,
    paddingHorizontal: 8,
  },
  navText: { color: colors.primary, fontSize: 9, fontWeight: "700" },
});
