import InputCard from "../components/InputCard"
import Icon from "../components/Icon"
import PrimaryButton from "../components/PrimaryButton"
import type { TripData } from "../App"

type TripFormScreenProps = {
  trip: TripData
  onChange: (trip: TripData) => void
  onBack: () => void
  onNext: () => void
}

export default function TripFormScreen({
  trip,
  onChange,
  onBack,
  onNext,
}: TripFormScreenProps) {
  const gallons = (trip.tankSize * trip.fuelLevel) / 100
  const update = <K extends keyof TripData>(key: K, value: TripData[K]) =>
    onChange({ ...trip, [key]: value })

  return (
    <section className="trip-screen screen-content">
      <header className="mobile-header">
        <button
          className="back-button"
          onClick={onBack}
          aria-label="Back to home"
        >
          <Icon name="back" size={22} />
        </button>
        <h1>Plan your trip</h1>
        <span className="header-spacer" />
      </header>

      <div className="form-scroll">
        <div className="form-intro">
          <p>Tell us about your drive</p>
          <span>We’ll calculate when and where to fill up.</span>
        </div>

        <div className="form-stack">
          <InputCard
            label="Starting location"
            value={trip.start}
            icon="location"
            onChange={(value) => update("start", value)}
          />
          <InputCard
            label="Destination"
            value={trip.destination}
            icon="pin"
            onChange={(value) => update("destination", value)}
          />

          <div className="vehicle-grid">
            <InputCard
              compact
              label="Vehicle MPG"
              value={trip.mpg}
              type="number"
              suffix="MPG"
              onChange={(value) => update("mpg", Number(value))}
            />
            <InputCard
              compact
              label="Tank size"
              value={trip.tankSize}
              type="number"
              suffix="gal"
              onChange={(value) => update("tankSize", Number(value))}
            />
          </div>

          <section className="fuel-level-card">
            <div className="fuel-level-heading">
              <div>
                <span className="input-label">Current fuel level</span>
                <strong>
                  {trip.fuelLevel}% <em>· {gallons.toFixed(1)} gal</em>
                </strong>
              </div>
              <span className="fuel-icon">
                <Icon name="fuel" size={21} />
              </span>
            </div>
            <div className="slider-wrap">
              <div className="reserve-marker">
                <i />
                <span>Reserve</span>
              </div>
              <input
                aria-label="Current fuel level"
                className="fuel-slider"
                max="100"
                min="0"
                style={{
                  background: `linear-gradient(90deg, var(--primary) 0 ${trip.fuelLevel}%, #dce3dd ${trip.fuelLevel}% 100%)`,
                }}
                type="range"
                value={trip.fuelLevel}
                onChange={(event) =>
                  update("fuelLevel", Number(event.target.value))
                }
              />
              <div className="slider-labels">
                <span>Empty</span>
                <span>Full</span>
              </div>
            </div>
          </section>

          <section className="fuel-type-card">
            <span className="input-label">Fuel type</span>
            <div className="segment-control">
              {(["Regular", "Premium"] as const).map((type) => (
                <button
                  key={type}
                  className={trip.fuelType === type ? "active" : ""}
                  onClick={() => update("fuelType", type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      <footer className="sticky-action">
        <PrimaryButton onClick={onNext} showArrow>
          Find the cheapest plan
        </PrimaryButton>
      </footer>
    </section>
  )
}
