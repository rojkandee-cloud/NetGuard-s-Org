import React, { useState } from 'react';
import { Plus, Trash2, Shield } from 'lucide-react';

interface RuleManagerProps {
  rules: string[];
  onAddRule: (rule: string) => void;
  onRemoveRule: (rule: string) => void;
}

const RuleManager: React.FC<RuleManagerProps> = ({ rules, onAddRule, onRemoveRule }) => {
  const [newRule, setNewRule] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRule.trim()) {
      onAddRule(newRule.trim());
      setNewRule('');
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-2 h-full">
      <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-1.5">
        <Shield className="text-amber-500 w-4 h-4" />
        <h2 className="text-sm font-semibold text-slate-100">Blocklist</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-1 mb-2">
        <input
          type="text"
          value={newRule}
          onChange={(e) => setNewRule(e.target.value)}
          placeholder="Add domain..."
          className="flex-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded p-1.5 focus:ring-1 focus:ring-amber-500 outline-none"
        />
        <button 
          type="submit"
          className="bg-amber-600 hover:bg-amber-700 text-white p-1.5 rounded transition-colors"
        >
          <Plus size={14} />
        </button>
      </form>

      <div className="space-y-1 max-h-[400px] overflow-y-auto scrollbar-hide">
        {rules.map((rule, idx) => (
          <div key={`${rule}-${idx}`} className="flex justify-between items-center bg-slate-900/50 p-1.5 rounded border border-slate-700/50 group">
            <span className="text-slate-300 font-mono text-[10px] truncate">{rule}</span>
            <button
              onClick={() => onRemoveRule(rule)}
              className="text-slate-500 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={10} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RuleManager;