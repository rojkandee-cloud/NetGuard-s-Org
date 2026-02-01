import React, { useRef, useEffect } from 'react';
import { TrafficPacket, PacketStatus } from '../types';
import { ShieldBan, CheckCircle, Search, Globe, Cpu, ArrowDown, ArrowUp } from 'lucide-react';

interface TrafficTableProps {
  traffic: TrafficPacket[];
  onAnalyze: (packet: TrafficPacket) => void;
}

const TrafficTable: React.FC<TrafficTableProps> = ({ traffic, onAnalyze }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [traffic]);

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden flex flex-col h-full shadow-lg">
      <div className="p-2 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
        <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
          <Globe className="text-blue-400 w-4 h-4" /> Live Traffic
        </h2>
        <span className="text-[10px] text-emerald-400 px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded font-mono animate-pulse">
          ● MONITORING
        </span>
      </div>
      
      <div className="flex-1 overflow-auto relative scrollbar-hide" ref={scrollRef}>
        <table className="w-full text-left text-slate-400">
          <thead className="bg-slate-900/90 sticky top-0 backdrop-blur-sm z-10 text-[10px] uppercase tracking-wider font-bold">
            <tr>
              <th className="p-2 hidden md:table-cell">Time</th>
              <th className="p-2">Status</th>
              <th className="p-2">App/Process</th>
              <th className="p-2">Destination</th>
              <th className="p-2 text-right">Speed (Mb)</th>
              <th className="p-2 text-right">Ping</th>
              <th className="p-2 text-center">Act</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50 text-[11px]">
            {traffic.map((packet) => (
              <tr key={packet.id} className="hover:bg-slate-700/30 transition-colors font-mono group leading-tight">
                <td className="p-2 text-slate-500 hidden md:table-cell whitespace-nowrap">
                  {new Date(packet.timestamp).toLocaleTimeString()}
                </td>
                <td className="p-2 whitespace-nowrap">
                  {packet.status === PacketStatus.BLOCKED ? (
                    <span className="flex items-center text-rose-500 gap-1 font-bold">
                      <ShieldBan size={12} /> BLK
                    </span>
                  ) : (
                    <span className="flex items-center text-emerald-500 gap-1">
                      <CheckCircle size={12} /> OK
                    </span>
                  )}
                </td>
                <td className="p-2 max-w-[100px] truncate">
                  <div className="flex items-center gap-1.5">
                    <Cpu size={12} className="text-slate-500 shrink-0" />
                    <span className="text-slate-200 font-bold truncate">{packet.processName}</span>
                  </div>
                </td>
                <td className="p-2 max-w-[120px] truncate text-slate-300">
                  {packet.destinationDomain}
                </td>
                <td className="p-2 text-right whitespace-nowrap">
                   <div className="flex flex-col items-end">
                      <span className="text-emerald-400 flex items-center gap-0.5"><ArrowDown size={8}/>{packet.downloadRate}</span>
                      <span className="text-blue-400 flex items-center gap-0.5"><ArrowUp size={8}/>{packet.uploadRate}</span>
                   </div>
                </td>
                <td className="p-2 text-right font-medium">
                  <span className={`${packet.latency > 100 ? 'text-rose-400' : packet.latency > 50 ? 'text-amber-400' : 'text-slate-400'}`}>
                    {packet.latency}ms
                  </span>
                </td>
                <td className="p-2 text-center">
                  <button 
                    onClick={() => onAnalyze(packet)}
                    className="text-indigo-400 hover:text-white hover:bg-indigo-600 p-1 rounded transition-colors"
                    title="Analyze"
                  >
                    <Search size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {traffic.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-xs">
            Awaiting traffic...
          </div>
        )}
      </div>
    </div>
  );
};

export default TrafficTable;