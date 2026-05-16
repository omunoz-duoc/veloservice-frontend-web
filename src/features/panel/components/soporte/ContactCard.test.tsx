import { render, screen } from "@testing-library/react"
import { MessageCircle, Phone } from "lucide-react"
import { ContactCard } from "./ContactCard"

describe("ContactCard", () => {
  const telProps = {
    icon: Phone,
    label: "Teléfono",
    value: "+56 2 0000 0000",
    ctaLabel: "Llamar",
    href: "tel:+56200000000",
  }

  const httpProps = {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+56 9 0000 0000",
    ctaLabel: "Chatear",
    href: "https://wa.me/56900000000",
  }

  it("renders the label", () => {
    render(<ContactCard {...telProps} />)
    expect(screen.getByText("Teléfono")).toBeInTheDocument()
  })

  it("renders the contact value", () => {
    render(<ContactCard {...telProps} />)
    expect(screen.getByText("+56 2 0000 0000")).toBeInTheDocument()
  })

  it("tel: link has no target or rel — browser handles protocol natively", () => {
    render(<ContactCard {...telProps} />)
    const link = screen.getByRole("link", { name: "Llamar" })
    expect(link).toHaveAttribute("href", "tel:+56200000000")
    expect(link).not.toHaveAttribute("target")
    expect(link).not.toHaveAttribute("rel")
  })

  it("http: link opens in new tab with security attributes", () => {
    render(<ContactCard {...httpProps} />)
    const link = screen.getByRole("link", { name: "Chatear" })
    expect(link).toHaveAttribute("href", "https://wa.me/56900000000")
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
  })
})
