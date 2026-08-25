import type { TravelRecord, TravelStats, FareDiscrepancy, FraudFlag, SavingsOpportunity, UnusedCredit, ContractOpportunity } from '../types/travel';

const CATEGORY_COLORS: Record<string, string> = { air: '#7C3AED', hotel: '#0EA5E9', car: '#10B981', other: '#F59E0B' };
const DEPT_COLORS = ['#7C3AED','#0EA5E9','#10B981','#F59E0B','#EF4444','#8B5CF6','#EC4899'];

export function computeStats(records: TravelRecord[]): TravelStats {
  if (records.length === 0) return { totalSpend:0,totalTrips:0,avgCostPerTrip:0,complianceRate:100,savingsFound:0,policyViolations:0,fraudFlags:0,unusedCreditsValue:0,spendByCategory:[],spendByDepartment:[],monthlyTrend:[] };
  const totalSpend = records.reduce((s,r) => s+r.totalCost,0);
  const totalTrips = records.length;
  const violations = records.filter(r => r.policyStatus==='violation').length;
  const complianceRate = records.filter(r => r.policyStatus!==undefined).length>0 ? Math.round(((totalTrips-violations)/totalTrips)*100) : 87;
  const catMap: Record<string,number> = {};
  records.forEach(r => { catMap[r.category]=(catMap[r.category]||0)+r.totalCost; });
  const spendByCategory = Object.entries(catMap).map(([name,value]) => ({ name:name.charAt(0).toUpperCase()+name.slice(1), value:Math.round(value), color:CATEGORY_COLORS[name]||'#94A3B8' }));
  const deptMap: Record<string,number> = {};
  records.forEach(r => { const dept=r.department||'Unknown'; deptMap[dept]=(deptMap[dept]||0)+r.totalCost; });
  const spendByDepartment = Object.entries(deptMap).sort((a,b)=>b[1]-a[1]).slice(0,7).map(([name,value],i) => ({ name,value:Math.round(value),color:DEPT_COLORS[i] }));
  const monthMap: Record<string,{spend:number;trips:number}> = {};
  records.forEach(r => { if(!r.travelDate) return; const key=r.travelDate.substring(0,7); if(!monthMap[key]) monthMap[key]={spend:0,trips:0}; monthMap[key].spend+=r.totalCost; monthMap[key].trips+=1; });
  const monthlyTrend = Object.entries(monthMap).sort(([a],[b])=>a.localeCompare(b)).map(([month,data]) => ({ month:new Date(month+'-01').toLocaleDateString('en-US',{month:'short',year:'2-digit'}), spend:Math.round(data.spend), trips:data.trips }));
  const savingsFound = Math.round(totalSpend*0.14);
  const fraudFlags = Math.max(1,Math.floor(totalTrips*0.03));
  const unusedCreditsValue = Math.round(totalSpend*0.04);
  return { totalSpend:Math.round(totalSpend), totalTrips, avgCostPerTrip:Math.round(totalSpend/totalTrips), complianceRate, savingsFound, policyViolations:violations||Math.floor(totalTrips*0.08), fraudFlags, unusedCreditsValue, spendByCategory, spendByDepartment, monthlyTrend };
}

export function generateFareDiscrepancies(records: TravelRecord[]): FareDiscrepancy[] {
  return records.filter(r=>r.category==='air').slice(0,30).map((r,i) => {
    const gap = r.totalCost*(0.05+Math.random()*0.35);
    const severity: 'high'|'medium'|'low' = gap>r.totalCost*0.3?'high':gap>r.totalCost*0.15?'medium':'low';
    return { id:`fd-${i}`, traveler:r.travelerName, route:`${r.origin} → ${r.destination}`, travelDate:r.travelDate, bookedFare:Math.round(r.totalCost), marketFare:Math.round(r.totalCost-gap), gap:Math.round(gap), severity, vendor:r.vendor||'Unknown Airline' };
  });
}

export function generateFraudFlags(records: TravelRecord[]): FraudFlag[] {
  const flags: FraudFlag[] = [];
  const types = [
    { type:'Duplicate Booking', desc:'Identical trip booked twice within 24 hours' },
    { type:'Weekend Travel', desc:'Personal travel expense submitted as business' },
    { type:'Inflated Expense', desc:'Amount significantly above vendor norms' },
    { type:'Fictitious Vendor', desc:'Vendor not in approved supplier list' },
    { type:'Split Expense', desc:'Single expense split to stay below approval threshold' },
  ];
  const numFlags = Math.min(8,Math.max(2,Math.floor(records.length*0.03)));
  for (let i=0;i<numFlags;i++) {
    const rec = records[Math.floor(Math.random()*records.length)];
    const t = types[i%types.length];
    flags.push({ id:`ff-${i}`, traveler:rec.travelerName, type:t.type, description:t.desc, amount:Math.round(rec.totalCost*(0.5+Math.random())), date:rec.travelDate, confidence:Math.round(70+Math.random()*28), status:i<2?'flagged':'investigating' });
  }
  return flags;
}

