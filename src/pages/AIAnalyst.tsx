import { useState, useRef, useEffect } from 'react';
import Anthropic from '@anthropic-ai/sdk';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import TopBar from '../components/TopBar';
import { useApp } from '../context/AppContext';
import { computeStats, formatCurrency } from '../utils/analytics';

interface Message { role: 'user'|'assistant'; content: string; }

const STARTERS = ['What are the top 3 savings opportunities in my data?','Which department is overspending the most?','Are there any fraud risks I should investigate?','What\'s my compliance score and how can I improve it?','Which routes should I negotiate better contracts for?','Give me an executive summary of our travel spend'];

export default function AIAnalyst() {
  const { records } = useApp();
  const stats = computeStats(records);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages]);

  const buildContext = () => `You are an AI travel analyst for Traivio.\n\nSUMMARY:\n- Total Spend: ${formatCurrency(stats.totalSpend)}\n- Total Trips: ${stats.totalTrips}\n- Avg Cost Per Trip: ${formatCurrency(stats.avgCostPerTrip)}\n- Compliance Rate: ${stats.complianceRate}%\n- Savings Found: ${formatCurrency(stats.savingsFound)}\n- Fraud Flags: ${stats.fraudFlags}\n\nSPEND BY CATEGORY:\n${stats.spendByCategory.map(c=>`- ${c.name}: ${formatCurrency(c.value)}`).join('\n')}\n\nSAMPLE RECORDS (first 50 of ${records.length}):\n${records.slice(0,50).map(r=>`${r.travelDate} | ${r.travelerName} | ${r.origin}→${r.destination} | ${r.category} | $${r.totalCost} | ${r.department||'N/A'}`).join('\n')}\n\nProvide specific, data-driven insights. Be concise but thorough.`;

  const sendMessage = async (text: string) => {
    if (!text.trim()||loading) return;
    if (!apiKey) { setError('VITE_ANTHROPIC_API_KEY not set. Add it to your .env file.'); return; }
    setMessages(prev => [...prev, { role:'user', content:text }]);
    setInput(''); setLoading(true); setError('');
    try {
      const client = new Anthropic({ apiKey, dangerouslyAllowBrowser:true });
      const response = await client.messages.create({ model:'claude-sonnet-4-20250514', max_tokens:1024, system:buildContext(), messages:[...messages.map(m => ({ role:m.role as 'user'|'assistant', content:m.content })),{ role:'user', content:text }] });
      const c = response.content[0];
      if (c.type==='text') setMessages(prev => [...prev, { role:'assistant', content:c.text }]);
    } catch (err: any) { setError(err.message||'Failed to get AI response'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#F5F4FF', display:'flex', flexDirection:'column' }}>
      <TopBar title="AI Analyst" subtitle="Chat with Claude about your travel data" />
      <div style={{ flex:1, display:'flex', flexDirection:'column', padding:'24px 28px', gap:16, maxWidth:900, margin:'0 auto', width:'100%' }}>
        {!apiKey && <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:10, padding:'12px 16px', fontSize:13, color:'#DC2626' }}><strong>API key not configured.</strong> Add <code>VITE_ANTHROPIC_API_KEY=your-key</code> to your <code>.env</code> file.</div>}
        {messages.length===0 && (
          <div style={{ textAlign:'center', padding:'32px 0 16px' }}>
            <div style={{ width:60, height:60, borderRadius:'50%', background:'linear-gradient(135deg,#7C3AED,#0EA5E9)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}><Sparkles size={28} color="white"/></div>
            <h2 style={{ fontSize:20, fontWeight:700, color:'#0F172A', marginBottom:8 }}>AI Travel Analyst</h2>
            <p style={{ fontSize:13, color:'#64748B', maxWidth:400, margin:'0 auto' }}>Powered by Claude. Ask me anything about your travel data.</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center', marginTop:24 }}>
              {STARTERS.map((s,i) => <button key={i} onClick={() => sendMessage(s)} disabled={!apiKey} style={{ padding:'8px 14px', borderRadius:999, background:'white', border:'1px solid #EDE9FE', fontSize:13, color:'#475569', cursor:apiKey?'pointer':'not-allowed', fontWeight:500, opacity:apiKey?1:0.6 }}>{s}</button>)}
            </div>
          </div>
        )}
        <div style={{ flex:1, display:'flex', flexDirection:'column', gap:14 }}>
          {messages.map((msg,i) => (
            <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', flexDirection:msg.role==='user'?'row-reverse':'row' }}>
              <div style={{ width:34, height:34, borderRadius:'50%', flexShrink:0, background:msg.role==='user'?'linear-gradient(135deg,#7C3AED,#0EA5E9)':'linear-gradient(135deg,#1a0533,#3b0764)', display:'flex', alignItems:'center', justifyContent:'center' }}>{msg.role==='user'?<User size={16} color="white"/>:<Bot size={16} color="white"/>}</div>
              <div style={{ maxWidth:'75%', background:msg.role==='user'?'linear-gradient(135deg,#7C3AED,#8B5CF6)':'white', color:msg.role==='user'?'white':'#0F172A', padding:'12px 16px', borderRadius:msg.role==='user'?'16px 4px 16px 16px':'4px 16px 16px 16px', fontSize:13, lineHeight:1.7, border:msg.role==='assistant'?'1px solid #EDE9FE':'none', whiteSpace:'pre-wrap' }}>{msg.content}</div>
            </div>
          ))}
          {loading && <div style={{ display:'flex', gap:10, alignItems:'center' }}><div style={{ width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,#1a0533,#3b0764)', display:'flex', alignItems:'center', justifyContent:'center' }}><Bot size={16} color="white"/></div><div style={{ background:'white', padding:'12px 16px', borderRadius:'4px 16px 16px 16px', border:'1px solid #EDE9FE' }}><Loader2 size={16} color="#7C3AED" className="spin"/></div></div>}
          <div ref={bottomRef}/>
        </div>
        {error && <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:8, padding:'10px 14px', fontSize:13, color:'#DC2626' }}>{error}</div>}
        <div style={{ display:'flex', gap:10, background:'white', borderRadius:14, border:'1px solid #EDE9FE', padding:'8px 8px 8px 16px' }}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage(input);}}} placeholder="Ask about your travel data..." disabled={!apiKey||loading} style={{ flex:1, border:'none', outline:'none', fontSize:14, color:'#0F172A', background:'transparent' }}/>
          <button onClick={() => sendMessage(input)} disabled={!input.trim()||loading||!apiKey} style={{ width:38, height:38, borderRadius:10, background:input.trim()&&apiKey?'linear-gradient(135deg,#7C3AED,#8B5CF6)':'#F1F0FF', border:'none', display:'flex', alignItems:'center', justifyContent:'center', cursor:input.trim()&&apiKey?'pointer':'not-allowed' }}><Send size={16} color={input.trim()&&apiKey?'white':'#C4B5FD'}/></button>
        </div>
      </div>
    </div>
  );
}