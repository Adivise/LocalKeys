import React, { useState, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import './KeycapTab.css'; 

export default function KeycapTab({ settings, updateSetting }) {
  // State สำหรับควบคุมการเปิด/ปิด Dropdown
  const [isFontOpen, setIsFontOpen] = useState(false);
  const [isVariantOpen, setIsVariantOpen] = useState(false);
  
  // Ref สำหรับจับการคลิกพื้นที่อื่นเพื่อปิด Dropdown
  const fontRef = useRef(null);
  const variantRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fontRef.current && !fontRef.current.contains(event.target)) setIsFontOpen(false);
      if (variantRef.current && !variantRef.current.contains(event.target)) setIsVariantOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fontOptions = ['Inter', 'Roboto', 'Kanit', 'Prompt', 'Montserrat', 'Poppins', 'Oswald', 'JetBrains Mono', 'Fira Code', 'Arial', 'Tahoma', 'Segoe UI', 'Impact'];
  const variantOptions = ['Full Text', 'Short Text', 'Icon Only'];

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      
      {/* 1. KEYCAP: TEXT */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4">Text</h3>
        <div className="space-y-3">
          
          <div className="bg-zinc-900/50 rounded-xl p-5 border border-zinc-800/50 space-y-4">
            <div className="grid grid-cols-2 gap-4 items-end">
              
              {/* --- 1. Font (Custom Dropdown + Input) --- */}
              <div className="relative" ref={fontRef}>
                <h4 className="text-sm font-medium text-zinc-300 mb-2">Font</h4>
                <div className="relative flex items-center h-[38px]">
                  <input 
                    type="text"
                    value={settings.fontFamily} 
                    onChange={(e) => updateSetting('fontFamily', e.target.value)} 
                    onFocus={() => setIsFontOpen(true)}
                    placeholder="Type local font name..."
                    className="w-full h-full bg-zinc-950 border border-zinc-800 text-white text-sm rounded-lg focus:outline-none focus:border-emerald-500/50 px-3 pr-8 transition-colors"
                    style={{ fontFamily: `"${settings.fontFamily}", sans-serif` }}
                  />
                  <button 
                    onClick={() => setIsFontOpen(!isFontOpen)}
                    className="absolute right-2 p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    <ChevronDown size={14} className={`transition-transform duration-200 ${isFontOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {isFontOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 max-h-48 overflow-y-auto bg-[#0f0f11] border border-zinc-800 rounded-lg shadow-xl z-50 p-1 animate-smooth-fade">
                    {fontOptions.map(font => (
                      <button
                        key={font}
                        onClick={() => {
                          updateSetting('fontFamily', font);
                          setIsFontOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors ${
                          settings.fontFamily === font ? 'bg-emerald-500/10 text-emerald-400' : 'text-zinc-300 hover:bg-zinc-800'
                        }`}
                        style={{ fontFamily: `"${font}", sans-serif` }}
                      >
                        {font}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* --- 2. Size --- */}
              <div>
                <h4 className="text-sm font-medium text-zinc-300 mb-2">Size</h4>
                <div className="flex items-center bg-zinc-950 rounded-lg border border-zinc-800 overflow-hidden w-full h-[38px]">
                  <input type="number" value={settings.fontSize} onChange={(e) => updateSetting('fontSize', Number(e.target.value))} className="flex-1 bg-transparent text-center text-sm text-white focus:outline-none" />
                  <div className="flex flex-col border-l border-zinc-800 h-full w-8">
                    <button onClick={() => updateSetting('fontSize', settings.fontSize + 2)} className="flex-1 flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 text-zinc-400"><ChevronUp size={12}/></button>
                    <button onClick={() => updateSetting('fontSize', settings.fontSize - 2)} className="flex-1 flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border-t border-zinc-800"><ChevronDown size={12}/></button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 items-end">
              
              {/* --- 3. Variant (Custom Dropdown) --- */}
              <div className="relative" ref={variantRef}>
                <h4 className="text-sm font-medium text-zinc-300 mb-2">Variant</h4>
                <div 
                  onClick={() => setIsVariantOpen(!isVariantOpen)}
                  className="flex items-center justify-between w-full h-[38px] bg-zinc-950 border border-zinc-800 text-white text-sm rounded-lg px-3 cursor-pointer hover:border-zinc-700 transition-colors"
                >
                  <span>{settings.variant}</span>
                  <ChevronDown size={14} className={`text-zinc-500 transition-transform duration-200 ${isVariantOpen ? 'rotate-180' : ''}`} />
                </div>

                {isVariantOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f0f11] border border-zinc-800 rounded-lg shadow-xl z-50 p-1 animate-smooth-fade">
                    {variantOptions.map(v => (
                      <button
                        key={v}
                        onClick={() => {
                          updateSetting('variant', v);
                          setIsVariantOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          settings.variant === v ? 'bg-emerald-500/10 text-emerald-400' : 'text-zinc-300 hover:bg-zinc-800'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* --- 4. Text Cap --- */}
              <div>
                <h4 className="text-sm font-medium text-zinc-300 mb-2">Text Cap</h4>
                <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800 w-full justify-between h-[38px]">
                  <button onClick={() => updateSetting('textCap', settings.textCap === 'uppercase' ? 'none' : 'uppercase')} className={`flex-1 flex items-center justify-center text-sm font-medium rounded-md transition-colors ${settings.textCap === 'uppercase' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}>AA</button>
                  <button onClick={() => updateSetting('textCap', settings.textCap === 'capitalize' ? 'none' : 'capitalize')} className={`flex-1 flex items-center justify-center text-sm font-medium rounded-md transition-colors ${settings.textCap === 'capitalize' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}>Aa</button>
                  <button onClick={() => updateSetting('textCap', settings.textCap === 'lowercase' ? 'none' : 'lowercase')} className={`flex-1 flex items-center justify-center text-sm font-medium rounded-md transition-colors ${settings.textCap === 'lowercase' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}>aa</button>
                </div>
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="bg-zinc-900/50 rounded-xl p-5 border border-zinc-800/50 grid grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-zinc-300">Text Color</h4>
              <div className="flex items-center space-x-2 bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800 h-[38px]">
                <input type="color" value={settings.textColor} onChange={(e) => updateSetting('textColor', e.target.value)} className="w-5 h-5 rounded cursor-pointer bg-transparent border-none outline-none" />
                <span className="text-xs font-mono text-zinc-400 uppercase">{settings.textColor}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-zinc-300">Modifier Color</h4>
              <div className="flex items-center space-x-2 bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800 h-[38px]">
                <input type="color" value={settings.modifierTextColor} onChange={(e) => updateSetting('modifierTextColor', e.target.value)} className="w-5 h-5 rounded cursor-pointer bg-transparent border-none outline-none" />
                <span className="text-xs font-mono text-zinc-400 uppercase">{settings.modifierTextColor}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. KEYCAP: LAYOUT */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4">Layout</h3>
        <div className="space-y-3">
          <div className="bg-zinc-900/50 rounded-xl p-5 border border-zinc-800/50 flex items-center justify-between">
            <h4 className="text-sm font-medium text-zinc-300">Icon</h4>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={settings.showIcon} onChange={(e) => updateSetting('showIcon', e.target.checked)} className="sr-only peer" />
              <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          <div className="bg-zinc-900/50 rounded-xl p-5 border border-zinc-800/50 flex items-center justify-between">
            <h4 className="text-sm font-medium text-zinc-300">Alignment</h4>
            <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800">
              <button onClick={() => updateSetting('keyAlignment', 'flex-start')} className={`p-1.5 rounded-md ${settings.keyAlignment === 'flex-start' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}><AlignLeft size={16}/></button>
              <button onClick={() => updateSetting('keyAlignment', 'center')} className={`p-1.5 rounded-md ${settings.keyAlignment === 'center' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}><AlignCenter size={16}/></button>
              <button onClick={() => updateSetting('keyAlignment', 'flex-end')} className={`p-1.5 rounded-md ${settings.keyAlignment === 'flex-end' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}><AlignRight size={16}/></button>
            </div>
          </div>

          <div className="bg-zinc-900/50 rounded-xl p-5 border border-zinc-800/50 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-zinc-300">Press Count</h4>
              <p className="text-xs text-zinc-500 mt-1">Display the number of times a key has been pressed.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={settings.showPressCount} onChange={(e) => updateSetting('showPressCount', e.target.checked)} className="sr-only peer" />
              <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* 3. KEYCAP: COLOR & BORDER */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4">Color & Border</h3>
        <div className="space-y-3">
          
          <div className="bg-zinc-900/50 rounded-xl p-5 border border-zinc-800/50 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-zinc-300">Highlight Modifier</h4>
              <p className="text-xs text-zinc-500 mt-1">Use different color for modifier keys</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={settings.highlightModifier} onChange={(e) => updateSetting('highlightModifier', e.target.checked)} className="sr-only peer" />
              <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          <div className="bg-zinc-900/50 rounded-xl p-5 border border-zinc-800/50">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-zinc-300">Enable Border</h4>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={settings.borderEnable} onChange={(e) => updateSetting('borderEnable', e.target.checked)} className="sr-only peer" />
                  <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-zinc-300">Width</h4>
                <div className="flex items-center bg-zinc-950 rounded-lg border border-zinc-800 overflow-hidden w-24 h-[38px]">
                  <input type="number" value={settings.borderWidth} onChange={(e) => updateSetting('borderWidth', Number(e.target.value))} className="flex-1 w-full bg-transparent text-center text-sm text-white focus:outline-none py-1.5" />
                  <div className="flex flex-col border-l border-zinc-800 h-full w-8">
                    <button onClick={() => updateSetting('borderWidth', settings.borderWidth + 1)} className="flex-1 flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 text-zinc-400"><ChevronUp size={10}/></button>
                    <button onClick={() => updateSetting('borderWidth', Math.max(0, settings.borderWidth - 1))} className="flex-1 flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border-t border-zinc-800"><ChevronDown size={10}/></button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-zinc-300">Color</h4>
                <div className="flex items-center space-x-2 bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800 h-[38px]">
                  <input type="color" value={settings.borderColor} onChange={(e) => updateSetting('borderColor', e.target.value)} className="w-5 h-5 rounded cursor-pointer bg-transparent border-none outline-none" />
                  <span className="text-xs font-mono text-zinc-400 uppercase">{settings.borderColor}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-zinc-300">Modifier Color</h4>
                <div className="flex items-center space-x-2 bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800 h-[38px]">
                  <input type="color" value={settings.borderModifierColor} onChange={(e) => updateSetting('borderModifierColor', e.target.value)} className="w-5 h-5 rounded cursor-pointer bg-transparent border-none outline-none" />
                  <span className="text-xs font-mono text-zinc-400 uppercase">{settings.borderModifierColor}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <h4 className="text-sm font-medium text-zinc-300 w-24">Radius</h4>
              <input type="range" min="0" max="50" value={settings.borderRadius} onChange={(e) => updateSetting('borderRadius', Number(e.target.value))} className="flex-1 custom-range" />
              <span className="text-xs text-zinc-400 font-mono w-8 text-right">{settings.borderRadius}px</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. KEYCAP: BACKGROUND */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4">Background</h3>
        <div className="bg-zinc-900/50 rounded-xl p-5 border border-zinc-800/50 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-zinc-300">Enable Background</h4>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={settings.bgEnable} onChange={(e) => updateSetting('bgEnable', e.target.checked)} className="sr-only peer" />
              <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-zinc-300">Color</h4>
              <div className="flex items-center space-x-2 bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800 h-[38px]">
                <input type="color" value={settings.bgColor} onChange={(e) => updateSetting('bgColor', e.target.value)} className="w-5 h-5 rounded cursor-pointer bg-transparent border-none outline-none" />
                <span className="text-xs font-mono text-zinc-400 uppercase">{settings.bgColor}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between space-x-4">
              <h4 className="text-sm font-medium text-zinc-300">Opacity</h4>
              <input type="range" min="0" max="100" value={settings.bgOpacity} onChange={(e) => updateSetting('bgOpacity', Number(e.target.value))} className="flex-1 custom-range" />
              <span className="text-xs text-zinc-400 font-mono w-8 text-right">{settings.bgOpacity}%</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}