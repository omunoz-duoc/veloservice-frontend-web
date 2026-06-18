import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import Swal from "sweetalert2"
import { ApiError } from "@/lib/api/api-error"
import { InventarioPage } from "./InventarioPage"

const mocks = vi.hoisted(() => ({
  createProducto: vi.fn(),
  updateProducto: vi.fn(),
}))

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(() => Promise.resolve({ isConfirmed: true })),
  },
}))

vi.mock("../../hooks/useInventarioProductos", () => ({
  useInventarioProductos: () => ({ data: [] }),
  useCreateProducto: () => ({ mutateAsync: mocks.createProducto, isPending: false }),
  useUpdateProducto: () => ({ mutateAsync: mocks.updateProducto, isPending: false }),
}))

function openModalAndFillRequiredFields() {
  render(<InventarioPage />)

  fireEvent.click(screen.getByRole("button", { name: /nuevo producto/i }))
  fireEvent.change(screen.getByPlaceholderText("ej. Cadena Shimano CN-HG701"), {
    target: { value: "Cadena Shimano" },
  })
  fireEvent.change(screen.getByPlaceholderText("ej. SH-CN-HG701"), {
    target: { value: "SH-HG601-11" },
  })
  fireEvent.change(screen.getByPlaceholderText("ej. 18900"), {
    target: { value: "18900" },
  })
  fireEvent.change(screen.getByPlaceholderText("ej. 27900"), {
    target: { value: "27900" },
  })
  fireEvent.change(screen.getByPlaceholderText("ej. 14"), {
    target: { value: "14" },
  })
  fireEvent.change(screen.getByPlaceholderText("ej. 6"), {
    target: { value: "6" },
  })
}

describe("InventarioPage", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("shows the backend 409 message in SweetAlert2 when creating a duplicate SKU", async () => {
    const message = "SKU 'SH-HG601-11' ya existe en esta sucursal"
    mocks.createProducto.mockRejectedValueOnce(
      new ApiError("POST productos failed", 409, { message })
    )

    openModalAndFillRequiredFields()
    fireEvent.click(screen.getByRole("button", { name: /crear producto/i }))

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
        icon: "error",
        title: "Producto duplicado",
        text: message,
      }))
    })
    expect(screen.getByRole("button", { name: /crear producto/i })).toBeInTheDocument()
    expect(screen.queryByText("No se pudo crear el producto.")).not.toBeInTheDocument()
  })

  it("keeps the existing inline error for non-conflict create failures", async () => {
    mocks.createProducto.mockRejectedValueOnce(new Error("network error"))

    openModalAndFillRequiredFields()
    fireEvent.click(screen.getByRole("button", { name: /crear producto/i }))

    await waitFor(() => {
      expect(screen.getByText("No se pudo crear el producto.")).toBeInTheDocument()
    })
    expect(Swal.fire).not.toHaveBeenCalled()
  })
})
