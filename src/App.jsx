import React, { useState, useEffect } from 'react';
import { Scissors, CalendarDays, Clock, User, Phone, ChevronRight, ArrowLeft, CheckCircle2, Star, MapPin, Lock, LogOut, CalendarRange, RotateCcw, WifiOff } from "lucide-react";
import { Instagram } from "lucide-react/dist/esm/icons/instagram";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;
const ADMIN_PASSWORD = 'admin'; 

const SERVICES = [
  { id: 1, name: 'Corte Clássico', price: 'R$ 45,00', duration: '40 min', icon: '✂️' },
  { id: 2, name: 'Corte Degradê (Fade)', price: 'R$ 55,00', duration: '50 min', icon: '💈' },
  { id: 3, name: 'Barba Terapia', price: 'R$ 35,00', duration: '30 min', icon: '🧔' },
  { id: 4, name: 'Combo (Corte + Barba)', price: 'R$ 80,00', duration: '1h 20m', icon: '🔥', popular: true },
  { id: 5, name: 'Platinado / Luzes', price: 'R$ 120,00', duration: '2h 00m', icon: '✨' },
  { id: 6, name: 'Sobrancelha', price: 'R$ 15,00', duration: '15 min', icon: '👁️' },
];

const AVAILABLE_TIMES = ['09:00', '09:45', '10:30', '11:15', '13:00', '13:45', '14:30', '15:15', '16:00', '16:45', '17:30', '18:15', '19:00'];

const generateUpcomingDays = (days = 14) => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    if (date.getDay() !== 0) dates.push(date); 
  }
  return dates;
};

const formatDateToBR = (date) => {
  if (!date) return { dayName: '', dayNumber: '', monthNumber: '', full: null };
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  return { dayName: days[date.getDay()], dayNumber: String(date.getDate()).padStart(2, '0'), monthNumber: String(date.getMonth() + 1).padStart(2, '0'), full: date };
};

export default function App() {
  const [view, setView] = useState('client'); 
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 selection:bg-amber-500/30 selection:text-amber-200">
      <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-900 px-4 py-4 flex items-center justify-center">
        {view === 'admin' && (
          <button onClick={() => setView('client')} className="absolute left-4 p-2 rounded-full hover:bg-zinc-900 text-zinc-400">
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <Scissors className="w-5 h-5 text-amber-500" />
          <span>viitinh<span className="text-amber-500">cortes</span></span>
        </div>
      </nav>
      <main className="pb-24">
        {view === 'client' ? <ClientFlow goToAdmin={() => setView('admin')} /> : <AdminDashboard isLoggedIn={isAdminLoggedIn} setIsLoggedIn={setIsAdminLoggedIn} />}
      </main>
    </div>
  );
}

function ClientFlow({ goToAdmin }) {
  const [step, setStep] = useState(0); 
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [upcomingDays, setUpcomingDays] = useState([]);

  useEffect(() => { setUpcomingDays(generateUpcomingDays()); }, []);
  const nextStep = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(s => s + 1); };
  const prevStep = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(s => s - 1); };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    const payload = { id: Date.now().toString(), nome: formData.name, telefone: formData.phone, servico: selectedService.name, data_agendamento: dateStr, hora_agendamento: selectedTime, status: 'agendado' };
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/agendamentos`, {
        method: 'POST',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({ nome: payload.nome, telefone: payload.telefone, servico: payload.servico, data_agendamento: payload.data_agendamento, hora_agendamento: payload.hora_agendamento, status: payload.status })
      });
    } catch (err) {
      const localData = JSON.parse(localStorage.getItem('viitinh_offline_db') || '[]');
      localData.push(payload);
      localStorage.setItem('viitinh_offline_db', JSON.stringify(localData));
    } finally { setIsSubmitting(false); setStep(4); }
  };

  return (
    <>
      {step === 0 && (
        <div className="animate-in fade-in duration-500 text-center px-6">
          <h1 className="text-5xl font-bold text-white mb-4">viitinh<span className="text-amber-500">cortes</span></h1>
          <button onClick={() => setStep(1)} className="px-8 py-4 bg-amber-500 text-zinc-950 rounded-full">AGENDAR</button>
        </div>
      )}
      {step === 1 && (
        <div className="max-w-2xl mx-auto px-4">
           {SERVICES.map((s) => <button key={s.id} onClick={() => { setSelectedService(s); nextStep(); }} className="w-full p-4 mb-3 bg-zinc-900 border border-zinc-800 rounded-xl">{s.name}</button>)}
        </div>
      )}
      {step === 4 && (
        <div className="text-center p-10"><h2 className="text-3xl font-bold text-white">Sucesso!</h2></div>
      )}
    </>
  );
}

function AdminDashboard({ isLoggedIn, setIsLoggedIn }) {
  // Código do Admin simplificado para o exemplo, adicione o resto da lógica aqui
  return <div className="text-center text-white">Dashboard Admin</div>;
}
