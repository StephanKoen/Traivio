import { X, TrendingUp, ShieldAlert, Ticket, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { computeStats, formatCurrency } from '../utils/analytics';

export default function WelcomePopup() {
  const { user, records, welcomePopupDismissed, dismissWelcomePopup } = useApp();
  const navigate = useNavigate();
  const stats = computeStats(records);
  if (welcomePopupDismissed) return null;
  const userName = user?.name?.split(' ')[0]||'Sarah';
  const actions = [
    { label:'Show fraud flags', path:'/fraud-compliance', color:'#EF4444', icon:ShieldAlert },
    { label:'View savings', path:'/savings', color:'#10B981', icon:TrendingUp },
    { label:'Run report', path:'/reports', color:'#7C3AED', icon:ArrowRight },
  ];
  return (
    <div style={{ position:'fixed', inset:0, zIndex:100, background:'rgba(15,23,42,0.45)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:'white', borderRadius:20, width:480, boxShadow:'0 24px 64px rgba(0,0,0,0.18)', overflow:'hidden' }}>
        <div style={{ background:'linear-gradient(135deg,#1a0533,#3b0764)', padding:'28px 28px 24px', position:'relative' }}>
          <button onClick={dismissWelcomePopup} style={{ position:'absolute', top:16, right:16, background:'rgba(255,255,255,0.15)', border:'none', borderRadius:'50%', width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center', color:'white', cursor:'pointer' }}><X size={14} /></button>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
            <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,#7C3AED,#0EA5E9)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:16 }}>{userName.charAt(0)}</div>
            <div>
              <div style={{ color:'rgba(255,255,255,0.6)', fontSize:13 }}>Welcome back,</div>
              <div style={{ color:'white', fontWeight:700, fontSize:20 }}>{userName} 👋</div>
            </div>
          </div>
          <p style={{ color:'rgba(255,255,255,0.65)', fontSize:13, lineHeight:1.6 }}>Here's what changed since your last login 3 days ago. Your travel programme needs attention.</p>
        </div>
        <div style={{ padding:'20px 24px', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
          {[
            { icon:ShieldAlert, color:'#EF4444', bg:'#FEF2F2', label:'New fraud flags', value:stats.fraudFlags },
            { icon:Ticket, color:'#F59E0B', bg:'#FFFBEB', label:'Credits expiring', value:4 },
            { icon:TrendingUp, color:'#10B981', bg:'#ECFDF5', label:'Savings found', value:formatCurrency(stats.savingsFound) },
          ].map((item,i) => (
            <div key={i} style={{ background:item.bg, borderRadius:12, padding:'14px 12px', textAlign:'center' }}>
              <item.icon size={18} color={item.color} style={{ margin:'0 auto 6px' }} />
              <div style={{ fontWeight:700, fontSize:18, color:item.color }}>{item.value}</div>
              <div style={{ fontSize:11, color:'#64748B', marginTop:2 }}>{item.label}</div>
            </div>
          ))}
        </div>
        <div style={{ padding:'0 24px' }}>
          <div style={{ background:'#F5F4FF', borderRadius:10, padding:'12px 14px', border:'1px solid #EDE9FE' }}>
            <div style={{ fontSize:11, fontWeight:600, color:'#7C3AED', marginBottom:6 }}>AI SUMMARY</div>
            <p style={{ fontSize:13, color:'#475569', lineHeight:1.6 }}>3 new fraud flags detected — 2 duplicate bookings and 1 policy exception over $500. You have {formatCurrency(stats.unusedCreditsValue)} in unused credits with 4 expiring within 30 days. AI found {formatCurrency(stats.savingsFound)} in potential savings this period.</p>
          </div>
        </div>
        <div style={{ padding:'16px 24px 24px', display:'flex', gap:8 }}>
          {actions.map((a,i) => (
            <button key={i} onClick={() => { dismissWelcomePopup(); navigate(a.path); }} style={{ flex:1, padding:'9px 8px', background:'white', border:`1.5px solid ${a.color}`, borderRadius:8, color:a.color, fontSize:12, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:4 }}>
              <a.icon size={12} />{a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}