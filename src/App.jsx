import React, { useState, useEffect } from 'react';
import * as Lucide from 'lucide-react';

const { Scissors, CalendarDays, Clock, User, Phone, ChevronRight, ArrowLeft, CheckCircle2, Star, MapPin, Instagram, Lock, LogOut, CalendarRange, RotateCcw, WifiOff } = Lucide;

export default function App() {
  const [view, setView] = useState('client'); 
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100">
      <div className="text-white p-10 text-center">
        <h1 className="text-4xl">Sistema em Manutenção</h1>
        <p>O deploy foi corrigido com sucesso.</p>
      </div>
    </div>
  );
}
