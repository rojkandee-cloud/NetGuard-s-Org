import React from 'react';
import { AccessRequest } from '../types';
import { Facebook, Check, X, User, Wifi } from 'lucide-react';

interface AccessControlProps {
  requests: AccessRequest[];
  onApprove: (id: string) => void;
  onDeny: (id: string) => void;
}

const AccessControl: React.FC<AccessControlProps> = ({ requests, onApprove, onDeny }) => {
  const pendingRequests = requests.filter(r => r.status === 'PENDING');
  const authorizedCount = requests.filter(r => r.status === 'APPROVED').length;

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden shadow-lg flex flex-col h-full">
      <div className="p-2 border-b border-slate-700 bg-slate-900/50 flex justify-between items-center">
        <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
          <Wifi className="text-cyan-400 w-4 h-4" /> NAC
        </h2>
        <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded-full">
          {authorizedCount} Allowed
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-hide bg-gradient-to-b from-slate-800 to-slate-900">
        {pendingRequests.length === 0 ? (
          <div className="text-center text-slate-600 py-4 border border-dashed border-slate-700 rounded-lg">
            <User className="w-6 h-6 mx-auto mb-1 opacity-20" />
            <p className="text-[10px]">No pending requests</p>
          </div>
        ) : (
          pendingRequests.map(req => (
            <div key={req.id} className="bg-slate-800 border border-slate-600 p-2 rounded shadow-md animate-in slide-in-from-right duration-300">
              <div className="flex justify-between items-start mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
                    <Facebook size={12} fill="white" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="font-semibold text-xs text-slate-200 truncate">{req.userName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{req.ipAddress}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-1">
                <button 
                  onClick={() => onApprove(req.id)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] py-1 rounded flex items-center justify-center gap-1 transition-colors"
                >
                  <Check size={10} /> Allow
                </button>
                <button 
                  onClick={() => onDeny(req.id)}
                  className="flex-1 bg-rose-600 hover:bg-rose-500 text-white text-[10px] py-1 rounded flex items-center justify-center gap-1 transition-colors"
                >
                  <X size={10} /> Deny
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AccessControl;