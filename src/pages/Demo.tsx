import { useState, useRef } from 'react';
import { Upload, Download, CheckCircle, Lock, TrendingUp, ShieldAlert, Ticket, Zap, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { parseFile, CSV_TEMPLATE } from '../utils/dataParser';
import { computeStats, generateFraudFlags, generateSavingsOpportunities, formatCurrency } from '../utils/analytics';
import type { TravelRecord } from '../types/travel';

export default function Demo() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<TravelRecord[]|null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if(!file) return;
    setUploading(true); setError('');
    try { const result=await parseFile(file); if(result.warnings.length>0){setError(result.warnings[0]);}else{setRecords(result.records);setFileName(file.name);} }
    catch(err:any){setError(err.message||'Failed to parse file');}
    finally{setUploading(false);if(fileRef.current)fileRef.current.value='';}
  };
  const downloadTemplate = () => { const blob=new Blob([CSV_TEMPLATE],{type:'text/csv'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='traivio-template.csv'; a.click(); URL.revokeObjectURL(url); };
  const stats = records?computeStats(records):null;
  const fraudFlags = records?generateFraudFlags(records):[];
  const savings = records?generateSavingsOpportunities(records,computeStats(records)):[];
  return (
    <div style={{ minHeight:'100vh', background:'#F5F4FF' }}>
      <div style={{ background:'linear-gradient(135deg,#1a0533,#3b0764)', padding:'20px 32px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#7C3AED,#C084FC)', display:'flex', alignItems:'center', justifyContent:'center' }}><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 16L10 4L16 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M6.5 11.5H13.5" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg></div>
          <div><div style={{ color:'white', fontWeight:700, fontSize:18 }}>Traivio</div><div style={{ color:'rgba(255,255,255,0.5)', fontSize:10 }}>Free Demo</div></div>
        </div>
        <button onClick={() => navigate('/login')} style={{ padding:'8px 18px', borderRadius:8, background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.25)', color:'white', fontSize:13, fontWeight:600, cursor:'pointer' }}>Sign In / Register →</button>
      </div>
      <div style={{ maxWidth:900, margin:'0 auto', padding:'36px 24px' }}>
        {!records?(
          <div>
            <div style={{ textAlign:'center', marginBottom:36 }}><h1 style={{ fontSize:36, fontWeight:800, color:'#0F172A', letterSpacing:'-1px' }}>AI Travel Analytics — Free Demo</h1><p style={{ fontSize:16, color:'#64748B', marginTop:10, maxWidth:520, margin:'10px auto 0' }}>Upload up to 12 months of corporate travel data. Get instant AI analysis.</p></div>
            <div onClick={() => fileRef.current?.click()} style={{ border:'2px dashed #C4B5FD', borderRadius:16, padding:'60px 40px', textAlign:'center', background:'white', cursor:'pointer' }} onMouseEnter={e=>{e.currentTarget.style.borderColor='#7C3AED';e.currentTarget.style.background='#F5F3FF';}} onMouseLeave={e=>{e.currentTarget.style.borderColor='#C4B5FD';e.currentTarget.style.background='white';}}>
              {uploading?(<div><Loader2 size={40} color="#7C3AED" className="spin" style={{ margin:'0 auto 12px' }}/><p style={{ fontSize:15, color:'#7C3AED', fontWeight:600 }}>Analysing your data with AI...</p></div>):(<div><Upload size={44} color="#C4B5FD" style={{ margin:'0 auto 14px' }}/><p style={{ fontSize:16, fontWeight:700, color:'#0F172A', marginBottom:6 }}>Drop your travel data here</p><p style={{ fontSize:13, color:'#94A3B8' }}>Supports CSV, Excel (.xlsx, .xls)</p><div style={{ display:'inline-block', marginTop:16, padding:'10px 24px', borderRadius:8, background:'linear-gradient(135deg,#7C3AED,#8B5CF6)', color:'white', fontSize:14, fontWeight:600 }}>Choose File</div></div>)}
              <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" onChange={handleUpload} style={{ display:'none' }}/>
            </div>
            {error && <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:10, padding:'16px', marginTop:16 }}><p style={{ color:'#DC2626', fontWeight:600, marginBottom:4 }}>Upload Error</p><p style={{ color:'#DC2626', fontSize:13 }}>{error}</p><button onClick={downloadTemplate} style={{ marginTop:10, display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:7, background:'white', border:'1px solid #FECACA', color:'#DC2626', fontSize:13, cursor:'pointer' }}><Download size={13}/> Download CSV Template</button></div>}
            <div style={{ display:'flex', justifyContent:'center', marginTop:16 }}><button onClick={downloadTemplate} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', color:'#7C3AED', fontSize:13, cursor:'pointer', fontWeight:500 }}><Download size={13}/> Download CSV template</button></div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginTop:36 }}>
              {[{icon:TrendingUp,color:'#10B981',title:'Savings Found',desc:'AI identifies cost reduction opportunities ranked by impact and effort'},{icon:ShieldAlert,color:'#EF4444',title:'Fraud Detection',desc:'Duplicate bookings, policy violations and anomalous expenses flagged automatically'},{icon:Ticket,color:'#F59E0B',title:'Credits & Compliance',desc:'Unused ticket credits, expiry alerts and compliance scoring'}].map((item,i) => (
                <div key={i} style={{ background:'white', borderRadius:14, padding:'20px', border:'1px solid #EDE9FE', textAlign:'center' }}><div style={{ width:44, height:44, borderRadius:'50%', background:`${item.color}15`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}><item.icon size={20} color={item.color}/></div><h3 style={{ fontSize:14, fontWeight:700, color:'#0F172A', marginBottom:6 }}>{item.title}</h3><p style={{ fontSize:12, color:'#64748B', lineHeight:1.5 }}>{item.desc}</p></div>
              ))}
            </div>
          </div>
        ):(
          <div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
              <div><div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}><CheckCircle size={20} color="#10B981"/><h2 style={{ fontSize:20, fontWeight:700, color:'#0F172A' }}>Analysis Complete!</h2></div><p style={{ fontSize:13, color:'#64748B' }}>{fileName} · {records.length} trips analysed</p></div>
              <button onClick={() => { setRecords(null); setFileName(''); }} style={{ padding:'8px 14px', borderRadius:8, background:'white', border:'1px solid #EDE9FE', fontSize:13, color:'#64748B', cursor:'pointer' }}>Upload new file</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
              {[{label:'Total Spend',value:formatCurrency(stats!.totalSpend),color:'#7C3AED'},{label:'Savings Found',value:formatCurrency(stats!.savingsFound),color:'#10B981'},{label:'Compliance Rate',value:`${stats!.complianceRate}%`,color:'#0EA5E9'},{label:'Fraud Flags',value:stats!.fraudFlags,color:'#EF4444'}].map((kpi,i) => (
                <div key={i} style={{ background:'white', borderRadius:12, padding:'18px', borderTop:`3px solid ${kpi.color}`, border:`1px solid #EDE9FE` }}><div style={{ fontSize:11, color:'#94A3B8', fontWeight:500, marginBottom:6 }}>{kpi.label}</div><div style={{ fontSize:24, fontWeight:800, color:'#0F172A' }}>{kpi.value}</div></div>
              ))}
            </div>
            <div style={{ background:'white', borderRadius:14, border:'1px solid #EDE9FE', padding:'20px', marginBottom:16 }}>
              <h3 style={{ fontSize:14, fontWeight:700, color:'#0F172A', marginBottom:16 }}>Top 5 Savings Opportunities</h3>
              {savings.slice(0,5).map((s,i) => (<div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:i<4?'1px solid #F8F7FF':'none' }}><div style={{ width:24, height:24, borderRadius:'50%', background:'linear-gradient(135deg,#7C3AED,#8B5CF6)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:11, fontWeight:700, flexShrink:0 }}>{i+1}</div><div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:600, color:'#0F172A' }}>{s.title}</div><div style={{ fontSize:12, color:'#64748B', marginTop:2 }}>{s.description}</div></div><div style={{ fontSize:16, fontWeight:800, color:'#10B981', flexShrink:0 }}>{formatCurrency(s.estimatedSavings)}</div></div>))}
            </div>
            {[{title:'Contract Qualification Analysis',icon:'🤝',desc:'See which vendors you qualify for better rates with...'},{title:'Predictive Spend Forecast',icon:'📈',desc:'6-month spend forecast with confidence intervals...'},{title:'Department Deep-Dive',icon:'🏢',desc:'Per-department compliance scores, top travelers...'}].map((section,i) => (
              <div key={i} style={{ background:'white', borderRadius:14, border:'1px solid #EDE9FE', padding:'20px', marginBottom:16, position:'relative', overflow:'hidden' }}>
                <h3 style={{ fontSize:14, fontWeight:700, color:'#0F172A', marginBottom:8 }}>{section.icon} {section.title}</h3>
                <p style={{ fontSize:13, color:'#94A3B8' }}>{section.desc}</p>
                <div style={{ position:'absolute', inset:0, background:'rgba(255,255,255,0.85)', backdropFilter:'blur(4px)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8 }}>
                  <Lock size={20} color="#7C3AED"/><div style={{ fontSize:13, fontWeight:600, color:'#7C3AED' }}>Sign up to unlock full report</div>
                  <button onClick={() => navigate('/login')} style={{ padding:'8px 20px', borderRadius:8, background:'linear-gradient(135deg,#7C3AED,#8B5CF6)', border:'none', color:'white', fontSize:13, fontWeight:600, cursor:'pointer' }}>Get Full Access →</button>
                </div>
              </div>
            ))}
            <div style={{ background:'linear-gradient(135deg,#1a0533,#7C3AED)', borderRadius:16, padding:'32px', textAlign:'center' }}>
              <h3 style={{ color:'white', fontSize:20, fontWeight:700, marginBottom:8 }}>Unlock Your Full Travel Intelligence Report</h3>
              <p style={{ color:'rgba(255,255,255,0.7)', fontSize:14, marginBottom:20 }}>Get the complete analysis, AI recommendations, PDF export, and ongoing monitoring.</p>
              <button onClick={() => navigate('/login')} style={{ padding:'12px 28px', borderRadius:10, background:'white', border:'none', color:'#7C3AED', fontSize:15, fontWeight:700, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:6 }}><Zap size={16}/> Get Full Access — Free Trial</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}