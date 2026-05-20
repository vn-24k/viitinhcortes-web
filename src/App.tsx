import React, { useState, useEffect } from 'react';
import { 
  Scissors, CalendarDays, Clock, User, Phone, 
  ChevronRight, ArrowLeft, CheckCircle2, Star, 
  MapPin, Instagram, Lock, LogOut, CalendarRange, RotateCcw,
  WifiOff
} from 'lucide-react';

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

const AVAILABLE_TIMES = [
  '09:00', '09:45', '10:30', '11:15', '13:00', '13:45', '14:30', '15:15', '16:00', '16:45', '17:30', '18:15', '19:00'
];

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
  return { 
    dayName: days[date.getDay()], 
    dayNumber: String(date.getDate()).padStart(2, '0'), 
    monthNumber: String(date.getMonth() + 1).padStart(2, '0'), 
    full: date 
  };
};

export default function App() {
  const [view, setView] = useState('client'); 
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 selection:bg-amber-500/30 selection:text-amber-200">
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

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
        {view === 'client' ? (
          <ClientFlow goToAdmin={() => setView('admin')} />
        ) : (
          <AdminDashboard isLoggedIn={isAdminLoggedIn} setIsLoggedIn={setIsAdminLoggedIn} />
        )}
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

  useEffect(() => {
    setUpcomingDays(generateUpcomingDays());
  }, []);

  const nextStep = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(s => s + 1); };
  const prevStep = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(s => s - 1); };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    const payload = {
      id: Date.now().toString(),
      nome: formData.name,
      telefone: formData.phone,
      servico: selectedService.name,
      data_agendamento: dateStr,
      hora_agendamento: selectedTime,
      status: 'agendado'
    };

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/agendamentos`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          nome: payload.nome,
          telefone: payload.telefone,
          servico: payload.servico,
          data_agendamento: payload.data_agendamento,
          hora_agendamento: payload.hora_agendamento,
          status: payload.status
        })
      });

      if (!response.ok) throw new Error("Erro na API");
      
    } catch (err) {
      const localData = JSON.parse(localStorage.getItem('viitinh_offline_db') || '[]');
      localData.push(payload);
      localStorage.setItem('viitinh_offline_db', JSON.stringify(localData));
    } finally {
      setIsSubmitting(false);
      setStep(4);
    }
  };

  return (
    <>
      {step > 0 && step < 4 && (
        <button onClick={prevStep} className="fixed top-4 left-4 z-[60] p-2 rounded-full bg-zinc-900/80 text-zinc-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}

      {step === 0 && (
        <div className="animate-in fade-in duration-500">
          <div className="relative h-[60vh] min-h-[500px] w-full bg-zinc-900 overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80")' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
            <div className="relative z-10 text-center px-6 max-w-2xl mx-auto flex flex-col items-center">
              <div className="w-20 h-20 bg-zinc-800 rounded-full border-2 border-amber-500/50 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(217,119,6,0.3)]">
                <Scissors className="w-10 h-10 text-amber-500" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-4">viitinh<span className="text-amber-500">cortes</span></h1>
              <p className="text-zinc-400 text-lg md:text-xl mb-8 max-w-md mx-auto">A arte da barbearia levada a sério.</p>
              <button onClick={() => setStep(1)} className="px-8 py-4 font-bold text-zinc-950 bg-amber-500 rounded-full hover:bg-amber-400 flex items-center gap-2">
                AGENDAR AGORA <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <footer className="mt-16 border-t border-zinc-900 py-8 text-center text-zinc-500 text-sm flex flex-col items-center">
            <button onClick={goToAdmin} className="text-zinc-600 hover:text-amber-500 underline underline-offset-4 mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4" /> Área do Barbeiro
            </button>
            <p>© {new Date().getFullYear()} viitinhcortes.</p>
          </footer>
        </div>
      )}

      {step === 1 && (
        <div className="max-w-2xl mx-auto px-4 py-8 animate-in slide-in-from-right-4">
          <h2 className="text-2xl font-bold text-white mb-2">Escolhe o Serviço</h2>
          <div className="space-y-3 mt-6">
            {SERVICES.map((s) => (
              <button key={s.id} onClick={() => { setSelectedService(s); nextStep(); }} className="w-full flex items-center justify-between p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 text-left">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{s.icon}</div>
                  <div>
                    <h3 className="text-white font-medium">{s.name}</h3>
                    <span className="text-sm text-zinc-500">{s.duration}</span>
                  </div>
                </div>
                <span className="text-amber-500 font-bold">{s.price}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-2xl mx-auto px-4 py-8 animate-in slide-in-from-right-4">
          <h2 className="text-2xl font-bold text-white mb-6">Data e Hora</h2>
          <div className="flex overflow-x-auto gap-3 pb-4 snap-x hide-scrollbar mb-8">
            {upcomingDays.map((date, idx) => {
              const { dayName, dayNumber, monthNumber } = formatDateToBR(date);
              const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
              return (
                <button key={idx} onClick={() => setSelectedDate(date)} className={`snap-start shrink-0 flex flex-col items-center justify-center w-20 h-24 rounded-2xl border transition-all ${isSelected ? 'bg-amber-500 text-zinc-950 border-amber-500' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}>
                  <span className="text-xs uppercase">{dayName}</span>
                  <span className="text-2xl font-bold">{dayNumber}</span>
                  <span className="text-xs">/{monthNumber}</span>
                </button>
              );
            })}
          </div>

          {selectedDate && (
            <div className="grid grid-cols-3 gap-3 animate-in fade-in">
              {AVAILABLE_TIMES.map((time) => (
                <button key={time} onClick={() => setSelectedTime(time)} className={`py-3 rounded-xl text-sm font-medium border ${selectedTime === time ? 'bg-amber-500 text-zinc-950 border-amber-500' : 'bg-zinc-900 border-zinc-800 text-zinc-300'}`}>
                  {time}
                </button>
              ))}
            </div>
          )}

          <button onClick={nextStep} disabled={!selectedDate || !selectedTime} className="w-full mt-10 py-4 rounded-xl font-bold bg-amber-500 text-zinc-950 disabled:opacity-50">
            Continuar
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="max-w-2xl mx-auto px-4 py-8 animate-in slide-in-from-right-4">
          <h2 className="text-2xl font-bold text-white mb-6">Os Teus Dados</h2>
          
          <div className="bg-zinc-900 p-5 rounded-xl mb-6 border border-zinc-800">
            <p className="text-zinc-300 text-sm mb-2">{selectedService?.name} - <span className="text-amber-500">{selectedService?.price}</span></p>
            <p className="text-zinc-400 text-sm">{formatDateToBR(selectedDate).dayNumber}/{formatDateToBR(selectedDate).monthNumber} às {selectedTime}</p>
          </div>

          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input type="text" required placeholder="Nome Completo" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl py-4 pl-12 pr-4 focus:border-amber-500 outline-none" />
            </div>
            
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input type="tel" required placeholder="Telemóvel / WhatsApp" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl py-4 pl-12 pr-4 focus:border-amber-500 outline-none" />
            </div>

            <button type="submit" disabled={isSubmitting || !formData.name || !formData.phone} className="w-full py-4 mt-4 rounded-xl font-bold bg-amber-500 text-zinc-950 disabled:opacity-50">
              {isSubmitting ? 'A Confirmar...' : 'Confirmar Agendamento'}
            </button>
          </form>
        </div>
      )}

      {step === 4 && (
        <div className="max-w-md mx-auto px-4 py-16 text-center animate-in zoom-in-95">
          <CheckCircle2 className="w-20 h-20 text-amber-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Agendado com Sucesso!</h2>
          <p className="text-zinc-400 mb-8">Esperamos por ti, {formData.name.split(' ')[0]}!</p>
          <button onClick={() => { setStep(0); setSelectedService(null); setSelectedDate(null); setSelectedTime(null); setFormData({name:'', phone:''}); }} className="text-amber-500 font-medium border border-amber-500 px-6 py-2 rounded-full hover:bg-amber-500/10">
            Fazer novo agendamento
          </button>
        </div>
      )}
    </>
  );
}

