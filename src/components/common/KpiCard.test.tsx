import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { KpiCard } from "./KpiCard"
import { ClipboardList } from "lucide-react"

const baseProps = {
  title: "Órdenes activas",
  value: "14",
  delta: "+3",
  trend: "up" as const,
  sub: "vs. ayer 11",
  accent: "violet" as const,
  icon: ClipboardList,
}

describe("KpiCard", () => {
  it("renders title and value", () => {
    render(<KpiCard {...baseProps} />)
    expect(screen.getByText("Órdenes activas")).toBeInTheDocument()
    expect(screen.getByText("14")).toBeInTheDocument()
  })

  it("renders delta badge", () => {
    render(<KpiCard {...baseProps} />)
    expect(screen.getByText("+3")).toBeInTheDocument()
  })

  it("renders sub text", () => {
    render(<KpiCard {...baseProps} />)
    expect(screen.getByText("vs. ayer 11")).toBeInTheDocument()
  })

  it("renders Sparkline SVG when spark prop provided", () => {
    const { container } = render(
      <KpiCard {...baseProps} spark={[1, 2, 3, 4, 5]} />
    )
    expect(container.querySelector("svg")).toBeInTheDocument()
  })

  it("renders progress bar when progress prop provided", () => {
    const { container } = render(<KpiCard {...baseProps} progress={0.76} />)
    const bar = container.querySelector(".h-full.rounded-full")
    expect(bar).toBeInTheDocument()
  })

  it("does not render progress bar when only spark provided", () => {
    const { container } = render(
      <KpiCard {...baseProps} spark={[1, 2, 3]} />
    )
    const bar = container.querySelector(".h-full.rounded-full")
    expect(bar).toBeNull()
  })
})
