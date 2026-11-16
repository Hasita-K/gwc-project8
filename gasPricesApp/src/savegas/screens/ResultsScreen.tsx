import { useMemo, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Svg, { Ellipse, Line, Polyline } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "../components/Icon";
import PricePin from "../components/PricePin";
import PrimaryButton from "../components/PrimaryButton";
import StopRow from "../components/StopRow";
import SummaryBox from "../components/SummaryBox";
import { ROUTE_MILES, planStops, stations } from "../calc";
import { colors, shadow } from "../theme";
import type { FuelStop, TripData } from "../types";

// The drawn route, in percentages of the map area
const ROUTE: [number, number][] = [
  [11.5, 24], [25, 27], [34, 38], [42, 46], [52, 51],
  [60, 60], [66, 66], [72, 72], [79, 84], [81.5, 90],
];

const SEGMENTS = ROUTE.slice(1).map((p, i) =>
  Math.hypot(p[0] - ROUTE[i][0], p[1] - ROUTE[i][1])
);
const ROUTE_LENGTH = SEGMENTS.reduce((a, b) => a + b, 0);

// Point on the drawn route at a fraction of the trip (0 = start, 1 = end)
function pointAt(fraction: number): [number, number] {
  let remaining = Math.max(0, Math.min(1, fraction)) * ROUTE_LENGTH;
  for (let i = 0; i < SEGMENTS.length; i++) {
    if (remaining <= SEGMENTS[i]) {
      const t = SEGMENTS[i] === 0 ? 0 : remaining / SEGMENTS[i];
      const [x1, y1] = ROUTE[i];
      const [x2, y2] = ROUTE[i + 1];
      return [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t];
    }
    remaining -= SEGMENTS[i];
  }
  return ROUTE[ROUTE.length - 1];
}

const pct = (n: number): `${number}%` => `${n}%`;

// Simple drawn "map" (water, parks, roads, route) in percentage coordinates
function RouteMap({ w, h }: { w: number; h: number }) {
  const x = (p: number) => (p / 100) * w;
  const y = (p: number) => (p / 100) * h;

  const roads: [number, number, number, number][] = [
    [-10, 42, 115, 18],
    [22, 8, 72, 108],
    [-5, 78, 105, 62],
  ];
  const points = ROUTE.map(([px, py]) => `${x(px)},${y(py)}`).join(" ");

  return (
    <Svg width={w} height={h} style={StyleSheet.absoluteFill}>
      <Ellipse cx={x(94.5)} cy={y(34.5)} rx={x(16.5)} ry={y(42.5)} fill="#d3e6e7" />
      <Ellipse cx={x(6)} cy={y(31)} rx={x(15)} ry={y(15)} fill="#d3e4cf" />
      <Ellipse cx={x(73)} cy={y(86)} rx={x(14)} ry={y(11)} fill="#d3e4cf" />

      {roads.map(([x1, y1, x2, y2], i) => (
        <Line key={`rw${i}`} x1={x(x1)} y1={y(y1)} x2={x(x2)} y2={y(y2)}
          stroke="#ffffff" strokeWidth={10} strokeLinecap="round" />
      ))}
      {roads.map(([x1, y1, x2, y2], i) => (
        <Line key={`rg${i}`} x1={x(x1)} y1={y(y1)} x2={x(x2)} y2={y(y2)}
          stroke="#d0d5cf" strokeWidth={6} strokeLinecap="round" />
      ))}

      <Polyline points={points} fill="none" stroke="#ffffff" strokeWidth={11}
        strokeLinecap="round" strokeLinejoin="round" />
      <Polyline points={points} fill="none" stroke={colors.primary} strokeWidth={5}
        strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
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
  const [mapSize, setMapSize] = useState({ w: 0, h: 0 });

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

  const onMapLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setMapSize({ w: width, h: height });
  };

  return (
    <View style={styles.screen}>
      {/* MAP */}
      <View style={styles.map} onLayout={onMapLayout}>
        {mapSize.w > 0 && <RouteMap w={mapSize.w} h={mapSize.h} />}

        <View style={[styles.endpoint, styles.startMarker]}>
          <View style={styles.startDot} />
        </View>
        <View style={[styles.endpoint, styles.endMarker]}>
          <Icon name="pin" size={14} color={colors.white} />
        </View>

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

        {plan &&
          plan.stops.map((st, i) => {
            const [x, y] = pointAt(st.mileMarker / ROUTE_MILES);
            const card = stopCards[i];
            return (
              <PricePin
                key={card.id}
                number={card.id}
                price={card.price}
                cheapest={!!card.tag}
                selected={selected === card.id}
                left={pct(x)}
                top={pct(y)}
                onPress={() => setSelected(card.id)}
              />
            );
          })}
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
    position: "absolute",
    zIndex: 6,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.white,
    borderRadius: 20,
    backgroundColor: colors.primary,
    ...shadow(0.22, 6, 3, 3),
  },
  startMarker: { top: "22%", left: "9%", width: 19, height: 19 },
  startDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.white },
  endMarker: { right: "15%", bottom: "7%", width: 28, height: 28 },
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
    borderWidth: 0,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
  },
  toastText: { color: colors.primary, fontSize: 10, fontWeight: "700" },
});
