import { useMemo } from 'react';
import { Handshake, TrendingUp, CheckCircle } from 'lucide-react';
import TopBar from '../components/TopBar';
import { useApp } from '../context/AppContext';
import { generateContractOpportunities, formatCurrency } from '../utils/analytics';

export default function ContractOpportunities() {
  const { records } = useApp();
  const contracts = useMemo(() => generateContractOpportunities(records), [records]);
  const totalPotential = contracts.reduce((s,c) => s+c.potential, 0);
  return (
    <div style={{ minHeight:'100vh', background:'#F5F4FF' }}>
      <TopBar title="Contract Opportunities" subtitle="Vendor spend analysis and negotiation recommendations" />
      <div style={{ padding:'24px 28px', display:'flex', flexDirection:'column', gap:20 }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          {[{label:'Negotiation Potential',value:formatCurrency(totalPotential),color:'#10B981',icon:TrendingUp,bg:'#ECFDF5'},{label:'Vendors Analysed',value:contracts.length,color:'#7C3AED',icon:Handshake,bg:'#F5F3FF'},{label:'Contracts Ready',value:contracts.filter(c=>c.progress>=80).length,color:'#0EA5E9',icon:CheckCircle,bg:'#F0F9FF'}].map((kpi,i) => (
            <div key={i} className="card" style={{ padding:'20px', borderTop:`3px solid ${kpi.color}`, display:'flex', alignItems:'center', gap:16 }}><div style={{ width:44, height:44, borderRadius:'50%', background:kpi.bg, display:'flex', alignItems:'center', justifyContent:'center' }}><kpi.icon size={20} color={kpi.color}/></div><div><div style={{ fontSize:12, color:'#94A3B8', fontWeight:500 }}>{kpi.label}</div><div style={{ fontSize:26, fontWeight:800, color:'#0F172A' }}>{kpi.value}</div></div></div>
          ))}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16 }}>
          {contracts.map((c,i) => (
            <div key={i} className="card" style={{ padding:'22px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
                <div><h3 style={{ fontSize:15, fontWeight:700, color:'#0F172A' }}>{c.vendor}</h3><span style={{ fontSize:12, color:'#94A3B8', background:'#F8F7FF', padding:'2px 8px', borderRadius:999, marginTop:4, display:'inline-block' }}>{c.category}</span></div>
                <div style={{ textAlign:'right' }}><div style={{ fontSize:11, color:'#94A3B8' }}>Annual Spend</div><div style={{ fontSize:20, fontWeight:800, color:'#0F172A' }}>{formatCurrency(c.annualSpend)}</div></div>
              </div>
              <div style={{ marginBottom:14 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}><span style={{ fontSize:12, color:'#64748B' }}>Contract threshold</span><span style={{ fontSize:12, fontWeight:600, color:c.progress>=100?'#10B981':'#F59E0B' }}>{formatCurrency(c.annualSpend)} / {formatCurrency(c.threshold)}</span></div>
                <div style={{ height:8, background:'#F1F0FF', borderRadius:4, overflow:'hidden' }}><div style={{ height:'100%', width:`${Math.min(c.progress,100)}%`, background:c.progress>=100?'linear-gradient(90deg,#10B981,#34D399)':'linear-gradient(90deg,#7C3AED,#8B5CF6)', borderRadius:4 }}/></div>
                <div style={{ fontSize:11, color:'#94A3B8', marginTop:4 }}>{c.progress}% of threshold reached</div>
              </div>
              <div style={{ background:'#F5F4FF', borderRadius:8, padding:'10px 12px', border:'1px solid #EDE9FE' }}><div style={{ fontSize:10, fontWeight:600, color:'#7C3AED', marginBottom:4 }}>AI RECOMMENDATION</div><p style={{ fontSize:12, color:'#475569', lineHeight:1.5 }}>{c.recommendation}</p></div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:14 }}><span style={{ fontSize:12, color:'#94A3B8' }}>Savings potential</span><span style={{ fontSize:16, fontWeight:800, color:'#10B981' }}>{formatCurrency(c.potential)}/yr</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}