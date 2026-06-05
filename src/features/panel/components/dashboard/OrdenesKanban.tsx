'use client'

import { useState, useRef, useEffect } from 'react'
import { Kanban, dropHandler } from 'react-kanban-kit'
import type { BoardData, BoardItem, BoardProps } from 'react-kanban-kit'
import { useOrdenesKanban } from '@/features/panel/hooks/useOrdenesKanban'

const PRIORIDAD_COLOR: Record<string, string> = {
  alta: "#c85a2a",
  media: "#c99a2e",
  baja: "#a59682",
}

type OrdenCardContent = {
  prioridad?: keyof typeof PRIORIDAD_COLOR
  cliente?: string
  bici?: string
  mecanico?: string
}

type OrdenBoardItem = BoardItem & {
  content?: OrdenCardContent
}

export function OrdenesKanban() {
  const { data: initialData, isLoading } = useOrdenesKanban()
  const [dataSource, setDataSource] = useState<BoardData | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const board = dataSource ?? initialData ?? null

  if (isLoading || !board) {
    return (
      <div className="bg-vs-card border border-vs-line rounded-[24px] p-5 animate-pulse min-h-[300px]" />
    )
  }

  const colCount = board.root.children.length
  const MIN_COL_WIDTH = 159
  const BOARD_GAP = 8
  const colWidth = containerWidth > 0
    ? Math.max(MIN_COL_WIDTH, (containerWidth - BOARD_GAP * (colCount - 1)) / colCount)
    : MIN_COL_WIDTH

  const configMap: BoardProps["configMap"] = {
    card: {
      render: ({ data }) => {
        const card = data as OrdenBoardItem
        const prioridad = card.content?.prioridad
        return (
        <div className="bg-white border border-vs-line-2 rounded-[12px] p-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-mono font-semibold text-vs-ink">{card.title}</span>
            {prioridad && (
              <span
                className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full text-white"
                style={{ background: PRIORIDAD_COLOR[prioridad] ?? "#a59682" }}
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
    <div className="bg-vs-card border border-vs-line rounded-[24px] p-4">
      <div className="mb-3">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-[#a59682]">Pipeline</div>
        <div className="text-[15px] font-semibold text-vs-ink">Órdenes de trabajo</div>
      </div>
      <div ref={containerRef} className="overflow-x-auto">
        <Kanban
          dataSource={board}
          configMap={configMap}
          cardsGap={6}
          columnWrapperStyle={() => ({ width: `${colWidth}px`, minWidth: `${MIN_COL_WIDTH}px` })}
          onCardMove={(move) => {
            setDataSource(dropHandler(
              move,
              board,
              () => {},
              (col) => ({ ...col, totalChildrenCount: col.totalChildrenCount + 1 }),
              (col) => ({ ...col, totalChildrenCount: col.totalChildrenCount - 1 }),
            ))
          }}
        />
      </div>
    </div>
  )
}
