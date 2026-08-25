import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import type { TravelRecord, ParsedDataResult, ColumnMapping } from '../types/travel';

const COLUMN_ALIASES: Record<keyof ColumnMapping, string[]> = {
  travelDate: ['travel date','trip date','departure date','travel_date','date of travel','trip_date','departure','flight date','check-in date','checkin date','date'],
  bookingDate: ['booking date','book date','purchase date','booking_date','issue date','ticket date','booked date','reservation date'],
  origin: ['origin','from','departure city','from city','origin city','depart from','dep city','source','start city','home city','check-in city','origin_city'],
  destination: ['destination','to','arrival city','to city','dest city','arrive at','arr city','end city','destination city','check-out city','dest_city'],
  totalCost: ['total cost','amount','fare','price','total fare','ticket price','cost','total amount','trip cost','invoice amount','charge','total charge','net amount','gross amount','total_cost','total_fare','ticket_price','spend','total spend','expense'],
  travelerName: ['traveler name','traveller name','passenger name','employee name','name','full name','traveler','traveller','guest name','pax name','passenger','employee','traveler_name'],
  travelerId: ['traveler id','traveller id','employee id','employee number','emp id','emp no','staff id','traveler_id','user id'],
  category: ['category','travel type','type','mode','service type','travel category','booking type','segment type'],
  vendor: ['vendor','supplier','airline','hotel name','hotel','car company','provider','carrier','vendor name','merchant'],
  department: ['department','dept','business unit','division','team','group','function','org unit'],
  costCentre: ['cost centre','cost center','cost_centre','cc','cost code','gl code','account code','budget code'],
  ticketRef: ['ticket number','ticket no','ticket ref','ticket_ref','ticket#','pnr','ticket id','ticket_number'],
  bookingRef: ['booking ref','booking number','booking_ref','confirmation number','confirmation no','conf no','booking id','reservation number','record locator'],
  classOfTravel: ['class','class of travel','cabin class','service class','fare class','travel class','cabin','booking class'],
  policyStatus: ['policy status','compliance status','in policy','out of policy','policy','approval status','policy_status'],
  tripPurpose: ['trip purpose','purpose','reason','business reason','travel reason','trip_purpose'],
};

function normalizeHeader(h: string): string {
  return h.toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
}

function detectColumnMapping(headers: string[]): ColumnMapping {
  const mapping: ColumnMapping = {};
  const normalizedHeaders = headers.map(h => ({ original: h, normalized: normalizeHeader(h) }));
  for (const [field, aliases] of Object.entries(COLUMN_ALIASES)) {
    for (const { original, normalized } of normalizedHeaders) {
      if (aliases.some(alias => normalized === alias || normalized.includes(alias))) {
        (mapping as any)[field] = original;
        break;
      }
    }
  }
  return mapping;
}

function inferCategory(row: Record<string, any>, mapping: ColumnMapping): 'air' | 'hotel' | 'car' | 'other' {
  const catVal = mapping.category ? String(row[mapping.category] || '').toLowerCase() : '';
  const vendorVal = mapping.vendor ? String(row[mapping.vendor] || '').toLowerCase() : '';
  const combined = catVal + ' ' + vendorVal;
  if (/air|flight|fly|airline|aviation|plane|aviat/.test(combined)) return 'air';
  if (/hotel|lodge|lodg|inn|resort|accommodation|stay|room/.test(combined)) return 'hotel';
  if (/car|rent|vehicle|auto|drive|hertz|avis|enterprise|budget/.test(combined)) return 'car';
  return 'other';
}

function parsePolicyStatus(val: string): 'compliant' | 'violation' | 'exception' {
  const v = val.toLowerCase();
  if (/violat|out.of.policy|non.?comply|reject|denied/.test(v)) return 'violation';
  if (/exception|approved|waived|exempt/.test(v)) return 'exception';
  return 'compliant';
}

function parseDate(val: any): string {
  if (!val) return '';
  if (typeof val === 'number') {
    const d = new Date((val - 25569) * 86400 * 1000);
    return d.toISOString().split('T')[0];
  }
  const str = String(val).trim();
  const d = new Date(str);
  if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
  return str;
}

function parseCost(val: any): number {
  if (typeof val === 'number') return Math.abs(val);
  const str = String(val || '').replace(/[$,£€\s]/g, '');
  const n = parseFloat(str);
  return isNaN(n) ? 0 : Math.abs(n);
}

