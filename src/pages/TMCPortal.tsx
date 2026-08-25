import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Building2, ShieldAlert, ChevronRight, ArrowLeft } from 'lucide-react';
import TopBar from '../components/TopBar';
import { formatCurrency } from '../utils/analytics';
import type { TMCClient } from '../types/travel';

const MOCK_CLIENTS: TMCClient[] = [
  { id:'c1', name:'Acme Corporation', industry:'Technology', totalSpend:2450000, complianceScore:87, fraudFlags:3, savingsFound:342000, trips:1240, color:'#7C3AED' },
  { id:'c2', name:'GlobalTech Solutions', industry:'Software', totalSpend:1820000, complianceScore:92, fraudFlags:1, savingsFound:218000, trips:890, color:'#0EA5E9' },
  { id:'c3', name:'Meridian Finance', industry:'Financial Services', totalSpend:3100000, complianceScore:78, fraudFlags:7, savingsFound:512000, trips:1680, color:'#EF4444' },
  { id:'c4', name:'Pacific Retail Group', industry:'Retail', totalSpend:980000, complianceScore:94, fraudFlags:0, savingsFound:98000, trips:520, color:'#10B981' },
  { id:'c5', name:'Atlas Manufacturing', industry:'Manufacturing', totalSpend:1650000, complianceScore:83, fraudFlags:4, savingsFound:189000, trips:740, color:'#F59E0B' },
  { id:'c6', name:'Nexus Healthcare', industry:'Healthcare', totalSpend:2200000, complianceScore:88, fraudFlags:2, savingsFound:274000, trips:1050, color:'#8B5CF6' },
];

function ClientDashboard({ client, onBack }: { client:TMCClient; onBack:()=>void }) {
  const trend = Array.from({length:6},(_,i) => ({ month:['Jul','Aug','Sep','Oct','Nov','Dec'][i], spend:Math.round(client.totalSpend/12*(0.85+Math.random()*0.3)) }));
  return (
    <div>
      <div style={{ padding:'20px 28px', display:'flex', alignItems:'center', gap:12 }}>
        <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:6, background:'white', border:'1px solid #EDE9FE', padding:'7px 12px', borderRadius:8, fontSize:13, color:'#64748B', cursor:'pointer' }}><ArrowLeft size={14}/> Back to portfolio</button>
        <div><h2 style={{ fontSize:18, fontWeight:700, color:'#0F172A' }}>{client.name}</h2><span style={{ fontSize:12, color:'#94A3B8' }}>{client.industry}</span></div>
      </div>
      <div style={{ padding:'0 28px 28px', display:'flex', flexDirection:'column', gap:20 }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
          {[{label:'Total Spend',value:formatCurrency(client.totalSpend),color:'#7C3AED'},{label:'Compliance',value:`${client.complianceScore}%`,color:'#10B981'},{label:'Fraud Flags',value:client.fraudFlags,color:'#EF4444'},{label:'Savings Found',value:formatCurrency(client.savingsFound),color:'#0EA5E9'}].map((kpi,i) => (
            <div key={i} className="card" style={{ padding:'20px', borderTop:`3px solid ${kpi.color}` }}><div style={{ fontSize:12, color:'#94A3B8', fontWeight:500, marginBottom:6 }}>{kpi.label}</div><div style={{ fontSize:24, fontWeight:800, color:'#0F172A' }}>{kpi.value}</div></div>
          ))}
        </div>
        <div className="card" style={{ padding:'24px' }}><h3 style={{ fontSize:14, fontWeight:700, marginBottom:20, color:'#0F172A' }}>6-Month Spend Trend</h3><ResponsiveContainer width="100%" height={200}><LineChart data={trend}><CartesianGrid strokeDasharray="3 3" stroke="#F1F0FF"/><XAxis dataKey="month" tick={{ fontSize:11, fill:'#94A3B8' }}/><YAxis tickFormatter={v=>`$${(v/1000).toFixed(0)}K`} tick={{ fontSize:11, fill:'#94A3B8' }}/><Tooltip formatter={(v:any) => formatCurrency(v)}/><Line type="monotone" dataKey="spend" stroke={client.color} strokeWidth={2.5} dot={{ fill:client.color, r:4 }}/></LineChart></ResponsiveContainer></div>
      </div>
    </div>
  );
}

