import { useCashierStore } from "@/store/cashierStore"
import { DISCOUNT_SOURCES, PAYMENT_METHODS } from "@/data/mock"
import type { InstallmentInfo } from "@/data/mock"
import VisitList from "@/components/VisitList"
import PackageConfirm from "@/components/PackageConfirm"
import PaymentSection from "@/components/PaymentSection"
import CashierRecords from "@/components/CashierRecords"

function PrintReceipt() {
  const getCurrentReceiptData = useCashierStore((s) => s.getCurrentReceiptData)
  const data = getCurrentReceiptData()

  if (!data.patient || !data.package) return null

  const paymentLabel = PAYMENT_METHODS.find((m) => m.type === data.paymentMethod)?.label ?? ""
  const discountLabel = DISCOUNT_SOURCES.find((s) => s.type === data.discountSource)?.label ?? ""

  const now = new Date()
  const printTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`

  const displayTime = data.paymentTime || printTime
  const statusText = data.status === "paid" ? "已收款" : "待收款"
  const statusColor = data.status === "paid" ? "#0A8F6C" : "#E8913A"
  const installmentInfo = data.installmentInfo as InstallmentInfo | undefined

  return (
    <div id="print-area" className="hidden print:block" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
      <div style={{ textAlign: "center", marginBottom: "16px", borderBottom: "1px solid #E5E5E3", paddingBottom: "12px" }}>
        <h1 style={{ fontSize: "16px", fontWeight: 600, margin: 0 }}>明德口腔诊所</h1>
        <p style={{ fontSize: "10px", color: "#999", margin: "4px 0 0" }}>收费明细单</p>
      </div>

      <div style={{ fontSize: "11px", marginBottom: "12px", display: "flex", justifyContent: "space-between" }}>
        <div>
          <div>患者：{data.patient.name}</div>
          <div>病历号：{data.patient.medicalRecordNo}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div>医生：{data.patient.doctorName}</div>
          <div>收费时间：{displayTime}</div>
          <div style={{ color: statusColor, fontWeight: 500, marginTop: "2px" }}>状态：{statusText}</div>
        </div>
      </div>

      <table style={{ width: "100%", fontSize: "11px", borderCollapse: "collapse", marginBottom: "12px" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #E5E5E3" }}>
            <th style={{ textAlign: "left", padding: "4px 0", fontWeight: 500, color: "#999" }}>项目</th>
            <th style={{ textAlign: "right", padding: "4px 0", fontWeight: 500, color: "#999" }}>金额</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: "1px solid #f2f2f0" }}>
            <td colSpan={2} style={{ padding: "6px 0 2px", fontWeight: 500 }}>{data.package.name}</td>
          </tr>
          {data.package.items.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #f2f2f0" }}>
              <td style={{ padding: "3px 0 3px 12px" }}>{item.name}</td>
              <td style={{ textAlign: "right", padding: "3px 0", fontFamily: "'DM Mono', monospace" }}>
                ¥{item.unitPrice.toLocaleString()}
              </td>
            </tr>
          ))}
          {data.extraItems.length > 0 && (
            <>
              <tr style={{ borderBottom: "1px solid #f2f2f0" }}>
                <td colSpan={2} style={{ padding: "6px 0 2px", fontWeight: 500, color: "#E8913A" }}>变更项</td>
              </tr>
              {data.extraItems.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #f2f2f0" }}>
                  <td style={{ padding: "3px 0 3px 12px" }}>{item.name}</td>
                  <td style={{ textAlign: "right", padding: "3px 0", fontFamily: "'DM Mono', monospace" }}>
                    +¥{item.price.toLocaleString()}
                  </td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>

      <div style={{ borderTop: "1px solid #E5E5E3", paddingTop: "8px", fontSize: "11px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
          <span>合计</span>
          <span style={{ fontFamily: "'DM Mono', monospace" }}>¥{data.totalAmount.toLocaleString()}</span>
        </div>
        {data.discountAmount > 0 && data.discountSource !== "none" && (
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", color: "#0A8F6C" }}>
            <span>优惠（{discountLabel}）</span>
            <span style={{ fontFamily: "'DM Mono', monospace" }}>-¥{data.discountAmount.toLocaleString()}</span>
          </div>
        )}
        {installmentInfo && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", color: "#E8913A" }}>
              <span>本次收取定金</span>
              <span style={{ fontFamily: "'DM Mono', monospace" }}>¥{installmentInfo.depositAmount.toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", color: "#666" }}>
              <span>剩余尾款</span>
              <span style={{ fontFamily: "'DM Mono', monospace" }}>¥{installmentInfo.remainingAmount.toLocaleString()}</span>
            </div>
            {installmentInfo.nextVisitDate && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", color: "#666" }}>
                <span>下次到店</span>
                <span>{installmentInfo.nextVisitDate}</span>
              </div>
            )}
          </>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: "13px", marginTop: "6px", paddingTop: "6px", borderTop: "1px solid #1C1C1E" }}>
          <span>{installmentInfo ? "应收总额" : "实收"}</span>
          <span style={{ fontFamily: "'DM Mono', monospace" }}>¥{data.actualAmount.toLocaleString()}</span>
        </div>
        <div style={{ marginTop: "4px" }}>
          <span>付款方式：{paymentLabel}</span>
        </div>
        {data.remark && (
          <div style={{ marginTop: "4px", color: "#666" }}>
            <span>备注：{data.remark}</span>
          </div>
        )}
      </div>

      <div style={{ marginTop: "32px", fontSize: "11px", borderTop: "1px solid #E5E5E3", paddingTop: "16px", display: "flex", justifyContent: "space-between" }}>
        <div>
          <div style={{ marginBottom: "20px" }}>患者签字：________________</div>
        </div>
        <div>
          <div style={{ marginBottom: "20px" }}>收费员：________________</div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="flex h-screen flex-col bg-warm">
      <header className="flex items-center justify-between border-b border-warm-300 bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald">
            <span className="text-xs font-bold text-white">口</span>
          </div>
          <h1 className="text-sm font-semibold text-carbon">套餐收银</h1>
          <span className="rounded-sm bg-warm-200 px-1.5 py-0.5 text-[10px] text-warm-400">
            明德口腔
          </span>
        </div>
        <span className="text-[11px] text-warm-400">桌面端 v1.0</span>
      </header>

      <main className="flex min-h-0 flex-1">
        <div className="w-72 shrink-0 flex flex-col min-h-0">
          <div className="h-[55%] min-h-0">
            <VisitList />
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">
            <CashierRecords />
          </div>
        </div>
        <div className="flex-1 min-w-0 bg-white">
          <PackageConfirm />
        </div>
        <div className="w-80 shrink-0">
          <PaymentSection />
        </div>
      </main>

      <PrintReceipt />
    </div>
  )
}
