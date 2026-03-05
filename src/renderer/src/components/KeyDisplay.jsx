import React from 'react';
import { 
  MousePointer2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, 
  Delete, CornerDownLeft, Command, ArrowUpToLine,
  ArrowRightToLine, ChevronsUp, ChevronsDown, ArrowUpFromLine, 
  ArrowDownToLine, XSquare, PlusSquare, XCircle
} from 'lucide-react';

export default function KeyDisplay({ activeKeys, settings, scale = 1 }) {
  const F = settings.fontSize * scale;
  const S = scale;

  const getContainerStyles = () => {
    const [y, x] = settings.position.split('-');
    const isColumn = settings.enableHistory && settings.direction === 'column';
    
    let styles = {
      padding: `${settings.marginY * S}px ${settings.marginX * S}px`,
      gap: `${settings.fontSize * 0.3 * S}px`,
      display: 'flex',
    };

    if (!isColumn) {
      styles.flexDirection = 'row';
      styles.flexWrap = 'wrap';
      const alignX = x || (settings.position === 'center' ? 'center' : 'left');
      const alignY = y || 'center';
      styles.justifyContent = alignX === 'left' ? 'flex-start' : alignX === 'right' ? 'flex-end' : 'center';
      styles.alignItems = alignY === 'top' ? 'flex-start' : alignY === 'bottom' ? 'flex-end' : 'center';
      styles.alignContent = styles.alignItems;
    } else {
      styles.flexDirection = 'column-reverse'; 
      const alignX = x || (settings.position === 'center' ? 'center' : 'left');
      const alignY = y || 'center';
      styles.alignItems = alignX === 'left' ? 'flex-start' : alignX === 'right' ? 'flex-end' : 'center';
      styles.justifyContent = alignY === 'top' ? 'flex-end' : 'flex-start'; 
    }

    return styles;
  };

  const hexToRgba = (hex, opacity) => {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const r = parseInt(hex.substring(0, 2), 16) || 0;
    const g = parseInt(hex.substring(2, 4), 16) || 0;
    const b = parseInt(hex.substring(4, 6), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  };

const keyMapData = {
    'Left Click': { short: 'LMB', full: 'Left Click', icon: <MousePointer2 /> },
    'Right Click': { short: 'RMB', full: 'Right Click', icon: <MousePointer2 /> },
    'Middle Click': { short: 'MMB', full: 'Middle Click', icon: <MousePointer2 /> },
    'Scroll Up': { short: 'SCROLL ↑', full: 'Scroll Up', icon: <MousePointer2 /> },
    'Scroll Down': { short: 'SCROLL ↓', full: 'Scroll Down', icon: <MousePointer2 /> },
    'Drag': { short: 'DRAG', full: 'Mouse Drag', icon: <MousePointer2 /> },

    '↑': { short: '↑', full: 'Up', icon: <ArrowUp /> },
    '↓': { short: '↓', full: 'Down', icon: <ArrowDown /> },
    '←': { short: '←', full: 'Left', icon: <ArrowLeft /> },
    '→': { short: '→', full: 'Right', icon: <ArrowRight /> },

    'Enter': { short: 'Enter', full: 'Enter', icon: <CornerDownLeft /> },
    'Backspace': { short: 'Back', full: 'Backspace', icon: <Delete /> },
    'Space': { short: 'Space', full: 'Spacebar', icon: <div className="border-b-2 border-current rounded-sm" style={{ width: '1.2em' }}></div> },
    'Win': { short: 'Win', full: 'Windows', icon: <Command /> },
    'Shift': { short: 'Shift', full: 'Shift', icon: <ArrowUpToLine /> },
 
    'Tab': { short: 'Tab', full: 'Tab', icon: <ArrowRightToLine /> },
    'Esc': { short: 'Esc', full: 'Escape', icon: <XCircle /> },
    'PgUp': { short: 'PgUp', full: 'Page Up', icon: <ChevronsUp /> },
    'PgDn': { short: 'PgDn', full: 'Page Down', icon: <ChevronsDown /> },
    'Home': { short: 'Home', full: 'Home', icon: <ArrowUpFromLine /> },
    'End': { short: 'End', full: 'End', icon: <ArrowDownToLine /> },
    'Del': { short: 'Del', full: 'Delete', icon: <XSquare /> },
    'Ins': { short: 'Ins', full: 'Insert', icon: <PlusSquare /> },
  };

  const displayGroups = settings.enableHistory && settings.direction === 'column' 
    ? [...activeKeys].reverse() 
    : activeKeys;

  return (
    <div className="absolute inset-0 box-border overflow-hidden" style={getContainerStyles()}>
      {activeKeys.length === 0 && scale < 1 && (
        <div className="opacity-30 text-zinc-600 text-sm">Type something to preview...</div>
      )}
      
      {displayGroups.map((group) => (
        <div key={group.id} className="flex items-center shrink-0 transition-all duration-300" style={{ gap: `${4 * S}px` }}>
          
          {group.items.map((k) => {
            const parts = k.keyStr.split(' + ');
            const isModFinal = ['Ctrl', 'Shift', 'Alt', 'Win'].some(mod => k.keyStr.includes(mod));
            const useModStyle = settings.highlightModifier && isModFinal;
            const currentTextColor = useModStyle ? settings.modifierTextColor : settings.textColor;
            const currentBorderColor = settings.borderEnable ? (useModStyle ? settings.borderModifierColor : settings.borderColor) : 'transparent';
            const customShadow = `0 ${4*S}px ${6*S}px -${1*S}px rgba(0,0,0,0.3), 0 ${2*S}px ${4*S}px -${1*S}px rgba(0,0,0,0.2)`;

            return (
              <div
                key={k.id}
                className={`relative flex items-center shrink-0 ${k.count === 1 ? (settings.animation === 'bounce' ? 'animate-smooth-pop' : 'animate-smooth-fade') : ''}`}
                style={{ animationDuration: `${0.15 * settings.animationSpeed}s` }}
              >
                <div
                  className="flex items-center font-bold"
                  style={{
                    fontFamily: `"${settings.fontFamily}", sans-serif`,
                    justifyContent: settings.keyAlignment,
                    fontSize: `${F}px`,
                    color: currentTextColor,
                    backgroundColor: settings.bgEnable ? hexToRgba(settings.bgColor, settings.bgOpacity) : 'transparent',
                    border: settings.borderEnable ? `${settings.borderWidth * S}px solid ${currentBorderColor}` : 'none',
                    borderRadius: `${settings.borderRadius * S}px`,
                    padding: settings.variant === 'Icon Only' ? `${F * 0.2}px` : `${F * 0.15}px ${F * 0.3}px`,
                    minWidth: settings.variant === 'Icon Only' ? 'auto' : `${F * 0.8}px`,
                    textTransform: settings.textCap !== 'none' ? settings.textCap : 'none',
                    boxShadow: customShadow,
                    lineHeight: 1.15,
                    gap: `${4 * S}px`
                  }}
                >
                  {parts.map((p, idx) => {
                    const mapData = keyMapData[p];
                    let innerContent = null;
                    
                    if (settings.variant === 'Icon Only') {
                      innerContent = (mapData && mapData.icon) ? React.cloneElement(mapData.icon, { size: F * 0.55, strokeWidth: 2 }) : <span>{mapData ? mapData.short : p}</span>;
                    } else {
                      const textToShow = settings.variant === 'Full Text' ? (mapData && mapData.full ? mapData.full : p) : (mapData && mapData.short ? mapData.short : p);
                      innerContent = (
                        <div className="flex items-center" style={{ gap: `${6 * S}px` }}>
                          {settings.showIcon && mapData && mapData.icon && React.cloneElement(mapData.icon, { size: F * 0.55, strokeWidth: 2 })}
                          <span>{textToShow}</span>
                        </div>
                      );
                    }

                    return (
                      <React.Fragment key={idx}>
                        {innerContent}
                        {idx < parts.length - 1 && (
                          <span style={{ opacity: 0.5, fontSize: `${F * 0.6}px`, fontWeight: 'bold' }}>+</span>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* อัปเกรด Badge ให้ตัวใหญ่และหนาขึ้น */}
                {settings.showPressCount && k.count > 1 && (
                  <div 
                    className="absolute flex items-center justify-center rounded-full bg-emerald-500 text-white animate-badge-pop"
                    style={{
                      top: `-${F * 0.3}px`, right: `-${F * 0.3}px`,
                      // ใช้ Math.max เพื่อดันฟอนต์ขั้นต่ำในพรีวิวไม่ให้เล็กลงไปกว่า 10px
                      fontSize: `${Math.max(F * 0.35, 10)}px`, 
                      padding: `0 ${F * 0.25}px`,
                      height: `${F * 0.65}px`, minWidth: `${F * 0.65}px`,
                      border: `${Math.max(2 * S, 1)}px solid ${settings.bgEnable ? hexToRgba(settings.bgColor, settings.bgOpacity) : '#09090b'}`,
                      fontFamily: `"${settings.fontFamily}", sans-serif`,
                      fontWeight: 'bold', // ทำตัวหนาให้ชัด
                      boxShadow: `0 ${3*S}px ${6*S}px rgba(0,0,0,0.4)`,
                      lineHeight: 1,
                      zIndex: 10
                    }}
                  >
                    x{k.count}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}