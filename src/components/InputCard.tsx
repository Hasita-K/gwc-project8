import Icon, { type IconName } from "./Icon"

type InputCardProps = {
  label: string
  value: string | number
  onChange: (value: string) => void
  icon?: IconName
  type?: "text" | "number"
  suffix?: string
  compact?: boolean
}

export default function InputCard({
  label,
  value,
  onChange,
  icon,
  type = "text",
  suffix,
  compact = false,
}: InputCardProps) {
  return (
    <label className={compact ? "input-card compact-input" : "input-card"}>
      <span className="input-label">{label}</span>
      <div className="input-row">
        {icon && (
          <span className="input-icon">
            <Icon name={icon} size={20} />
          </span>
        )}
        <input
          inputMode={type === "number" ? "decimal" : "text"}
          min={type === "number" ? 0 : undefined}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        {suffix && <span className="input-suffix">{suffix}</span>}
      </div>
    </label>
  )
}
