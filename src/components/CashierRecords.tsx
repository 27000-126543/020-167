import { Receipt, Banknote, QrCode, CalendarClock, Printer, ChevronDown, ChevronUp } from "lucide-react"
import { useCashierStore } from "@/store/cashierStore"
import { PAYMENT_METHODS, DISCOUNT_SOURCES } from "@/data/mock"
import type { CashierRecord } from "@/data/mock"
import { useState } from "react"

const PAYMENT_ICONS: Record<string, React.ReactNode> = {
  cash: <Banknote className="h-3 w-3" />,
  qr_code: <QrCode className="h-3 w-3" />,
  installment_deposit: <CalendarClock className="h-3 w-3" />,
}

function RecordItem({ record, onReprint }: { record: CashierRecord; onReprint: () => void }) {
  const paymentLabel = PAYMENT_METHODS.find((m) => m.type === record.paymentMethod)?.label ?? ""
  const discountLabel = DISCOUNT_SOURCES.find((s) => s.type === record.discountSource)?.label ?? ""

  const displayAmount = record.installmentInfo
    ? record.installmentInfo.depositAmount
    : record.actualAmount

  return (
    <div
      onClick={onReprint}
      className="group cursor-pointer rounded-md border border-warm-200 bg-white p-3 transition-all hover:border-emerald/30 hover:bg-emerald-light/30"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-carbon">{record.patient.name}</span>
            <span className="inline-flex items-center gap-0.5 text-warm-400">
              {PAYMENT_ICONS[record.paymentMethod]}
              <span className="text-[10px]">{paymentLabel}</span>
            </span>
          </div>
          <p className="mt-0.5 text-[10px] text-warm-400">
            {record.package.name}
          </p>
          {record.installmentInfo && (
            <p className="mt-0.5 text-[10px] text-amber">
              定金 ¥{record.installmentInfo.depositAmount.toLocaleString()} / 尾款 ¥{record.installmentInfo.remainingAmount.toLocaleString()}
              {record.installmentInfo.nextVisitDate && (
                <span className="ml-1">· 下次 {record.installmentInfo.nextVisitDate}</span>
              )}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="font-mono text-sm font-semibold text-emerald">
            ¥{displayAmount.toLocaleString()}
          </p>
          {record.discountAmount > 0 && record.discountSource !== "none" && (
            <p className="text-[10px] text-warm-400">
              {discountLabel} -¥{record.discountAmount.toLocaleString()}
            </p>
          )}
          <p className="mt-0.5 text-[10px] text-warm-400">
            {record.paymentTime.slice(11, 16)}
          </p>
        </div>
        <div className="ml-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Printer className="h-3.5 w-3.5 text-emerald" />
        </div>
      </div>
    </div>
  )
}

export default function CashierRecords() {
  const cashierRecords = useCashierStore((s) => s.cashierRecords)
  const getPaymentSummary = useCashierStore((s) => s.getPaymentSummary)
  const selectReprintRecord = useCashierStore((s) => s.selectReprintRecord)
  const [isExpanded, setIsExpanded] = useState(true)

  const summary = getPaymentSummary()
  const sortedRecords = [...cashierRecords].sort(
    (a, b) => new Date(b.paymentTime).getTime() - new Date(a.paymentTime).getTime()
  )

  return (
    <div className="flex h-full flex-col border-t border-warm-300 bg-warm-50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between border-b border-warm-200 bg-white px-5 py-3 text-left hover:bg-warm-100"
      >
        <div className="flex items-center gap-2">
          <Receipt className="h-4 w-4 text-carbon" />
          <h2 className="text-sm font-semibold tracking-wide text-carbon">今日收款记录</h2>
          <span className="rounded-sm bg-warm-200 px-1.5 py-0.5 text-[10px] text-warm-400">
            {cashierRecords.length} 笔
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-warm-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-warm-400" />
        )}
      </button>

      {isExpanded && (
        <>
          <div className="grid grid-cols-4 gap-2 border-b border-warm-200 bg-white px-5 py-3">
            <div className="rounded-md bg-warm-100 p-2">
              <p className="text-[10px] text-warm-400">现金</p>
              <p className="font-mono text-sm font-medium text-carbon">
                ¥{summary.cash.toLocaleString()}
              </p>
            </div>
            <div className="rounded-md bg-warm-100 p-2">
              <p className="text-[10px] text-warm-400">扫码</p>
              <p className="font-mono text-sm font-medium text-carbon">
                ¥{summary.qrCode.toLocaleString()}
              </p>
            </div>
            <div className="rounded-md bg-warm-100 p-2">
              <p className="text-[10px] text-warm-400">分期定金</p>
              <p className="font-mono text-sm font-medium text-carbon">
                ¥{summary.installment.toLocaleString()}
              </p>
            </div>
            <div className="rounded-md bg-emerald-light p-2">
              <p className="text-[10px] text-emerald">合计</p>
              <p className="font-mono text-sm font-semibold text-emerald">
                ¥{summary.total.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="scrollbar-thin flex-1 overflow-y-auto p-3">
            {sortedRecords.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-warm-400">
                <Receipt className="mb-2 h-8 w-8" />
                <p className="text-xs">暂无收款记录</p>
                <p className="mt-1 text-[10px]">完成收款后将显示在此处</p>
              </div>
            ) : (
              <div className="space-y-2">
                {sortedRecords.map((record) => (
                  <RecordItem
                    key={record.id}
                    record={record}
                    onReprint={() => selectReprintRecord(record.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
