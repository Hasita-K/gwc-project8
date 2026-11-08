import { useRef, useState } from "react";
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
import { colors, shadow } from "../theme";
import type { FuelStop, TripData } from "../types";

const stops: FuelStop[] = [
  {
    id: 1,
    station: "Wawa",
    location: "Orlando",
    price: "$3.09",
    gallons: "6.2",
    cost: "$19.16",
    detour: "0.4 mi off route",
    tag: "Top off before you leave",
  },
  {
    id: 2,
    station: "Shell",
    location: "Fort Pierce",
    price: "$3.29",
    gallons: "3.1",
    cost: "$10.20",
    detour: "0.7 mi off route",
  },
  {
    id: 3,
    station: "Circle K",
    location: "Pompano Beach",
    price: "$3.35",
    gallons: "2.8",
    cost: "$9.38",
    detour: "0.3 mi off route",
  },
];

// pin positions on the map, as percentages of the map area
const pinPositions: { left: `${number}%`; top: `${number}%` }[] = [
  { left: "25%", top: "27%" },
  { left: "52%", top: "51%" },
  { left: "72%", top: "72%" },
];

// Simple drawn "map" (water, parks, roads, route) in percentage coordinates
function RouteMap({ w, h }: { w: number; h: number }) {
  const x = (p: number) => (p / 100) * w;
  const y = (p: number) => (p / 100) * h;

  const roads: [number, number, number, number][] = [
    [-10, 42, 115, 18],
    [22, 8, 72, 108],
    [-5, 78, 105, 62],
  ];
  const route: [number, number][] = [
    [11.5, 24], [25, 27], [34, 38], [42, 46], [52, 51],
    [60, 60], [66, 66], [72, 72], [79, 84], [81.5, 90],
  ];
  const points = route.map(([px, py]) => `${x(px)},${y(py)}`).join(" ");

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
            {trip.start}
          </Text>
          <Icon name="arrow" size={14} color={colors.primary} />
          <Text numberOfLines={1} style={styles.mapTitleText}>
            {trip.destination}
          </Text>
        </View>

        {stops.map((s, i) => (
          <PricePin
            key={s.id}
            number={s.id}
            price={s.price}
            cheapest={s.id === 1}
            selected={selected === s.id}
            left={pinPositions[i].left}
            top={pinPositions[i].top}
            onPress={() => setSelected(s.id)}
          />
        ))}
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
          <SummaryBox />

          <View style={styles.stopsHeading}>
            <View>
              <Text style={styles.stopsTitle}>Your fuel stops</Text>
              <Text style={styles.stopsSub}>3 smart stops along your route</Text>
            </View>
            <Icon name="route" size={21} color={colors.primary} />
          </View>

          <View style={{ gap: 8 }}>
            {stops.map((stop) => (
              <StopRow
                key={stop.id}
                stop={stop}
                cheapest={stop.id === 1}
                selected={selected === stop.id}
                onPress={() => setSelected(stop.id)}
              />
            ))}
          </View>

          <View style={styles.details}>
            <View style={styles.detailCell}>
              <Text style={styles.detailBig}>235 mi</Text>
              <Text style={styles.detailSmall}>Distance</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailCell}>
              <Text style={styles.detailBig}>3h 40m</Text>
              <Text style={styles.detailSmall}>Drive time</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailCell}>
              <Text style={styles.detailBig}>25% tank</Text>
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
          <PrimaryButton height={48} onPress={() => setNavigationStarted(true)}>
            {navigationStarted ? "Navigation ready" : "Start navigation"}
          </PrimaryButton>
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
