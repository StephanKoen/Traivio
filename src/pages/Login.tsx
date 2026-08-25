import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, ArrowRight, Upload } from 'lucide-react';
import { useApp, DEMO_USER } from '../context/AppContext';
import type { User } from '../types/travel';

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [selected, setSelected] = useState<'company'|'tmc'|null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = () => {
    const user: User = { id:'user-1', name:selected==='tmc'?'Alex Morgan':'Sarah Chen', email:email||(selected==='tmc'?'alex@tmcpartners.com':'sarah@acmecorp.com'), role:selected==='tmc'?'TMC Account Manager':'Travel Manager', org:selected==='tmc'?'TMC Partners':'Acme Corporation', type:selected||'company' };
    setUser(user); navigate('/overview');
  };
  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#1a0533 0%,#3b0764 40%,#7C3AED 80%,#C084FC 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <svg style={{ position:'fixed', top:0, right:0, opacity:0.1, pointerEvents:'none' }} width="600" height="600" viewBox="0 0 600 600"><circle cx="500" cy="100" r="300" fill="white"/><circle cx="400" cy="400" r="200" fill="white"/><circle cx="100" cy="500" r="150" fill="white"/></svg>
      <div style={{ width:'100%', maxWidth:460, position:'relative' }}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ width:52, height:52, borderRadius:14, background:'rgba(255,255,255,0.15)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M5 22L14 6L23 22" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 15H19" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><circle cx="14" cy="6" r="2" fill="white"/></svg>
          </div>
          <h1 style={{ color:'white', fontSize:28, fontWeight:800, letterSpacing:'-0.5px' }}>Traivio</h1>
          <p style={{ color:'rgba(255,255,255,0.6)', fontSize:14, marginTop:4 }}>AI-powered travel intelligence</p>
        </div>
        <div style={{ background:'rgba(255,255,255,0.97)', borderRadius:20, padding:'36px', boxShadow:'0 32px 80px rgba(0,0,0,0.3)' }}>
          <h2 style={{ fontSize:18, fontWeight:700, color:'#0F172A', marginBottom:6 }}>Welcome back</h2>
          <p style={{ fontSize:13, color:'#64748B', marginBottom:24 }}>Sign in to your travel analytics dashboard</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
            {([{type:'company',label:"I'm a company",icon:Building2,desc:'Manage your corporate travel'},{type:'tmc',label:"I'm a TMC",icon:Users,desc:'Manage client portfolios'}] as const).map(opt => (
              <button key={opt.type} onClick={() => setSelected(opt.type)} style={{ padding:'14px 12px', borderRadius:12, cursor:'pointer', border:`2px solid ${selected===opt.type?'#7C3AED':'#EDE9FE'}`, background:selected===opt.type?'#F5F3FF':'white', textAlign:'center', transition:'all 0.15s' }}>
                <opt.icon size={20} color={selected===opt.type?'#7C3AED':'#94A3B8'} style={{ margin:'0 auto 6px' }} />
                <div style={{ fontSize:13, fontWeight:600, color:selected===opt.type?'#7C3AED':'#475569' }}>{opt.label}</div>
                <div style={{ fontSize:11, color:'#94A3B8', marginTop:2 }}>{opt.desc}</div>
              </button>
            ))}
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div><label style={{ fontSize:12, fontWeight:600, color:'#475569', display:'block', marginBottom:4 }}>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" style={{ width:'100%', padding:'10px 14px', border:'1px solid #EDE9FE', borderRadius:9, fontSize:14, color:'#0F172A', outline:'none', boxSizing:'border-box' }} /></div>
            <div><label style={{ fontSize:12, fontWeight:600, color:'#475569', display:'block', marginBottom:4 }}>Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" style={{ width:'100%', padding:'10px 14px', border:'1px solid #EDE9FE', borderRadius:9, fontSize:14, color:'#0F172A', outline:'none', boxSizing:'border-box' }} /></div>
          </div>
          <button onClick={handleLogin} style={{ width:'100%', padding:'12px', background:'linear-gradient(135deg,#7C3AED,#8B5CF6)', border:'none', borderRadius:10, color:'white', fontSize:14, fontWeight:700, cursor:'pointer', marginTop:20, display:'flex', alignItems:'center', justifyContent:'center', gap:6, boxShadow:'0 4px 14px rgba(124,58,237,0.4)' }}>Sign In <ArrowRight size={16} /></button>
          <div style={{ display:'flex', alignItems:'center', gap:12, margin:'20px 0' }}><div style={{ flex:1, height:1, background:'#EDE9FE' }}/><span style={{ fontSize:12, color:'#94A3B8' }}>or</span><div style={{ flex:1, height:1, background:'#EDE9FE' }}/></div>
          <button onClick={() => { setUser(DEMO_USER); navigate('/demo'); }} style={{ width:'100%', padding:'12px', background:'white', border:'2px solid #EDE9FE', borderRadius:10, color:'#7C3AED', fontSize:14, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}><Upload size={16} /> Try Free Demo — Upload Your Data</button>
        </div>
        <p style={{ color:'rgba(255,255,255,0.45)', fontSize:12, textAlign:'center', marginTop:20 }}>© 2025 Traivio · AI-powered travel intelligence</p>
      </div>
    </div>
  );
}