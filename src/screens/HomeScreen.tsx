import Icon from "../components/Icon"
import PrimaryButton from "../components/PrimaryButton"

export default function HomeScreen({ onNext }: { onNext: () => void }) {
  return (
    <section className="home-screen screen-content">
      <div className="map-pattern" aria-hidden="true">
        <i className="map-road road-a" />
        <i className="map-road road-b" />
        <i className="map-road road-c" />
        <i className="map-route" />
        <span className="pattern-pin pin-a" />
        <span className="pattern-pin pin-b" />
      </div>

      <div className="home-brand">
        <div className="home-logo">
          <Icon name="fuel" size={35} />
        </div>
        <h1>SaveGas</h1>
        <p>Fuel smarter. Drive cheaper.</p>
      </div>

      <div className="home-action">
        <PrimaryButton onClick={onNext} showArrow>
          Plan a trip
        </PrimaryButton>
        <p>Find the most affordable fuel stops along your route.</p>
      </div>
    </section>
  )
}
