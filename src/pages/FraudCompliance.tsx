import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';
import TopBar from '../components/TopBar';
import { useApp } from '../context/AppContext';
import { generateFraudFlags, computeStats, formatCurrency } from '../utils/analytics';

export default function FraudCompliance() {
  const { records } = useApp();
  const flags = useMemo(() => generateFraudFlags(records), [records]);
  const stats = useMemo(() => computeStats(records), [records]);
  const violationsData = [{name:'Late booking',count:18,value:Math.round(stats.totalSpend*0.05)},{name:'Class upgrade',count:11,value:Math.round(stats.totalSpend*0.04)},{name:'No approval',count:8,value:Math.round(stats.totalSpend*0.025)},{name:'Excess hotel',count:7,value:Math.round(stats.totalSpend*0.02)},{name:'Personal trip',count:4,value:Math.round(stats.totalSpend*0.015)}];
  const radarData = [{subject:'Air Policy',score:82},{subject:'Hotel Policy',score:91},{subject:'Car Policy',score:76},{subject:'Approval Flow',score:88},{subject:'Booking Lead',score:65},{subject:'Class Policy',score:79}];
  return (
    <div style={{ minHeight:'100vh', background:'#F5F4FF' }}>
      <TopBar title="Fraud & Compliance" subtitle="Policy violations, fraud detection and compliance scoring" />
      <div style={{ padding:'24px 28px', display:'flex', flexDirection:'column', gap:20 }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
          {[{label:'Compliance Rate',value:`${stats.complianceRate}%`,color:'#10B981',icon:ShieldCheck,bg:'#ECFDF5'},{label:'Fraud Flags',value:flags.length,color:'#EF4444',icon:ShieldAlert,bg:'#FEF2F2'},{label:'Policy Violations',value:stats.policyViolations,color:'#F59E0B',icon:AlertTriangle,bg:'#FFFBEB'},{label:'Under Investigation',value:flags.filter(f=>f.status==='investigating').length,color:'#0EA5E9',icon:ShieldAlert,bg:'#F0F9FF'}].map((kpi,i) => (
            <div key={i} className="card" style={{ padding:'20px', borderTop:`3px solid ${kpi.color}`, display:'flex', alignItems:'center', gap:16 }}><div style={{ width:44, height:44, borderRadius:'50%', background:kpi.bg, display:'flex', alignItems:'center', justifyContent:'center' }}><kpi.icon size={20} color={kpi.color}/></div><div><div style={{ fontSize:12, color:'#94A3B8', fontWeight:500 }}>{kpi.label}</div><div style={{ fontSize:26, fontWeight:800, color:'#0F172A' }}>{kpi.value}</div></div></div>
          ))}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <div className="card" style={{ padding:'24px' }}><h3 style={{ fontSize:14, fontWeight:700, marginBottom:20, color:'#0F172A' }}>Policy Violations Breakdown</h3><ResponsiveContainer width="100%" height={220}><BarChart data={violationsData} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#F1F0FF" horizontal={false}/><XAxis type="number" tick={{ fontSize:11, fill:'#94A3B8' }}/><YAxis dataKey="name" type="category" tick={{ fontSize:12, fill:'#64748B' }} width={90}/><Tooltip formatter={(v:any,name) => name==='count'?[v,'Violations']:[formatCurrency(v),'Impact']}/><Bar dataKey="count" name="Violations" fill="#F59E0B" radius={[0,4,4,0]}/></BarChart></ResponsiveContainer></div>
          <div className="card" style={{ padding:'24px' }}><h3 style={{ fontSize:14, fontWeight:700, marginBottom:20, color:'#0F172A' }}>Compliance Radar</h3><ResponsiveContainer width="100%" height={220}><RadarChart data={radarData}><PolarGrid stroke="#EDE9FE"/><PolarAngleAxis dataKey="subject" tick={{ fontSize:11, fill:'#64748B' }}/><PolarRadiusAxis domain={[0,100]} tick={{ fontSize:10 }}/><Radar name="Score" dataKey="score" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.25}/><Tooltip/></RadarChart></ResponsiveContainer></div>
        </div>
        <div className="card" style={{ overflow:'hidden' }}>
          <div style={{ padding:'20px 24px', borderBottom:'1px solid #EDE9FE', display:'flex', justifyContent:'space-between', alignItems:'center' }}><div><h3 style={{ fontSize:14, fontWeight:700, color:'#0F172A' }}>Fraud Flags</h3><p style={{ fontSize:12, color:'#94A3B8', marginTop:2 }}>AI-detected anomalies requiring investigation</p></div><span className="badge badge-danger">{flags.length} flags</span></div>
          <div style={{ overflowX:'auto' }}><table style={{ width:'100%', borderCollapse:'collapse' }}><thead><tr style={{ background:'#FAFAFA' }}>{['Traveler','Flag Type','Description','Amount','Date','Confidence','Status'].map(h => (<th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:11, fontWeight:600, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.05em', borderBottom:'1px solid #EDE9FE', whiteSpace:'nowrap' }}>{h}</th>))}</tr></thead><tbody>{flags.map((f,i) => (<tr key={f.id} style={{ borderBottom:'1px solid #F8F7FF', background:i%2===0?'white':'#FAFAFA' }}><td style={{ padding:'12px 16px', fontSize:13, fontWeight:500, color:'#0F172A' }}>{f.traveler}</td><td style={{ padding:'12px 16px' }}><span className="badge badge-danger" style={{ whiteSpace:'nowrap' }}>{f.type}</span></td><td style={{ padding:'12px 16px', fontSize:13, color:'#475569', maxWidth:240 }}>{f.description}</td><td style={{ padding:'12px 16px', fontSize:13, fontWeight:700, color:'#EF4444' }}>{formatCurrency(f.amount)}</td><td style={{ padding:'12px 16px', fontSize:13, color:'#64748B' }}>{f.date}</td><td style={{ padding:'12px 16px' }}><div style={{ display:'flex', alignItems:'center', gap:6 }}><div style={{ flex:1, height:4, background:'#F1F0FF', borderRadius:2, maxWidth:60 }}><div style={{ height:'100%', width:`${f.confidence}%`, background:f.confidence>85?'#EF4444':'#F59E0B', borderRadius:2 }}/></div><span style={{ fontSize:12, fontWeight:600, color:f.confidence>85?'#EF4444':'#F59E0B' }}>{f.confidence}%</span></div></td><td style={{ padding:'12px 16px' }}><span className={`badge badge-${f.status==='flagged'?'danger':f.status==='investigating'?'warning':'success'}`}>{f.status}</span></td></tr>))}</tbody></table></div>
        </div>
      </div>
    </div>
  );
}