import { Banknote, QrCode, CalendarClock, Tag, MessageSquare, Printer, CheckCircle2 } from "lucide-react"
import { useCashierStore } from "@/store/cashierStore"
import { PAYMENT_METHODS, DISCOUNT_SOURCES } from "@/data/mock"

const PAYMENT_ICONS: Record<string, React.ReactNode> = {
  cash: <Banknote className="h-3.5 w-3.5" />,
  qr_code: <QrCode className="h-3.5 w-3.5" />,
  installment_deposit: <CalendarClock className="h-3.5 w-3.5" />,
}

export default function PaymentSection() {
  const paymentMethod = useCashierStore((s) => s.paymentMethod)
  const setPaymentMethod = useCashierStore((s) => s.setPaymentMethod)
  const discountSource = useCashierStore((s) => s.discountSource)
  const setDiscountSource = useCashierStore((s) => s.setDiscountSource)
  const discountAmount = useCashierStore((s) => s.discountAmount)
  const setDiscountAmount = useCashierStore((s) => s.setDiscountAmount)
  const remark = useCashierStore((s) => s.remark)
  const setRemark = useCashierStore((s) => s.setRemark)
  const isPaid = useCashierStore((s) => s.isPaid)
  const confirmPayment = useCashierStore((s) => s.confirmPayment)
  const getSelectedVisit = useCashierStore((s) => s.getSelectedVisit)
  const getGrandTotal = useCashierStore((s) => s.getGrandTotal)
  const getActualAmount = useCashierStore((s) => s.getActualAmount)

  const visit = getSelectedVisit()
  const grandTotal = getGrandTotal()
  const actualAmount = getActualAmount()

  if (!visit) {
    return (
      <div className="flex h-full flex-col items-center justify-center border-l border-warm-300 bg-warm-50 text-warm-400">
        <Tag className="mb-3 h-10 w-10" />
        <p className="text-sm">选择患者后进行收款</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col border-l border-warm-300 bg-warm-50">
      <div className="border-b border-warm-200 px-5 py-4">
        <h2 className="text-sm font-semibold tracking-wide text-carbon">收款备注</h2>
      </div>

      <div className="scrollbar-thin flex-1 overflow-y-auto px-5 py-4">
        <div className="mb-5">
          <label className="mb-2 block text-[11px] font-medium text-warm-400">付款方式</label>
          <div className="space-y-1.5">
            {PAYMENT_METHODS.map((method) => (
              <label
                key={method.type}
                className={`flex cursor-pointer items-center gap-2.5 rounded-md border px-3 py-2.5 transition-all duration-150 ${
                  paymentMethod === method.type
                    ? "border-emerald bg-emerald-light"
                    : "border-warm-300 bg-white hover:border-warm-400"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.type}
                  checked={paymentMethod === method.type}
                  onChange={() => setPaymentMethod(method.type)}
                  className="h-3 w-3 border-warm-400 text-emerald focus:ring-emerald/20"
                />
                <span className="text-carbon">
                  {PAYMENT_ICONS[method.type]}
                </span>
                <span className="text-xs text-carbon">{method.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <label className="mb-2 block text-[11px] font-medium text-warm-400">优惠来源</label>
          <select
            value={discountSource}
            onChange={(e) => setDiscountSource(e.target.value)}
            className="w-full rounded-md border border-warm-300 bg-white px-3 py-2.5 text-xs text-carbon focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald/20"
          >
            {DISCOUNT_SOURCES.map((source) => (
              <option key={source.type} value={source.type}>
                {source.label}
              </option>
            ))}
          </select>
        </div>

        {discountSource !== "none" && (
          <div className="mb-5">
            <label className="mb-2 block text-[11px] font-medium text-warm-400">优惠金额</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-warm-400">
                ¥
              </span>
              <input
                type="number"
                min="0"
                value={discountAmount || ""}
                onChange={(e) => setDiscountAmount(Number(e.target.value))}
                placeholder="0"
                className="w-full rounded-md border border-warm-300 bg-white py-2.5 pl-8 pr-3 font-mono text-xs text-carbon focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald/20"
              />
            </div>
          </div>
        )}

        <div className="mb-5">
          <label className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-warm-400">
            <MessageSquare className="h-3 w-3" />
            备注
          </label>
          <textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            rows={3}
            placeholder="可填写备注信息…"
            className="w-full resize-none rounded-md border border-warm-300 bg-white px-3 py-2.5 text-xs text-carbon placeholder:text-warm-400 focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald/20"
          />
        </div>

        <div className="rounded-md bg-white border border-warm-200 p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-warm-400">套餐原价</span>
              <span className="font-mono text-xs text-carbon">
                ¥{visit.package.totalPrice.toLocaleString()}
              </span>
            </div>
            {grandTotal > visit.package.totalPrice && (
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-amber">变更项</span>
                <span className="font-mono text-xs text-amber">
                  +¥{(grandTotal - visit.package.totalPrice).toLocaleString()}
                </span>
              </div>
            )}
            {discountAmount > 0 && discountSource !== "none" && (
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-emerald">
                  优惠（{DISCOUNT_SOURCES.find((s) => s.type === discountSource)?.label}）
                </span>
                <span className="font-mono text-xs text-emerald">
                  -¥{discountAmount.toLocaleString()}
                </span>
              </div>
            )}
            <div className="border-t border-warm-200 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-carbon">实收金额</span>
                <span className="font-mono text-lg font-semibold text-emerald">
                  ¥{actualAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-warm-200 px-5 py-4">
        {isPaid ? (
          <div className="flex items-center justify-center gap-2 rounded-md bg-emerald-light py-3">
            <CheckCircle2 className="h-4 w-4 text-emerald" />
            <span className="text-sm font-medium text-emerald">已收款</span>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-warm-300 bg-white py-3 text-xs font-medium text-carbon transition-colors hover:bg-warm-100"
            >
              <Printer className="h-3.5 w-3.5" />
              打印
            </button>
            <button
              onClick={confirmPayment}
              className="flex flex-[2] items-center justify-center gap-1.5 rounded-md bg-emerald py-3 text-xs font-medium text-white transition-colors hover:bg-emerald-dark"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              确认收款
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
