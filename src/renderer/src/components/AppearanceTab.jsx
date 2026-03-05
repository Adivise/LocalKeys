import React, { useState, useRef, useEffect } from 'react';
import { AlignLeft, Move, Link2, Unlink, Clock, Layers, FastForward, ArrowUpLeft, ArrowUp, ArrowUpRight, ArrowLeft, Circle, ArrowRight, ArrowDownLeft, ArrowDown, ArrowDownRight, ChevronUp, ChevronDown } from 'lucide-react';
import './AppearanceTab.css';

export default function AppearanceTab({ settings, updateSetting }) {
  
  const [isEffectOpen, setIsEffectOpen] = useState(false);
  const effectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (effectRef.current && !effectRef.current.contains(event.target)) {
        setIsEffectOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarginChange = (axis, value) => {
    let val = Number(value);
    if (settings.marginLinked) {
      updateSetting('marginX', val); updateSetting('marginY', val);
    } else {
      updateSetting(axis === 'x' ? 'marginX' : 'marginY', val);
    }
  };

  const getGridIcon = (pos) => {
    const iconClass = "text-zinc-200";
    const size = 16;
    switch(pos) {
      case 'top-left': return <ArrowUpLeft size={size} className={iconClass}/>;
      case 'top-center': return <ArrowUp size={size} className={iconClass}/>;
      case 'top-right': return <ArrowUpRight size={size} className={iconClass}/>;
      case 'center-left': return <ArrowLeft size={size} className={iconClass}/>;
      case 'center': return <Circle size={10} className={`${iconClass} fill-zinc-200`}/>;
      case 'center-right': return <ArrowRight size={size} className={iconClass}/>;
      case 'bottom-left': return <ArrowDownLeft size={size} className={iconClass}/>;
      case 'bottom-center': return <ArrowDown size={size} className={iconClass}/>;
      case 'bottom-right': return <ArrowDownRight size={size} className={iconClass}/>;
      default: return null;
    }
  };

  const positions = ['top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right'];
  const effectOptions = [{ value: 'bounce', label: 'Bounce' }, { value: 'fade', label: 'Fade In' }];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* 1. POSITION SECTION */}
      <div>
        <h3 className="text-[13px] font-semibold text-zinc-400 mb-3 px-1">Position</h3>
        <div className="space-y-2.5">
          
          {/* Alignment Row */}
          <div className="flex items-center justify-between p-4 bg-zinc-900/40 border border-zinc-800/60 rounded-xl hover:border-zinc-700/50 transition-colors">
            <div className="flex items-start gap-3.5">
              <AlignLeft className="w-5 h-5 text-zinc-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-zinc-200">Alignment</h4>
                <p className="text-[13px] text-zinc-500 mt-0.5">Position of the key visualization on the screen</p>
              </div>
            </div>
            
            <div className="w-[88px] h-[88px] bg-[#09090b] border border-zinc-800/80 rounded-xl p-1.5 grid grid-cols-3 gap-1 shrink-0">
              {positions.map(pos => (
                <button 
                  key={pos} 
                  onClick={() => updateSetting('position', pos)} 
                  className={`flex items-center justify-center rounded-lg transition-all ${settings.position === pos ? 'bg-zinc-800 shadow-sm' : 'hover:bg-zinc-900'}`}
                >
                  {settings.position === pos ? getGridIcon(pos) : <div className="w-[3px] h-[3px] rounded-full bg-zinc-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Margin Row */}
          <div className="flex items-center justify-between p-4 bg-zinc-900/40 border border-zinc-800/60 rounded-xl hover:border-zinc-700/50 transition-colors">
            <div className="flex items-start gap-3.5">
              <Move className="w-5 h-5 text-zinc-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-zinc-200">Margin</h4>
                <p className="text-[13px] text-zinc-500 mt-0.5">Space from the edge of the screen</p>
              </div>
            </div>
            
            <div className="flex items-center bg-[#09090b] border border-zinc-800/80 rounded-lg p-1 h-10 shrink-0">
              <span className="text-[11px] font-bold text-zinc-500 px-2">X</span>
              <input type="number" value={settings.marginX} onChange={(e) => handleMarginChange('x', e.target.value)} className="w-12 bg-transparent text-center text-sm text-zinc-200 focus:outline-none" />
              <button onClick={() => updateSetting('marginLinked', !settings.marginLinked)} className={`p-1.5 rounded-md transition-colors ${settings.marginLinked ? 'bg-zinc-800 text-zinc-200 shadow-sm' : 'text-zinc-600 hover:text-zinc-400'}`}>
                {settings.marginLinked ? <Link2 size={14}/> : <Unlink size={14}/>}
              </button>
              <span className="text-[11px] font-bold text-zinc-500 px-2">Y</span>
              <input type="number" value={settings.marginY} onChange={(e) => handleMarginChange('y', e.target.value)} className="w-12 bg-transparent text-center text-sm text-zinc-200 focus:outline-none" />
            </div>
          </div>

        </div>
      </div>

      {/* 2. ANIMATION SECTION */}
      <div>
        <h3 className="text-[13px] font-semibold text-zinc-400 mb-3 px-1">Animation</h3>
        <div className="space-y-2.5">
          
          {/* Duration Row */}
          <div className="flex items-center justify-between p-4 bg-zinc-900/40 border border-zinc-800/60 rounded-xl hover:border-zinc-700/50 transition-colors">
            <div className="flex items-start gap-3.5">
              <Clock className="w-5 h-5 text-zinc-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-zinc-200">Duration</h4>
                <p className="text-[13px] text-zinc-500 mt-0.5">The duration keys stay on screen (in seconds)</p>
              </div>
            </div>
            
            <div className="flex items-center bg-[#09090b] border border-zinc-800/80 rounded-lg overflow-hidden w-[100px] h-10 shrink-0">
              <input type="number" value={settings.duration} onChange={(e) => updateSetting('duration', Number(e.target.value))} className="flex-1 bg-transparent text-center text-sm text-zinc-200 focus:outline-none" min="1" max="20" />
              <div className="flex flex-col border-l border-zinc-800/80 h-full w-[26px]">
                <button onClick={() => updateSetting('duration', Math.min(20, settings.duration + 1))} className="flex-1 flex items-center justify-center bg-zinc-900/30 hover:bg-zinc-800 text-zinc-400 transition-colors"><ChevronUp size={12}/></button>
                <button onClick={() => updateSetting('duration', Math.max(1, settings.duration - 1))} className="flex-1 flex items-center justify-center bg-zinc-900/30 hover:bg-zinc-800 text-zinc-400 border-t border-zinc-800/80 transition-colors"><ChevronDown size={12}/></button>
              </div>
            </div>
          </div>

          {/* Animation Effect Row */}
          <div className="flex items-center justify-between p-4 bg-zinc-900/40 border border-zinc-800/60 rounded-xl hover:border-zinc-700/50 transition-colors">
            <div className="flex items-start gap-3.5">
              <Layers className="w-5 h-5 text-zinc-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-zinc-200">Animation</h4>
              </div>
            </div>
            
            <div className="relative w-[130px] shrink-0" ref={effectRef}>
              <div 
                onClick={() => setIsEffectOpen(!isEffectOpen)}
                className={`flex items-center justify-between w-full h-10 bg-[#09090b] border text-zinc-200 text-sm rounded-lg px-3 cursor-pointer transition-colors ${isEffectOpen ? 'border-zinc-700' : 'border-zinc-800/80 hover:border-zinc-700/80'}`}
              >
                <span>{settings.animation === 'bounce' ? 'Bounce' : 'Fade In'}</span>
                <ChevronDown size={14} className={`text-zinc-500 transition-transform duration-200 ${isEffectOpen ? 'rotate-180' : ''}`} />
              </div>

              {isEffectOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#121214] border border-zinc-800/80 rounded-lg shadow-xl z-50 p-1.5 animate-smooth-fade">
                  {effectOptions.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        updateSetting('animation', opt.value);
                        setIsEffectOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-[13px] transition-colors ${
                        settings.animation === opt.value 
                          ? 'bg-zinc-800 text-zinc-100 font-medium' 
                          : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Animation Speed Row */}
          <div className="flex items-center justify-between p-4 bg-zinc-900/40 border border-zinc-800/60 rounded-xl hover:border-zinc-700/50 transition-colors">
            <div className="flex items-start gap-3.5">
              <FastForward className="w-5 h-5 text-zinc-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-zinc-200">Animation Speed</h4>
                <p className="text-[13px] text-zinc-500 mt-0.5">Higher the value, slower the animation</p>
              </div>
            </div>
            
            <div className="flex items-center bg-[#09090b] border border-zinc-800/80 rounded-lg overflow-hidden w-[100px] h-10 shrink-0">
              <input type="number" step="0.5" value={settings.animationSpeed} onChange={(e) => updateSetting('animationSpeed', Number(e.target.value))} className="flex-1 bg-transparent text-center text-sm text-zinc-200 focus:outline-none" min="0.1" max="5" />
              <div className="flex flex-col border-l border-zinc-800/80 h-full w-[26px]">
                <button onClick={() => updateSetting('animationSpeed', settings.animationSpeed + 0.5)} className="flex-1 flex items-center justify-center bg-zinc-900/30 hover:bg-zinc-800 text-zinc-400 transition-colors"><ChevronUp size={12}/></button>
                <button onClick={() => updateSetting('animationSpeed', Math.max(0.1, settings.animationSpeed - 0.5))} className="flex-1 flex items-center justify-center bg-zinc-900/30 hover:bg-zinc-800 text-zinc-400 border-t border-zinc-800/80 transition-colors"><ChevronDown size={12}/></button>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}