export default function TMCPortal() {
  const [selectedClient, setSelectedClient] = useState<TMCClient|null>(null);
  if (selectedClient) return (<div style={{ minHeight:'100vh', background:'#F5F4FF' }}><TopBar title="TMC Portal" subtitle={`Viewing: ${selectedClient.name}`}/><ClientDashboard client={selectedClient} onBack={() => setSelectedClient(null)}/></div>);
  const totalSpend = MOCK_CLIENTS.reduce((s,c) => s+c.totalSpend, 0);
  const avgCompliance = Math.round(MOCK_CLIENTS.reduce((s,c) => s+c.complianceScore, 0)/MOCK_CLIENTS.length);
  const totalFlags = MOCK_CLIENTS.reduce((s,c) => s+c.fraudFlags, 0);
  return (
    <div style={{ minHeight:'100vh', background:'#F5F4FF' }}>
      <TopBar title="TMC Portal" subtitle="Client portfolio overview"/>
      <div style={{ padding:'24px 28px', display:'flex', flexDirection:'column', gap:20 }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
          {[{label:'Portfolio Spend',value:formatCurrency(totalSpend),color:'#7C3AED'},{label:'Active Clients',value:MOCK_CLIENTS.length,color:'#0EA5E9'},{label:'Avg Compliance',value:`${avgCompliance}%`,color:'#10B981'},{label:'Total Fraud Flags',value:totalFlags,color:'#EF4444'}].map((kpi,i) => (
            <div key={i} className="card" style={{ padding:'20px', borderTop:`3px solid ${kpi.color}` }}><div style={{ fontSize:12, color:'#94A3B8', fontWeight:500, marginBottom:6 }}>{kpi.label}</div><div style={{ fontSize:24, fontWeight:800, color:'#0F172A' }}>{kpi.value}</div></div>
          ))}
        </div>
        <div className="card" style={{ overflow:'hidden' }}>
          <div style={{ padding:'20px 24px', borderBottom:'1px solid #EDE9FE' }}><h3 style={{ fontSize:14, fontWeight:700, color:'#0F172A' }}>Client Portfolio</h3><p style={{ fontSize:12, color:'#94A3B8', marginTop:2 }}>Click any client to view their full dashboard</p></div>
          {MOCK_CLIENTS.map((client,i) => (
            <div key={client.id} onClick={() => setSelectedClient(client)} style={{ padding:'18px 24px', borderBottom:i<MOCK_CLIENTS.length-1?'1px solid #F8F7FF':'none', display:'flex', alignItems:'center', gap:16, cursor:'pointer', background:'white' }} onMouseEnter={e=>(e.currentTarget.style.background='#FAFAFA')} onMouseLeave={e=>(e.currentTarget.style.background='white')}>
              <div style={{ width:40, height:40, borderRadius:10, background:`${client.color}20`, border:`2px solid ${client.color}40`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Building2 size={18} color={client.color}/></div>
              <div style={{ flex:1 }}><div style={{ fontWeight:600, fontSize:14, color:'#0F172A' }}>{client.name}</div><div style={{ fontSize:12, color:'#94A3B8', marginTop:1 }}>{client.industry} · {client.trips} trips</div></div>
              <div style={{ width:100 }}><div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}><span style={{ fontSize:10, color:'#94A3B8' }}>Compliance</span><span style={{ fontSize:10, fontWeight:600, color:client.complianceScore>=90?'#10B981':client.complianceScore>=80?'#F59E0B':'#EF4444' }}>{client.complianceScore}%</span></div><div style={{ height:5, background:'#F1F0FF', borderRadius:3 }}><div style={{ height:'100%', width:`${client.complianceScore}%`, background:client.complianceScore>=90?'#10B981':client.complianceScore>=80?'#F59E0B':'#EF4444', borderRadius:3 }}/></div></div>
              <div style={{ textAlign:'right', width:110 }}><div style={{ fontSize:15, fontWeight:800, color:'#0F172A' }}>{formatCurrency(client.totalSpend)}</div><div style={{ fontSize:11, color:'#10B981', fontWeight:600 }}>+{formatCurrency(client.savingsFound)} saved</div></div>
              {client.fraudFlags>0 && <div style={{ display:'flex', alignItems:'center', gap:4 }}><ShieldAlert size={14} color="#EF4444"/><span style={{ fontSize:12, fontWeight:700, color:'#EF4444' }}>{client.fraudFlags}</span></div>}
              <ChevronRight size={16} color="#C4B5FD"/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}