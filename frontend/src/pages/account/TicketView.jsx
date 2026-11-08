import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, Rocket, ShieldCheck, AlertTriangle, Info } from 'lucide-react';
import api from '../../api/client.js';
import { Loading, ErrorState } from '../../components/ui.jsx';
import { formatDate, formatINR, errorMessage } from '../../utils/format.js';
import { downloadProtected } from '../../utils/download.js';

export default function TicketView() {
  const { ticketNumber } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/tickets/${ticketNumber}`)
      .then((res) => setTicket(res.data.ticket))
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false));
  }, [ticketNumber]);

  const downloadPdf = async () => {
    try { await downloadProtected(`/api/tickets/${ticketNumber}/download`, `antariksh-${ticketNumber}.pdf`); }
    catch (e) { setError('Download failed'); }
  };

  if (loading) return <div className="bg-black text-white"><Loading /></div>;
  if (error || !ticket) return <ErrorState message={error} />;
  const b = ticket.booking;

  return (
    <div className="bg-black text-white">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Boarding Pass</h1>
            <p className="font-mono text-xs text-[#8492A6]">Your escape ticket. Keep it away from NASA (joke).</p>
          </div>
          {b && b.status === 'confirmed' && (
            <button onClick={downloadPdf} className="btn-saffron">Download PDF <Download className="h-4 w-4" /></button>
          )}
        </div>

        {/* Boarding pass */}
        <div className="rounded-2xl border border-white/20 bg-black text-white shadow-card-lg">
          <div className="flex items-center justify-between rounded-t-2xl bg-navy-800 px-6 py-5">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-black"><Rocket className="h-5 w-5 text-brand-saffron" /></span>
              <span className="font-display text-lg font-bold text-white">ANTARIKSH</span>
            </div>
            <span className="badge badge-saffron">SIMULATED</span>
          </div>

          <div className="flex items-center justify-between gap-4 border-b border-dashed border-navy-500 px-6 py-5">
            <div>
              <p className="text-xs uppercase tracking-wide text-[#8492A6]">Departure</p>
              <p className="text-lg font-bold">Earth</p>
              <p className="text-xs text-[#8492A6]">Gate: Launch Pad 01</p>
            </div>
            <Rocket className="h-6 w-6 text-brand-sky" />
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-[#8492A6]">Destination</p>
              <p className="text-lg font-bold">{b?.destination?.name || '—'}</p>
              <p className="text-xs text-[#8492A6]">{b?.company?.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5 px-6 py-5 text-sm sm:grid-cols-3">
            <div><p className="text-xs uppercase tracking-wide text-[#8492A6]">Passenger</p><p className="font-semibold">{b?.passengerName}</p></div>
            <div><p className="text-xs uppercase tracking-wide text-[#8492A6]">Departure</p><p className="font-semibold">{formatDate(b?.departureDate)}</p></div>
            <div><p className="text-xs uppercase tracking-wide text-[#8492A6]">Class / Seat</p><p className="font-semibold">{b?.travelClass?.name} · {b?.seatNumber}</p></div>
            <div><p className="text-xs uppercase tracking-wide text-[#8492A6]">Booking Ref</p><p className="font-mono font-semibold">{b?.bookingReference}</p></div>
            <div><p className="text-xs uppercase tracking-wide text-[#8492A6]">Ticket No.</p><p className="font-mono font-semibold">{ticket.ticketNumber}</p></div>
            <div><p className="text-xs uppercase tracking-wide text-[#8492A6]">Total</p><p className="font-display font-bold text-brand-saffron">{formatINR(b?.totalPrice)}</p></div>
          </div>

          <div className="flex flex-col items-center justify-center gap-2 border-t border-navy-500 px-6 py-5 sm:flex-row sm:justify-between">
            {ticket.qrDataUrl
              ? <img src={ticket.qrDataUrl} alt="QR" className="h-28 w-28 rounded-xl border border-navy-600 bg-black p-1" />
              : <div className="grid h-28 w-28 place-items-center rounded-xl bg-black"><ShieldCheck className="h-8 w-8 text-[#8492A6]" /></div>}
            <div className="max-w-xs text-xs text-[#8492A6]">
              <p className="font-semibold text-white">Baggage warning</p>
              <p>Please do not pack another planet.</p>
              <p className="mt-1 font-semibold text-white">Special instructions</p>
              <p>Keep your arms, legs and existential worries inside the spacecraft.</p>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-b-2xl bg-brand-saffron/10 px-6 py-3 text-xs text-brand-saffron">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> Fictional simulated reservation for demonstration. No real humans have been launched by us.
          </div>
        </div>

        <div className="mt-6 flex items-start gap-2 rounded-xl border border-brand-sky/30 bg-brand-sky/10 p-3 text-xs text-brand-sky">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <span>This boarding pass is decorative where it says "Earth", "Launch Pad 01" and the baggage warning. The booking reference, ticket number and QR are real records checked against our database.</span>
        </div>

        <div className="mt-6 text-center">
          <Link to="/dashboard" className="text-sm font-medium text-brand-sky">← Back to My Missions</Link>
        </div>
      </div>
    </div>
  );
}



