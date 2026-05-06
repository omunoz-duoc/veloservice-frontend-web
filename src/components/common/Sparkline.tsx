type SparklineProps = {
  data: number[]
  color: string
  height?: number
}

export function Sparkline({ data, color, height = 18 }: SparklineProps) {
  const W = 100
  const H = height
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * W,
    H - ((v - min) / range) * H,
  ])
  const pathD = "M " + pts.map(p => p.join(",")).join(" L ")
  const areaD = `${pathD} L ${W},${H} L 0,${H} Z`

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="w-full"
      style={{ height: `${height}px` }}
    >
      <path d={areaD} fill={color} fillOpacity={0.12} />
      <path
        d={pathD}
        stroke={color}
        strokeWidth={1.6}
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
