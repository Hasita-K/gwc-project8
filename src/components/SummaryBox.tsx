export default function SummaryBox() {
  return (
    <section className="summary-box">
      <div className="summary-topline">
        <div>
          <p>Total fuel cost</p>
          <strong>$38.40</strong>
        </div>
        <span className="savings-badge">You saved $6.85</span>
      </div>
      <p className="summary-note">vs. filling up when your tank runs low</p>
    </section>
  )
}
