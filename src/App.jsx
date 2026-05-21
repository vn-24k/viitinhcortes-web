import React, { useState, useEffect } from 'react';
import * as Lucide from 'lucide-react';

const { Scissors, CalendarDays, Clock, User, Phone, ChevronRight, ArrowLeft, CheckCircle2, Star, MapPin, Instagram, Lock, LogOut, CalendarRange, RotateCcw, WifiOff } = Lucide;

const SUPABASE_URL = 'https://ekpacsgjfgfulmumwwnp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrcGFjc2dqZmdmdWxtdXd3bnAiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNzc4NDYwNywiZXhwIjoyMDUzMzYwNjA3fQ.bXJfZXfQ3_55p6G9L0R8u_8W-7LgEwF9P5V6_M_801Y';
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
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
          <Scissors className="w-5 h-5 text-amber-500" />
          <span>viitinh<span className="text-amber-500">cortes</span></span>
        </div>
      </nav>
      <main className="pb-24">
        <div className="p-10 text-center text-white"><h1 className="text-2xl">O site carregou!</h1></div>
      </main>
    </div>
  );
}
