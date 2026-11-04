import Icon from "./Icon"

type PrimaryButtonProps = {
  children: React.ReactNode
  onClick: () => void
  secondary?: boolean
  showArrow?: boolean
}

export default function PrimaryButton({
  children,
  onClick,
  secondary = false,
  showArrow = false,
}: PrimaryButtonProps) {
  return (
    <button
      className={
        secondary ? "primary-button secondary-button" : "primary-button"
      }
      onClick={onClick}
    >
      <span>{children}</span>
      {showArrow && <Icon name="arrow" size={19} />}
    </button>
  )
}
