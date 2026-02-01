import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Globe, RefreshCw, ChevronDown, CheckCircle2 } from 'lucide-react';
import { VpnProvider, VpnPackage } from '../types';

interface VpnPanelProps {
  isConnected: boolean;
  onToggle: (connected: boolean) => void;
  provider: VpnProvider;
  onProviderChange: (p: VpnProvider) => void;
}

const VpnPanel: React.FC<VpnPanelProps> = ({ isConnected, onToggle, provider, onProviderChange }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<VpnPackage>(provider === 'AIS' ? 'AIS_FREE_NET' : 'DTAC_SOCIAL_GAMING');
  const [autoServer, setAutoServer] = useState<string>('N/A');

  useEffect(() => {
    setSelectedPackage(provider === 'AIS' ? 'AIS_FREE_NET' : 'DTAC_SOCIAL_GAMING');
  }, [provider]);

  const handleConnect = () => {
    if (isConnected) {
      onToggle(false);
      setAutoServer('N/A');
    } else {
      setIsConnecting(true);
      // Simulate handshaking and auto-selection
      setTimeout(() => {
        setIsConnecting(false);
        onToggle(true);
        // Automatic Server Selection Simulation
        const serverPrefix = provider === 'DTAC' ? 'DTAC-BKK-GAME-SRV' : 'AIS-BKK-PROX-SRV';
        const serverNum = Math.floor(Math.random() * 5) + 1;
        setAutoServer(`${serverPrefix}-0${serverNum}`);
      }, 1500);
    }
  };

  const getThemeColor = () => {
    if (provider === 'AIS') return isConnected ? 'text-lime-400' : 'text-slate-500';
    return isConnected ? 'text-cyan-400' : 'text-slate-500';
  };

  const getBtnBg = () => {
    if (isConnected) return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
    if (provider === 'AIS') return 'bg-lime-500 text-slate-950 hover:bg-lime-400';
    return 'bg-cyan-500 text-slate-950 hover:bg-cyan-400';
  };

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-2 shadow-lg flex flex-col h-full overflow-hidden transition-all duration-500">
      <div className="flex items-center justify-between mb-2 border-b border-slate-700 pb-1.5">
        <div className="flex items-center gap-2">
          <Lock className={`w-4 h-4 transition-colors duration-500 ${getThemeColor()}`} />
          <h2 className="text-sm font-semibold text-slate-100">OpenVPN Pro</h2>
        </div>
        {isConnected && (
          <span className={`text-[9px] font-bold px-1 rounded border animate-pulse ${provider === 'AIS' ? 'text-lime-400 bg-lime-400/10 border-lime-400/20' : 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20'}`}>
            {provider} TUNNEL ACTIVE
          </span>
        )}
      </div>

      <div className="space-y-2 flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        {/* Provider Switcher */}
        <div className="grid grid-cols-2 gap-1 p-0.5 bg-slate-900 rounded border border-slate-700">
           <button 
             onClick={() => !isConnected && onProviderChange('AIS')}
             disabled={isConnected}
             className={`text-[10px] py-1 rounded transition-all font-bold ${provider === 'AIS' ? 'bg-lime-500 text-slate-950' : 'text-slate-500 hover:text-slate-300'}`}
           >
             AIS
           </button>
           <button 
             onClick={() => !isConnected && onProviderChange('DTAC')}
             disabled={isConnected}
             className={`text-[10px] py-1 rounded transition-all font-bold ${provider === 'DTAC' ? 'bg-cyan-500 text-slate-950' : 'text-slate-500 hover:text-slate-300'}`}
           >
             DTAC
           </button>
        </div>

        {/* Package Selector (Simulated based on provider) */}
        <div className="bg-slate-900/50 p-1.5 rounded border border-slate-800">
           <div className="text-[8px] text-slate-500 uppercase font-bold mb-1">Active Package</div>
           <div className="flex items-center gap-2 text-[10px] text-slate-200 font-mono">
              <CheckCircle2 size={12} className={provider === 'AIS' ? 'text-lime-400' : 'text-cyan-400'} />
              {provider === 'AIS' ? 'Easy Free Net (Unlimited)' : 'Social Gaming (Turbo)'}
           </div>
        </div>

        {/* Auto Server Output */}
        <div className="bg-slate-900/50 p-1.5 rounded border border-slate-800">
           <div className="text-[8px] text-slate-500 uppercase font-bold mb-1">Assigned Server</div>
           <div className="text-[10px] text-slate-300 font-mono flex items-center justify-between">
              <span>{autoServer}</span>
              {isConnected && <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1 rounded">AUTO-SELECT</span>}
           </div>
        </div>

        <div className="grid grid-cols-2 gap-1 bg-slate-900/50 p-1.5 rounded border border-slate-800">
           <div className="flex flex-col">
              <span className="text-[8px] text-slate-500">Cipher</span>
              <span className="text-[10px] text-slate-300 font-mono">CHACHA20</span>
           </div>
           <div className="flex flex-col">
              <span className="text-[8px] text-slate-500">Mtu</span>
              <span className="text-[10px] text-slate-300 font-mono">1500</span>
           </div>
        </div>
      </div>

      <button 
        onClick={handleConnect}
        disabled={isConnecting}
        className={`w-full mt-2 py-2 rounded flex items-center justify-center gap-2 font-bold text-xs transition-all active:scale-95 ${getBtnBg()}`}
      >
        {isConnecting ? (
          <RefreshCw size={14} className="animate-spin" />
        ) : isConnected ? (
          <Unlock size={14} />
        ) : (
          <Globe size={14} />
        )}
        {isConnecting ? 'AUTO-CONFIGURING...' : isConnected ? 'TERM TUNNEL' : `INIT ${provider} VPN`}
      </button>
    </div>
  );
};

export default VpnPanel;