import { useMemo } from 'react';
import { TrendingUp, ArrowRight } from 'lucide-react';
import TopBar from '../components/TopBar';
import { useApp } from '../context/AppContext';
import { generateSavingsOpportunities, computeStats, formatCurrency } from '../utils/analytics';

export default function SavingsOpportunities() {
  const { records } = useApp();
  const stats = useMemo(() => computeStats(records), [records]);
  const opportunities = useMemo(() => generateSavingsOpportunities(records, stats), [records, stats]);
  const totalSavings = opportunities.reduce((s,o) => s+o.estimatedSavings, 0);
  const funnelData = [{name:'Identified',value:totalSavings,fill:'#7C3AED'},{name:'Approved',value:Math.round(totalSavings*0.7),fill:'#8B5CF6'},{name:'In Progress',value:Math.round(totalSavings*0.45),fill:'#A78BFA'},{name:'Realized',value:Math.round(totalSavings*0.25),fill:'#10B981'}];
  const effortColor: Record<string,string> = {low:'#10B981',medium:'#F59E0B',high:'#EF4444'};
  const impactColor: Record<string,string> = {high:'#7C3AED',medium:'#0EA5E9',low:'#94A3B8'};
  return (
    <div style={{ minHeight:'100vh', background:'#F5F4FF' }}>
      <TopBar title="Savings Opportunities" subtitle="AI-identified cost reduction opportunities ranked by impact" />
      <div style={{ padding:'24px 28px', display:'flex', flexDirection:'column', gap:20 }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          {[{label:'Total Savings Pipeline',value:formatCurrency(totalSavings),color:'#10B981',bg:'#ECFDF5'},{label:'Quick Wins (Low Effort)',value:formatCurrency(opportunities.filter(o=>o.effort==='low').reduce((s,o)=>s+o.estimatedSavings,0)),color:'#7C3AED',bg:'#F5F3FF'},{label:'Opportunities Found',value:opportunities.length,color:'#0EA5E9',bg:'#F0F9FF'}].map((kpi,i) => (
            <div key={i} className="card" style={{ padding:'20px', borderTop:`3px solid ${kpi.color}` }}><div style={{ fontSize:12, color:'#94A3B8', fontWeight:500, marginBottom:8 }}>{kpi.label}</div><div style={{ fontSize:30, fontWeight:800, color:'#0F172A' }}>{kpi.value}</div></div>
          ))}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1.5fr', gap:20 }}>
          <div className="card" style={{ padding:'24px' }}>
            <h3 style={{ fontSize:14, fontWeight:700, marginBottom:20, color:'#0F172A' }}>Savings Funnel</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>{funnelData.map((stage,i) => (<div key={i}><div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}><span style={{ fontSize:13, color:'#475569', fontWeight:500 }}>{stage.name}</span><span style={{ fontSize:13, fontWeight:700, color:stage.fill }}>{formatCurrency(stage.value)}</span></div><div style={{ height:10, background:'#F1F0FF', borderRadius:5 }}><div style={{ height:'100%', width:`${Math.round((stage.value/funnelData[0].value)*100)}%`, background:`linear-gradient(90deg,${stage.fill},${stage.fill}88)`, borderRadius:5 }}/></div></div>))}</div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {opportunities.map((opp,i) => (
              <div key={opp.id} className="card" style={{ padding:'18px 20px' }}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                      <span style={{ width:22, height:22, borderRadius:'50%', background:'linear-gradient(135deg,#7C3AED,#8B5CF6)', display:'inline-flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:11, fontWeight:700, flexShrink:0 }}>{i+1}</span>
                      <h4 style={{ fontSize:14, fontWeight:700, color:'#0F172A' }}>{opp.title}</h4>
                    </div>
                    <p style={{ fontSize:12, color:'#64748B', marginLeft:30, lineHeight:1.5 }}>{opp.description}</p>
                    <div style={{ display:'flex', gap:8, marginLeft:30, marginTop:8 }}>
                      <span style={{ fontSize:11, fontWeight:600, color:effortColor[opp.effort], background:`${effortColor[opp.effort]}15`, padding:'2px 8px', borderRadius:999 }}>{opp.effort} effort</span>
                      <span style={{ fontSize:11, fontWeight:600, color:impactColor[opp.impact], background:`${impactColor[opp.impact]}15`, padding:'2px 8px', borderRadius:999 }}>{opp.impact} impact</span>
                    </div>
                  </div>
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    <div style={{ fontSize:20, fontWeight:800, color:'#10B981' }}>{formatCurrency(opp.estimatedSavings)}</div>
                    <div style={{ fontSize:11, color:'#94A3B8' }}>est. savings/yr</div>
                    <button style={{ marginTop:8, display:'flex', alignItems:'center', gap:4, padding:'5px 10px', background:'#7C3AED', border:'none', borderRadius:6, color:'white', fontSize:11, fontWeight:600, cursor:'pointer' }}>Implement <ArrowRight size={10}/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}