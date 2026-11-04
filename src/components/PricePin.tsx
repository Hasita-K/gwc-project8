type PricePinProps = {
  number: number
  price: string
  cheapest?: boolean
  selected?: boolean
  className: string
  onClick: () => void
}

export default function PricePin({
  number,
  price,
  cheapest,
  selected,
  className,
  onClick,
}: PricePinProps) {
  return (
    <button
      className={`price-pin ${className}${cheapest ? " cheapest" : ""}${
        selected ? " selected" : ""
      }`}
      aria-label={`Stop ${number}, ${price} per gallon`}
      onClick={onClick}
    >
      <span className="pin-number">{number}</span>
      <span className="pin-price">{price}</span>
      <i />
    </button>
  )
}