function AdminDashboard({ isLoggedIn, setIsLoggedIn }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [agendamentos, setAgendamentos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Senha incorreta.');
    }
  };

  const fetchAgendamentos = async () => {
    setIsLoading(true);
    setIsOffline(false);
    
    let dadosSupabase = [];
    let dadosOffline = JSON.parse(localStorage.getItem('viitinh_offline_db') || '[]');

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/agendamentos?select=*&order=data_agendamento.asc`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });
      
      if (response.ok) {
        dadosSupabase = await response.json();
      } else {
        throw new Error("Erro DB");
      }
    } catch (err) {
      setIsOffline(true);
    } finally {
      const todosOsDados = [...dadosSupabase, ...dadosOffline];
      const unicos = Array.from(new Set(todosOsDados.map(a => a.id)))
        .map(id => todosOsDados.find(a => a.id === id))
        .sort((a, b) => new Date(a.data_agendamento) - new Date(b.data_agendamento));
        
      setAgendamentos(unicos);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchAgendamentos();
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 animate-in fade-in">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
          <Lock className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-6">Área Restrita</h2>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              placeholder="Digita a senha (admin)" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl py-4 px-4 mb-4 text-center focus:border-amber-500 outline-none"
            />
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            <button type="submit" className="w-full py-4 rounded-xl font-bold bg-amber-500 text-zinc-950 hover:bg-amber-400">
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in">
      <div className="flex justify-between items-center mb-8 border-b border-zinc-900 pb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <CalendarRange className="text-amber-500" /> A Minha Agenda
        </h2>
        <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-2 text-zinc-400 hover:text-white px-4 py-2 bg-zinc-900 rounded-lg">
          Sair <LogOut className="w-4 h-4" />
        </button>
      </div>

      {isOffline && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 p-4 rounded-xl mb-6 flex items-start gap-3">
          <WifiOff className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-bold text-sm">Modo de Memória Local</p>
            <p className="text-xs mt-1">O teu navegador está a bloquear a ligação externa. A exibir agendamentos salvos na memória do teu dispositivo.</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-zinc-400">Próximos Cortes</h3>
        <button onClick={fetchAgendamentos} className="flex items-center gap-2 text-sm text-amber-500 hover:text-amber-400 px-4 py-2 bg-amber-500/10 rounded-lg">
          <RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Atualizar
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-zinc-500 flex flex-col items-center">
          <RotateCcw className="w-8 h-8 animate-spin mb-4 text-amber-500" />
          A carregar a tua agenda...
        </div>
      ) : agendamentos.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/50 rounded-2xl border border-zinc-800 border-dashed text-zinc-500">
          <CalendarDays className="w-12 h-12 mx-auto mb-4 opacity-50" />
          Nenhum agendamento encontrado. A tua agenda está livre!
        </div>
      ) : (
        <div className="space-y-4">
          {agendamentos.map((ag) => {
            const [year, month, day] = ag.data_agendamento.split('-');
            return (
              <div key={ag.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-amber-500/30 transition-colors">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-amber-500 text-zinc-950 font-bold px-3 py-1 rounded-md text-sm">
                      {ag.hora_agendamento}
                    </span>
                    <span className="text-zinc-400 text-sm font-medium">{day}/{month}/{year}</span>
                  </div>
                  <h3 className="text-white font-bold text-lg">{ag.nome}</h3>
                  <p className="text-zinc-400 flex items-center gap-2 mt-1">
                    <Phone className="w-4 h-4" /> {ag.telefone}
                  </p>
                </div>
                
                <div className="bg-zinc-950 px-4 py-3 rounded-lg border border-zinc-800 w-full md:w-auto text-center">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Serviço Solicitado</p>
                  <p className="text-amber-500 font-medium">{ag.servico}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
