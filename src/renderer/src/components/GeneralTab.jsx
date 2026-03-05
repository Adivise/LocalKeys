import React, { useState } from 'react';
import { Copy, Check, Filter, Layers, ArrowLeftRight, ArrowUpDown, ChevronUp, ChevronDown, Link as LinkIcon, Hash } from 'lucide-react';

export default function GeneralTab({ settings, updateSetting }) {
  const [copied, setCopied] = useState(false);
  
const overlayUrl = (window.location.hostname === 'localhost' && window.location.port !== '28499' && window.location.port !== '')
        ? `http://localhost:${window.location.port}/overlay`
        : `http://localhost:28499/overlay`;

  const handleCopy = () => {
    navigator.clipboard.writeText(overlayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* 1. CONNECTION SECTION */}
      <div>
        <h3 className="text-[13px] font-semibold text-zinc-400 mb-3 px-1">Connection</h3>
        <div className="flex items-center justify-between p-4 bg-zinc-900/40 border border-zinc-800/60 rounded-xl hover:border-zinc-700/50 transition-colors">
          <div className="flex items-start gap-3.5">
            <LinkIcon className="w-5 h-5 text-zinc-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-zinc-200">Browser Source</h4>
              <p className="text-[13px] text-zinc-500 mt-0.5">Copy this URL and add it as a Browser Source in OBS</p>
            </div>
          </div>
          <div className="flex bg-[#09090b] rounded-lg p-1 border border-zinc-800/80 items-center">
            <input type="text" readOnly value={overlayUrl} className="w-56 bg-transparent px-3 text-[13px] text-zinc-400 focus:outline-none font-mono" />
            <button onClick={handleCopy} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${copied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'}`}>
              {copied ? <Check size={14}/> : <Copy size={14}/>}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. BEHAVIOR SECTION */}
      <div>
        <h3 className="text-[13px] font-semibold text-zinc-400 mb-3 px-1">Behavior</h3>
        <div className="space-y-2.5">
          
          <div className="flex items-center justify-between p-4 bg-zinc-900/40 border border-zinc-800/60 rounded-xl hover:border-zinc-700/50 transition-colors">
            <div className="flex items-start gap-3.5">
              <Filter className="w-5 h-5 text-zinc-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-zinc-200">Filter</h4>
                <p className="text-[13px] text-zinc-500 mt-0.5">
                  {settings.filterType === 'off' && "Show all key presses."}
                  {settings.filterType === 'hotkeys' && "Only show shortcuts and modifiers."}
                  {settings.filterType === 'custom' && "Custom filter applied."}
                </p>
              </div>
            </div>
            <div className="flex bg-[#09090b] p-1 rounded-lg border border-zinc-800/80 shrink-0">
              {['off', 'hotkeys', 'custom'].map(t => (
                <button key={t} onClick={() => updateSetting('filterType', t)} className={`px-3 py-1.5 rounded-md text-[13px] font-medium capitalize transition-colors ${settings.filterType === t ? 'bg-zinc-800 text-zinc-200 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}>{t}</button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-zinc-900/40 border border-zinc-800/60 rounded-xl hover:border-zinc-700/50 transition-colors">
            <div className="flex items-start gap-3.5">
              <Layers className="w-5 h-5 text-zinc-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-zinc-200">History</h4>
                <p className="text-[13px] text-zinc-500 mt-0.5">Keep previously pressed keystrokes in the view</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input type="checkbox" checked={settings.enableHistory} onChange={(e) => updateSetting('enableHistory', e.target.checked)} className="sr-only peer" />
              <div className="w-10 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          <div className={`flex items-center justify-between p-4 bg-zinc-900/40 border border-zinc-800/60 rounded-xl transition-all ${!settings.enableHistory ? 'opacity-40 grayscale pointer-events-none' : 'hover:border-zinc-700/50'}`}>
            <div className="flex items-start gap-3.5">
              <ArrowLeftRight className="w-5 h-5 text-zinc-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-zinc-200">Direction</h4>
                <p className="text-[13px] text-zinc-500 mt-0.5">Layout direction for history blocks</p>
              </div>
            </div>
            <div className="flex bg-[#09090b] p-1 rounded-lg border border-zinc-800/80 shrink-0">
              <button onClick={() => updateSetting('direction', 'row')} className={`px-3 py-1.5 rounded-md text-[13px] font-medium flex items-center gap-1.5 transition-colors ${settings.direction === 'row' ? 'bg-zinc-800 text-zinc-200 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}><ArrowLeftRight size={14}/> Row</button>
              <button onClick={() => updateSetting('direction', 'column')} className={`px-3 py-1.5 rounded-md text-[13px] font-medium flex items-center gap-1.5 transition-colors ${settings.direction === 'column' ? 'bg-zinc-800 text-zinc-200 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}><ArrowUpDown size={14}/> Column</button>
            </div>
          </div>

          <div className={`flex items-center justify-between p-4 bg-zinc-900/40 border border-zinc-800/60 rounded-xl transition-all ${!settings.enableHistory ? 'opacity-40 grayscale pointer-events-none' : 'hover:border-zinc-700/50'}`}>
            <div className="flex items-start gap-3.5">
              <Hash className="w-5 h-5 text-zinc-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-zinc-200">Max Count</h4>
                <p className="text-[13px] text-zinc-500 mt-0.5">Maximum number of keys on screen</p>
              </div>
            </div>
            <div className="flex items-center bg-[#09090b] border border-zinc-800/80 rounded-lg overflow-hidden w-[80px] h-10 shrink-0">
              <input type="number" value={settings.maxCount} onChange={(e) => updateSetting('maxCount', Number(e.target.value))} className="flex-1 bg-transparent text-center text-sm text-zinc-200 focus:outline-none" min="1" max="20" />
              <div className="flex flex-col border-l border-zinc-800/80 h-full w-[26px]">
                <button onClick={() => updateSetting('maxCount', Math.min(20, settings.maxCount + 1))} className="flex-1 flex items-center justify-center bg-zinc-900/30 hover:bg-zinc-800 text-zinc-400 transition-colors"><ChevronUp size={12}/></button>
                <button onClick={() => updateSetting('maxCount', Math.max(1, settings.maxCount - 1))} className="flex-1 flex items-center justify-center bg-zinc-900/30 hover:bg-zinc-800 text-zinc-400 border-t border-zinc-800/80 transition-colors"><ChevronDown size={12}/></button>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}