function rowsToRecords(rows: Record<string, any>[], mapping: ColumnMapping): TravelRecord[] {
  return rows
    .filter(row => {
      const hasCost = mapping.totalCost && parseCost(row[mapping.totalCost]) > 0;
      const hasDate = mapping.travelDate && row[mapping.travelDate];
      const hasName = mapping.travelerName && row[mapping.travelerName];
      return hasCost && hasDate && hasName;
    })
    .map((row, i) => {
      const travelDate = parseDate(mapping.travelDate ? row[mapping.travelDate] : '');
      const bookingDate = mapping.bookingDate ? parseDate(row[mapping.bookingDate]) : undefined;
      const advanceBookingDays = travelDate && bookingDate
        ? Math.max(0, Math.floor((new Date(travelDate).getTime() - new Date(bookingDate).getTime()) / 86400000))
        : undefined;
      return {
        id: `rec-${i}`,
        travelDate,
        bookingDate,
        origin: mapping.origin ? String(row[mapping.origin] || '').trim() : 'Unknown',
        destination: mapping.destination ? String(row[mapping.destination] || '').trim() : 'Unknown',
        totalCost: parseCost(mapping.totalCost ? row[mapping.totalCost] : 0),
        travelerName: mapping.travelerName ? String(row[mapping.travelerName] || '').trim() : 'Unknown',
        travelerId: mapping.travelerId ? String(row[mapping.travelerId] || '') : undefined,
        category: inferCategory(row, mapping),
        vendor: mapping.vendor ? String(row[mapping.vendor] || '').trim() : undefined,
        department: mapping.department ? String(row[mapping.department] || '').trim() : undefined,
        costCentre: mapping.costCentre ? String(row[mapping.costCentre] || '').trim() : undefined,
        ticketRef: mapping.ticketRef ? String(row[mapping.ticketRef] || '') : undefined,
        bookingRef: mapping.bookingRef ? String(row[mapping.bookingRef] || '') : undefined,
        classOfTravel: mapping.classOfTravel ? String(row[mapping.classOfTravel] || '') : undefined,
        policyStatus: mapping.policyStatus ? parsePolicyStatus(String(row[mapping.policyStatus] || '')) : undefined,
        tripPurpose: mapping.tripPurpose ? String(row[mapping.tripPurpose] || '') : undefined,
        advanceBookingDays,
      };
    });
}

export function validateMapping(mapping: ColumnMapping): string[] {
  const missing: string[] = [];
  if (!mapping.travelDate) missing.push('Travel Date');
  if (!mapping.totalCost) missing.push('Total Cost / Amount');
  if (!mapping.travelerName) missing.push('Traveler Name');
  return missing;
}

export async function parseCSV(file: File): Promise<ParsedDataResult> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields || [];
        const mapping = detectColumnMapping(headers);
        const missing = validateMapping(mapping);
        if (missing.length > 0) {
          resolve({ records: [], unmappedColumns: headers.filter(h => !Object.values(mapping).includes(h)), warnings: [`Missing required columns: ${missing.join(', ')}`] });
          return;
        }
        const records = rowsToRecords(results.data as Record<string, any>[], mapping);
        const unmappedColumns = headers.filter(h => !Object.values(mapping).includes(h));
        resolve({ records, unmappedColumns, warnings: [] });
      },
      error: reject,
    });
  });
}

export async function parseExcel(file: File): Promise<ParsedDataResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' }) as Record<string, any>[];
        if (rows.length === 0) { resolve({ records: [], unmappedColumns: [], warnings: ['Empty spreadsheet'] }); return; }
        const headers = Object.keys(rows[0]);
        const mapping = detectColumnMapping(headers);
        const missing = validateMapping(mapping);
        if (missing.length > 0) {
          resolve({ records: [], unmappedColumns: headers.filter(h => !Object.values(mapping).includes(h)), warnings: [`Missing required columns: ${missing.join(', ')}`] });
          return;
        }
        const records = rowsToRecords(rows, mapping);
        const unmappedColumns = headers.filter(h => !Object.values(mapping).includes(h));
        resolve({ records, unmappedColumns, warnings: [] });
      } catch (err) { reject(err); }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export async function parseFile(file: File): Promise<ParsedDataResult> {
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext === 'csv') return parseCSV(file);
  if (ext === 'xlsx' || ext === 'xls') return parseExcel(file);
  throw new Error('Unsupported file type. Please upload a CSV or Excel file.');
}

export const CSV_TEMPLATE = `Travel Date,Booking Date,Origin,Destination,Total Cost,Traveler Name,Department,Vendor,Class,Policy Status,Ticket Ref
2024-01-15,2024-01-01,New York,London,1850.00,John Smith,Finance,British Airways,Business,Compliant,BA123456
2024-01-18,2024-01-10,London,Paris,320.00,Jane Doe,Marketing,Eurostar,Economy,Compliant,ES789012
2024-01-22,2024-01-05,New York,Chicago,450.00,Bob Johnson,Sales,United Airlines,Economy,Out of Policy,UA345678`;