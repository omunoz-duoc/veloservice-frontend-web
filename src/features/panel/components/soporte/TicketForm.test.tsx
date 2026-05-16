import { render, screen, fireEvent } from "@testing-library/react"
import { TicketForm } from "./TicketForm"

describe("TicketForm", () => {
  it("renders asunto and mensaje fields", () => {
    render(<TicketForm />)
    expect(screen.getByLabelText("Asunto")).toBeInTheDocument()
    expect(screen.getByLabelText("Mensaje")).toBeInTheDocument()
  })

  it("renders submit button", () => {
    render(<TicketForm />)
    expect(screen.getByRole("button", { name: /enviar ticket/i })).toBeInTheDocument()
  })

  it("shows success message after submit", () => {
    render(<TicketForm />)
    fireEvent.change(screen.getByLabelText("Asunto"), { target: { value: "Problema" } })
    fireEvent.change(screen.getByLabelText("Mensaje"), { target: { value: "Descripción del problema" } })
    fireEvent.click(screen.getByRole("button", { name: /enviar ticket/i }))
    expect(screen.getByText(/mensaje fue enviado/i)).toBeInTheDocument()
  })

  it("hides form fields after successful submit", () => {
    render(<TicketForm />)
    fireEvent.change(screen.getByLabelText("Asunto"), { target: { value: "Problema" } })
    fireEvent.change(screen.getByLabelText("Mensaje"), { target: { value: "Descripción" } })
    fireEvent.click(screen.getByRole("button", { name: /enviar ticket/i }))
    expect(screen.queryByLabelText("Asunto")).not.toBeInTheDocument()
  })
})
