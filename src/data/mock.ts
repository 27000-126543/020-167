export interface Patient {
  id: string
  name: string
  phone: string
  medicalRecordNo: string
  doctorName: string
  visitTime: string
}

export interface PackageItem {
  id: string
  name: string
  unitPrice: number
  status: "completed" | "pending_followup"
}

export interface TreatmentPackage {
  id: string
  name: string
  totalPrice: number
  items: PackageItem[]
}

export interface ExtraItem {
  id: string
  name: string
  price: number
  category: "film" | "anesthesia" | "material_upgrade" | "other"
}

export interface VisitRecord {
  patient: Patient
  package: TreatmentPackage
}

export const MOCK_PATIENTS: VisitRecord[] = [
  {
    patient: {
      id: "P001",
      name: "张明远",
      phone: "13812345678",
      medicalRecordNo: "BL20240001",
      doctorName: "李婉清",
      visitTime: "09:30",
    },
    package: {
      id: "PKG001",
      name: "全口洁治+美白套餐",
      totalPrice: 2680,
      items: [
        { id: "I001", name: "超声波洁治", unitPrice: 380, status: "completed" },
        { id: "I002", name: "喷砂抛光", unitPrice: 280, status: "completed" },
        { id: "I003", name: "冷光美白", unitPrice: 1680, status: "completed" },
        { id: "I004", name: "术后脱敏护理", unitPrice: 340, status: "pending_followup" },
      ],
    },
  },
  {
    patient: {
      id: "P002",
      name: "王思涵",
      phone: "15987654321",
      medicalRecordNo: "BL20240002",
      doctorName: "陈志远",
      visitTime: "10:15",
    },
    package: {
      id: "PKG002",
      name: "种植牙标准套餐",
      totalPrice: 8800,
      items: [
        { id: "I005", name: "种植体植入", unitPrice: 5200, status: "completed" },
        { id: "I006", name: "愈合基台", unitPrice: 800, status: "completed" },
        { id: "I007", name: "牙冠修复", unitPrice: 2400, status: "pending_followup" },
        { id: "I008", name: "术后复查", unitPrice: 400, status: "pending_followup" },
      ],
    },
  },
  {
    patient: {
      id: "P003",
      name: "刘子墨",
      phone: "18600001111",
      medicalRecordNo: "BL20240003",
      doctorName: "赵瑞芳",
      visitTime: "11:00",
    },
    package: {
      id: "PKG003",
      name: "正畸初诊套餐",
      totalPrice: 1500,
      items: [
        { id: "I009", name: "口腔全景片", unitPrice: 200, status: "completed" },
        { id: "I010", name: "头颅侧位片", unitPrice: 180, status: "completed" },
        { id: "I011", name: "数字化口扫", unitPrice: 500, status: "completed" },
        { id: "I012", name: "正畸方案设计", unitPrice: 620, status: "completed" },
      ],
    },
  },
  {
    patient: {
      id: "P004",
      name: "陈雅琪",
      phone: "13711112222",
      medicalRecordNo: "BL20240004",
      doctorName: "李婉清",
      visitTime: "14:00",
    },
    package: {
      id: "PKG004",
      name: "根管治疗套餐",
      totalPrice: 3200,
      items: [
        { id: "I013", name: "开髓引流", unitPrice: 300, status: "completed" },
        { id: "I014", name: "根管预备", unitPrice: 800, status: "completed" },
        { id: "I015", name: "根管充填", unitPrice: 900, status: "pending_followup" },
        { id: "I016", name: "纤维桩+全瓷冠", unitPrice: 1200, status: "pending_followup" },
      ],
    },
  },
  {
    patient: {
      id: "P005",
      name: "孙浩然",
      phone: "15033334444",
      medicalRecordNo: "BL20240005",
      doctorName: "陈志远",
      visitTime: "15:30",
    },
    package: {
      id: "PKG005",
      name: "智齿拔除套餐",
      totalPrice: 1800,
      items: [
        { id: "I017", name: "口腔CBCT", unitPrice: 300, status: "completed" },
        { id: "I018", name: "阻生齿拔除", unitPrice: 1200, status: "completed" },
        { id: "I019", name: "术后消炎护理", unitPrice: 300, status: "completed" },
      ],
    },
  },
  {
    patient: {
      id: "P006",
      name: "周佳怡",
      phone: "13955556666",
      medicalRecordNo: "BL20240006",
      doctorName: "赵瑞芳",
      visitTime: "16:00",
    },
    package: {
      id: "PKG006",
      name: "儿童窝沟封闭套餐",
      totalPrice: 960,
      items: [
        { id: "I020", name: "口腔检查", unitPrice: 60, status: "completed" },
        { id: "I021", name: "窝沟封闭（4颗）", unitPrice: 480, status: "completed" },
        { id: "I022", name: "全口涂氟", unitPrice: 280, status: "completed" },
        { id: "I023", name: "复查", unitPrice: 140, status: "pending_followup" },
      ],
    },
  },
]

export const EXTRA_ITEMS: ExtraItem[] = [
  { id: "EX001", name: "口腔全景片", price: 200, category: "film" },
  { id: "EX002", name: "CBCT三维影像", price: 350, category: "film" },
  { id: "EX003", name: "局部麻药（必兰麻）", price: 80, category: "anesthesia" },
  { id: "EX004", name: "阻滞麻醉", price: 120, category: "anesthesia" },
  { id: "EX005", name: "进口树脂升级（3M）", price: 280, category: "material_upgrade" },
  { id: "EX006", name: "全瓷冠升级（威兰德）", price: 800, category: "material_upgrade" },
  { id: "EX007", name: "氧化锆冠升级", price: 1200, category: "material_upgrade" },
  { id: "EX008", name: "术后止痛药", price: 45, category: "other" },
  { id: "EX009", name: "漱口水（医用级）", price: 60, category: "other" },
]

export const PAYMENT_METHODS = [
  { type: "cash" as const, label: "现金" },
  { type: "qr_code" as const, label: "扫码支付" },
  { type: "installment_deposit" as const, label: "分期定金" },
]

export const DISCOUNT_SOURCES = [
  { type: "none" as const, label: "无优惠" },
  { type: "member_price" as const, label: "会员价" },
  { type: "director_approval" as const, label: "院长特批" },
  { type: "group_purchase" as const, label: "团购核销" },
]

export const CATEGORY_LABELS: Record<ExtraItem["category"], string> = {
  film: "拍片",
  anesthesia: "麻药",
  material_upgrade: "材料升级",
  other: "其他",
}
