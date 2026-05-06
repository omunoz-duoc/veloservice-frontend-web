"use client"

import { Bell, Settings, Search, Plus, ChevronDown } from "lucide-react"

export function Topbar() {
  return (
    <div className="flex items-center gap-4 mb-6">
      {/* Search */}
      <div className="flex-1 max-w-[420px] bg-vs-card border border-vs-line rounded-[24px] flex items-center gap-3 px-4 py-2.5">
        <Search size={16} className="text-[#a59682] shrink-0" />
        <input
          placeholder="Buscar OT, marca, ciclista…"
          className="bg-transparent outline-none flex-1 text-sm placeholder:text-[#a59682]"
        />
        <span className="text-[11px] text-[#a59682] font-mono bg-vs-chip px-2 py-0.5 rounded-full">
          ⌘K
        </span>
      </div>

      <div className="flex-1" />

      {/* Nueva OT */}
      <button className="flex items-center gap-2 bg-vs-ink text-white pl-4 pr-2 py-2 rounded-full text-sm font-medium">
        <Plus size={16} />
        Nueva OT
        <span className="ml-1 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
          <ChevronDown size={14} />
        </span>
      </button>

      {/* Bell */}
      <button className="relative w-10 h-10 rounded-full bg-vs-card border border-vs-line flex items-center justify-center text-[#2b2f36]">
        <Bell size={18} strokeWidth={1.6} />
        <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-vs-warn" />
      </button>

      {/* Settings */}
      <button className="w-10 h-10 rounded-full bg-vs-card border border-vs-line flex items-center justify-center text-[#2b2f36]">
        <Settings size={18} strokeWidth={1.6} />
      </button>

      {/* User */}
      <div className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-full bg-vs-card border border-vs-line">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#d9c7a8] to-[#b39573] flex items-center justify-center text-white text-sm font-semibold">
          MA
        </div>
        <div className="leading-tight pr-2">
          <div className="text-[13px] font-semibold">Martín Álvarez</div>
          <div className="text-[11px] text-[#8a7f70]">Jefe de taller</div>
        </div>
        <ChevronDown size={16} className="text-[#8a7f70]" />
      </div>
    </div>
  )
}
