import { mapApiOrden } from "./ordenes.service"

function makeOrden(overrides: Record<string, unknown> = {}) {
  return {
    tipo:        { id: "t-1", codigo: "mantencion", nombre: "Mantención" },
    estado:      { id: "e-1", codigo: "recibido",   nombre: "Recibido"   },
    fechaIngreso: "2026-06-01T00:00:00Z",
    prioridad:   "media",
    ...overrides,
  } as any
}

describe("mapApiOrden — ESTADO_MAP", () => {
  const cases: [string, string][] = [
    ["recibido",           "recibido"],
    ["en_reparacion",      "proceso"],
    ["en_proceso",         "proceso"],
    ["en_diagnostico",     "diagnostico"],
    ["esperando_repuesto", "espera"],
    ["control_calidad",    "calidad"],
    ["lista_para_entrega", "listo"],
    ["entregado",          "entregado"],
    ["cancelada",          "cancelado"],
  ]

  for (const [backendCodigo, expected] of cases) {
    it(`"${backendCodigo}" → "${expected}"`, () => {
      const o = mapApiOrden(makeOrden({ estado: { id: "e-1", codigo: backendCodigo, nombre: backendCodigo } }), 0)
      expect(o.estado).toBe(expected)
    })
  }

  it("unknown estado code falls back to 'recibido'", () => {
    const o = mapApiOrden(makeOrden({ estado: { id: "e-x", codigo: "desconocido", nombre: "?" } }), 0)
    expect(o.estado).toBe("recibido")
  })
})

describe("mapApiOrden — cliente field", () => {
  it("string cliente → used directly as clienteNombre", () => {
    const o = mapApiOrden(makeOrden({ cliente: "Ana Torres" }), 0)
    expect(o.clienteNombre).toBe("Ana Torres")
  })

  it("object cliente → nombre + apellido joined", () => {
    const o = mapApiOrden(makeOrden({ cliente: { nombre: "Ana", apellido: "Torres" } }), 0)
    expect(o.clienteNombre).toBe("Ana Torres")
  })

  it("missing cliente → 'Sin cliente'", () => {
    const o = mapApiOrden(makeOrden(), 0)
    expect(o.clienteNombre).toBe("Sin cliente")
  })
})

describe("mapApiOrden — mecanico field", () => {
  it("string mecanico → mecanicoId equals it", () => {
    const uuid = "aaaaaaaa-aaaa-1aaa-8aaa-aaaaaaaaaaaa"
    const o = mapApiOrden(makeOrden({ mecanico: uuid }), 0)
    expect(o.mecanicoId).toBe(uuid)
  })

  it("object mecanico → mecanicoId is fullName (nombre + apellido)", () => {
    const o = mapApiOrden(makeOrden({ mecanico: { id: "uuid-123", nombre: "Luis", apellido: "Rojas" } }), 0)
    expect(o.mecanicoId).toBe("Luis Rojas")
  })

  it("null mecanico → 'Sin asignar'", () => {
    const o = mapApiOrden(makeOrden({ mecanico: null }), 0)
    expect(o.mecanicoId).toBe("Sin asignar")
  })
})

describe("mapApiOrden — bicicleta fallbacks", () => {
  it("missing bicicleta → biciMarca is 'Sin bicicleta'", () => {
    const o = mapApiOrden(makeOrden(), 0)
    expect(o.biciMarca).toBe("Sin bicicleta")
  })

  it("missing bicicleta.tipo → biciTipo is 'Otro'", () => {
    const o = mapApiOrden(makeOrden({ bicicleta: { marca: "Trek", modelo: "Marlin" } }), 0)
    expect(o.biciTipo).toBe("Otro")
  })

  it("missing bicicleta.color → biciColor is ''", () => {
    const o = mapApiOrden(makeOrden({ bicicleta: { marca: "Trek", modelo: "Marlin" } }), 0)
    expect(o.biciColor).toBe("")
  })
})

describe("mapApiOrden — numeroOrden / id", () => {
  it("uses numeroOrden as id when present", () => {
    const o = mapApiOrden(makeOrden({ numeroOrden: "OT-0099" }), 0)
    expect(o.id).toBe("OT-0099")
  })

  it("falls back to OT-XXXX format based on idx when numeroOrden absent", () => {
    const o = mapApiOrden(makeOrden(), 2)
    expect(o.id).toBe("OT-0003")
  })
})

describe("mapApiOrden — prioridad normalization", () => {
  it('"alta" → "alta"',        () => expect(mapApiOrden(makeOrden({ prioridad: "alta" }),        0).prioridad).toBe("alta"))
  it('"baja" → "baja"',        () => expect(mapApiOrden(makeOrden({ prioridad: "baja" }),        0).prioridad).toBe("baja"))
  it('"urgente" → "alta"',     () => expect(mapApiOrden(makeOrden({ prioridad: "urgente" }),     0).prioridad).toBe("alta"))
  it('unknown → "media"',      () => expect(mapApiOrden(makeOrden({ prioridad: "desconocido" }), 0).prioridad).toBe("media"))
  it('undefined → "media"',    () => expect(mapApiOrden(makeOrden({ prioridad: undefined }),     0).prioridad).toBe("media"))
})
