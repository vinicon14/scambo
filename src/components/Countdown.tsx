'use client';

import { useEffect, useState } from 'react';
import { getRemainingTime } from '@/lib/utils';
import { Clock, Timer } from 'lucide-react';

interface CountdownProps {
  endsAt: string;
}

export default function Countdown({ endsAt }: CountdownProps) {
  const [time, setTime] = useState(getRemainingTime(endsAt));
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getRemainingTime(endsAt));
    }, 1000);
    return () => clearInterval(timer);
  }, [endsAt]);

  const pad = (n: number) => String(n).padStart(2, '0');

  if (!mounted) return null;

  const items = [
    { value: time.days, label: 'Dias' },
    { value: time.hours, label: 'Horas' },
    { value: time.minutes, label: 'Min' },
    { value: time.seconds, label: 'Seg' },
  ];

  return (
    <div className="animate-slide-down relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-700 via-indigo-700 to-purple-800 p-[1px]">
      <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 rounded-2xl p-6 text-white text-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent_70%)] rounded-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Timer className="w-5 h-5 text-purple-200" />
            <h3 className="text-sm font-semibold text-purple-200 uppercase tracking-wider">Ranking encerra em</h3>
          </div>
          <div className="flex justify-center gap-3">
            {items.map((item, i) => (
              <div
                key={item.label}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-3 min-w-[72px] border border-white/5 animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="text-3xl sm:text-4xl font-black tabular-nums tracking-tight">{pad(item.value)}</div>
                <div className="text-[10px] text-purple-300 mt-1 uppercase tracking-widest font-medium">{item.label}</div>
              </div>
            ))}
          </div>
          {time.total === 0 && (
            <p className="mt-4 text-yellow-300 font-semibold animate-fade-in">
              Ranking encerrado! Aguardando resultado...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
