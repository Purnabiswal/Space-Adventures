import { useState } from 'react';
import { Search, ShieldCheck, XCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import api from '../api/client.js';
import { errorMessage } from '../utils/format.js';

export default function VerifyTicket() {
  const [ticketNumber, setTicketNumber] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const verify = async (e) => {
    e.preventDefault();
    setError(''); setResult(null); setLoading(true);
    try {
      const res = await api.post('/tickets/verify', { ticketNumber });
      setResult(res.data);
    } catch (e2) {
      setError(errorMessage(e2, 'Invalid ticket'));
      setResult(null);
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-black text-white">
      <div className="mx-auto max-w-2xl px-4 py-16">
        <p className="eyebrow text-brand-saffron"><ShieldCheck className="h-4 w-4" /> Verification</p>
        <h1 className="font-display text-3xl font-extrabold text-white">Verify a Space Ticket</h1>
        <p className="mt-2 text-[#B3BECE]">Enter an ANTARIKSH ticket number. We'll check if it's real, or just a very confident forgery.</p>

        <form onSubmit={verify} className="mt-8 flex gap-3">
          <input className="input-dark font-mono" placeholder="ANT-TKT-XXXXXXXX" value={ticketNumber} onChange={(e) => setTicketNumber(e.target.value)} required />
          <button type="submit" disabled={loading} className="btn-saffron whitespace-nowrap">Verify <Search className="h-4 w-4" /></button>
        </form>

        {error && (
          <div className="mt-6 rounded-2xl border border-brand-coral/40 bg-brand-coral/10 p-5">
            <div className="flex items-center gap-2 font-semibold text-brand-coral"><XCircle className="h-5 w-5" /> Ticket not found, or it forgot to confirm itself.</div>
          </div>
        )}

        {result && (
          <div className={`mt-6 rounded-2xl border p-6 ${result.valid ? 'border-brand-green/40 bg-brand-green/10' : 'border-brand-coral/40 bg-brand-coral/10'}`}>
            <div className="flex items-center gap-2 font-semibold text-white">
              {result.valid ? <CheckCircle2 className="h-6 w-6 text-brand-green" /> : <XCircle className="h-6 w-6 text-brand-coral" />}
              {result.valid ? 'Valid ticket. Earth is officially losing one human.' : 'Invalid / not confirmed'}
            </div>
            <div className="mt-3 space-y-1 font-mono text-sm text-[#B3BECE]">
              <p>Ticket: {result.ticket?.ticketNumber}</p>
              <p>Passenger: {result.ticket?.booking?.passengerName}</p>
              <p>Destination: {result.ticket?.booking?.destination?.name}</p>
              <p>Company: {result.ticket?.booking?.company?.name}</p>
              <p>Status: {result.ticket?.booking?.status}</p>
            </div>
            {result.valid && <p className="mt-3 flex items-center gap-1 text-xs text-brand-green"><ShieldCheck className="h-4 w-4" /> Verified against the ANTARIKSH database</p>}
            <p className="mt-2 flex items-center gap-1 text-xs text-brand-warning/80"><AlertTriangle className="h-4 w-4" /> Fictional simulated reservation</p>
          </div>
        )}
      </div>
    </div>
  );
}


