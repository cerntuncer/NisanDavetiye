interface Props {
  className?: string
}

export function OrnamentLights({ className = '' }: Props) {
  return (
    <div className={`ornament-lights ${className}`.trim()}>
      <img
        src="/assets/images/string-lights.png"
        alt=""
        className="ornament-lights__img ornament-img"
        draggable={false}
      />
    </div>
  )
}
