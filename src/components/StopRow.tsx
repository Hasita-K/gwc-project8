export type FuelStop = {
  id: number
  station: string
  location: string
  price: string
  gallons: string
  cost: string
  detour: string
  tag?: string
}

type StopRowProps = {
  stop: FuelStop
  selected: boolean
  cheapest?: boolean
  onClick: () => void
}

export default function StopRow({
  stop,
  selected,
  cheapest,
  onClick,
}: StopRowProps) {
  return (
    <button
      className={selected ? "stop-row selected" : "stop-row"}
      onClick={onClick}
    >
      <span className={cheapest ? "stop-number cheapest" : "stop-number"}>
        {stop.id}
      </span>
      <span className="stop-main">
        <span className="stop-title">
          <strong>{stop.station}</strong>
          <em> · {stop.location}</em>
        </span>
        <span className="stop-meta">{stop.detour}</span>
        {stop.tag && <span className="stop-tag">{stop.tag}</span>}
      </span>
      <span className="stop-numbers">
        <strong>
          {stop.price}
          <small>/gal</small>
        </strong>
        <span>
          {stop.gallons} gal · {stop.cost}
        </span>
      </span>
    </button>
  )
}
