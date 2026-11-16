import { useMemo, useState } from "react";
import {
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Ellipse, Line, Polyline } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "../components/Icon";
import PricePin from "../components/PricePin";
import StopRow from "../components/StopRow";
import SummaryBox from "../components/SummaryBox";
import { TOTAL_MILES, type Plan } from "../planner";
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
  plan,
  onBack,
}: {
  trip: TripData;
  plan: Plan | null;
  onBack: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [mapSize, setMapSize] = useState({ w: 0, h: 0 });
  const [navigatingId, setNavigatingId] = useState<number | null>(null);

  const stopCards: FuelStop[] = useMemo(() => {
    if (!plan) return [];
    const tank = Number(trip.tankSize.toFixed(1));
    return plan.stops.map((s, i) => ({
      id: i + 1,
      station: s.name,
      brand: `Mile ${s.mile_marker}`,
      address: `Arrive with ${s.fuel_on_arrival.toFixed(1)} gal, fill up to ${tank} gal`,
      price: `$${s.price.toFixed(2)}`,
      detour: `Buy ${s.gallons_bought.toFixed(1)} gal · $${s.fuel_cost.toFixed(2)}`,
    }));
  }, [plan, trip.tankSize]);

  // the cheapest stop is highlighted in green (first one wins ties)
  const cheapestId = useMemo(() => {
    if (!plan || plan.stops.length === 0) return -1;
    let best = 0;
    plan.stops.forEach((s, i) => {
      if (s.price < plan.stops[best].price) best = i;
    });
    return best + 1;
  }, [plan]);

  const [selected, setSelected] = useState<number | null>(null);
  const activeId = selected ?? cheapestId;

  const driveMinutes = Math.round((TOTAL_MILES / 65) * 60); // assumes 65 mph
  const driveTime = `${Math.floor(driveMinutes / 60)}h ${driveMinutes % 60}m`;

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
          <View style={[styles.labelWrap, { left: -23.5 }]}>
            <View style={styles.label}>
              <Text style={styles.labelText}>Start</Text>
            </View>
          </View>
        </View>
        <View style={[styles.endpoint, styles.endMarker]}>
          <Icon name="pin" size={14} color={colors.white} />
          <View style={[styles.labelWrap, { left: -19 }]}>
            <View style={styles.label}>
              <Text style={styles.labelText}>End</Text>
            </View>
          </View>
        </View>

        <Pressable
          style={[styles.mapBack, { top: Math.max(15, insets.top) }]}
          onPress={onBack}
          accessibilityLabel="Back to trip form"
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
            const [x, y] = pointAt(st.mile_marker / TOTAL_MILES);
            const card = stopCards[i];
            return (
              <PricePin
                key={card.id}
                number={card.id}
                price={card.price}
                cheapest={card.id === cheapestId}
                selected={activeId === card.id}
                left={pct(x)}
                top={pct(y)}
                onPress={() => setSelected(card.id)}
              />
            );
          })}
      </View>

      {/* RESULTS PANEL */}
      <View style={styles.content}>
        <View style={styles.contentBg} />
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 24 + Math.max(0, insets.bottom),
          }}
          showsVerticalScrollIndicator={false}
        >
          {plan ? (
            <SummaryBox
              distance={`${TOTAL_MILES} mi`}
              driveTime={driveTime}
              fuelCost={`$${plan.total_trip_cost.toFixed(2)}`}
              savings={plan.saved !== undefined ? `$${plan.saved.toFixed(2)}` : "--"}
            />
          ) : (
            <View style={[styles.message, styles.messageTop]}>
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
              <Text style={styles.stopsTitle}>Stops along your route</Text>
              <Text style={styles.stopsSub}>
                {plan
                  ? `${stopCards.length} fuel stop${stopCards.length === 1 ? "" : "s"} sorted by route order`
                  : "No stops available"}
              </Text>
            </View>
            <Icon name="route" size={21} color={colors.primary} />
          </View>

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
                selected={activeId === stop.id}
                navigating={navigatingId === stop.id}
                onPress={() => setSelected(stop.id)}
                onNavigate={() => {
                  setSelected(stop.id);
                  setNavigatingId(stop.id);
                }}
              />
            ))}
          </View>

          <Text style={styles.footnote}>
            Prices are estimates and may change before you arrive.
          </Text>
          <Text style={styles.footnote}>
            Demo route: Orlando to Miami ({TOTAL_MILES} mi) with sample
            prices. Other routes are coming soon.
          </Text>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "45%",
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
  labelWrap: {
    position: "absolute",
    top: "100%",
    marginTop: 4,
    width: 60,
    alignItems: "center",
  },
  label: {
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  labelText: { color: colors.primary, fontSize: 7, fontWeight: "800" },
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
  content: {
    position: "absolute",
    zIndex: 18,
    top: "39%",
    left: 0,
    right: 0,
    bottom: 0,
  },
  // cream background starts 7% down, so the summary card straddles the map edge
  contentBg: {
    position: "absolute",
    top: "7%",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.cream,
  },
  stopsHeading: {
    marginTop: 20,
    marginBottom: 11,
    marginHorizontal: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stopsTitle: { color: colors.ink, fontSize: 18, fontWeight: "800", letterSpacing: -0.4 },
  stopsSub: { marginTop: 3, color: colors.muted, fontSize: 10 },
  message: {
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#dbe8de",
    borderRadius: 16,
    backgroundColor: "#f7fbf8",
    padding: 13,
  },
  messageTop: { marginTop: 10 },
  messageTitle: { color: colors.primary, fontSize: 13, fontWeight: "800" },
  messageText: { marginTop: 4, color: colors.muted, fontSize: 11, lineHeight: 16 },
  footnote: {
    marginTop: 14,
    color: colors.muted,
    fontSize: 9,
    lineHeight: 13,
    textAlign: "center",
  },
});
