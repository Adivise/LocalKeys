import React from 'react';
import { MousePointer2, Move, ChevronUp, ChevronDown } from 'lucide-react';

export default function MouseTab({ settings, updateSetting }) {
  return (
    <div className="space-y-10 animate-fade-in pb-10">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4">Event</h3>
        <div className="space-y-3">
          
          {/* Drag Threshold */}
          <div className="bg-zinc-900/50 rounded-xl p-5 border border-zinc-800/50 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-zinc-300 flex items-center"><Move size={14} className="mr-2 text-zinc-400"/> Drag Threshold</h4>
              <p className="text-xs text-zinc-500 mt-1">Minimum distance in pixels to show Drag event</p>
            </div>
            <div className="flex items-center bg-zinc-950 rounded-lg border border-zinc-800 overflow-hidden w-24">
              <input type="number" value={settings.dragThreshold} onChange={(e) => updateSetting('dragThreshold', Number(e.target.value))} className="flex-1 bg-transparent text-center text-sm text-white focus:outline-none py-1.5" />
              <div className="flex flex-col border-l border-zinc-800">
                <button onClick={() => updateSetting('dragThreshold', settings.dragThreshold + 10)} className="px-2 py-[2px] bg-zinc-900 hover:bg-zinc-800 text-zinc-400 transition-colors"><ChevronUp size={10}/></button>
                <button onClick={() => updateSetting('dragThreshold', Math.max(10, settings.dragThreshold - 10))} className="px-2 py-[2px] bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border-t border-zinc-800 transition-colors"><ChevronDown size={10}/></button>
              </div>
            </div>
          </div>

          {/* Mouse Events */}
          <div className="bg-zinc-900/50 rounded-xl p-5 border border-zinc-800/50 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-zinc-300 flex items-center"><MousePointer2 size={14} className="mr-2 text-zinc-400"/> Mouse Events</h4>
              <p className="text-xs text-zinc-500 mt-1">Visualize mouse events like click, drag, etc.<br/>along with key events</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={settings.showMouse} onChange={(e) => updateSetting('showMouse', e.target.checked)} className="sr-only peer" />
              <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

        </div>
      </div>
    </div>
  );
}