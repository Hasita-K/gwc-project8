import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";

export default function SummaryBox() {
  return (
    <View style={styles.box}>
      <View style={styles.top}>
        <View>
          <Text style={styles.small}>Total fuel cost</Text>
          <Text style={styles.big}>$38.40</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>You saved $6.85</Text>
        </View>
      </View>
      <Text style={[styles.small, styles.note]}>
        vs. filling up when your tank runs low
      </Text>
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
