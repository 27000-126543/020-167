import { create } from "zustand"
import type { Patient, TreatmentPackage, ExtraItem, VisitRecord, CashierRecord, InstallmentInfo } from "@/data/mock"
import { MOCK_PATIENTS, EXTRA_ITEMS, PAYMENT_METHODS, DISCOUNT_SOURCES } from "@/data/mock"

interface CashierState {
  visitRecords: VisitRecord[]
  cashierRecords: CashierRecord[]
  selectedPatientId: string | null
  reprintRecordId: string | null
  searchQuery: string
  selectedExtraItems: string[]
  paymentMethod: string
  discountSource: string
  discountAmount: number
  installmentDeposit: number
  remainingAmount: number
  nextVisitDate: string
  remark: string
  isPaid: boolean
  paymentTime: string | null

  setSearchQuery: (query: string) => void
  selectPatient: (id: string) => void
  toggleExtraItem: (id: string) => void
  setPaymentMethod: (method: string) => void
  setDiscountSource: (source: string) => void
  setDiscountAmount: (amount: number) => void
  setInstallmentDeposit: (amount: number) => void
  setRemainingAmount: (amount: number) => void
  setNextVisitDate: (date: string) => void
  setRemark: (remark: string) => void
  confirmPayment: () => void
  resetState: () => void
  selectReprintRecord: (id: string | null) => void

  getFilteredPatients: () => VisitRecord[]
  getSelectedVisit: () => VisitRecord | undefined
  getSelectedExtraItems: () => ExtraItem[]
  getPackageTotal: () => number
  getExtraTotal: () => number
  getGrandTotal: () => number
  getActualAmount: () => number
  getDifference: () => number
  getPaymentSummary: () => { cash: number; qrCode: number; installment: number; total: number }
  getCurrentReceiptData: () => {
    patient: Patient | undefined
    package: TreatmentPackage | undefined
    extraItems: ExtraItem[]
    paymentMethod: string
    discountSource: string
    discountAmount: number
    totalAmount: number
    actualAmount: number
    installmentInfo?: InstallmentInfo
    remark: string
    paymentTime?: string
    status: "pending" | "paid"
  }
  getReprintReceiptData: () => CashierRecord | undefined
}

