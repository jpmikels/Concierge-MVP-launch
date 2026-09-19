export type ReferralCategory =
  | "elder_law"
  | "hospice"
  | "benefits"
  | "hospital_advocate"
  | "home_health"
  | "respite"
  | "medical_debt"
  | "aging_services"
  | "veterans"
  | "medical_alert"
  | "other";

export type ReviewStatus = "verified" | "needs_review";

export interface Referral {
  id: string;
  category: ReferralCategory;
  name: string;
  whyTrusted: string;
  howToReach: string;
  utahNotes?: string;
  reviewStatus: ReviewStatus;
  networkReady?: boolean;
}

export const referrals: Referral[] = [
  {
    id: "utah-state-bar-elder-law",
    category: "elder_law",
    name: "Utah State Bar Lawyer Referral Service",
    whyTrusted:
      "Official state bar program - attorneys are licensed and in good standing.",
    howToReach:
      "utahbar.org/public-services/lawyer-referral-service or call (801) 531-9077. Ask specifically for elder law or estate planning.",
    utahNotes:
      "Initial consultation is typically $50 for 30 minutes. Specify you need POA, healthcare directive, and estate planning for an aging parent.",
    reviewStatus: "verified",
    networkReady: true,
  },
  {
    id: "utah-daas",
    category: "aging_services",
    name: "Utah Division of Aging and Adult Services (DAAS)",
    whyTrusted:
      "State government agency - the official coordinator of aging services in Utah.",
    howToReach:
      "Call (801) 538-3910 or visit daas.utah.gov. They connect you to your local Area Agency on Aging.",
    utahNotes:
      "DAAS oversees all 12 Area Agencies on Aging in Utah. Start here if you do not know which program you need.",
    reviewStatus: "verified",
    networkReady: true,
  },
  {
    id: "utah-aaa",
    category: "aging_services",
    name: "Utah Area Agency on Aging (local)",
    whyTrusted:
      "Federally-funded, state-coordinated agencies - they exist to help families navigate eldercare.",
    howToReach:
      "Find your county's AAA at daas.utah.gov/area-agencies-on-aging or call DAAS at (801) 538-3910 to be connected.",
    utahNotes:
      "Free help navigating Medicaid waivers, respite, home care, and caregiver support programs. They know the local resources.",
    reviewStatus: "verified",
    networkReady: true,
  },
  {
    id: "utah-dws-medicaid",
    category: "benefits",
    name: "Utah Department of Workforce Services - Medicaid",
    whyTrusted:
      "State agency that administers Medicaid eligibility in Utah.",
    howToReach:
      "jobs.utah.gov/customereducation/services/medicaid or visit a local DWS office. Apply online at medicaid.utah.gov.",
    utahNotes:
      "For waiver programs (home and community-based services), you apply through DWS but may be referred to DAAS for assessment.",
    reviewStatus: "verified",
    networkReady: false,
  },
  {
    id: "medicare-hospice-compare",
    category: "hospice",
    name: "Medicare Hospice Compare",
    whyTrusted:
      "Official Medicare tool - shows quality ratings and inspection results for all certified hospices.",
    howToReach:
      "medicare.gov/care-compare - select 'Hospice' and enter your zip code.",
    utahNotes:
      "Utah hospices are listed with quality scores. Look for 4-5 star ratings and check recent survey results.",
    reviewStatus: "verified",
    networkReady: false,
  },
  {
    id: "hospital-patient-advocate",
    category: "hospital_advocate",
    name: "Hospital Patient Advocate / Patient Relations",
    whyTrusted:
      "Required by hospitals - their job is to resolve issues between patients/families and hospital staff.",
    howToReach:
      "Ask any nurse or front desk: 'I need to speak with the patient advocate' or 'patient relations.' Every hospital has one.",
    utahNotes:
      "If the discharge planner is not answering your questions or you feel rushed, the patient advocate can intervene.",
    reviewStatus: "verified",
    networkReady: false,
  },
  {
    id: "dollar-for",
    category: "medical_debt",
    name: "Dollar For",
    whyTrusted:
      "Nonprofit that helps patients access hospital charity care programs - they have helped eliminate over $100M in medical debt.",
    howToReach: "dollarfor.org - free service to help you apply for charity care at nonprofit hospitals.",
    utahNotes:
      "Works with most nonprofit hospitals. They know the financial assistance policies and help you fill out applications correctly.",
    reviewStatus: "verified",
    networkReady: true,
  },
  {
    id: "rip-medical-debt",
    category: "medical_debt",
    name: "RIP Medical Debt (now Undue Medical Debt)",
    whyTrusted:
      "Major nonprofit that buys and abolishes medical debt for pennies on the dollar - has eliminated billions in debt.",
    howToReach:
      "unduemedicaldebt.org - you can apply for debt relief or donate to help others.",
    utahNotes:
      "They purchase debt in bulk, so you cannot request specific debt be purchased. But if you qualify, they may eliminate yours.",
    reviewStatus: "verified",
    networkReady: false,
  },
  {
    id: "va-aid-attendance",
    category: "veterans",
    name: "VA Aid & Attendance Benefit",
    whyTrusted:
      "Federal VA benefit - provides monthly payment to veterans or surviving spouses who need help with daily activities.",
    howToReach:
      "va.gov/pension/aid-attendance-housebound or call VA at 1-800-827-1000. Can also apply through a VA-accredited claims agent.",
    utahNotes:
      "The veteran (or their spouse) must have served during wartime. Benefit can be used to pay family caregivers.",
    reviewStatus: "verified",
    networkReady: false,
  },
  {
    id: "utah-caregiver-support",
    category: "respite",
    name: "Utah Caregiver Support Program",
    whyTrusted:
      "Federally-funded through Older Americans Act, administered by Utah DAAS.",
    howToReach:
      "Contact your local Area Agency on Aging or call DAAS at (801) 538-3910. Ask about the National Family Caregiver Support Program.",
    utahNotes:
      "May provide respite care, caregiver training, support groups, and limited supplemental services. Eligibility varies by AAA.",
    reviewStatus: "verified",
    networkReady: true,
  },
  {
    id: "alzheimers-association-utah",
    category: "other",
    name: "Alzheimer's Association - Utah Chapter",
    whyTrusted:
      "National nonprofit with local chapter - provides free education, support groups, and a 24/7 helpline.",
    howToReach:
      "24/7 Helpline: 1-800-272-3900. Utah chapter: alz.org/utah or (801) 265-1944.",
    utahNotes:
      "Free care consultations, support groups across Utah, and education on dementia care strategies.",
    reviewStatus: "verified",
    networkReady: true,
  },
  {
    id: "medical-alert-comparison",
    category: "medical_alert",
    name: "Medical Alert System (via insurance or self-purchase)",
    whyTrusted:
      "Established product category - multiple reputable companies offer similar services.",
    howToReach:
      "Ask her insurance if they cover a medical alert system. If self-paying, compare Medical Guardian, Bay Alarm Medical, or Philips Lifeline.",
    utahNotes:
      "Some Utah Medicaid waiver programs cover personal emergency response systems. Ask your AAA or Medicaid case worker.",
    reviewStatus: "needs_review",
    networkReady: false,
  },
  {
    id: "utah-legal-services",
    category: "elder_law",
    name: "Utah Legal Services (low-income)",
    whyTrusted:
      "Nonprofit legal aid - provides free civil legal help to low-income Utahns.",
    howToReach:
      "utahlegalservices.org or call (801) 328-8891 / toll-free 1-800-662-4245. Income eligibility required.",
    utahNotes:
      "Can help with advance directives, simple POAs, and Medicaid issues for those who qualify by income.",
    reviewStatus: "verified",
    networkReady: true,
  },
  {
    id: "new-choices-waiver",
    category: "benefits",
    name: "Utah New Choices Waiver",
    whyTrusted:
      "State Medicaid program specifically for transitioning out of nursing homes back to community living.",
    howToReach:
      "Ask the nursing home social worker or contact DAAS at (801) 538-3910. Faster than standard HCBS waiver waitlist.",
    utahNotes:
      "If your parent is currently in a nursing home or hospital and wants to go home, this waiver may have shorter wait times.",
    reviewStatus: "verified",
    networkReady: false,
  },
  {
    id: "aging-lifespan-respite",
    category: "respite",
    name: "Utah Lifespan Respite Coalition",
    whyTrusted:
      "Statewide coalition connecting families to respite options across Utah.",
    howToReach:
      "utahrespite.org or call 2-1-1 (Utah 211) and ask about respite care options.",
    utahNotes:
      "Can help find respite providers, respite voucher programs, and emergency respite resources.",
    reviewStatus: "needs_review",
    networkReady: true,
  },
];

export function getReferralById(id: string): Referral | undefined {
  return referrals.find((r) => r.id === id);
}

export function getReferralsByIds(ids: string[]): Referral[] {
  return ids
    .map((id) => getReferralById(id))
    .filter((r): r is Referral => r !== undefined);
}

export function getReferralsByCategory(category: ReferralCategory): Referral[] {
  return referrals.filter((r) => r.category === category);
}

export const categoryLabels: Record<ReferralCategory, string> = {
  elder_law: "Elder Law Attorney",
  hospice: "Hospice Care",
  benefits: "Benefits & Programs",
  hospital_advocate: "Hospital Advocate",
  home_health: "Home Health",
  respite: "Respite Care",
  medical_debt: "Medical Debt Help",
  aging_services: "Aging Services",
  veterans: "Veterans Benefits",
  medical_alert: "Medical Alert",
  other: "Other Resources",
};
