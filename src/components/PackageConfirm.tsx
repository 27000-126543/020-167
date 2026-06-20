import { Check, CircleDot, AlertTriangle, Plus } from "lucide-react"
import { useCashierStore } from "@/store/cashierStore"
import { EXTRA_ITEMS, CATEGORY_LABELS } from "@/data/mock"
import type { ExtraItem } from "@/data/mock"

function StatusBadge({ status }: { status: "completed" | "pending_followup" }) {
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-sm bg-emerald-light px-1.5 py-0.5 text-[10px] font-medium text-emerald">
        <Check className="h-2.5 w-2.5" />
        已完成
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-sm bg-amber-light px-1.5 py-0.5 text-[10px] font-medium text-amber">
      <CircleDot className="h-2.5 w-2.5" />
      待复诊
    </span>
  )
}

function ExtraItemCheckbox({ item }: { item: ExtraItem }) {
  const selectedExtraItems = useCashierStore((s) => s.selectedExtraItems)
  const toggleExtraItem = useCashierStore((s) => s.toggleExtraItem)
  const isChecked = selectedExtraItems.includes(item.id)

  return (
    <label
      className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 transition-all duration-150 ${
        isChecked
          ? "border-emerald bg-emerald-light"
          : "border-warm-300 bg-white hover:border-warm-400"
      }`}
    >
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => toggleExtraItem(item.id)}
        className="h-3 w-3 rounded border-warm-400 text-emerald focus:ring-emerald/20"
      />
      <div className="flex flex-1 items-center justify-between">
        <span className="text-xs text-carbon">{item.name}</span>
        <span className="font-mono text-xs text-carbon">
          +¥{item.price.toLocaleString()}
        </span>
      </div>
    </label>
  )
}

export default function PackageConfirm() {
  const getSelectedVisit = useCashierStore((s) => s.getSelectedVisit)
  const getPackageTotal = useCashierStore((s) => s.getPackageTotal)
  const getExtraTotal = useCashierStore((s) => s.getExtraTotal)
  const getGrandTotal = useCashierStore((s) => s.getGrandTotal)
  const getDifference = useCashierStore((s) => s.getDifference)

  const visit = getSelectedVisit()
  const packageTotal = getPackageTotal()
  const extraTotal = getExtraTotal()
  const grandTotal = getGrandTotal()
  const difference = getDifference()

  if (!visit) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-warm-400">
        <Plus className="mb-3 h-10 w-10" />
        <p className="text-sm">请在左侧选择患者</p>
      </div>
    )
  }

  const filmItems = EXTRA_ITEMS.filter((i) => i.category === "film")
  const anesthesiaItems = EXTRA_ITEMS.filter((i) => i.category === "anesthesia")
  const upgradeItems = EXTRA_ITEMS.filter((i) => i.category === "material_upgrade")
  const otherItems = EXTRA_ITEMS.filter((i) => i.category === "other")

  const completedCount = visit.package.items.filter((i) => i.status === "completed").length
  const pendingCount = visit.package.items.filter((i) => i.status === "pending_followup").length

  return (
    <div className="scrollbar-thin flex h-full flex-col overflow-y-auto">
      <div className="border-b border-warm-200 px-6 py-4">
        <h2 className="text-sm font-semibold tracking-wide text-carbon">套餐确认</h2>
        <p className="mt-1 text-base font-medium text-carbon">{visit.package.name}</p>
        <div className="mt-2 flex gap-4">
          <span className="text-[11px] text-emerald">
            已完成 {completedCount} 项
          </span>
          <span className="text-[11px] text-amber">
            待复诊 {pendingCount} 项
          </span>
        </div>
      </div>

      <div className="px-6 py-4">
        <h3 className="mb-3 text-xs font-medium text-warm-400">套餐项目明细</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-warm-200 text-left">
              <th className="pb-2 text-[11px] font-medium text-warm-400">项目</th>
              <th className="pb-2 text-right text-[11px] font-medium text-warm-400">单价</th>
              <th className="pb-2 text-right text-[11px] font-medium text-warm-400">状态</th>
            </tr>
          </thead>
          <tbody>
            {visit.package.items.map((item) => (
              <tr key={item.id} className="border-b border-warm-200/50">
                <td className="py-2.5 text-xs text-carbon">{item.name}</td>
                <td className="py-2.5 text-right font-mono text-xs text-carbon">
                  ¥{item.unitPrice.toLocaleString()}
                </td>
                <td className="py-2.5 text-right">
                  <StatusBadge status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 flex items-center justify-between border-t border-warm-200 pt-3">
          <span className="text-xs text-warm-400">套餐原价</span>
          <span className="font-mono text-sm font-medium text-carbon">
            ¥{packageTotal.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="border-t border-warm-200 px-6 py-4">
        <h3 className="mb-3 flex items-center gap-2 text-xs font-medium text-warm-400">
          <AlertTriangle className="h-3 w-3 text-amber" />
          变更项（临时增加）
        </h3>

        <div className="space-y-4">
          {[
            { label: CATEGORY_LABELS.film, items: filmItems },
            { label: CATEGORY_LABELS.anesthesia, items: anesthesiaItems },
            { label: CATEGORY_LABELS.material_upgrade, items: upgradeItems },
            { label: CATEGORY_LABELS.other, items: otherItems },
          ].map(
            (group) =>
              group.items.length > 0 && (
                <div key={group.label}>
                  <p className="mb-2 text-[11px] font-medium text-warm-400">{group.label}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {group.items.map((item) => (
                      <ExtraItemCheckbox key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              )
          )}
        </div>

        {extraTotal > 0 && (
          <div className="mt-4 rounded-md bg-amber-light px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-amber">变更项合计</span>
              <span className="font-mono text-sm font-medium text-amber">
                +¥{extraTotal.toLocaleString()}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-amber/80">
              较原套餐增加 ¥{difference.toLocaleString()}
            </p>
          </div>
        )}
      </div>

      <div className="mt-auto border-t border-warm-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-warm-400">应收金额</span>
            {extraTotal > 0 && (
              <span className="ml-2 text-[10px] text-amber">
                含变更 +¥{extraTotal.toLocaleString()}
              </span>
            )}
          </div>
          <span className="font-mono text-xl font-semibold text-carbon">
            ¥{grandTotal.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}
