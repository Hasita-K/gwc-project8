import { useRef, useState } from "react"
import Icon from "../components/Icon"
import PricePin from "../components/PricePin"
import PrimaryButton from "../components/PrimaryButton"
import StopRow, { type FuelStop } from "../components/StopRow"
import SummaryBox from "../components/SummaryBox"
import type { TripData } from "../App"

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
]

type DragState = {
  y: number
  height: number
}

export default function ResultsScreen({
  trip,
  onBack,
}: {
  trip: TripData
  onBack: () => void
}) {
  const [selected, setSelected] = useState(1)
  const [sheetHeight, setSheetHeight] = useState(56)
  const [navigationStarted, setNavigationStarted] = useState(false)
  const dragStart = useRef<DragState | null>(null)

  const beginDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    dragStart.current = { y: event.clientY, height: sheetHeight }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const moveDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragStart.current) return
    const delta =
      ((dragStart.current.y - event.clientY) / window.innerHeight) * 100
    setSheetHeight(Math.max(48, Math.min(78, dragStart.current.height + delta)))
  }

  const endDrag = () => {
    setSheetHeight((height) => (height > 63 ? 76 : 56))
    dragStart.current = null
  }

  return (
    <section className="results-screen screen-content">
      <div className="results-map">
        <div className="map-grid" />
        <div className="map-water" />
        <div className="map-park park-one" />
        <div className="map-park park-two" />
        <i className="result-road road-one" />
        <i className="result-road road-two" />
        <i className="result-road road-three" />
        <div className="result-route route-outline" />
        <div className="result-route route-green" />
        <span className="endpoint start-marker">
          <i />
        </span>
        <span className="endpoint end-marker">
          <Icon name="pin" size={14} />
        </span>

        <button className="map-back" onClick={onBack} aria-label="Edit trip">
          <Icon name="back" size={21} />
        </button>
        <div className="map-title">
          <strong>{trip.start}</strong>
          <Icon name="arrow" size={14} />
          <strong>{trip.destination}</strong>
        </div>

        <PricePin
          number={1}
          price="$3.09"
          cheapest
          selected={selected === 1}
          className="price-one"
          onClick={() => setSelected(1)}
        />
        <PricePin
          number={2}
          price="$3.29"
          selected={selected === 2}
          className="price-two"
          onClick={() => setSelected(2)}
        />
        <PricePin
          number={3}
          price="$3.35"
          selected={selected === 3}
          className="price-three"
          onClick={() => setSelected(3)}
        />
      </div>

      <section className="results-sheet" style={{ height: `${sheetHeight}%` }}>
        <button
          className="drag-handle"
          aria-label="Drag results sheet"
          onPointerDown={beginDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <span />
        </button>

        <div className="sheet-scroll">
          <SummaryBox />
          <div className="stops-heading">
            <div>
              <h2>Your fuel stops</h2>
              <p>3 smart stops along your route</p>
            </div>
            <Icon name="route" size={21} />
          </div>
          <div className="stops-list">
            {stops.map((stop) => (
              <StopRow
                key={stop.id}
                stop={stop}
                cheapest={stop.id === 1}
                selected={selected === stop.id}
                onClick={() => setSelected(stop.id)}
              />
            ))}
          </div>

          <div className="trip-details">
            <span>
              <strong>235 mi</strong>
              <small>Distance</small>
            </span>
            <i />
            <span>
              <strong>3h 40m</strong>
              <small>Drive time</small>
            </span>
            <i />
            <span>
              <strong>25% tank</strong>
              <small>On arrival</small>
            </span>
          </div>
        </div>

        <footer className="results-actions">
          {navigationStarted && (
            <div className="navigation-toast" role="status">
              <Icon name="navigation" size={15} />
              Route ready — drive safely
            </div>
          )}
          <PrimaryButton onClick={() => setNavigationStarted(true)}>
            {navigationStarted ? "Navigation ready" : "Start navigation"}
          </PrimaryButton>
          <PrimaryButton secondary onClick={onBack}>
            Edit trip
          </PrimaryButton>
        </footer>
      </section>
    </section>
  )
}
