import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Rocket, CheckCircle2, Download, LayoutDashboard, MapPin, CalendarDays, ShieldCheck, Award, Star } from 'lucide-react';
import api from '../../api/client.js';
import { Loading, ErrorState } from '../../components/ui.jsx';
import { formatINR, formatDate, errorMessage } from '../../utils/format.js';
import { downloadProtected } from '../../utils/download.js';

export default function BookingSuccess() {
  const { bookingReference } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!bookingReference) {
      navigate('/destinations');
      return;
    }
    api.get(`/bookings/reference/${bookingReference}`)
      .then((res) => {
        setBooking(res.data.booking);
        setTicket(res.data.ticket);
      })
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false));
  }, [bookingReference, navigate]);

  const handleDownload = async () => {
    if (!ticket) return;
    try {
      await downloadProtected(`/api/tickets/${ticket.ticketNumber}/download`, `antariksh-${ticket.ticketNumber}.pdf`);
    } catch (e) {
      setError('Download failed');
    }
  };

  if (loading) return <div className="bg-black text-white"><Loading /></div>;
  if (error || !booking) return <ErrorState message={error} />;

  const b = booking;
  const classDisplay = b.travelClass?.displayName || b.travelClass?.name || '—';
  const total = formatINR(b.totalPrice);

  return (
    <div className="bg-black text-white">
      <div className="mx-auto max-w-3xl px-4 py-12">
        {/* Success header */}
        <div className="text-center mb-10">
          <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-brand-green/20">
            <CheckCircle2 className="h-12 w-12 text-brand-green" />
          </div>
          <h1 className="font-display text-4xl font-extrabold text-white">MISSION CONFIRMED!</h1>
          <p className="mt-3 text-lg text-[#B3BECE]">
            Congratulations, future astronaut. Your journey is officially booked!
          </p>
          <p className="mt-2 font-mono text-sm text-brand-saffron">
            Booking Ref: {b.bookingReference}
          </p>
        </div>

        {/* Booking details card */}
        <div className="card overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-brand-saffron/20 to-brand-sky/20 px-6 py-4">
            <div className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-brand-saffron" />
              <span className="font-display text-lg font-bold text-white">ANTARIKSH</span>
              <span className="ml-auto badge-saffron">CONFIRMED</span>
            </div>
          </div>
          <div className="p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-[#8492A6]">Passenger</p>
                <p className="font-semibold text-white">{b.passengers?.[0]?.name || b.passengerName || '—'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-[#8492A6]">Ticket Status</p>
                <p className="font-semibold text-brand-green">{b.status?.toUpperCase()}</p>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-brand-sky shrink-0" />
                <div>
                  <p className="text-xs text-[#8492A6]">Route</p>
                  <p className="font-semibold text-white">{b.source?.name || 'Earth'} &rarr; {b.destination?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CalendarDays className="h-4 w-4 text-brand-teal shrink-0" />
                <div>
                  <p className="text-xs text-[#8492A6]">Travel Date</p>
                  <p className="font-semibold text-white">{formatDate(b.departureDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Rocket className="h-4 w-4 text-brand-saffron shrink-0" />
                <div>
                  <p className="text-xs text-[#8492A6]">Spacecraft / Company</p>
                  <p className="font-semibold text-white">{b.packageId?.name || '—'} &middot; {b.company?.name || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Award className="h-4 w-4 text-brand-sky shrink-0" />
                <div>
                  <p className="text-xs text-[#8492A6]">Class / Seat</p>
                  <p className="font-semibold text-white">{classDisplay} &middot; {b.seatNumber || '—'}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-navy-600 pt-4">
              <p className="text-xs text-[#8492A6]">Total Amount</p>
              <p className="font-display text-2xl font-bold text-brand-saffron">{total}</p>
            </div>
          </div>
        </div>

        {/* QR Code */}
        {ticket?.qrDataUrl && (
          <div className="flex justify-center mb-8">
            <div className="rounded-xl bg-white p-2">
              <img src={ticket.qrDataUrl} alt="Ticket QR" className="h-32 w-32" />
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          {ticket && (
            <button onClick={handleDownload} className="btn-saffron !px-8 !py-3 text-base">
              <Download className="h-5 w-5" /> DOWNLOAD MY TICKET
            </button>
          )}
          <Link to="/dashboard" className="btn-ghost !px-8 !py-3 text-base">
            <LayoutDashboard className="h-5 w-5" /> VIEW MY MISSIONS
          </Link>
        </div>

        <p className="mt-8 text-center text-xs text-[#8492A6]">
          This is a fictional simulated reservation. No actual space travel is provided.
        </p>
      </div>
    </div>
  );
}

