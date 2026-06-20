import { Search, Clock, User } from "lucide-react"
import { useCashierStore } from "@/store/cashierStore"

export default function VisitList() {
  const searchQuery = useCashierStore((s) => s.searchQuery)
  const setSearchQuery = useCashierStore((s) => s.setSearchQuery)
  const selectPatient = useCashierStore((s) => s.selectPatient)
  const selectedPatientId = useCashierStore((s) => s.selectedPatientId)
  const getFilteredPatients = useCashierStore((s) => s.getFilteredPatients)

  const patients = getFilteredPatients()
  const today = new Date()
  const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`

  return (
    <div className="flex h-full flex-col border-r border-warm-300 bg-warm-50">
      <div className="border-b border-warm-200 px-5 py-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-wide text-carbon">今日就诊</h2>
          <span className="font-mono text-xs text-warm-400">{dateStr}</span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-warm-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="手机号 / 病历号 / 姓名"
            className="w-full rounded-md border border-warm-300 bg-white py-2 pl-9 pr-3 text-xs text-carbon placeholder:text-warm-400 focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald/20"
          />
        </div>
      </div>

      <div className="scrollbar-thin flex-1 overflow-y-auto p-3">
        {patients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-warm-400">
            <User className="mb-2 h-8 w-8" />
            <p className="text-xs">未找到匹配患者</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {patients.map((visit) => {
              const isSelected = visit.patient.id === selectedPatientId
              return (
                <button
                  key={visit.patient.id}
                  onClick={() => selectPatient(visit.patient.id)}
                  className={`group w-full rounded-md px-3.5 py-3 text-left transition-all duration-150 ${
                    isSelected
                      ? "border-l-2 border-emerald bg-emerald-light"
                      : "border-l-2 border-transparent bg-white hover:bg-warm-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-carbon">{visit.patient.name}</span>
                    <span className="font-mono text-[10px] text-warm-400">
                      {visit.patient.phone.slice(-4)}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[11px] text-warm-400">
                      <Clock className="h-3 w-3" />
                      {visit.patient.visitTime}
                    </span>
                    <span className="text-[11px] text-emerald">{visit.patient.doctorName}</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-[11px] text-warm-400">
                      {visit.package.name}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="border-t border-warm-200 px-5 py-3">
        <span className="text-[11px] text-warm-400">
          共 {patients.length} 位患者
        </span>
      </div>
    </div>
  )
}
