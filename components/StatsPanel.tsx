import React from 'react';
import { TrafficPacket, PacketStatus } from '../types';
import { ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { ShieldAlert, ShieldCheck, Activity, ArrowDown, ArrowUp, Wifi, Zap } from 'lucide-react';

interface StatsPanelProps {
  traffic: TrafficPacket[];
}

const StatsPanel: React.FC<StatsPanelProps> = ({ traffic }) => {
  const total = traffic.length;
  const blocked = traffic.filter(t => t.status === PacketStatus.BLOCKED).length;
  const adsBlocked = traffic.filter(t => t.status === PacketStatus.BLOCKED && (t.category === 'Ad' || t.category === 'Tracker')).length;
  const efficiency = total > 0 ? ((blocked / total) * 100).toFixed(1) : '0';

  const recentPackets = traffic.slice(-5);
  const avgDownload = recentPackets.length > 0 
    ? (recentPackets.reduce((acc, curr) => acc + curr.downloadRate, 0) / recentPackets.length).toFixed(1) 
    : '0.0';
  const avgUpload = recentPackets.length > 0 
    ? (recentPackets.reduce((acc, curr) => acc + curr.uploadRate, 0) / recentPackets.length).toFixed(1) 
    : '0.0';
  const avgLatency = recentPackets.length > 0 
    ? Math.round(recentPackets.reduce((acc, curr) => acc + curr.latency, 0) / recentPackets.length) 
    : 0;

  const categoryData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    traffic.forEach(t => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [traffic]);

  // Enhanced Colors for Categories including AD
  const COLORS = {
    Content: '#0088FE',
    Social: '#00C49F',
    Tracker: '#FFBB28',
    Ad: '#F43F5E', // Rose-500 for Ads
    Shopping: '#FF8042',
    System: '#8884d8'
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-2">
      <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 shadow flex flex-col justify-between">
         <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase font-bold">
            <ArrowDown className="w-3 h-3 text-emerald-400" /> Down
         </div>
         <div className="text-xl font-mono text-emerald-400 font-bold leading-none">{avgDownload} <span className="text-[10px] text-slate-500 font-normal">Mb/s</span></div>
      </div>

      <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 shadow flex flex-col justify-between">
         <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase font-bold">
            <ArrowUp className="w-3 h-3 text-blue-400" /> Up
         </div>
         <div className="text-xl font-mono text-blue-400 font-bold leading-none">{avgUpload} <span className="text-[10px] text-slate-500 font-normal">Mb/s</span></div>
      </div>

       <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 shadow flex flex-col justify-between">
         <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase font-bold">
            <Wifi className="w-3 h-3 text-amber-400" /> Ping
         </div>
         <div className="text-xl font-mono text-amber-400 font-bold leading-none">{avgLatency} <span className="text-[10px] text-slate-500 font-normal">ms</span></div>
      </div>

      <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 shadow flex flex-col justify-between group overflow-hidden relative">
        <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase font-bold relative z-10">
          <Zap className="text-yellow-500 w-3 h-3" /> Ads Filtered
        </div>
        <div className="text-xl font-bold text-yellow-500 relative z-10 leading-none">{adsBlocked}</div>
        <Zap className="absolute -right-2 -bottom-2 w-10 h-10 text-yellow-500/10 group-hover:scale-125 transition-transform" />
      </div>

      <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 shadow flex flex-col justify-between">
        <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase font-bold">
          <ShieldAlert className="text-rose-500 w-3 h-3" /> Blocked
        </div>
        <div className="text-xl font-bold text-rose-500 leading-none">{blocked}</div>
      </div>

      <div className="bg-slate-800 p-1 rounded-lg border border-slate-700 shadow relative">
         <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={15}
                outerRadius={25}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#CCC'} />
                ))}
              </Pie>
            </PieChart>
         </ResponsiveContainer>
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[10px] font-bold text-slate-500">{efficiency}%</span>
         </div>
      </div>
    </div>
  );
};

export default StatsPanel;