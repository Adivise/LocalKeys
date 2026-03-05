import React, { useState, useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { Keyboard, Settings as SettingsIcon, Palette, Monitor, MousePointer2, Type, ChevronUp, ChevronDown, Lock } from 'lucide-react';

import GeneralTab from './components/GeneralTab';
import AppearanceTab from './components/AppearanceTab';
import KeycapTab from './components/KeycapTab';
import MouseTab from './components/MouseTab';

import { useKeyCapture } from './hooks/useKeyCapture';
import KeyDisplay from './components/KeyDisplay';

function MainApp() {
  const [activeTab, setActiveTab] = useState('general');
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);
  
  const [hasLoaded, setHasLoaded] = useState(false); 
  const [settings, setSettings] = useState({
    position: 'bottom-left', marginX: 100, marginY: 100, marginLinked: true,
    duration: 5, animationSpeed: 1, animation: 'smoothPop',
    filterType: 'off', enableHistory: true, direction: 'row', maxCount: 4, showMouse: true, dragThreshold: 50,
    fontFamily: 'Inter', fontSize: 48, textCap: 'none', textColor: '#ffffff', modifierTextColor: '#3a86ff', highlightModifier: true,
    variant: 'Short Text', showIcon: true, keyAlignment: 'center', showPressCount: true,
    borderEnable: true, borderWidth: 2, borderColor: '#3f3f46', borderModifierColor: '#3a86ff', borderRadius: 12,
    bgEnable: true, bgColor: '#18181b', bgOpacity: 80
  });

  const isElectron = !!window.electronAPI || /electron/i.test(navigator.userAgent) || window.location.protocol === 'file:';

  useEffect(() => {
    if (isElectron && window.electronAPI.getSettings) {
      window.electronAPI.getSettings().then((savedSettings) => {
        if (savedSettings) {
          setSettings(savedSettings);
        }
        setHasLoaded(true);
      });
    } else {
      setHasLoaded(true);
    }
  }, [isElectron]);

  const { activeKeys, isOverlay } = useKeyCapture(settings, setSettings, hasLoaded);
  
  const updateSetting = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));

  const fontImportUrl = ['Inter', 'Roboto', 'Montserrat', 'Poppins', 'Oswald', 'JetBrains Mono', 'Fira Code', 'Kanit', 'Prompt'].includes(settings.fontFamily) 
    ? `https://fonts.googleapis.com/css2?family=${settings.fontFamily.replace(/ /g, '+')}:wght@400;700&display=swap`
    : '';

  if (isOverlay) {
    return (
      <div className="w-screen h-screen overflow-hidden bg-transparent">
        <style>{`
          ${fontImportUrl ? `@import url('${fontImportUrl}');` : ''}
          .combo-container { transition: all 0.2s cubic-bezier(0.25, 1, 0.5, 1); }
          body { background-color: transparent !important; }
        `}</style>
        <KeyDisplay activeKeys={activeKeys} settings={settings} scale={1} />
      </div>
    );
  }

  if (!isElectron) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#09090b] text-white font-sans">
        <Lock className="w-16 h-16 text-zinc-700 mb-6 drop-shadow-lg" />
        <h1 className="text-3xl font-bold tracking-tight mb-3 text-zinc-200">Access Restricted</h1>
        <p className="text-zinc-400 text-sm max-w-sm text-center mb-6">
          The settings dashboard can only be accessed from within the <span className="text-emerald-400 font-semibold">LocalKeys Desktop App</span>.
        </p>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-center max-w-md">
          <p className="text-zinc-500 text-xs uppercase tracking-wider mb-2 font-semibold">Allowed Browser Sources</p>
          <code className="text-emerald-400 text-[13px] bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800">
            http://localhost:28499/overlay
          </code>
        </div>
      </div>
    );
  }

  if (!hasLoaded) {
    return <div className="h-screen w-screen bg-[#09090b]"></div>;
  }

  return (
    <div className="h-screen bg-[#09090b] text-white flex flex-col font-sans overflow-hidden select-none">
      <style>{`
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        ${fontImportUrl ? `@import url('${fontImportUrl}');` : ''}
      `}</style>

      <div className="flex flex-1 overflow-hidden pt-4">
        <div className="w-56 flex flex-col space-y-2 px-4 py-4 bg-[#09090b] border-r border-zinc-800/50">
          <div className="mb-8 px-2">
            <h1 className="text-lg font-bold tracking-wide text-zinc-100 flex items-center gap-2">
              <Keyboard className="w-5 h-5 text-emerald-500" /> LocalKeys
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">Browser Overlay</p>
          </div>
          <nav className="flex-1 space-y-1">
            {[
              { id: 'general', label: 'General', icon: SettingsIcon },
              { id: 'appearance', label: 'Appearance', icon: Palette },
              { id: 'keycap', label: 'Keycap', icon: Type },
              { id: 'mouse', label: 'Mouse', icon: MousePointer2 },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all border-l-2 relative ${
                  activeTab === tab.id 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500' 
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border-transparent'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 flex flex-col bg-[#0f0f11] overflow-hidden">
          <div className="flex-1 overflow-y-auto p-10">
            <div className="max-w-3xl">
              <header className="mb-10">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-100 capitalize">
                  {activeTab}
                </h2>
              </header>
              <div className="space-y-6">
                {activeTab === 'general' && <GeneralTab settings={settings} updateSetting={updateSetting} />}
                {activeTab === 'appearance' && <AppearanceTab settings={settings} updateSetting={updateSetting} />}
                {activeTab === 'keycap' && <KeycapTab settings={settings} updateSetting={updateSetting} />}
                {activeTab === 'mouse' && <MouseTab settings={settings} updateSetting={updateSetting} />}
              </div>
            </div>
          </div>

          <div className={`border-t border-zinc-800/50 bg-[#09090b] shrink-0 flex flex-col relative transition-all duration-300 ${isPreviewOpen ? 'p-6 h-72' : 'p-4 h-auto'}`}>
            <div className={`flex items-center justify-between ${isPreviewOpen ? 'mb-4' : ''}`}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex items-center">
                <Monitor className="mr-2 w-3 h-3" /> Live Preview
              </h3>
              <button onClick={() => setIsPreviewOpen(!isPreviewOpen)} className="p-1 rounded-md hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors">
                {isPreviewOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </button>
            </div>
            
            {isPreviewOpen && (
              <div className="w-full h-full bg-zinc-900/30 rounded-lg border border-zinc-800 relative overflow-hidden flex">
                 <KeyDisplay activeKeys={activeKeys} settings={settings} scale={0.5} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Root() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}