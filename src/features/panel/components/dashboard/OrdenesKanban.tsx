'use client'

import { useState } from 'react'
import { Kanban, dropHandler } from 'react-kanban-kit'
import type { BoardData } from 'react-kanban-kit'
import { useOrdenesKanban } from '@/features/panel/hooks/useOrdenesKanban'

const PRIORIDAD_COLOR: Record<string, string> = {
  Alta:  "#c85a2a",
  Media: "#c99a2e",
  Baja:  "#a59682",
}

export function OrdenesKanban() {
  const { data: initialData, isLoading } = useOrdenesKanban()
  const [dataSource, setDataSource] = useState<BoardData | null>(null)

  const board = dataSource ?? initialData ?? null

  if (isLoading || !board) {
    return (
      <div className="bg-vs-card border border-vs-line rounded-[24px] p-5 animate-pulse min-h-[300px]" />
    )
  }

  const configMap = {
    card: {
      render: ({ data }: any) => (
        <div className="bg-white border border-vs-line-2 rounded-[12px] p-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-mono font-semibold text-vs-ink">{data.title}</span>
            {data.content?.prioridad && (
              <span
                className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full text-white"
                style={{ background: PRIORIDAD_COLOR[data.content.prioridad] ?? "#a59682" }}
              >
                {data.content.prioridad}
              </span>
            )}
          </div>
          <div className="text-[11px] text-[#4a4438] font-medium truncate">{data.content?.cliente}</div>
          <div className="text-[10px] text-[#8a7f70] truncate mt-0.5">{data.content?.bici}</div>
          <div className="text-[10px] text-[#a59682] mt-1.5 truncate">{data.content?.mecanico}</div>
        </div>
      ),
      isDraggable: true,
    },
  }

  return (
    <div className="bg-vs-card border border-vs-line rounded-[24px] p-4">
      <div className="mb-3">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-[#a59682]">Pipeline</div>
        <div className="text-[15px] font-semibold text-vs-ink">Órdenes de trabajo</div>
      </div>
      <div className="overflow-x-auto">
        <Kanban
          dataSource={board}
          configMap={configMap}
          cardsGap={6}
          columnWrapperStyle={() => ({ width: '165px', minWidth: '165px', maxWidth: '165px' })}
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
