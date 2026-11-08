import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import Home from './pages/Home.jsx';
import Destinations from './pages/Destinations.jsx';
import DestinationDetail from './pages/DestinationDetail.jsx';
import Companies from './pages/Companies.jsx';
import CompanyDetail from './pages/CompanyDetail.jsx';
import Adventures from './pages/Adventures.jsx';
import AdventureDetail from './pages/AdventureDetail.jsx';
import Assessment from './pages/Assessment.jsx';
import SpaceStore from './pages/SpaceStore.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import TicketView from './pages/TicketView.jsx';
import VerifyTicket from './pages/VerifyTicket.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import BookingPassengers from './pages/BookingPassengers.jsx';
import BookingSummary from './pages/BookingSummary.jsx';
import BookingProcessing from './pages/BookingProcessing.jsx';
import BookingSuccess from './pages/BookingSuccess.jsx';
import { Spinner } from './components/ui.jsx';
import { useAuth } from './context/AuthContext.jsx';

function Protected({ children, admin }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div className="grid min-h-[60vh] place-items-center"><Spinner className="h-10 w-10 text-brand-sky" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (admin && !isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}


export default function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/destinations/:slug" element={<DestinationDetail />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/companies/:slug" element={<CompanyDetail />} />
        <Route path="/adventures" element={<Adventures />} />
        <Route path="/adventures/:slug" element={<AdventureDetail />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/store" element={<SpaceStore />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<VerifyTicket />} />
        <Route path="/ticket/:ticketNumber" element={<Protected><TicketView /></Protected>} />
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
        <Route path="/admin" element={<Protected admin><AdminDashboard /></Protected>} />

        {/* New Booking Flow */}
        <Route path="/booking/passengers" element={<Protected><BookingPassengers /></Protected>} />
        <Route path="/booking/summary" element={<Protected><BookingSummary /></Protected>} />
        <Route path="/booking/processing" element={<Protected><BookingProcessing /></Protected>} />
        <Route path="/booking/success/:bookingReference" element={<Protected><BookingSuccess /></Protected>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
}

