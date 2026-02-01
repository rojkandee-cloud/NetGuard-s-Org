import React, { useState, useEffect, useCallback } from 'react';
import { generatePacket, generateAccessRequest } from './services/trafficGenerator';
import { analyzeThreat } from './services/geminiService';
import { TrafficPacket, GeminiAnalysisResult, AccessRequest, PacketStatus, VpnProvider } from './types';
import TrafficTable from './components/TrafficTable';
import StatsPanel from './components/StatsPanel';
import RuleManager from './components/RuleManager';
import AccessControl from './components/AccessControl';
import FirewallPanel from './components/FirewallPanel';
import VpnPanel from './components/VpnPanel';
import { Bot, AlertTriangle, X, Power, Settings, Smartphone, Zap, Cpu, Globe } from 'lucide-react';

const MAX_LOG_SIZE = 100;

export default function App() {
  const [traffic, setTraffic] = useState<TrafficPacket[]>([]);
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [blocklist, setBlocklist] = useState<string[]>(['doubleclick', 'analytics', 'ads', 'tracker', 'googlesyndication']);
  const [blockedPorts, setBlockedPorts] = useState<number[]>([22, 21]); 
  const [strictMode, setStrictMode] = useState(true); // DPI Filtering
  const [adShield, setAdShield] = useState(true); // YouTube Shield
  const [runOnStartup, setRunOnStartup] = useState(true);
  const [backgroundMode, setBackgroundMode] = useState(true);
  
  const [isSimulating, setIsSimulating] = useState(true);
  const [isVpnConnected, setIsVpnConnected] = useState(false);
  const [vpnProvider, setVpnProvider] = useState<VpnProvider>('AIS');
  const [selectedPacket, setSelectedPacket] = useState<TrafficPacket | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<GeminiAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [bootTime] = useState(new Date().toLocaleTimeString());

  // Simulation Loop
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      const newPacket = generatePacket(blocklist, blockedPorts, isVpnConnected, vpnProvider);
      
      // YouTube AdShield Logic: High-priority filtering
      if (adShield && newPacket.category === 'Ad') {
          newPacket.status = PacketStatus.BLOCKED;
          newPacket.riskScore = 95;
      }

      // DPI (Strict) Mode Logic: Block anything suspicious or Tracker-heavy
      if (strictMode && newPacket.status !== PacketStatus.BLOCKED) {
          if (newPacket.category === 'Tracker' || newPacket.riskScore > 40) {
              newPacket.status = PacketStatus.BLOCKED;
          }
      }

      setTraffic(prev => {
        const updated = [...prev, newPacket];
        return updated.length > MAX_LOG_SIZE ? updated.slice(updated.length - MAX_LOG_SIZE) : updated;
      });

      if (Math.random() < 0.05) { 
        setAccessRequests(prev => [generateAccessRequest(), ...prev].slice(0, 10)); 
      }

    }, 800);

    return () => clearInterval(interval);
  }, [isSimulating, blocklist, blockedPorts, strictMode, adShield, isVpnConnected, vpnProvider]);

  // Handlers
  const handleAddRule = (rule: string) => {
    if (!blocklist.includes(rule)) setBlocklist(prev => [...prev, rule]);
  };

  const handleRemoveRule = (rule: string) => {
    setBlocklist(prev => prev.filter(r => r !== rule));
  };

  const handleTogglePort = (port: number) => {
    setBlockedPorts(prev => 
      prev.includes(port) ? prev.filter(p => p !== port) : [...prev, port]
    );
  };

  const handleApproveAccess = (id: string) => {
    setAccessRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'APPROVED' } : req));
  };

  const handleDenyAccess = (id: string) => {
    setAccessRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'DENIED' } : req));
  };

  const handleAnalyze = useCallback(async (packet: TrafficPacket) => {
    setSelectedPacket(packet);
    setIsAnalyzing(true);
    setAiAnalysis(null);
    const result = await analyzeThreat(packet.destinationDomain, packet.category);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  }, []);

  const closeAnalysis = () => {
    setSelectedPacket(null);
    setAiAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-10 font-sans flex flex-col text-sm overflow-hidden h-screen transition-colors duration-700">
      <header className="px-3 py-2 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 shrink-0 z-30">
        <div className="max-w-[1920px] mx-auto flex justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
              <Zap className="text-yellow-400 w-5 h-5" />
              <span className="hidden sm:inline">NetGuard AI Sentinel</span>
              <span className="sm:hidden">NG-AI</span>
            </h1>
            {isVpnConnected && (
                <div className={`flex items-center gap-1.5 px-2 py-0.5 border rounded text-[10px] font-bold animate-pulse transition-all duration-500 ${vpnProvider === 'AIS' ? 'bg-lime-500/10 border-lime-500/30 text-lime-400' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'}`}>
                    <Globe size={10} /> {vpnProvider} TUNNEL
                </div>
            )}
            {adShield && (
              <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/30 rounded text-yellow-500 text-[10px] font-bold">
                 AD-SHIELD: ON
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
             <div className="hidden lg:flex items-center gap-3 text-[10px] text-slate-500 mr-2 bg-slate-900 py-1 px-2 rounded border border-slate-800">
                <span>Boot: {bootTime}</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Live</span>
             </div>
             
             <div className="flex items-center gap-2">
                <button onClick={() => setRunOnStartup(!runOnStartup)} className={`p-1.5 rounded transition-colors ${runOnStartup ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500'}`} title="Settings"><Settings size={14} /></button>
                <button onClick={() => setIsSimulating(!isSimulating)} className={`px-2 py-1 rounded font-medium transition-all text-xs border flex items-center gap-1 ${isSimulating ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/50' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                  <Power size={12} /> {isSimulating ? 'RUN' : 'STOP'}
                </button>
             </div>
          </div>
        </div>
      </header>

      <div className="flex-1 p-2 overflow-hidden flex flex-col gap-2">
        <div className="max-w-[1920px] mx-auto w-full flex-1 flex flex-col gap-2 min-h-0">
          <StatsPanel traffic={traffic} />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2 flex-1 min-h-0 overflow-hidden">
            <div className="xl:col-span-1 flex flex-col gap-2 min-h-0 overflow-hidden">
              <div className="h-1/2 min-h-0">
                  <VpnPanel isConnected={isVpnConnected} onToggle={setIsVpnConnected} provider={vpnProvider} onProviderChange={setVpnProvider} />
              </div>
              <div className="h-1/2 min-h-0">
                  <FirewallPanel 
                      blockedPorts={blockedPorts} 
                      onTogglePort={handleTogglePort}
                      strictMode={strictMode}
                      setStrictMode={setStrictMode}
                      adShield={adShield}
                      setAdShield={setAdShield}
                  />
              </div>
            </div>

            <div className="xl:col-span-2 h-full min-h-0 flex flex-col">
              <TrafficTable traffic={traffic} onAnalyze={handleAnalyze} />
            </div>

            <div className="xl:col-span-1 flex flex-col gap-2 h-full min-h-0">
                <div className="h-3/5 min-h-0">
                    <AccessControl requests={accessRequests} onApprove={handleApproveAccess} onDeny={handleDenyAccess} />
                </div>
                <div className="h-2/5 min-h-0">
                    <RuleManager rules={blocklist} onAddRule={handleAddRule} onRemoveRule={handleRemoveRule} />
                </div>
            </div>
          </div>
        </div>
      </div>

      {selectedPacket && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-3 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-base font-semibold flex items-center gap-2 text-indigo-400"><Bot size={18} /> Deep Analysis</h3>
              <button onClick={closeAnalysis} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-4">
              <div className="mb-3 grid grid-cols-2 gap-2">
                <div>
                    <div className="text-[10px] text-slate-500 uppercase mb-0.5">Application</div>
                    <div className="text-xs font-mono text-emerald-400 bg-slate-950 p-1.5 rounded border border-slate-800 flex items-center gap-1"><Cpu size={12}/>{selectedPacket.processName}</div>
                </div>
                <div>
                    <div className="text-[10px] text-slate-500 uppercase mb-0.5">Endpoint</div>
                    <div className="text-xs font-mono text-slate-200 bg-slate-950 p-1.5 rounded border border-slate-800 truncate">{selectedPacket.destinationDomain}</div>
                </div>
              </div>
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-6 space-y-2">
                  <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs text-indigo-300 animate-pulse">Analyzing Packet Headers...</p>
                </div>
              ) : aiAnalysis ? (
                <div className="space-y-3">
                   <div className={`px-2 py-0.5 rounded text-xs font-bold border inline-block ${aiAnalysis.threatLevel === 'High' ? 'bg-rose-500/20 text-rose-400 border-rose-500/50' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'}`}>Threat: {aiAnalysis.threatLevel}</div>
                   <div className="bg-slate-800/50 p-2 rounded border border-slate-700/50 text-slate-400 text-xs leading-relaxed">{aiAnalysis.explanation}</div>
                   <div className="flex items-start gap-2 bg-indigo-500/10 p-2 rounded border border-indigo-500/20">
                      <AlertTriangle className="w-3 h-3 text-indigo-400 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-semibold text-indigo-300">Action</h4>
                        <p className="text-indigo-200/80 text-xs">{aiAnalysis.recommendation}</p>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="text-rose-400 text-center text-xs">Error in deep analysis engine.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}