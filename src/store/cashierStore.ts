import { create } from "zustand"
import type { Patient, TreatmentPackage, ExtraItem, VisitRecord } from "@/data/mock"
import { MOCK_PATIENTS, EXTRA_ITEMS, PAYMENT_METHODS, DISCOUNT_SOURCES } from "@/data/mock"

interface CashierState {
  visitRecords: VisitRecord[]
  selectedPatientId: string | null
  searchQuery: string
  selectedExtraItems: string[]
  paymentMethod: string
  discountSource: string
  discountAmount: number
  remark: string
  isPaid: boolean

  setSearchQuery: (query: string) => void
  selectPatient: (id: string) => void
  toggleExtraItem: (id: string) => void
  setPaymentMethod: (method: string) => void
  setDiscountSource: (source: string) => void
  setDiscountAmount: (amount: number) => void
  setRemark: (remark: string) => void
  confirmPayment: () => void
  resetState: () => void

  getFilteredPatients: () => VisitRecord[]
  getSelectedVisit: () => VisitRecord | undefined
  getSelectedExtraItems: () => ExtraItem[]
  getPackageTotal: () => number
  getExtraTotal: () => number
  getGrandTotal: () => number
  getActualAmount: () => number
  getDifference: () => number
}

export const useCashierStore = create<CashierState>((set, get) => ({
  visitRecords: MOCK_PATIENTS,
  selectedPatientId: null,
  searchQuery: "",
  selectedExtraItems: [],
  paymentMethod: PAYMENT_METHODS[0].type,
  discountSource: DISCOUNT_SOURCES[0].type,
  discountAmount: 0,
  remark: "",
  isPaid: false,

  setSearchQuery: (query) => set({ searchQuery: query }),

  selectPatient: (id) =>
    set({
      selectedPatientId: id,
      selectedExtraItems: [],
      discountAmount: 0,
      discountSource: DISCOUNT_SOURCES[0].type,
      remark: "",
      isPaid: false,
    }),

  toggleExtraItem: (id) =>
    set((state) => ({
      selectedExtraItems: state.selectedExtraItems.includes(id)
        ? state.selectedExtraItems.filter((item) => item !== id)
        : [...state.selectedExtraItems, id],
    })),

  setPaymentMethod: (method) => set({ paymentMethod: method }),
  setDiscountSource: (source) => set({ discountSource: source }),
  setDiscountAmount: (amount) => set({ discountAmount: Math.max(0, amount) }),
  setRemark: (remark) => set({ remark }),

  confirmPayment: () => set({ isPaid: true }),

  resetState: () =>
    set({
      selectedPatientId: null,
      selectedExtraItems: [],
      searchQuery: "",
      paymentMethod: PAYMENT_METHODS[0].type,
      discountSource: DISCOUNT_SOURCES[0].type,
      discountAmount: 0,
      remark: "",
      isPaid: false,
    }),

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
    const { visitRecords, selectedPatientId } = get()
    if (!selectedPatientId) return undefined
    return visitRecords.find((v) => v.patient.id === selectedPatientId)
  },

  getSelectedExtraItems: () => {
    const { selectedExtraItems } = get()
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
    return Math.max(0, get().getGrandTotal() - get().discountAmount)
  },

  getDifference: () => {
    return get().getExtraTotal()
  },
}))
