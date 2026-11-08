import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Svg, { Circle, Line, Path } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "../components/Icon";
import PrimaryButton from "../components/PrimaryButton";
import { colors, shadow } from "../theme";

export default function HomeScreen({ onNext }: { onNext: () => void }) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      {/* faint decorative map in the background */}
      <Svg
        style={StyleSheet.absoluteFill}
        viewBox="0 0 393 852"
        preserveAspectRatio="xMidYMid slice"
        opacity={0.65}
      >
        <Line x1="-60" y1="260" x2="450" y2="60" stroke="#e3e9e4" strokeWidth="10" strokeLinecap="round" />
        <Line x1="-100" y1="330" x2="330" y2="640" stroke="#e3e9e4" strokeWidth="10" strokeLinecap="round" />
        <Line x1="480" y1="760" x2="120" y2="470" stroke="#e3e9e4" strokeWidth="10" strokeLinecap="round" />
        <Path
          d="M90 120 C 330 60, 380 300, 250 400 S 120 480, 200 520"
          stroke="rgba(31,77,54,0.12)"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        <Circle cx="315" cy="135" r="6.5" stroke="rgba(31,77,54,0.15)" strokeWidth="3" fill="none" />
        <Circle cx="70" cy="480" r="6.5" stroke="rgba(31,77,54,0.15)" strokeWidth="3" fill="none" />
      </Svg>

      <View style={[styles.brand, { top: height * 0.24 }]}>
        <View style={styles.logo}>
          <Icon name="fuel" size={35} color={colors.white} />
        </View>
        <Text style={styles.title}>SaveGas</Text>
        <Text style={styles.subtitle}>Fuel smarter. Drive cheaper.</Text>
      </View>

      <View
        style={[
          styles.action,
          { bottom: height * 0.15 + Math.max(16, insets.bottom) },
        ]}
      >
        <PrimaryButton onPress={onNext} showArrow>
          Plan a trip
        </PrimaryButton>
        <Text style={styles.note}>
          Find the most affordable fuel stops along your route.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f8f9f4" },
  brand: {
    position: "absolute",
    left: 16,
    right: 16,
    alignItems: "center",
  },
  logo: {
    width: 76,
    height: 76,
    marginBottom: 18,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: colors.primary,
    ...shadow(0.22, 18, 10, 8),
  },
  title: {
    color: colors.ink,
    fontSize: 38,
    fontWeight: "800",
    letterSpacing: -1.8,
  },
  subtitle: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 16,
    fontWeight: "500",
  },
  action: { position: "absolute", left: 16, right: 16 },
  note: {
    maxWidth: 280,
    alignSelf: "center",
    marginTop: 13,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
});
