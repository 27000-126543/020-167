import { Banknote, QrCode, CalendarClock, Tag, MessageSquare, Printer, CheckCircle2, CalendarDays, Wallet, CreditCard } from "lucide-react"
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
  const installmentDeposit = useCashierStore((s) => s.installmentDeposit)
  const setInstallmentDeposit = useCashierStore((s) => s.setInstallmentDeposit)
  const remainingAmount = useCashierStore((s) => s.remainingAmount)
  const setRemainingAmount = useCashierStore((s) => s.setRemainingAmount)
  const nextVisitDate = useCashierStore((s) => s.nextVisitDate)
  const setNextVisitDate = useCashierStore((s) => s.setNextVisitDate)
  const remark = useCashierStore((s) => s.remark)
  const setRemark = useCashierStore((s) => s.setRemark)
  const isPaid = useCashierStore((s) => s.isPaid)
  const paymentTime = useCashierStore((s) => s.paymentTime)
  const confirmPayment = useCashierStore((s) => s.confirmPayment)
  const resetState = useCashierStore((s) => s.resetState)
  const getSelectedVisit = useCashierStore((s) => s.getSelectedVisit)
  const getGrandTotal = useCashierStore((s) => s.getGrandTotal)
  const getActualAmount = useCashierStore((s) => s.getActualAmount)
  const reprintRecordId = useCashierStore((s) => s.reprintRecordId)
  const selectReprintRecord = useCashierStore((s) => s.selectReprintRecord)

  const visit = getSelectedVisit()
  const grandTotal = getGrandTotal()
  const actualAmount = getActualAmount()
  const isReprint = !!reprintRecordId

  if (!visit) {
    return (
      <div className="flex h-full flex-col items-center justify-center border-l border-warm-300 bg-warm-50 text-warm-400">
        <Tag className="mb-3 h-10 w-10" />
        <p className="text-sm">选择患者后进行收款</p>
      </div>
    )
  }

  const handleDepositChange = (value: string) => {
    const num = Number(value)
    setInstallmentDeposit(num)
    setRemainingAmount(Math.max(0, grandTotal - num))
  }

  return (
    <div className="flex h-full flex-col border-l border-warm-300 bg-warm-50">
      <div className="border-b border-warm-200 px-5 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-wide text-carbon">收款备注</h2>
          {isReprint && (
            <button
              onClick={() => selectReprintRecord(null)}
              className="text-[10px] text-warm-400 hover:text-carbon transition-colors"
            >
              退出补打
            </button>
          )}
        </div>
        {isPaid && paymentTime && (
          <p className="mt-1 text-[10px] text-emerald">
            收款时间：{paymentTime}
          </p>
        )}
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
                } ${isPaid ? "opacity-80 cursor-not-allowed" : ""}`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.type}
                  checked={paymentMethod === method.type}
                  onChange={() => setPaymentMethod(method.type)}
                  disabled={isPaid}
                  className="h-3 w-3 border-warm-400 text-emerald focus:ring-emerald/20 disabled:opacity-50"
                />
                <span className="text-carbon">
                  {PAYMENT_ICONS[method.type]}
                </span>
                <span className="text-xs text-carbon">{method.label}</span>
              </label>
            ))}
          </div>
        </div>

        {paymentMethod === "installment_deposit" && (
          <div className="mb-5 rounded-md bg-amber-light p-3">
            <label className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-amber">
              <CreditCard className="h-3 w-3" />
              分期收款信息
            </label>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-[10px] text-amber/80">本次定金金额</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-amber/70">¥</span>
                  <input
                    type="number"
                    min="0"
                    value={installmentDeposit || ""}
                    onChange={(e) => handleDepositChange(e.target.value)}
                    placeholder="请输入定金金额"
                    disabled={isPaid}
                    className="w-full rounded-md border border-amber/30 bg-white py-2 pl-8 pr-3 font-mono text-xs text-carbon placeholder:text-warm-400 focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber/20 disabled:bg-warm-100"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-[10px] text-amber/80">剩余尾款</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-amber/70">¥</span>
                  <input
                    type="number"
                    min="0"
                    value={remainingAmount || ""}
                    onChange={(e) => setRemainingAmount(Number(e.target.value))}
                    placeholder="自动计算，可修改"
                    disabled={isPaid}
                    className="w-full rounded-md border border-amber/30 bg-white py-2 pl-8 pr-3 font-mono text-xs text-carbon placeholder:text-warm-400 focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber/20 disabled:bg-warm-100"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 flex items-center gap-1 text-[10px] text-amber/80">
                  <CalendarDays className="h-2.5 w-2.5" />
                  下次到店提醒
                </label>
                <input
                  type="date"
                  value={nextVisitDate}
                  onChange={(e) => setNextVisitDate(e.target.value)}
                  disabled={isPaid}
                  className="w-full rounded-md border border-amber/30 bg-white px-3 py-2 text-xs text-carbon focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber/20 disabled:bg-warm-100"
                />
              </div>
            </div>
          </div>
        )}

        <div className="mb-5">
          <label className="mb-2 block text-[11px] font-medium text-warm-400">优惠来源</label>
          <select
            value={discountSource}
            onChange={(e) => setDiscountSource(e.target.value)}
            disabled={isPaid}
            className="w-full rounded-md border border-warm-300 bg-white px-3 py-2.5 text-xs text-carbon focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald/20 disabled:bg-warm-100"
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
                disabled={isPaid}
                className="w-full rounded-md border border-warm-300 bg-white py-2.5 pl-8 pr-3 font-mono text-xs text-carbon placeholder:text-warm-400 focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald/20 disabled:bg-warm-100"
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
            disabled={isPaid}
            className="w-full resize-none rounded-md border border-warm-300 bg-white px-3 py-2.5 text-xs text-carbon placeholder:text-warm-400 focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald/20 disabled:bg-warm-100"
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
            {paymentMethod === "installment_deposit" && installmentDeposit > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-amber">
                  <Wallet className="inline h-2.5 w-2.5 mr-0.5" />
                  本次收取
                </span>
                <span className="font-mono text-xs text-amber">
                  ¥{installmentDeposit.toLocaleString()}
                </span>
              </div>
            )}
            {paymentMethod === "installment_deposit" && remainingAmount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-warm-400">剩余尾款</span>
                <span className="font-mono text-xs text-warm-400">
                  ¥{remainingAmount.toLocaleString()}
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
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 rounded-md bg-emerald-light py-3">
              <CheckCircle2 className="h-4 w-4 text-emerald" />
              <span className="text-sm font-medium text-emerald">
                {isReprint ? "补打" : "已收款"}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-warm-300 bg-white py-3 text-xs font-medium text-carbon transition-colors hover:bg-warm-100"
              >
                <Printer className="h-3.5 w-3.5" />
                {isReprint ? "补打明细" : "打印明细"}
              </button>
              {!isReprint && (
                <button
                  onClick={resetState}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-warm-300 bg-white py-3 text-xs font-medium text-carbon transition-colors hover:bg-warm-100"
                >
                  <Wallet className="h-3.5 w-3.5" />
                  新收款
                </button>
              )}
            </div>
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