function generatePaymentTime(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`
}

function generateRecordId(): string {
  return `R${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`
}

export const useCashierStore = create<CashierState>((set, get) => ({
  visitRecords: MOCK_PATIENTS,
  cashierRecords: [],
  selectedPatientId: null,
  reprintRecordId: null,
  searchQuery: "",
  selectedExtraItems: [],
  paymentMethod: PAYMENT_METHODS[0].type,
  discountSource: DISCOUNT_SOURCES[0].type,
  discountAmount: 0,
  installmentDeposit: 0,
  remainingAmount: 0,
  nextVisitDate: "",
  remark: "",
  isPaid: false,
  paymentTime: null,

  setSearchQuery: (query) => set({ searchQuery: query }),

  selectPatient: (id) =>
    set({
      selectedPatientId: id,
      reprintRecordId: null,
      selectedExtraItems: [],
      discountAmount: 0,
      discountSource: DISCOUNT_SOURCES[0].type,
      installmentDeposit: 0,
      remainingAmount: 0,
      nextVisitDate: "",
      remark: "",
      isPaid: false,
      paymentTime: null,
    }),

  toggleExtraItem: (id) =>
    set((state) => ({
      selectedExtraItems: state.selectedExtraItems.includes(id)
        ? state.selectedExtraItems.filter((item) => item !== id)
        : [...state.selectedExtraItems, id],
    })),

  setPaymentMethod: (method) => set({ paymentMethod: method }),

  setDiscountSource: (source) => {
    if (source === "none") {
      set({ discountSource: source, discountAmount: 0 })
    } else {
      set({ discountSource: source })
    }
  },

  setDiscountAmount: (amount) => set({ discountAmount: Math.max(0, amount) }),
  setInstallmentDeposit: (amount) => set({ installmentDeposit: Math.max(0, amount) }),
  setRemainingAmount: (amount) => set({ remainingAmount: Math.max(0, amount) }),
  setNextVisitDate: (date) => set({ nextVisitDate: date }),
  setRemark: (remark) => set({ remark }),

  confirmPayment: () => {
    const state = get()
    const visit = state.getSelectedVisit()
    if (!visit) return

    const extraItems = state.getSelectedExtraItems()
    const totalAmount = state.getGrandTotal()
    const actualAmount = state.getActualAmount()
    const payTime = generatePaymentTime()

    let installmentInfo: InstallmentInfo | undefined
    if (state.paymentMethod === "installment_deposit") {
      const deposit = state.installmentDeposit > 0 ? state.installmentDeposit : actualAmount
      const remaining = state.remainingAmount > 0 ? state.remainingAmount : Math.max(0, totalAmount - deposit)
      installmentInfo = {
        depositAmount: deposit,
        remainingAmount: remaining,
        nextVisitDate: state.nextVisitDate,
      }
    }

    const newRecord: CashierRecord = {
      id: generateRecordId(),
      patient: visit.patient,
      package: visit.package,
      extraItems,
      paymentMethod: state.paymentMethod,
      discountSource: state.discountSource,
      discountAmount: state.discountAmount,
      totalAmount,
      actualAmount,
      installmentInfo,
      remark: state.remark,
      paymentTime: payTime,
      status: "paid",
    }

    set((s) => ({
      isPaid: true,
      paymentTime: payTime,
      cashierRecords: [...s.cashierRecords, newRecord],
    }))
  },

  resetState: () =>
    set({
      selectedPatientId: null,
      reprintRecordId: null,
      selectedExtraItems: [],
      searchQuery: "",
      paymentMethod: PAYMENT_METHODS[0].type,
      discountSource: DISCOUNT_SOURCES[0].type,
      discountAmount: 0,
      installmentDeposit: 0,
      remainingAmount: 0,
      nextVisitDate: "",
      remark: "",
      isPaid: false,
      paymentTime: null,
    }),

  selectReprintRecord: (id) => {
    if (id === null) {
      set({ reprintRecordId: null })
      return
    }
    const record = get().cashierRecords.find((r) => r.id === id)
    if (record) {
      set({
        reprintRecordId: id,
        selectedPatientId: record.patient.id,
        isPaid: true,
        paymentTime: record.paymentTime,
      })
    }
  },

  getFilteredPatients: () => {
    const { visitRecords, searchQuery } = get()
    if (!searchQuery.trim()) return visitRecords
    const q = searchQuery.trim().toLowerCase()
    return visitRecords.filter(
      (v) =>
        v.patient.name.toLowerCase().includes(q) ||
        v.patient.phone.includes(q) ||
        v.patient.medicalRecordNo.toLowerCase().includes(q)
    )
  },

  getSelectedVisit: () => {
    const { visitRecords, selectedPatientId, reprintRecordId, cashierRecords } = get()
    if (reprintRecordId) {
      const record = cashierRecords.find((r) => r.id === reprintRecordId)
      if (record) {
        return { patient: record.patient, package: record.package }
      }
    }
    if (!selectedPatientId) return undefined
    return visitRecords.find((v) => v.patient.id === selectedPatientId)
  },

  getSelectedExtraItems: () => {
    const { selectedExtraItems, reprintRecordId, cashierRecords } = get()
    if (reprintRecordId) {
      const record = cashierRecords.find((r) => r.id === reprintRecordId)
      if (record) return record.extraItems
    }
    return EXTRA_ITEMS.filter((item) => selectedExtraItems.includes(item.id))
  },

  getPackageTotal: () => {
    const visit = get().getSelectedVisit()
    return visit?.package.totalPrice ?? 0
  },

  getExtraTotal: () => {
    return get().getSelectedExtraItems().reduce((sum, item) => sum + item.price, 0)
  },

  getGrandTotal: () => {
    return get().getPackageTotal() + get().getExtraTotal()
  },

  getActualAmount: () => {
    const { reprintRecordId, cashierRecords } = get()
    if (reprintRecordId) {
      const record = cashierRecords.find((r) => r.id === reprintRecordId)
      if (record) return record.actualAmount
    }
    return Math.max(0, get().getGrandTotal() - get().discountAmount)
  },

  getDifference: () => {
    return get().getExtraTotal()
  },

  getPaymentSummary: () => {
    const { cashierRecords } = get()
    let cash = 0
    let qrCode = 0
    let installment = 0

    cashierRecords.forEach((r) => {
      const amount = r.installmentInfo ? r.installmentInfo.depositAmount : r.actualAmount
      if (r.paymentMethod === "cash") cash += amount
      else if (r.paymentMethod === "qr_code") qrCode += amount
      else if (r.paymentMethod === "installment_deposit") installment += amount
    })

    return { cash, qrCode, installment, total: cash + qrCode + installment }
  },

  getCurrentReceiptData: () => {
    const state = get()
    const visit = state.getSelectedVisit()
    const extraItems = state.getSelectedExtraItems()

    let installmentInfo: InstallmentInfo | undefined
    if (state.paymentMethod === "installment_deposit") {
      const deposit = state.installmentDeposit > 0 ? state.installmentDeposit : state.getActualAmount()
      const remaining = state.remainingAmount > 0 ? state.remainingAmount : Math.max(0, state.getGrandTotal() - deposit)
      installmentInfo = {
        depositAmount: deposit,
        remainingAmount: remaining,
        nextVisitDate: state.nextVisitDate,
      }
    }

    const isReprint = !!state.reprintRecordId
    const reprintRecord = state.getReprintReceiptData()

    if (isReprint && reprintRecord) {
      return {
        patient: reprintRecord.patient,
        package: reprintRecord.package,
        extraItems: reprintRecord.extraItems,
        paymentMethod: reprintRecord.paymentMethod,
        discountSource: reprintRecord.discountSource,
        discountAmount: reprintRecord.discountAmount,
        totalAmount: reprintRecord.totalAmount,
        actualAmount: reprintRecord.actualAmount,
        installmentInfo: reprintRecord.installmentInfo,
        remark: reprintRecord.remark,
        paymentTime: reprintRecord.paymentTime,
        status: reprintRecord.status,
      }
    }

    return {
      patient: visit?.patient,
      package: visit?.package,
      extraItems,
      paymentMethod: state.paymentMethod,
      discountSource: state.discountSource,
      discountAmount: state.discountAmount,
      totalAmount: state.getGrandTotal(),
      actualAmount: state.getActualAmount(),
      installmentInfo,
      remark: state.remark,
      paymentTime: state.paymentTime ?? undefined,
      status: state.isPaid ? "paid" : "pending",
    }
  },

  getReprintReceiptData: () => {
    const { cashierRecords, reprintRecordId } = get()
    if (!reprintRecordId) return undefined
    return cashierRecords.find((r) => r.id === reprintRecordId)
  },
}))