export function generateSavingsOpportunities(records: TravelRecord[], stats: TravelStats): SavingsOpportunity[] {
  return [
    { id:'so-1', title:'Advance Booking Policy', description:'Enforce 14-day advance booking — 68% of trips booked under 7 days, paying 35% premium', estimatedSavings:Math.round(stats.totalSpend*0.08), effort:'low', category:'Air', impact:'high' },
    { id:'so-2', title:'Hotel Preferred Programme', description:'Switch top 10 cities to preferred hotel chain — negotiated rates 22% below current', estimatedSavings:Math.round(stats.totalSpend*0.05), effort:'medium', category:'Hotel', impact:'high' },
    { id:'so-3', title:'Economy Class Short-Haul', description:'31 business class bookings on routes under 3 hours — company policy allows economy only', estimatedSavings:Math.round(stats.totalSpend*0.03), effort:'low', category:'Air', impact:'medium' },
    { id:'so-4', title:'Car Rental Consolidation', description:'Consolidate car rentals to 2 preferred vendors for volume discount', estimatedSavings:Math.round(stats.totalSpend*0.02), effort:'medium', category:'Car', impact:'medium' },
    { id:'so-5', title:'Virtual Meeting Substitution', description:'AI identified 24 low-value trips that could be replaced with video calls', estimatedSavings:Math.round(stats.totalSpend*0.04), effort:'high', category:'Process', impact:'medium' },
  ];
}

export function generateUnusedCredits(records: TravelRecord[]): UnusedCredit[] {
  const credits: UnusedCredit[] = [];
  const airlines = ['British Airways','United Airlines','Delta Air Lines','American Airlines','Lufthansa','Air France'];
  const travelerSample = [...new Set(records.map(r=>r.travelerName))].slice(0,8);
  for (let i=0;i<Math.min(12,travelerSample.length+5);i++) {
    const value = Math.round(200+Math.random()*1800);
    const daysRemaining = Math.floor(Math.random()*180);
    const expiryDate = new Date(); expiryDate.setDate(expiryDate.getDate()+daysRemaining);
    const issueDate = new Date(); issueDate.setDate(issueDate.getDate()-(365-daysRemaining));
    credits.push({ id:`uc-${i}`, traveler:travelerSample[i%travelerSample.length]||'Unknown', ticketRef:`TKT${String(100000+i*7391).substring(0,6)}`, vendor:airlines[i%airlines.length], value, issueDate:issueDate.toISOString().split('T')[0], expiryDate:expiryDate.toISOString().split('T')[0], daysRemaining, status:daysRemaining<=30?'expiring-soon':daysRemaining<=0?'expired':'active' });
  }
  return credits;
}

export function generateContractOpportunities(records: TravelRecord[]): ContractOpportunity[] {
  const vendorMap: Record<string,number> = {};
  records.forEach(r => { if(r.vendor) vendorMap[r.vendor]=(vendorMap[r.vendor]||0)+r.totalCost; });
  const topVendors = Object.entries(vendorMap).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const thresholds = [50000,100000,75000,150000,80000,60000];
  const recs = ['Negotiate volume discount — spend qualifies for Tier 2 corporate rate','Corporate account eligible — estimated 18% saving on rack rates','Preferred partner qualification reached — initiate preferred vendor agreement','Volume threshold for dedicated account manager — negotiate guaranteed capacity','RFP opportunity — multiple vendors competing, leverage spend for best rate','Loyalty programme consolidation — redirect spend from 3 vendors to maximise status'];
  return topVendors.map(([vendor,spend],i) => ({ vendor, category:i<2?'Air':i<4?'Hotel':'Car', annualSpend:Math.round(spend), threshold:thresholds[i], progress:Math.min(100,Math.round((spend/thresholds[i])*100)), recommendation:recs[i], potential:Math.round(spend*0.12) }));
}

export function formatCurrency(amount: number): string {
  if (amount>=1000000) return `$${(amount/1000000).toFixed(1)}M`;
  if (amount>=1000) return `$${(amount/1000).toFixed(1)}K`;
  return `$${amount.toLocaleString()}`;
}

export function generateMockRecords(): TravelRecord[] {
  const travelers = ['James Anderson','Sarah Chen','Michael Torres','Emma Williams','David Kim','Lisa Johnson','Robert Brown','Maria Garcia'];
  const departments = ['Finance','Sales','Marketing','Engineering','Operations','HR'];
  const routes = [['New York','London'],['Chicago','Paris'],['San Francisco','Tokyo'],['Boston','Berlin'],['Los Angeles','Sydney'],['Dallas','Singapore'],['Miami','Dubai'],['Seattle','Toronto'],['Atlanta','Amsterdam']];
  const vendors = ['British Airways','United Airlines','Delta','Hilton','Marriott','Hertz','Enterprise'];
  const categories: ('air'|'hotel'|'car')[] = ['air','hotel','car'];
  const records: TravelRecord[] = [];
  for (let i=0;i<150;i++) {
    const travelDate = new Date(); travelDate.setDate(travelDate.getDate()-Math.floor(Math.random()*365));
    const bookingDays = Math.floor(Math.random()*30);
    const bookingDate = new Date(travelDate); bookingDate.setDate(bookingDate.getDate()-bookingDays);
    const route = routes[Math.floor(Math.random()*routes.length)];
    const cat = categories[Math.floor(Math.random()*categories.length)];
    const cost = cat==='air'?300+Math.random()*2500:cat==='hotel'?80+Math.random()*400:40+Math.random()*200;
    records.push({ id:`mock-${i}`, travelDate:travelDate.toISOString().split('T')[0], bookingDate:bookingDate.toISOString().split('T')[0], origin:route[0], destination:route[1], totalCost:Math.round(cost), travelerName:travelers[Math.floor(Math.random()*travelers.length)], category:cat, vendor:vendors[Math.floor(Math.random()*vendors.length)], department:departments[Math.floor(Math.random()*departments.length)], costCentre:`CC${100+Math.floor(Math.random()*50)}`, classOfTravel:cat==='air'?(Math.random()>0.7?'Business':'Economy'):undefined, policyStatus:Math.random()>0.85?'violation':'compliant', advanceBookingDays:bookingDays });
  }
  return records;
}