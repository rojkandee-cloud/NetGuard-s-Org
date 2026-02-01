import React from 'react';
import { Server, ShieldCheck, Zap } from 'lucide-react';

interface FirewallPanelProps {
  blockedPorts: number[];
  onTogglePort: (port: number) => void;
  strictMode: boolean;
  setStrictMode: (val: boolean) => void;
  adShield: boolean;
  setAdShield: (val: boolean) => void;
}

const PORTS = [
  { port: 22, label: 'SSH', desc: 'Remote Access' },
  { port: 8080, label: 'WEB', desc: 'Web Proxy' },
  { port: 3389, label: 'RDP', desc: 'Remote Desktop' }
];

const FirewallPanel: React.FC<FirewallPanelProps> = ({ 
  blockedPorts, onTogglePort, strictMode, setStrictMode, adShield, setAdShield 
}) => {
  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-2 h-full shadow-lg flex flex-col">
      <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-1.5 shrink-0">
        <Server className="text-indigo-500 w-4 h-4" />
        <h2 className="text-sm font-semibold text-slate-100">AI Firewall</h2>
      </div>

      <div className="space-y-1.5 mb-2 overflow-y-auto scrollbar-hide flex-1">
        {/* Ad Shield Toggle */}
        <div className="bg-slate-900/50 p-2 rounded border border-slate-700 flex items-center justify-between group">
          <div className="flex items-center gap-2">
            <Zap className={`w-3.5 h-3.5 ${adShield ? 'text-yellow-400' : 'text-slate-500'}`} />
            <div className="text-xs font-medium text-slate-200">YouTube Shield</div>
          </div>
          <button 
            onClick={() => setAdShield(!adShield)}
            className={`w-8 h-4 rounded-full transition-colors relative ${adShield ? 'bg-yellow-500' : 'bg-slate-600'}`}
          >
            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${adShield ? 'left-4.5' : 'left-0.5'}`} style={{ left: adShield ? '18px' : '2px'}} />
          </button>
        </div>

        {/* DPI Toggle */}
        <div className="bg-slate-900/50 p-2 rounded border border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className={`w-3.5 h-3.5 ${strictMode ? 'text-rose-500' : 'text-slate-500'}`} />
            <div className="text-xs font-medium text-slate-200">DPI Filtering</div>
          </div>
          <button 
            onClick={() => setStrictMode(!strictMode)}
            className={`w-8 h-4 rounded-full transition-colors relative ${strictMode ? 'bg-rose-500' : 'bg-slate-600'}`}
          >
            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${strictMode ? 'left-4.5' : 'left-0.5'}`} style={{ left: strictMode ? '18px' : '2px'}} />
          </button>
        </div>

        <div className="pt-1.5">
          <div className="text-[10px] text-slate-500 uppercase font-bold mb-1 ml-1">Critical Ports</div>
          {PORTS.map((p) => {
            const isBlocked = blockedPorts.includes(p.port);
            return (
              <div key={p.port} className="flex items-center justify-between p-1.5 rounded bg-slate-900/30 border border-slate-800 mb-1">
                <div className="flex items-center gap-2">
                   <div className={`w-1.5 h-1.5 rounded-full ${isBlocked ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                   <div className="text-[11px] text-slate-300 font-mono leading-none">{p.port}/{p.label}</div>
                </div>
                <button 
                  onClick={() => onTogglePort(p.port)}
                  className={`text-[9px] px-1.5 py-0.5 rounded border transition-colors ${
                      isBlocked ? 'border-rose-500/50 text-rose-400' : 'border-slate-600 text-slate-400'
                  }`}
                >
                  {isBlocked ? 'BLK' : 'ALW'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FirewallPanel;