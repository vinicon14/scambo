'use client';

import { useEffect, useState } from 'react';
import { getRemainingTime } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface CountdownProps {
  endsAt: string;
}

export default function Countdown({ endsAt }: CountdownProps) {
  const [time, setTime] = useState(getRemainingTime(endsAt));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getRemainingTime(endsAt));
    }, 1000);
    return () => clearInterval(timer);
  }, [endsAt]);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white text-center shadow-xl">
      <div className="flex items-center justify-center gap-2 mb-3">
        <Clock className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Ranking encerra em</h3>
      </div>
      <div className="flex justify-center gap-4">
        <div className="bg-white/10 rounded-xl p-3 min-w-[70px]">
          <div className="text-3xl font-bold">{pad(time.days)}</div>
          <div className="text-xs text-purple-200 mt-1">Dias</div>
        </div>
        <div className="bg-white/10 rounded-xl p-3 min-w-[70px]">
          <div className="text-3xl font-bold">{pad(time.hours)}</div>
          <div className="text-xs text-purple-200 mt-1">Horas</div>
        </div>
        <div className="bg-white/10 rounded-xl p-3 min-w-[70px]">
          <div className="text-3xl font-bold">{pad(time.minutes)}</div>
          <div className="text-xs text-purple-200 mt-1">Min</div>
        </div>
        <div className="bg-white/10 rounded-xl p-3 min-w-[70px]">
          <div className="text-3xl font-bold">{pad(time.seconds)}</div>
          <div className="text-xs text-purple-200 mt-1">Seg</div>
        </div>
      </div>
      {time.total === 0 && (
        <p className="mt-3 text-yellow-300 font-semibold">Ranking encerrado! Aguardando resultado...</p>
      )}
    </div>
  );
}
