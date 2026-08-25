export interface TravelRecord {
  id: string;
  travelDate: string;
  bookingDate?: string;
  origin: string;
  destination: string;
  totalCost: number;
  travelerName: string;
  travelerId?: string;
  category: 'air' | 'hotel' | 'car' | 'other';
  vendor?: string;
  department?: string;
  costCentre?: string;
  ticketRef?: string;
  bookingRef?: string;
  classOfTravel?: string;
  policyStatus?: 'compliant' | 'violation' | 'exception';
  tripPurpose?: string;
  advanceBookingDays?: number;
}

export interface ParsedDataResult {
  records: TravelRecord[];
  unmappedColumns: string[];
  warnings: string[];
}

export interface ColumnMapping {
  travelDate?: string;
  bookingDate?: string;
  origin?: string;
  destination?: string;
  totalCost?: string;
  travelerName?: string;
  travelerId?: string;
  category?: string;
  vendor?: string;
  department?: string;
  costCentre?: string;
  ticketRef?: string;
  bookingRef?: string;
  classOfTravel?: string;
  policyStatus?: string;
  tripPurpose?: string;
}

export interface TravelStats {
  totalSpend: number;
  totalTrips: number;
  avgCostPerTrip: number;
  complianceRate: number;
  savingsFound: number;
  policyViolations: number;
  fraudFlags: number;
  unusedCreditsValue: number;
  spendByCategory: { name: string; value: number; color: string }[];
  spendByDepartment: { name: string; value: number; color: string }[];
  monthlyTrend: { month: string; spend: number; trips: number }[];
}

export interface FareDiscrepancy {
  id: string;
  traveler: string;
  route: string;
  travelDate: string;
  bookedFare: number;
  marketFare: number;
  gap: number;
  severity: 'high' | 'medium' | 'low';
  vendor: string;
}

export interface FraudFlag {
  id: string;
  traveler: string;
  type: string;
  description: string;
  amount: number;
  date: string;
  confidence: number;
  status: 'flagged' | 'investigating' | 'cleared';
}

export interface SavingsOpportunity {
  id: string;
  title: string;
  description: string;
  estimatedSavings: number;
  effort: 'low' | 'medium' | 'high';
  category: string;
  impact: 'high' | 'medium' | 'low';
}

export interface UnusedCredit {
  id: string;
  traveler: string;
  ticketRef: string;
  vendor: string;
  value: number;
  issueDate: string;
  expiryDate: string;
  daysRemaining: number;
  status: 'active' | 'expiring-soon' | 'expired';
}

export interface ContractOpportunity {
  vendor: string;
  category: string;
  annualSpend: number;
  threshold: number;
  progress: number;
  recommendation: string;
  potential: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  org: string;
  avatar?: string;
  type: 'company' | 'tmc';
  lastLogin?: string;
}

export interface TMCClient {
  id: string;
  name: string;
  industry: string;
  totalSpend: number;
  complianceScore: number;
  fraudFlags: number;
  savingsFound: number;
  trips: number;
  color: string;
}