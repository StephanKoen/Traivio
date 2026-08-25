import { useState, useRef } from 'react';
import { Upload, Download, Zap, ChevronDown, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { parseFile } from '../utils/dataParser';

interface TopBarProps { title: string; subtitle?: string; }

export default function TopBar({ title, subtitle }: TopBarProps) {
  const { setRecords, setFileName, user } = useApp();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setUploadError('');
    try {
      const result = await parseFile(file);
      if (result.warnings.length>0) { setUploadError(result.warnings[0]); }
      else { setRecords(result.records); setFileName(`${file.name} (${result.records.length} trips)`); }
    } catch (err: any) { setUploadError(err.message||'Failed to parse file'); }
    finally { setUploading(false); if(fileRef.current) fileRef.current.value=''; }
  };

  const lastUpdated = new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});

  return (
    <div style={{ background:'white', borderBottom:'1px solid #EDE9FE', padding:'12px 28px', display:'flex', alignItems:'center', gap:16, position:'sticky', top:0, zIndex:20 }}>
      <div style={{ flex:1 }}>
        <h1 style={{ fontSize:20, fontWeight:700, color:'#0F172A', lineHeight:1.2 }}>{title}</h1>
        <p style={{ fontSize:12, color:'#94A3B8', marginTop:2 }}>{subtitle||`${user?.org||'Acme Corporation'} · Updated ${lastUpdated}`}</p>
        {uploadError && <p style={{ fontSize:12, color:'#EF4444', marginTop:4, fontWeight:500 }}>{uploadError}</p>}
      </div>
      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
        {['All time','Department','Region','Cost centre','Traveler'].map(f => (
          <button key={f} style={{ display:'flex', alignItems:'center', gap:4, padding:'5px 12px', borderRadius:999, background:'white', border:'1px solid #EDE9FE', fontSize:12, fontWeight:500, color:'#64748B', cursor:'pointer' }}>{f} <ChevronDown size={12} /></button>
        ))}
        <div style={{ width:1, height:24, background:'#EDE9FE', margin:'0 4px' }} />
        <label style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:8, background:'white', border:'1px solid #EDE9FE', fontSize:13, fontWeight:500, color:'#64748B', cursor:'pointer' }}>
          {uploading?<Loader2 size={14} className="spin" />:<Upload size={14} />} Upload data
          <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" onChange={handleUpload} style={{ display:'none' }} />
        </label>
        <button style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:8, background:'white', border:'1px solid #EDE9FE', fontSize:13, fontWeight:500, color:'#64748B', cursor:'pointer' }}><Download size={14} /> Export PDF</button>
        <button style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 16px', borderRadius:8, background:'linear-gradient(135deg,#7C3AED,#8B5CF6)', border:'none', color:'white', fontSize:13, fontWeight:600, cursor:'pointer', boxShadow:'0 2px 8px rgba(124,58,237,0.35)' }}><Zap size={14} /> Run AI audit</button>
      </div>
    </div>
  );
}