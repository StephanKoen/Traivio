import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, GitCompare, ShieldAlert, TrendingUp, FileBarChart, Ticket, Handshake, Lightbulb, Bot, Building2, LogOut, Upload } from 'lucide-react';
import { useApp } from '../context/AppContext';

const NAV_GROUPS = [
  { label:'Main', items:[{ path:'/overview', label:'Overview', icon:LayoutDashboard }] },
  { label:'Reports', items:[
    { path:'/fare-discrepancies', label:'Fare Discrepancies', icon:GitCompare },
    { path:'/fraud-compliance', label:'Fraud & Compliance', icon:ShieldAlert, badge:3 },
    { path:'/savings', label:'Savings', icon:TrendingUp },
    { path:'/reports', label:'Reports & Analytics', icon:FileBarChart },
    { path:'/unused-credits', label:'Unused Credits', icon:Ticket, badge:4 },
    { path:'/contracts', label:'Contract Opportunities', icon:Handshake },
  ]},
  { label:'Intelligence', items:[
    { path:'/predictive', label:'Predictive Insights', icon:Lightbulb },
    { path:'/ai-analyst', label:'AI Analyst', icon:Bot },
    { path:'/tmc-portal', label:'TMC Portal', icon:Building2 },
  ]},
];

export default function Sidebar() {
  const { user, setUser, fileName } = useApp();
  const navigate = useNavigate();
  return (
    <aside style={{ width:256, minHeight:'100vh', background:'#1a0533', display:'flex', flexDirection:'column', flexShrink:0, position:'sticky', top:0, height:'100vh', overflowY:'auto' }}>
      <div style={{ padding:'24px 20px 16px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#7C3AED,#C084FC)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 16L10 4L16 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M6.5 11.5H13.5" stroke="white" strokeWidth="2" strokeLinecap="round"/><circle cx="10" cy="4" r="1.5" fill="white"/></svg>
          </div>
          <div>
            <div style={{ color:'white', fontWeight:700, fontSize:18, lineHeight:1 }}>Traivio</div>
            <div style={{ color:'rgba(255,255,255,0.45)', fontSize:10, marginTop:2 }}>Travel Intelligence</div>
          </div>
        </div>
        <div style={{ marginTop:12, padding:'6px 10px', background:'rgba(124,58,237,0.2)', borderRadius:8, border:'1px solid rgba(124,58,237,0.3)', display:'flex', alignItems:'center', gap:6 }}>
          <Upload size={11} color="#C084FC" />
          <span style={{ color:'#C084FC', fontSize:10, fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{fileName}</span>
        </div>
      </div>
      <nav style={{ flex:1, padding:'12px', overflowY:'auto' }}>
        {NAV_GROUPS.map(group => (
          <div key={group.label} style={{ marginBottom:8 }}>
            <div style={{ color:'rgba(255,255,255,0.35)', fontSize:10, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', padding:'8px 8px 4px' }}>{group.label}</div>
            {group.items.map((item: any) => (
              <NavLink key={item.path} to={item.path} style={({ isActive }) => ({ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', borderRadius:8, textDecoration:'none', marginBottom:1, color:isActive?'#C084FC':'rgba(255,255,255,0.6)', background:isActive?'rgba(124,58,237,0.2)':'transparent', borderLeft:isActive?'3px solid #7C3AED':'3px solid transparent', fontSize:13, fontWeight:isActive?600:400, transition:'all 0.15s' })}>
                <item.icon size={16} style={{ flexShrink:0 }} />
                <span style={{ flex:1 }}>{item.label}</span>
                {item.badge && <span style={{ background:'#EF4444', color:'white', fontSize:10, fontWeight:700, padding:'1px 6px', borderRadius:999 }}>{item.badge}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      <div style={{ padding:'12px 16px', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,#7C3AED,#0EA5E9)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:13, flexShrink:0 }}>{user?user.name.charAt(0):'S'}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ color:'white', fontSize:12, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name||'Sarah Chen'}</div>
            <div style={{ color:'rgba(255,255,255,0.4)', fontSize:10 }}>{user?.role||'Travel Manager'}</div>
          </div>
          <button onClick={() => { setUser(null); navigate('/login'); }} title="Sign out" style={{ background:'none', border:'none', color:'rgba(255,255,255,0.35)', padding:4, borderRadius:4 }}><LogOut size={14} /></button>
        </div>
      </div>
    </aside>
  );
}