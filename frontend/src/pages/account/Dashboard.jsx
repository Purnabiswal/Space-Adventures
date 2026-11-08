import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, CalendarDays, Download, Ticket as TicketIcon, ArrowRight, Award, Rocket } from 'lucide-react';
import api from '../../api/client.js';
import { Loading, ErrorState, EmptyState } from '../../components/ui.jsx';
import { formatINR, formatDate, daysRemaining, errorMessage } from '../../utils/format.js';
import { downloadProtected } from '../../utils/download.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.get('/visas/me'), api.get('/bookings'), api.get('/tickets/my')])
      .then(([v, b, t]) => setData({ visas: v.data, bookings: b.data.bookings, tickets: t.data.tickets }))
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async (ticket) => {
    try { await downloadProtected(`/api/tickets/${ticket.ticketNumber}/download`, `antariksh-${ticket.ticketNumber}.pdf`); }
    catch (e) { setError('Download failed'); }
  };

  if (loading) return <div className="bg-black text-white"><Loading /></div>;
  if (error) return <ErrorState message={error} />;
  const { visas, bookings, tickets } = data;
  const visa = visas.visa;
  const firstName = user?.name?.split(' ')[0] || 'Earthling';

  return (
    <div className="bg-black text-white">
      <div className="mx-auto max-w-7xl rounded-t-[2.5rem] bg-black px-4 py-10 text-white md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-extrabold text-white">Welcome back, {firstName}.</h1>
            <p className="mt-1 text-[#8492A6]">Your next adventure is waiting. Mission status: preparing for takeoff.</p>
          </div>
          <Link to="/destinations" className="btn-saffron">Book a mission <ArrowRight className="h-4 w-4" /></Link>
        </div>

        <section className="mt-8">
          <h2 className="mb-4 text-lg font-bold text-white">Space Travel Visa</h2>
          {visa ? (
            <div className="card relative overflow-hidden p-6 md:p-8">
              <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-brand-green/10" />
              <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div className="flex items-center gap-4">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-green/20"><ShieldCheck className="h-7 w-7 text-brand-green" /></span>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#8492A6]">Space Travel Visa · Active</p>
                    <p className="font-display font-mono text-xl font-bold text-white">{visa.visaNumber}</p>
                    <p className="text-sm text-[#8492A6]">Holder: {visa.holderName}</p>
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <p className="flex items-center gap-2 text-sm text-white"><CalendarDays className="h-4 w-4 text-brand-saffron" /> Expires {formatDate(visa.expiresAt)}</p>
                  <p className="mt-1 font-semibold text-brand-saffron">in {daysRemaining(visa.expiresAt)} days. Time to stop procrastinating.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-8 text-center">
              <Award className="mx-auto h-10 w-10 text-brand-sky" />
              <p className="mt-3 font-semibold text-white">No active visa yet</p>
              <p className="mt-1 text-sm text-[#8492A6]">Earth is still your home for now. Change that by passing the assessment.</p>
              <Link to="/assessment" className="btn-saffron mt-4">Take the Assessment</Link>
            </div>
          )}
        </section>

        <section className="mt-12">
          <h2 className="mb-4 text-lg font-bold text-white">Upcoming journeys & history</h2>
          <p className="mb-4 text-sm text-[#8492A6]">Previous missions: stories you can finally tell without sounding imaginary.</p>
          {bookings.length === 0 ? (
            <EmptyState variant="bookings" />
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => {
                const ticket = tickets.find((t) => String(t.booking?._id) === String(b._id));
                return (
                  <div key={b._id} className="card p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy-800"><Rocket className="h-5 w-5 text-brand-saffron" /></span>
                        <div>
                          <p className="font-semibold text-white">{b.packageId?.name || 'Adventure'}</p>
                          <p className="text-xs text-[#8492A6]">{b.company?.name} · {b.destination?.name} · {formatDate(b.departureDate)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-display font-bold text-brand-saffron">{formatINR(b.totalPrice)}</p>
                          <p className="text-xs text-[#8492A6]">{b.travelClass?.name} · Seat {b.seatNumber}</p>
                        </div>
                        <span className={`status-pill ${b.status === 'confirmed' ? 'bg-brand-green/20 text-brand-green' : b.status === 'cancelled' ? 'bg-brand-coral/20 text-brand-coral' : 'bg-black text-[#B3BECE]'}`}>
                          {b.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-navy-600 pt-3">
                      <div className="flex flex-wrap gap-3 font-mono text-xs text-[#8492A6]">
                        <span className="flex items-center gap-1"><TicketIcon className="h-4 w-4" /> Ref: {b.bookingReference}</span>
                        {ticket && <span className="flex items-center gap-1"><TicketIcon className="h-4 w-4" /> {ticket.ticketNumber}</span>}
                      </div>
                      <div className="flex gap-2">
                        {ticket && (b.status === 'confirmed' || b.status === 'completed') && (
                          <Link to={`/ticket/${ticket.ticketNumber}`} className="btn-ghost !px-4 !py-2 text-sm">View Ticket</Link>
                        )}
                        {b.status === 'confirmed' && (
                          <button onClick={() => handleDownload(ticket)} className="btn-saffron !px-4 !py-2 text-sm">Download PDF <Download className="h-4 w-4" /></button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {tickets.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 text-lg font-bold text-white">Your tickets</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {tickets.map((t) => (
                <div key={t._id} className="card flex items-center justify-between p-5">
                  <div>
                    <p className="flex items-center gap-1 font-mono text-sm font-semibold text-white"><TicketIcon className="h-4 w-4 text-brand-sky" /> {t.ticketNumber}</p>
                    <p className="text-xs text-[#8492A6]">{t.booking?.packageId?.name} · Issued {formatDate(t.issuedAt)}</p>
                    <p className="mt-1 text-xs text-brand-green">Fictional simulated reservation</p>
                  </div>
                  <Link to={`/ticket/${t.ticketNumber}`} className="flex items-center gap-1 text-sm font-medium text-brand-sky">View <ArrowRight className="h-4 w-4" /></Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}




