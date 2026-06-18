'use client'

import { useState, useRef, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Kanban, dropHandler } from 'react-kanban-kit'
import type { BoardData, BoardItem, BoardProps } from 'react-kanban-kit'
import { useOrdenesKanban } from '@/features/panel/hooks/useOrdenesKanban'
import { ordenesService } from '@/features/panel/services/ordenes.provider'

const PRIORIDAD_COLOR: Record<string, string> = {
  alta:  "#c85a2a",
  media: "#c99a2e",
  baja:  "#a59682",
}

const ESTADO_BACKEND_BY_COLUMN: Record<string, string> = {
  "col-recibido": "recibida",
  "col-proceso": "en_reparacion",
  "col-listo": "lista_para_entrega",
  "col-entregado": "entregada",
}

type OrdenCardContent = {
  ordenId?: string
  prioridad?: keyof typeof PRIORIDAD_COLOR
  cliente?: string
  bici?: string
  mecanico?: string
  estado?: string
}

type OrdenBoardItem = BoardItem & {
  content?: OrdenCardContent
}

export function OrdenesKanban() {
  const { data: initialData, isLoading } = useOrdenesKanban()
  const queryClient = useQueryClient()
  const [dataSource, setDataSource] = useState<{ base: BoardData | null; data: BoardData } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const board = dataSource && dataSource.base === initialData
    ? dataSource.data
    : initialData ?? null

  if (isLoading || !board) {
    return (
      <div className="min-h-[300px] min-w-0 animate-pulse rounded-[24px] border border-vs-line bg-vs-card p-5" />
    )
  }

  const colCount = board.root.children.length
  const MIN_COL_WIDTH = 200
  const BOARD_GAP = 12
  const colWidth = containerWidth > 0
    ? Math.max(MIN_COL_WIDTH, (containerWidth - BOARD_GAP * (colCount - 1)) / colCount)
    : MIN_COL_WIDTH
  const boardMinWidth = colCount * MIN_COL_WIDTH + BOARD_GAP * Math.max(colCount - 1, 0)

  const configMap: BoardProps["configMap"] = {
    card: {
      render: ({ data }) => {
        const card = data as OrdenBoardItem
        const prioridad = card.content?.prioridad
        const isAlta = prioridad === "alta"
        return (
          <div
            className={[
              "rounded-[12px] border p-3 shadow-sm transition-shadow hover:shadow-md",
              isAlta ? "border-[#e0a35d]/70 bg-[#fffaf2]" : "border-vs-line-2 bg-white",
            ].join(" ")}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-mono font-semibold text-vs-ink">{card.title}</span>
              {prioridad && (
                <span
                  className={[
                    "rounded-full px-1.5 py-0.5 text-[9px] font-semibold",
                    isAlta ? "bg-[#c85a2a] text-white shadow-[0_4px_12px_rgba(200,90,42,0.2)]" : "text-white",
                  ].join(" ")}
                  style={isAlta ? undefined : { background: PRIORIDAD_COLOR[prioridad] ?? "#a59682" }}
                >
                  {prioridad}
                </span>
              )}
            </div>
            <div className="text-[11px] text-[#4a4438] font-medium truncate">{card.content?.cliente}</div>
            <div className="text-[10px] text-[#8a7f70] truncate mt-0.5">{card.content?.bici}</div>
            <div className="text-[10px] text-[#a59682] mt-1.5 truncate">{card.content?.mecanico}</div>
          </div>
        )
      },
      isDraggable: true,
    },
  }

  return (
    <div className="min-w-0 overflow-hidden rounded-[24px] border border-vs-line bg-vs-card p-4">
      <div className="mb-3">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-[#a59682]">Pipeline</div>
        <div className="text-[15px] font-semibold text-vs-ink">Ordenes de trabajo</div>
      </div>
      {error && (
        <div className="mb-3 rounded-[12px] bg-vs-warn-bg px-3 py-2 text-[12px] font-medium text-vs-warn">
          {error}
        </div>
      )}
      <div ref={containerRef} className="min-w-0 max-w-full overflow-x-auto">
        <Kanban
          dataSource={board}
          configMap={configMap}
          rootStyle={{ width: "100%", minWidth: `${boardMinWidth}px`, gap: `${BOARD_GAP}px`, overflow: "visible" }}
          cardsGap={6}
          columnWrapperStyle={() => ({
            width: `${colWidth}px`,
            minWidth: `${MIN_COL_WIDTH}px`,
            maxWidth: `${colWidth}px`,
            flex: `1 0 ${MIN_COL_WIDTH}px`,
          })}
          columnListContentStyle={() => ({ maxHeight: "430px", overflowY: "auto", paddingRight: "2px" })}
          onCardMove={(move) => {
            const previousBoard = board
            const nextBoard = dropHandler(
              move,
              previousBoard,
              () => {},
              (col) => ({ ...col, totalChildrenCount: col.totalChildrenCount + 1 }),
              (col) => ({ ...col, totalChildrenCount: col.totalChildrenCount - 1 }),
            )

            setError(null)
            setDataSource({ base: initialData ?? null, data: nextBoard })

            if (move.fromColumnId === move.toColumnId) return

            const card = previousBoard[move.cardId] as OrdenBoardItem | undefined
            const ordenId = card?.content?.ordenId

            if (!ordenId) {
              setDataSource({ base: initialData ?? null, data: previousBoard })
              setError("No se pudo actualizar la orden.")
              return
            }

            if (!ESTADO_BACKEND_BY_COLUMN[move.toColumnId]) {
              setDataSource({ base: initialData ?? null, data: previousBoard })
              setError("No se pudo cambiar el estado de la orden.")
              return
            }

            void ordenesService.cambiarEstado(ordenId, {
              codigo: ESTADO_BACKEND_BY_COLUMN[move.toColumnId],
              observacion: "Cambio de estado desde dashboard pipeline",
            })
              .then(() => {
                void queryClient.invalidateQueries({ queryKey: ["ordenes"] })
                void queryClient.invalidateQueries({ queryKey: ["ordenes", "urgentes"] })
                void queryClient.invalidateQueries({ queryKey: ["mecanicos", "activos"] })
              })
              .catch(() => {
                setDataSource({ base: initialData ?? null, data: previousBoard })
                setError("No se pudo actualizar la orden.")
              })
          }}
        />
      </div>
    </div>
  )
}
