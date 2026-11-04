export type IconName = "arrow" | "back" | "car" | "fuel" | "location" | "navigation" | "pin" | "route"

export default function Icon({
  name,
  size = 20,
}: {
  name: IconName
  size?: number
}) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    back: (
      <>
        <path d="M19 12H5" />
        <path d="m11 18-6-6 6-6" />
      </>
    ),
    car: (
      <>
        <path d="m4 14 1.8-5.2A2.6 2.6 0 0 1 8.2 7h7.6a2.6 2.6 0 0 1 2.4 1.8L20 14" />
        <path d="M5 19h14a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2Z" />
        <path d="M6 19v2M18 19v2M7 16h.01M17 16h.01" />
      </>
    ),
    fuel: (
      <>
        <path d="M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16" />
        <path d="M3 21h14M8 7h4M15 8h2l2 2v7a2 2 0 0 0 2 2V9l-2-2" />
      </>
    ),
    location: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
        <circle cx="12" cy="12" r="7" />
      </>
    ),
    navigation: <path d="m4 4 16 7-7 2-2 7Z" />,
    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    route: (
      <>
        <circle cx="6" cy="18" r="2" />
        <circle cx="18" cy="6" r="2" />
        <path d="M8 18h2a3 3 0 0 0 3-3V9a3 3 0 0 1 3-3" />
      </>
    ),
  }

  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <g
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
      >
        {paths[name]}
      </g>
    </svg>
  )
}
