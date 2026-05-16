import { render, screen, fireEvent } from "@testing-library/react"
import { SoportePage } from "./SoportePage"

// PageHeader uses next/link — stub it out
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

describe("SoportePage", () => {
  it("renders the page title", () => {
    render(<SoportePage />)
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Soporte técnico")
  })

  it("renders both tab buttons", () => {
    render(<SoportePage />)
    expect(screen.getByRole("tab", { name: "Contactar soporte" })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "Preguntas frecuentes" })).toBeInTheDocument()
  })

  it("shows contactar content by default", () => {
    render(<SoportePage />)
    expect(screen.getByText("WhatsApp")).toBeInTheDocument()
  })

  it("switching to FAQ tab shows FAQ content", () => {
    render(<SoportePage />)
    fireEvent.click(screen.getByRole("tab", { name: "Preguntas frecuentes" }))
    expect(screen.getByText("General")).toBeInTheDocument()
  })

  it("switching back to contactar shows contact content", () => {
    render(<SoportePage />)
    fireEvent.click(screen.getByRole("tab", { name: "Preguntas frecuentes" }))
    fireEvent.click(screen.getByRole("tab", { name: "Contactar soporte" }))
    expect(screen.getByText("WhatsApp")).toBeInTheDocument()
  })
})
