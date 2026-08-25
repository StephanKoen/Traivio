import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, TrendingDown } from 'lucide-react';
import TopBar from '../components/TopBar';
import { useApp } from '../context/AppContext';
import { generateFareDiscrepancies, formatCurrency, computeStats } from '../utils/analytics';

export default function FareDiscrepancies() {
  const { records } = useApp();
  const discrepancies = useMemo(() => generateFareDiscrepancies(records), [records]);
  const totalGap = discrepancies.reduce((s,d) => s+d.gap, 0);
  const highSeverity = discrepancies.filter(d => d.severity==='high').length;
  const chartData = discrepancies.slice(0,8).map(d => ({ route:d.route.split('→')[1].trim().substring(0,8), booked:d.bookedFare, market:d.marketFare }));
  return (
    <div style={{ minHeight:'100vh', background:'#F5F4FF' }}>
      <TopBar title="Fare Discrepancies" subtitle="Booked fares vs market benchmarks" />
      <div style={{ padding:'24px 28px', display:'flex', flexDirection:'column', gap:20 }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          {[{label:'Total Excess Spend',value:formatCurrency(totalGap),color:'#EF4444',icon:TrendingDown,bg:'#FEF2F2'},{label:'High Severity Cases',value:highSeverity,color:'#F59E0B',icon:AlertTriangle,bg:'#FFFBEB'},{label:'Trips Analysed',value:discrepancies.length,color:'#7C3AED',icon:AlertTriangle,bg:'#F5F3FF'}].map((kpi,i) => (
            <div key={i} className="card" style={{ padding:'20px', borderTop:`3px solid ${kpi.color}`, display:'flex', alignItems:'center', gap:16 }}>
              <div style={{ width:44, height:44, borderRadius:'50%', background:kpi.bg, display:'flex', alignItems:'center', justifyContent:'center' }}><kpi.icon size={20} color={kpi.color}/></div>
              <div><div style={{ fontSize:12, color:'#94A3B8', fontWeight:500 }}>{kpi.label}</div><div style={{ fontSize:26, fontWeight:800, color:'#0F172A' }}>{kpi.value}</div></div>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding:'24px' }}>
          <h3 style={{ fontSize:14, fontWeight:700, marginBottom:20, color:'#0F172A' }}>Booked vs Market Fare — Top Routes</h3>
          <ResponsiveContainer width="100%" height={240}><BarChart data={chartData} barGap={4}><CartesianGrid strokeDasharray="3 3" stroke="#F1F0FF"/><XAxis dataKey="route" tick={{ fontSize:11, fill:'#94A3B8' }}/><YAxis tickFormatter={v=>`$${v}`} tick={{ fontSize:11, fill:'#94A3B8' }}/><Tooltip formatter={(v:any) => formatCurrency(v)}/><Bar dataKey="booked" name="Booked Fare" fill="#7C3AED" radius={[4,4,0,0]}/><Bar dataKey="market" name="Market Fare" fill="#C4B5FD" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer>
        </div>
        <div className="card" style={{ overflow:'hidden' }}>
          <div style={{ padding:'20px 24px', borderBottom:'1px solid #EDE9FE', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <h3 style={{ fontSize:14, fontWeight:700, color:'#0F172A' }}>Fare Discrepancy Details</h3>
            <span className="badge badge-danger">{discrepancies.length} discrepancies</span>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead><tr style={{ background:'#FAFAFA' }}>{['Traveler','Route','Date','Booked Fare','Market Fare','Gap','Vendor','Severity'].map(h => (<th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:11, fontWeight:600, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.05em', whiteSpace:'nowrap', borderBottom:'1px solid #EDE9FE' }}>{h}</th>))}</tr></thead>
              <tbody>{discrepancies.map((d,i) => (<tr key={d.id} style={{ borderBottom:'1px solid #F8F7FF', background:i%2===0?'white':'#FAFAFA' }}><td style={{ padding:'12px 16px', fontSize:13, fontWeight:500, color:'#0F172A' }}>{d.traveler}</td><td style={{ padding:'12px 16px', fontSize:13, color:'#475569' }}>{d.route}</td><td style={{ padding:'12px 16px', fontSize:13, color:'#64748B' }}>{d.travelDate}</td><td style={{ padding:'12px 16px', fontSize:13, fontWeight:600, color:'#0F172A' }}>{formatCurrency(d.bookedFare)}</td><td style={{ padding:'12px 16px', fontSize:13, color:'#10B981', fontWeight:600 }}>{formatCurrency(d.marketFare)}</td><td style={{ padding:'12px 16px', fontSize:13, fontWeight:700, color:'#EF4444' }}>+{formatCurrency(d.gap)}</td><td style={{ padding:'12px 16px', fontSize:13, color:'#64748B' }}>{d.vendor}</td><td style={{ padding:'12px 16px' }}><span className={`badge badge-${d.severity==='high'?'danger':d.severity==='medium'?'warning':'success'}`}>{d.severity}</span></td></tr>))}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}