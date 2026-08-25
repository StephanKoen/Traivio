import { useMemo } from 'react';
import { AlertTriangle, Ticket, Clock } from 'lucide-react';
import TopBar from '../components/TopBar';
import { useApp } from '../context/AppContext';
import { generateUnusedCredits, formatCurrency } from '../utils/analytics';

export default function UnusedCredits() {
  const { records } = useApp();
  const credits = useMemo(() => generateUnusedCredits(records), [records]);
  const totalValue = credits.reduce((s,c) => s+c.value, 0);
  const expiringSoon = credits.filter(c => c.status==='expiring-soon');
  const expiringValue = expiringSoon.reduce((s,c) => s+c.value, 0);
  const urgencyColor = (c: typeof credits[0]) => c.daysRemaining<=7?'#EF4444':c.daysRemaining<=30?'#F59E0B':'#10B981';
  return (
    <div style={{ minHeight:'100vh', background:'#F5F4FF' }}>
      <TopBar title="Unused Credits" subtitle="Ticket credits, values and expiry tracking" />
      <div style={{ padding:'24px 28px', display:'flex', flexDirection:'column', gap:20 }}>
        {expiringSoon.length>0 && (
          <div style={{ borderRadius:14, overflow:'hidden', background:'linear-gradient(135deg,#78350f,#b45309)', padding:'20px 24px', position:'relative' }}>
            <svg style={{ position:'absolute', top:0, right:0, opacity:0.15 }} width="160" height="100" viewBox="0 0 160 100"><circle cx="130" cy="30" r="60" fill="white"/><circle cx="100" cy="70" r="35" fill="white"/></svg>
            <div style={{ display:'flex', alignItems:'center', gap:12, position:'relative' }}>
              <AlertTriangle size={24} color="#FCD34D"/>
              <div><div style={{ color:'white', fontWeight:700, fontSize:16 }}>{expiringSoon.length} credits expiring within 30 days</div><div style={{ color:'rgba(255,255,255,0.7)', fontSize:13, marginTop:2 }}>{formatCurrency(expiringValue)} at risk — use or transfer before expiry</div></div>
            </div>
          </div>
        )}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          {[{label:'Total Credits Value',value:formatCurrency(totalValue),color:'#7C3AED',icon:Ticket,bg:'#F5F3FF'},{label:'Expiring (30 days)',value:formatCurrency(expiringValue),color:'#F59E0B',icon:Clock,bg:'#FFFBEB'},{label:'Active Credits',value:credits.filter(c=>c.status==='active').length,color:'#10B981',icon:Ticket,bg:'#ECFDF5'}].map((kpi,i) => (
            <div key={i} className="card" style={{ padding:'20px', borderTop:`3px solid ${kpi.color}`, display:'flex', alignItems:'center', gap:16 }}><div style={{ width:44, height:44, borderRadius:'50%', background:kpi.bg, display:'flex', alignItems:'center', justifyContent:'center' }}><kpi.icon size={20} color={kpi.color}/></div><div><div style={{ fontSize:12, color:'#94A3B8', fontWeight:500 }}>{kpi.label}</div><div style={{ fontSize:26, fontWeight:800, color:'#0F172A' }}>{kpi.value}</div></div></div>
          ))}
        </div>
        <div className="card" style={{ overflow:'hidden' }}>
          <div style={{ padding:'20px 24px', borderBottom:'1px solid #EDE9FE' }}><h3 style={{ fontSize:14, fontWeight:700, color:'#0F172A' }}>All Unused Credits</h3></div>
          <div style={{ overflowX:'auto' }}><table style={{ width:'100%', borderCollapse:'collapse' }}><thead><tr style={{ background:'#FAFAFA' }}>{['Traveler','Ticket Ref','Vendor','Value','Issue Date','Expiry Date','Days Remaining','Status'].map(h => (<th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:11, fontWeight:600, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.05em', borderBottom:'1px solid #EDE9FE', whiteSpace:'nowrap' }}>{h}</th>))}</tr></thead><tbody>{credits.map((c,i) => (<tr key={c.id} style={{ borderBottom:'1px solid #F8F7FF', background:i%2===0?'white':'#FAFAFA' }}><td style={{ padding:'12px 16px', fontSize:13, fontWeight:500, color:'#0F172A' }}>{c.traveler}</td><td style={{ padding:'12px 16px', fontSize:12, color:'#64748B', fontFamily:'monospace' }}>{c.ticketRef}</td><td style={{ padding:'12px 16px', fontSize:13, color:'#475569' }}>{c.vendor}</td><td style={{ padding:'12px 16px', fontSize:13, fontWeight:700, color:'#10B981' }}>{formatCurrency(c.value)}</td><td style={{ padding:'12px 16px', fontSize:13, color:'#64748B' }}>{c.issueDate}</td><td style={{ padding:'12px 16px', fontSize:13, color:'#64748B' }}>{c.expiryDate}</td><td style={{ padding:'12px 16px' }}><div style={{ display:'flex', alignItems:'center', gap:6 }}><div style={{ width:8, height:8, borderRadius:'50%', background:urgencyColor(c), boxShadow:`0 0 0 2px ${urgencyColor(c)}33` }}/><span style={{ fontSize:13, fontWeight:600, color:urgencyColor(c) }}>{c.daysRemaining}d</span></div></td><td style={{ padding:'12px 16px' }}><span className={`badge badge-${c.status==='expiring-soon'?'warning':c.status==='expired'?'danger':'success'}`}>{c.status==='expiring-soon'?'Expiring':c.status==='expired'?'Expired':'Active'}</span></td></tr>))}</tbody></table></div>
        </div>
      </div>
    </div>
  );
}