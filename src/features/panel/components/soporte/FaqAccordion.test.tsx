import { render, screen, fireEvent } from "@testing-library/react"
import { FaqAccordion } from "./FaqAccordion"

describe("FaqAccordion", () => {
  it("renders all category headings", () => {
    render(<FaqAccordion />)
    expect(screen.getByText("General")).toBeInTheDocument()
    expect(screen.getByText("Órdenes de trabajo")).toBeInTheDocument()
    expect(screen.getByText("Clientes")).toBeInTheDocument()
    expect(screen.getByText("Inventario")).toBeInTheDocument()
  })

  it("renders question text", () => {
    render(<FaqAccordion />)
    expect(screen.getByText("¿Cómo cambio mi contraseña?")).toBeInTheDocument()
  })

  it("answer is hidden by default", () => {
    render(<FaqAccordion />)
    expect(screen.getByText(/perfil de usuario/i)).not.toBeVisible()
  })

  it("clicking a question reveals the answer and sets aria-expanded", () => {
    render(<FaqAccordion />)
    const btn = screen.getByRole("button", { name: "¿Cómo cambio mi contraseña?" })
    expect(btn).toHaveAttribute("aria-expanded", "false")
    fireEvent.click(btn)
    expect(btn).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByText(/perfil de usuario/i)).toBeVisible()
  })

  it("clicking an open question hides the answer", () => {
    render(<FaqAccordion />)
    const question = screen.getByRole("button", { name: "¿Cómo cambio mi contraseña?" })
    fireEvent.click(question)
    fireEvent.click(question)
    expect(screen.getByText(/perfil de usuario/i)).not.toBeVisible()
  })
})
