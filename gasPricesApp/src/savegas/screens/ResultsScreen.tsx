import { useMemo, useRef, useState } from "react";
import {
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "../components/Icon";
import PrimaryButton from "../components/PrimaryButton";
import StopRow from "../components/StopRow";
import SummaryBox from "../components/SummaryBox";
import { ROUTE_MILES, planStops, stations } from "../calc";
import { END, START, STATION_COORDS } from "../coords";
import { colors, shadow } from "../theme";
import type { FuelStop, TripData } from "../types";

// The route line: start, then every station in order, then the end
const ROUTE_COORDS = [
  START,
  ...stations.map((s) => STATION_COORDS[s.mileMarker]).filter(Boolean),
  END,
];

// The price bubble shown on the map for each fuel stop
function PriceBubble({
  number,
  price,
  cheapest,
  selected,
}: {
  number: number;
  price: string;
  cheapest: boolean;
  selected: boolean;
}) {
  return (
    <View
      style={[
        styles.bubble,
        cheapest && styles.bubbleCheapest,
        selected && styles.bubbleSelected,
      ]}
    >
      <View style={[styles.bubbleNum, cheapest && styles.bubbleNumCheapest]}>
        <Text style={styles.bubbleNumText}>{number}</Text>
      </View>
      <Text style={styles.bubblePrice}>{price}</Text>
    </View>
  );
}

export default function ResultsScreen({
  trip,
  onBack,
}: {
  trip: TripData;
  onBack: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { height: winH } = useWindowDimensions();

  const [selected, setSelected] = useState(1);

  // run the planner on whatever the user typed in
  const plan = useMemo(() => {
    const fuelNow = (trip.tankSize * trip.fuelLevel) / 100;
    return planStops(ROUTE_MILES, trip.mpg, trip.tankSize, fuelNow);
  }, [trip.mpg, trip.tankSize, trip.fuelLevel]);

  const stopCards: FuelStop[] = useMemo(() => {
    if (!plan) return [];
    const cheapest = Math.min(...plan.stops.map((s) => s.price));
    return plan.stops.map((s, i) => ({
      id: i + 1,
      station: s.name,
      location: `mile ${s.mileMarker}`,
      price: `$${s.price.toFixed(2)}`,
      gallons: s.gallonsBought.toFixed(1),
      cost: `$${s.fuelCost.toFixed(2)}`,
      detour: `Mile ${s.mileMarker} of ${ROUTE_MILES}`,
      arriveFuel: `${Math.round((s.fuelOnArrival / trip.tankSize) * 100)}%`,
      leaveFuel: `${Math.round((s.fuelOnDeparture / trip.tankSize) * 100)}%`,
      reason: "Cheapest station you can reach before dropping below 1/4 tank",
      tag:
        plan.stops.length > 1 && s.price === cheapest
          ? "Cheapest stop on your route"
          : undefined,
    }));
  }, [plan, trip.tankSize]);

  const avgPrice =
    stations.reduce((sum, st) => sum + st.price, 0) / stations.length;
  const totalGallons = plan
    ? plan.stops.reduce((sum, st) => sum + st.gallonsBought, 0)
    : 0;
  const savings = plan ? totalGallons * avgPrice - plan.totalCost : 0;
  const arrivalPercent = plan
    ? Math.round((plan.fuelAtDestination / trip.tankSize) * 100)
    : 0;
  const driveMinutes = Math.round((ROUTE_MILES / 65) * 60); // assumes 65 mph
  const driveTime = `${Math.floor(driveMinutes / 60)}h ${driveMinutes % 60}m`;
  const [navigationStarted, setNavigationStarted] = useState(false);

  // draggable bottom sheet (height as % of the screen)
  const [sheetHeight, setSheetHeight] = useState(56);
  const heightRef = useRef(56);
  const startRef = useRef(56);
  const winHRef = useRef(winH);
  winHRef.current = winH;

  const clamp = (v: number) => Math.max(48, Math.min(78, v));
  const settle = () => {
    const next = heightRef.current > 63 ? 76 : 56;
    heightRef.current = next;
    setSheetHeight(next);
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        startRef.current = heightRef.current;
      },
      onPanResponderMove: (_, g) => {
        const next = clamp(startRef.current - (g.dy / winHRef.current) * 100);
        heightRef.current = next;
        setSheetHeight(next);
      },
      onPanResponderRelease: settle,
      onPanResponderTerminate: settle,
    })
  ).current;

  return (
    <View style={styles.screen}>
      {/* MAP */}
      <View style={styles.map}>
        <MapView
          style={StyleSheet.absoluteFill}
          initialRegion={{
            latitude: 27.2,
            longitude: -81.0,
            latitudeDelta: 3.5,
            longitudeDelta: 3.5,
          }}
          toolbarEnabled={false}
        >
          <Polyline
            coordinates={ROUTE_COORDS}
            strokeColor={colors.primary}
            strokeWidth={5}
          />

          <Marker coordinate={START} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={[styles.endpoint, styles.startMarker]}>
              <View style={styles.startDot} />
            </View>
          </Marker>
          <Marker coordinate={END} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={[styles.endpoint, styles.endMarker]}>
              <Icon name="pin" size={14} color={colors.white} />
            </View>
          </Marker>

          {plan &&
            plan.stops.map((st, i) => {
              const coord = STATION_COORDS[st.mileMarker];
              const card = stopCards[i];
              if (!coord || !card) return null;
              return (
                <Marker
                  key={card.id}
                  coordinate={coord}
                  anchor={{ x: 0.5, y: 0.5 }}
                  zIndex={selected === card.id ? 10 : 1}
                  onPress={() => setSelected(card.id)}
                >
                  <PriceBubble
                    number={card.id}
                    price={card.price}
                    cheapest={!!card.tag}
                    selected={selected === card.id}
                  />
                </Marker>
              );
            })}
        </MapView>

        <Pressable
          style={[styles.mapBack, { top: Math.max(15, insets.top) }]}
          onPress={onBack}
          accessibilityLabel="Edit trip"
        >
          <Icon name="back" size={21} color={colors.primary} />
        </Pressable>

        <View style={[styles.mapTitle, { top: Math.max(17, insets.top) }]}>
          <Text numberOfLines={1} style={styles.mapTitleText}>
            Orlando, FL
          </Text>
          <Icon name="arrow" size={14} color={colors.primary} />
          <Text numberOfLines={1} style={styles.mapTitleText}>
            Miami, FL
          </Text>
        </View>
      </View>

      {/* BOTTOM SHEET */}
      <View style={[styles.sheet, { height: `${sheetHeight}%` }]}>
        <View style={styles.handle} {...pan.panHandlers}>
          <View style={styles.handleBar} />
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {plan ? (
            <SummaryBox
              totalCost={plan.totalCost}
              savings={savings}
              stopCount={plan.stops.length}
              totalMiles={ROUTE_MILES}
              driveMinutes={driveMinutes}
              arriveFuelPct={arrivalPercent}
            />
          ) : (
            <View style={styles.message}>
              <Text style={styles.messageTitle}>No safe plan found</Text>
              <Text style={styles.messageText}>
                With this much fuel, your car can’t reach a station before
                dipping below the quarter-tank reserve. Try a higher fuel
                level or a larger tank.
              </Text>
            </View>
          )}

          <View style={styles.stopsHeading}>
            <View>
              <Text style={styles.stopsTitle}>Your fuel stops</Text>
              <Text style={styles.stopsSub}>
                {plan
                  ? `${stopCards.length} smart stop${stopCards.length === 1 ? "" : "s"} along your route`
                  : "No stops available"}
              </Text>
            </View>
            <Icon name="route" size={21} color={colors.primary} />
          </View>

          <Text style={styles.demoNote}>
            Demo route: Orlando to Miami ({ROUTE_MILES} mi), with sample
            prices. Other routes are coming soon.
          </Text>

          {plan && stopCards.length === 0 && (
            <View style={styles.message}>
              <Text style={styles.messageTitle}>No fuel stop needed</Text>
              <Text style={styles.messageText}>
                You can reach Miami without refueling and still keep your
                quarter-tank reserve.
              </Text>
            </View>
          )}

          <View style={{ gap: 8 }}>
            {stopCards.map((stop) => (
              <StopRow
                key={stop.id}
                stop={stop}
                cheapest={!!stop.tag}
                selected={selected === stop.id}
                onPress={() => setSelected(stop.id)}
              />
            ))}
          </View>

          <View style={styles.details}>
            <View style={styles.detailCell}>
              <Text style={styles.detailBig}>{ROUTE_MILES} mi</Text>
              <Text style={styles.detailSmall}>Distance</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailCell}>
              <Text style={styles.detailBig}>{driveTime}</Text>
              <Text style={styles.detailSmall}>Drive time</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailCell}>
              <Text style={styles.detailBig}>{plan ? `${arrivalPercent}% tank` : "--"}</Text>
              <Text style={styles.detailSmall}>On arrival</Text>
            </View>
          </View>
        </ScrollView>

        <View style={[styles.actions, { paddingBottom: Math.max(16, insets.bottom) }]}>
          {navigationStarted && (
            <View style={styles.toast}>
              <Icon name="navigation" size={15} color={colors.primary} />
              <Text style={styles.toastText}>Route ready — drive safely</Text>
            </View>
          )}
          {plan && (
            <PrimaryButton height={48} onPress={() => setNavigationStarted(true)}>
              {navigationStarted ? "Navigation ready" : "Start navigation"}
            </PrimaryButton>
          )}
          <PrimaryButton secondary height={39} onPress={onBack}>
            Edit trip
          </PrimaryButton>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#e9eee8" },
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: "45%",
    overflow: "hidden",
    backgroundColor: "#e9eee7",
  },
  endpoint: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.white,
    borderRadius: 20,
    backgroundColor: colors.primary,
    ...shadow(0.22, 6, 3, 3),
  },
  startMarker: { width: 19, height: 19 },
  startDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.white },
  endMarker: { width: 28, height: 28 },
  bubble: {
    minWidth: 74,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 999,
    backgroundColor: colors.white,
    paddingVertical: 4,
    paddingLeft: 4,
    paddingRight: 9,
  },
  bubbleCheapest: { borderColor: colors.orange },
  bubbleSelected: { transform: [{ scale: 1.12 }] },
  bubbleNum: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  bubbleNumCheapest: { backgroundColor: colors.orange },
  bubbleNumText: { color: colors.white, fontSize: 10, fontWeight: "800" },
  bubblePrice: { color: colors.ink, fontSize: 11, fontWeight: "800" },
  mapBack: {
    position: "absolute",
    zIndex: 10,
    left: 16,
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.9)",
    ...shadow(0.07, 8, 3, 2),
  },
  mapTitle: {
    position: "absolute",
    zIndex: 9,
    left: 68,
    right: 16,
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingHorizontal: 11,
    ...shadow(0.1, 10, 4, 2),
  },
  mapTitleText: {
    flexShrink: 1,
    color: colors.primary,
    fontSize: 10,
    fontWeight: "700",
  },
  sheet: {
    position: "absolute",
    zIndex: 20,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.cream,
    ...shadow(0.14, 18, -8, 12),
  },
  handle: { height: 28, alignItems: "center", justifyContent: "center" },
  handleBar: { width: 38, height: 4, borderRadius: 2, backgroundColor: "#cfd5d0" },
  stopsHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
    marginBottom: 10,
    marginHorizontal: 2,
  },
  stopsTitle: { color: colors.ink, fontSize: 17, fontWeight: "800", letterSpacing: -0.4 },
  demoNote: {
    marginHorizontal: 2,
    marginBottom: 10,
    color: colors.muted,
    fontSize: 9,
    lineHeight: 13,
  },
  message: {
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#dbe8de",
    borderRadius: 16,
    backgroundColor: "#f7fbf8",
    padding: 13,
  },
  messageTitle: { color: colors.primary, fontSize: 13, fontWeight: "800" },
  messageText: { marginTop: 4, color: colors.muted, fontSize: 11, lineHeight: 16 },
  stopsSub: { marginTop: 3, color: colors.muted, fontSize: 10 },
  details: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.65)",
    paddingVertical: 11,
    paddingHorizontal: 8,
  },
  detailCell: { flex: 1, alignItems: "center" },
  detailBig: { color: colors.primary, fontSize: 11, fontWeight: "700" },
  detailSmall: { marginTop: 2, color: colors.muted, fontSize: 8 },
  divider: { width: 1, height: 25, backgroundColor: colors.line },
  actions: {
    gap: 7,
    paddingTop: 10,
    paddingHorizontal: 16,
    backgroundColor: colors.cream,
  },
  toast: {
    minHeight: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
  },
  toastText: { color: colors.primary, fontSize: 10, fontWeight: "700" },
});
