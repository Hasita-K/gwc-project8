import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Slider from "@react-native-community/slider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "../components/Icon";
import InputCard from "../components/InputCard";
import PrimaryButton from "../components/PrimaryButton";
import { colors, shadow } from "../theme";
import type { TripData } from "../types";

type Props = {
  trip: TripData;
  onChange: (trip: TripData) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function TripFormScreen({ trip, onChange, onBack, onNext }: Props) {
  const insets = useSafeAreaInsets();
  const gallons = (trip.tankSize * trip.fuelLevel) / 100;

  const update = <K extends keyof TripData>(key: K, value: TripData[K]) =>
    onChange({ ...trip, [key]: value });

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.header, { paddingTop: Math.max(8, insets.top) }]}>
        <Pressable
          style={styles.backButton}
          onPress={onBack}
          accessibilityLabel="Back to home"
        >
          <Icon name="back" size={22} color={colors.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Plan your trip</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.intro}>
          <Text style={styles.introTitle}>Tell us about your drive</Text>
          <Text style={styles.introSub}>
            We’ll calculate when and where to fill up.
          </Text>
        </View>

        <View style={styles.stack}>
          <View style={styles.rowFull}>
            <InputCard
              label="Starting location"
              value={trip.start}
              icon="location"
              onChange={(v) => update("start", v)}
            />
          </View>
          <View style={styles.rowFull}>
            <InputCard
              label="Destination"
              value={trip.destination}
              icon="pin"
              onChange={(v) => update("destination", v)}
            />
          </View>

          <View style={styles.vehicleGrid}>
            <InputCard
              label="Vehicle MPG"
              value={trip.mpg}
              type="number"
              suffix="MPG"
              onChange={(v) => update("mpg", Number(v) || 0)}
            />
            <InputCard
              label="Tank size"
              value={trip.tankSize}
              type="number"
              suffix="gal"
              onChange={(v) => update("tankSize", Number(v) || 0)}
            />
          </View>

          <View style={[styles.card, { paddingBottom: 16 }]}>
            <View style={styles.levelHeading}>
              <View>
                <Text style={styles.label}>Current fuel level</Text>
                <Text style={styles.levelBig}>
                  {trip.fuelLevel}%{" "}
                  <Text style={styles.levelSmall}>· {gallons.toFixed(1)} gal</Text>
                </Text>
              </View>
              <View style={styles.fuelIcon}>
                <Icon name="fuel" size={21} color={colors.primary} />
              </View>
            </View>

            <View style={styles.sliderWrap}>
              <View style={styles.reserve} pointerEvents="none">
                <Text style={styles.reserveText}>Reserve</Text>
                <View style={styles.reserveLine} />
              </View>
              <Slider
                style={{ width: "100%", height: 32 }}
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={trip.fuelLevel}
                onValueChange={(v) => update("fuelLevel", Math.round(v))}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor="#dce3dd"
                thumbTintColor={colors.primary}
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>Empty</Text>
                <Text style={styles.sliderLabel}>Full</Text>
              </View>
            </View>
          </View>

          <View style={[styles.card, { paddingBottom: 15 }]}>
            <Text style={styles.label}>Fuel type</Text>
            <View style={styles.segment}>
              {(["Regular", "Premium"] as const).map((type) => {
                const active = trip.fuelType === type;
                return (
                  <Pressable
                    key={type}
                    onPress={() => update("fuelType", type)}
                    style={[styles.segBtn, active && styles.segActive]}
                  >
                    <Text style={[styles.segText, active && { color: colors.primary }]}>
                      {type}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(16, insets.bottom) }]}>
        <PrimaryButton onPress={onNext} showArrow>
          Find the cheapest plan
        </PrimaryButton>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  header: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.4,
  },
  backButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.9)",
    ...shadow(0.07, 8, 3, 1),
  },
  scroll: { paddingTop: 10, paddingHorizontal: 16, paddingBottom: 120 },
  intro: { marginTop: 8, marginBottom: 20, marginHorizontal: 2 },
  introTitle: {
    color: colors.ink,
    fontSize: 23,
    fontWeight: "800",
    letterSpacing: -0.7,
  },
  introSub: { marginTop: 5, color: colors.muted, fontSize: 13, lineHeight: 19 },
  stack: { gap: 12 },
  rowFull: { flexDirection: "row" },
  vehicleGrid: { flexDirection: "row", gap: 12 },
  card: {
    borderWidth: 1,
    borderColor: "rgba(226,232,227,0.9)",
    borderRadius: 20,
    backgroundColor: colors.white,
    paddingTop: 14,
    paddingHorizontal: 15,
    ...shadow(0.05, 10, 3, 1),
  },
  label: {
    marginBottom: 9,
    color: colors.muted,
    fontSize: 12,
    fontWeight: "600",
  },
  levelHeading: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  levelBig: {
    marginTop: -1,
    color: colors.primary,
    fontSize: 25,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  levelSmall: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0,
  },
  fuelIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
    backgroundColor: colors.primarySoft,
  },
  sliderWrap: { marginTop: 17, paddingTop: 14 },
  reserve: {
    position: "absolute",
    top: 0,
    left: "25%",
    width: 40,
    marginLeft: -20,
    alignItems: "center",
  },
  reserveText: { color: colors.orange, fontSize: 9, fontWeight: "700" },
  reserveLine: { width: 1, height: 18, backgroundColor: colors.orange },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  sliderLabel: { color: colors.muted, fontSize: 10, fontWeight: "600" },
  segment: {
    minHeight: 48,
    flexDirection: "row",
    gap: 4,
    borderRadius: 14,
    backgroundColor: colors.primaryPale,
    padding: 4,
  },
  segBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
  },
  segActive: { backgroundColor: colors.white, ...shadow(0.09, 6, 3, 1) },
  segText: { color: colors.muted, fontSize: 14, fontWeight: "700" },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.cream,
  },
});
