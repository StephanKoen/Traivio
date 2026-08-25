import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import TopBar from '../components/TopBar';
import { useApp } from '../context/AppContext';
import { computeStats, formatCurrency } from '../utils/analytics';

export default function PredictiveInsights() {
  const { records } = useApp();
  const stats = useMemo(() => computeStats(records), [records]);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const currentMonth = new Date().getMonth();
  const avgMonthly = stats.totalSpend/12;
  const forecastData = months.map((m,i) => { const isHistorical=i<=currentMonth; const base=avgMonthly*(0.8+Math.sin(i*0.5)*0.2+Math.random()*0.15); return { month:m, actual:isHistorical?Math.round(base):null, forecast:!isHistorical?Math.round(base*1.05):null }; });
  const insights = [
    { title:'Q4 Spend Surge Expected', description:'Based on historical patterns, travel spend typically increases 28% in Q4. Budget allocation may need adjustment.', confidence:89, impact:'high', icon:TrendingUp, color:'#F59E0B' },
    { title:'Air Fares Rising on Key Routes', description:'NY-London and SF-Tokyo fares trending up 15% over next 60 days. Recommend advance booking now.', confidence:82, impact:'high', icon:AlertCircle, color:'#EF4444' },
    { title:'Preferred Hotel Rates Expiring', description:'3 hotel contracts expire in 90 days. Start renegotiations now to lock in current rates.', confidence:95, impact:'medium', icon:AlertCircle, color:'#F59E0B' },
    { title:'Carbon Footprint Reduction Opportunity', description:'Substituting 24 short-haul flights with rail could reduce emissions by 40 tonnes CO₂.', confidence:76, impact:'medium', icon:TrendingDown, color:'#0EA5E9' },
    { title:'Sales Team Trip Frequency Optimisation', description:'AI analysis suggests quarterly visits to top 10 accounts could replace monthly schedule with 92% relationship retention.', confidence:71, impact:'high', icon:TrendingDown, color:'#10B981' },
    { title:'Budget Overrun Risk', description:`Current spend trajectory suggests ${formatCurrency(Math.round(stats.totalSpend*0.12))} budget overrun by year-end without intervention.`, confidence:84, impact:'high', icon:AlertCircle, color:'#EF4444' },
  ];
  const impactColor: Record<string,string> = {high:'#EF4444',medium:'#F59E0B',low:'#94A3B8'};
  return (
    <div style={{ minHeight:'100vh', background:'#F5F4FF' }}>
      <TopBar title="Predictive Insights" subtitle="6-month AI forecast with confidence intervals" />
      <div style={{ padding:'24px 28px', display:'flex', flexDirection:'column', gap:20 }}>
        <div className="card" style={{ padding:'24px' }}>
          <h3 style={{ fontSize:14, fontWeight:700, marginBottom:20, color:'#0F172A' }}>12-Month Spend Forecast</h3>
          <ResponsiveContainer width="100%" height={280}><AreaChart data={forecastData}><defs><linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#7C3AED" stopOpacity={0.15}/><stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/></linearGradient><linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.15}/><stop offset="95%" stopColor="#10B981" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#F1F0FF"/><XAxis dataKey="month" tick={{ fontSize:11, fill:'#94A3B8' }}/><YAxis tickFormatter={v=>`$${(v/1000).toFixed(0)}K`} tick={{ fontSize:11, fill:'#94A3B8' }}/><Tooltip formatter={(v:any) => v?formatCurrency(v):'N/A'}/><Area type="monotone" dataKey="actual" stroke="#7C3AED" strokeWidth={2.5} fill="url(#actualGrad)" connectNulls={false} dot={false}/><Area type="monotone" dataKey="forecast" stroke="#10B981" strokeWidth={2} strokeDasharray="6 3" fill="url(#forecastGrad)" connectNulls={false} dot={false}/></AreaChart></ResponsiveContainer>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14 }}>
          {insights.map((ins,i) => (
            <div key={i} className="card" style={{ padding:'20px', borderLeft:`4px solid ${ins.color}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12 }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}><ins.icon size={16} color={ins.color}/><h4 style={{ fontSize:13, fontWeight:700, color:'#0F172A' }}>{ins.title}</h4></div>
                  <p style={{ fontSize:12, color:'#64748B', lineHeight:1.6 }}>{ins.description}</p>
                  <div style={{ display:'flex', gap:8, marginTop:10 }}><span style={{ fontSize:11, fontWeight:600, color:impactColor[ins.impact], background:`${impactColor[ins.impact]}15`, padding:'2px 8px', borderRadius:999 }}>{ins.impact} impact</span></div>
                </div>
                <div style={{ textAlign:'center', flexShrink:0 }}>
                  <div style={{ fontSize:20, fontWeight:800, color:ins.color }}>{ins.confidence}%</div>
                  <div style={{ fontSize:10, color:'#94A3B8' }}>confidence</div>
                  <div style={{ width:40, height:4, background:'#F1F0FF', borderRadius:2, marginTop:4 }}><div style={{ height:'100%', width:`${ins.confidence}%`, background:ins.color, borderRadius:2 }}/></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}