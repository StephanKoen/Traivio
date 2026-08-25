import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LineChart, Line, CartesianGrid } from 'recharts';
import { TrendingUp, ShieldAlert, AlertCircle, ArrowRight } from 'lucide-react';
import TopBar from '../components/TopBar';
import { useApp } from '../context/AppContext';
import { computeStats, formatCurrency } from '../utils/analytics';

export default function Overview() {
  const { records } = useApp();
  const stats = useMemo(() => computeStats(records), [records]);
  const kpis = [
    { label:'Savings Found', value:formatCurrency(stats.savingsFound), color:'#10B981', icon:TrendingUp, bg:'#ECFDF5' },
    { label:'Compliance Rate', value:`${stats.complianceRate}%`, color:'#7C3AED', icon:ShieldAlert, bg:'#F5F3FF' },
    { label:'Policy Violations', value:stats.policyViolations, color:'#F59E0B', icon:AlertCircle, bg:'#FFFBEB' },
    { label:'Fraud Flags', value:stats.fraudFlags, color:'#EF4444', icon:ShieldAlert, bg:'#FEF2F2' },
  ];
  return (
    <div style={{ minHeight:'100vh', background:'#F5F4FF' }}>
      <TopBar title="Overview" subtitle={`${stats.totalTrips} trips · ${formatCurrency(stats.totalSpend)} total spend`} />
      <div style={{ padding:'24px 28px', display:'flex', flexDirection:'column', gap:20 }}>
        <div style={{ borderRadius:16, background:'linear-gradient(135deg,#1a0533 0%,#3b0764 40%,#7C3AED 75%,#C084FC 100%)', padding:'32px 36px', position:'relative', overflow:'hidden' }}>
          <svg style={{ position:'absolute', right:0, top:0, opacity:0.15 }} width="300" height="180" viewBox="0 0 300 180"><circle cx="240" cy="40" r="80" fill="white"/><circle cx="200" cy="100" r="50" fill="white"/><path d="M0 100 Q150 20 300 80" stroke="white" strokeWidth="2" fill="none"/></svg>
          <div style={{ display:'flex', alignItems:'flex-start', gap:48, position:'relative' }}>
            <div>
              <div style={{ color:'rgba(255,255,255,0.6)', fontSize:13, marginBottom:4 }}>Total Travel Spend</div>
              <div style={{ color:'white', fontSize:48, fontWeight:800, letterSpacing:'-1px', lineHeight:1 }}>{formatCurrency(stats.totalSpend)}</div>
              <div style={{ color:'rgba(255,255,255,0.55)', fontSize:13, marginTop:8 }}>Last 12 months · {stats.totalTrips} trips</div>
              <div style={{ display:'flex', gap:8, marginTop:20, flexWrap:'wrap' }}>
                {[{label:`${stats.fraudFlags} Fraud Flags`,color:'#EF4444',bg:'rgba(239,68,68,0.2)'},{label:'4 Credits Expiring',color:'#F59E0B',bg:'rgba(245,158,11,0.2)'},{label:`${formatCurrency(stats.savingsFound)} Savings Found`,color:'#10B981',bg:'rgba(16,185,129,0.2)'}].map((pill,i) => (
                  <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'4px 12px', borderRadius:999, background:pill.bg, color:pill.color, fontSize:12, fontWeight:600, border:`1px solid ${pill.color}33` }}>{pill.label}</span>
                ))}
              </div>
            </div>
            <div style={{ display:'flex', gap:32 }}>
              <div><div style={{ color:'rgba(255,255,255,0.55)', fontSize:12 }}>Avg Per Trip</div><div style={{ color:'white', fontSize:28, fontWeight:700 }}>{formatCurrency(stats.avgCostPerTrip)}</div></div>
              <div><div style={{ color:'rgba(255,255,255,0.55)', fontSize:12 }}>Compliance Rate</div><div style={{ color:'#10B981', fontSize:28, fontWeight:700 }}>{stats.complianceRate}%</div></div>
            </div>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
          {kpis.map((kpi,i) => (
            <div key={i} className="card" style={{ padding:'20px 20px 16px', borderTop:`3px solid ${kpi.color}`, display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
              <div><div style={{ fontSize:12, color:'#94A3B8', fontWeight:500, marginBottom:8 }}>{kpi.label}</div><div style={{ fontSize:28, fontWeight:800, color:'#0F172A' }}>{kpi.value}</div></div>
              <div style={{ width:44, height:44, borderRadius:'50%', background:kpi.bg, display:'flex', alignItems:'center', justifyContent:'center' }}><kpi.icon size={20} color={kpi.color} /></div>
            </div>
          ))}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <div className="card" style={{ padding:'24px' }}>
            <h3 style={{ fontSize:14, fontWeight:700, marginBottom:20, color:'#0F172A' }}>Spend by Category</h3>
            <div style={{ display:'flex', alignItems:'center', gap:24 }}>
              <ResponsiveContainer width={160} height={160}><PieChart><Pie data={stats.spendByCategory} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>{stats.spendByCategory.map((e,i) => <Cell key={i} fill={e.color}/>)}</Pie><Tooltip formatter={(v:any) => formatCurrency(v)}/></PieChart></ResponsiveContainer>
              <div style={{ flex:1 }}>{stats.spendByCategory.map((cat,i) => (<div key={i} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}><div style={{ width:10, height:10, borderRadius:3, background:cat.color, flexShrink:0 }}/><span style={{ fontSize:13, color:'#475569', flex:1 }}>{cat.name}</span><span style={{ fontSize:13, fontWeight:600, color:'#0F172A' }}>{formatCurrency(cat.value)}</span></div>))}</div>
            </div>
          </div>
          <div className="card" style={{ padding:'24px' }}>
            <h3 style={{ fontSize:14, fontWeight:700, marginBottom:20, color:'#0F172A' }}>Department Breakdown</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {stats.spendByDepartment.slice(0,5).map((dept,i) => { const max=stats.spendByDepartment[0]?.value||1; const pct=Math.round((dept.value/max)*100); return (<div key={i}><div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}><span style={{ fontSize:12, color:'#64748B', fontWeight:500 }}>{dept.name}</span><span style={{ fontSize:12, fontWeight:600, color:'#0F172A' }}>{formatCurrency(dept.value)}</span></div><div style={{ height:8, background:'#F1F0FF', borderRadius:4, overflow:'hidden' }}><div style={{ height:'100%', width:`${pct}%`, background:`linear-gradient(90deg,${dept.color},${dept.color}99)`, borderRadius:4 }}/></div></div>);})}
            </div>
            <div style={{ marginTop:16, padding:'10px 12px', background:'#F5F4FF', borderRadius:8, fontSize:12, color:'#7C3AED', fontWeight:500 }}>AI: Sales dept 23% above target — review trip necessity threshold</div>
          </div>
        </div>
        {stats.monthlyTrend.length>0 && (
          <div className="card" style={{ padding:'24px' }}>
            <h3 style={{ fontSize:14, fontWeight:700, marginBottom:20, color:'#0F172A' }}>Monthly Spend Trend</h3>
            <ResponsiveContainer width="100%" height={220}><LineChart data={stats.monthlyTrend}><CartesianGrid strokeDasharray="3 3" stroke="#F1F0FF"/><XAxis dataKey="month" tick={{ fontSize:11, fill:'#94A3B8' }}/><YAxis tickFormatter={v=>`$${(v/1000).toFixed(0)}K`} tick={{ fontSize:11, fill:'#94A3B8' }}/><Tooltip formatter={(v:any) => formatCurrency(v)}/><Line type="monotone" dataKey="spend" stroke="#7C3AED" strokeWidth={2.5} dot={{ fill:'#7C3AED', r:4 }}/></LineChart></ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}