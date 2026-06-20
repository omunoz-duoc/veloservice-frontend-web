import { estadoKanban, ordenesToBoardData } from "./useOrdenesKanban"
import type { OrdenTrabajo } from "@/features/panel/components/ordenes/ordenes.types"

function makeOrden(overrides: Partial<OrdenTrabajo> = {}): OrdenTrabajo {
  return {
    id: "OT-0001",
    backendId: "uuid-1",
    tipo: { id: "t-1", codigo: "mantencion", nombre: "Mantención" },
    estado: "recibido",
    prioridad: "media",
    fechaIngreso: "01 Jun 2026",
    fechaEstimada: "2026-06-10",
    mecanicoId: "Sin asignar",
    clienteNombre: "Juan Perez",
    biciMarca: "Trek Marlin",
    biciTipo: "MTB",
    biciColor: "Rojo",
    descripcion: "Ajuste",
    ...overrides,
  }
}

describe("estadoKanban", () => {
  it('"recibido" → "recibido"',   () => expect(estadoKanban("recibido")).toBe("recibido"))
  it('"listo" → "listo"',         () => expect(estadoKanban("listo")).toBe("listo"))
  it('"entregado" → "entregado"', () => expect(estadoKanban("entregado")).toBe("entregado"))
  it('"diagnostico" → "proceso"', () => expect(estadoKanban("diagnostico")).toBe("proceso"))
  it('"espera" → "proceso"',      () => expect(estadoKanban("espera")).toBe("proceso"))
  it('"proceso" → "proceso"',     () => expect(estadoKanban("proceso")).toBe("proceso"))
  it('"calidad" → "proceso"',     () => expect(estadoKanban("calidad")).toBe("proceso"))
  it("unknown estado → null",     () => expect(estadoKanban("unknown" as any)).toBeNull())
})

describe("ordenesToBoardData", () => {
  it("root node has exactly 4 column children", () => {
    const board = ordenesToBoardData([])
    expect(board.root.children).toHaveLength(4)
  })

  it("all columns are empty when no ordenes passed", () => {
    const board = ordenesToBoardData([])
    for (const colId of board.root.children as string[]) {
      expect(board[colId].totalChildrenCount).toBe(0)
    }
  })

  it("places a 'recibido' orden into col-recibido", () => {
    const board = ordenesToBoardData([makeOrden({ id: "OT-0001", estado: "recibido" })])
    expect(board["col-recibido"].children).toContain("card-OT-0001")
  })

  it("card content has expected shape", () => {
    const board = ordenesToBoardData([makeOrden({ id: "OT-0002", estado: "listo" })])
    const card = board["card-OT-0002"] as any
    expect(card.content).toMatchObject({
      cliente: "Juan Perez",
      prioridad: "media",
      estado: "listo",
    })
  })

  it("groups diagnostico and espera both into col-proceso", () => {
    const board = ordenesToBoardData([
      makeOrden({ id: "OT-D", estado: "diagnostico" }),
      makeOrden({ id: "OT-E", estado: "espera" }),
    ])
    expect(board["col-proceso"].children).toContain("card-OT-D")
    expect(board["col-proceso"].children).toContain("card-OT-E")
  })
})
