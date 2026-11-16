import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";

type Props = {
  number: number;
  price: string;
  cheapest?: boolean;
  selected?: boolean;
  left: `${number}%`;
  top: `${number}%`;
  onPress: () => void;
};

const W = 90;
const H = 52;

export default function PricePin({
  number,
  price,
  cheapest,
  selected,
  left,
  top,
  onPress,
}: Props) {
  const bg = cheapest ? colors.primary : "#69756e";
  const badgeBg = cheapest ? colors.primary : "#4e5953";

  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={`Stop ${number}, ${price} per gallon`}
      style={[
        styles.wrap,
        { left, top, zIndex: selected ? 9 : 8 },
      ]}
    >
      <View>
        <View
          style={[
            styles.ring,
            selected && { borderColor: "rgba(31,77,54,0.22)" },
          ]}
        >
          <View style={[styles.pill, { backgroundColor: bg }]}>
            <Text style={styles.price}>{price}</Text>
          </View>
        </View>
        <View style={[styles.badge, { backgroundColor: badgeBg }]}>
          <Text style={styles.badgeText}>{number}</Text>
        </View>
      </View>
      <View style={[styles.arrow, { backgroundColor: bg }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    width: W,
    height: H,
    marginLeft: -W / 2,
    marginTop: -H / 2,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  ring: { borderWidth: 3, borderColor: "transparent", borderRadius: 999 },
  pill: {
    borderWidth: 3,
    borderColor: colors.white,
    borderRadius: 999,
    paddingVertical: 7,
    paddingLeft: 14,
    paddingRight: 10,
  },
  price: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "800",
  },
  badge: {
    position: "absolute",
    top: -8,
    left: -4,
    width: 21,
    height: 21,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: 11,
  },
  badgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: "800",
  },
  arrow: {
    width: 9,
    height: 9,
    marginTop: -6,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.white,
    transform: [{ rotate: "45deg" }],
  },
});
