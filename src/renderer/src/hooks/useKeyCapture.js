import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';

export function useKeyCapture(settings, setSettings, hasLoaded = false) {
  const [activeKeys, setActiveKeys] = useState([]); 
  const location = useLocation();
  
  const isOverlay = location.pathname === '/overlay';
  const isElectron = !!window.electronAPI || /electron/i.test(navigator.userAgent) || window.location.protocol === 'file:';

  const settingsRef = useRef(settings);
  const timersRef = useRef({});

  useEffect(() => {
    settingsRef.current = settings;
    if (isElectron && !isOverlay && hasLoaded) {
      window.electronAPI.updateSettings(settings);
    }
  }, [settings, isOverlay, isElectron, hasLoaded]);

  useEffect(() => {
    let socket;

    const scheduleRemoval = (itemId) => {
      if (timersRef.current[itemId]) clearTimeout(timersRef.current[itemId]);
      timersRef.current[itemId] = setTimeout(() => {
        setActiveKeys((currentGroups) => {
          return currentGroups.map(group => ({
            ...group,
            items: group.items.filter(item => item.id !== itemId)
          })).filter(group => group.items.length > 0);
        });
        delete timersRef.current[itemId];
      }, settingsRef.current.duration * 1000);
    };

    const handleInput = (data) => {
      const currentOpts = settingsRef.current;
      if (data.type === 'mouse' && !currentOpts.showMouse) return;
      if (currentOpts.filterType === 'hotkeys') {
        const isBasicKey = /^[a-zA-Z0-9]$/.test(data.key);
        if (data.type === 'keyboard' && isBasicKey) return; 
      }

      const now = Date.now();
      const modifiersList = ['Ctrl', 'Shift', 'Alt', 'Win'];

      setActiveKeys((prev) => {
        if (data.state === 'up') {
          let updated = [...prev];
          let stateChanged = false;
          for (let g = updated.length - 1; g >= 0; g--) {
            let groupUpdated = false;
            let newItems = [...updated[g].items];
            for (let i = newItems.length - 1; i >= 0; i--) {
              if (newItems[i].isHeld && newItems[i].heldKeys && newItems[i].heldKeys.includes(data.key)) {
                newItems[i] = { ...newItems[i], heldKeys: newItems[i].heldKeys.filter(k => k !== data.key) };
                if (newItems[i].heldKeys.length === 0) {
                  newItems[i].isHeld = false;
                  scheduleRemoval(newItems[i].id);
                }
                groupUpdated = true;
                stateChanged = true;
              }
            }
            if (groupUpdated) updated[g] = { ...updated[g], items: newItems };
          }
          return stateChanged ? updated : prev;
        }

        const isMod = modifiersList.includes(data.key);
        const physicallyHeldKeys = new Set();
        prev.forEach(g => {
          g.items.forEach(item => {
            if (item.isHeld && item.heldKeys) {
              item.heldKeys.forEach(k => physicallyHeldKeys.add(k));
            }
          });
        });

        if (physicallyHeldKeys.has(data.key)) return prev;

        const heldModifiers = modifiersList.filter(m => physicallyHeldKeys.has(m));
        let keyString = data.key;
        if (!isMod && heldModifiers.length > 0) {
          keyString = [...heldModifiers, data.key].join(' + ');
        }

        const lastGroup = prev.length > 0 ? prev[prev.length - 1] : null;
        const lastItem = lastGroup && lastGroup.items.length > 0 ? lastGroup.items[lastGroup.items.length - 1] : null;
        const timeSinceLastItem = lastItem ? now - lastItem.updateTrigger : 9999;
        const effectiveMaxCount = currentOpts.enableHistory ? currentOpts.maxCount : 8;

        const newItemTemplate = {
          id: data.id,
          keyStr: keyString,
          count: 1,
          updateTrigger: now,
          isHeld: true,
          heldKeys: [...heldModifiers, data.key]
        };

        if (lastItem) {
          if (lastItem.keyStr === keyString) {
            const updatedGroups = [...prev];
            const updatedItems = [...lastGroup.items];
            updatedItems[updatedItems.length - 1] = {
              ...lastItem, 
              count: (lastItem.count || 1) + 1, 
              updateTrigger: now, 
              isHeld: true,
              heldKeys: Array.from(new Set([...heldModifiers, data.key]))
            };
            updatedGroups[updatedGroups.length - 1] = { ...lastGroup, items: updatedItems };
            if (timersRef.current[lastItem.id]) clearTimeout(timersRef.current[lastItem.id]);
            return updatedGroups;
          }

          if (lastItem.isHeld && timeSinceLastItem < 1500) {
            const lastKeyIsOnlyModifiers = lastItem.keyStr.split(' + ').every(k => modifiersList.includes(k));
            if (lastKeyIsOnlyModifiers) {
              const updatedGroups = [...prev];
              const updatedItems = [...lastGroup.items];
              
              if (isMod) {
                if (!lastItem.keyStr.includes(data.key)) {
                  updatedItems[updatedItems.length - 1] = {
                    ...lastItem, 
                    keyStr: lastItem.keyStr + ' + ' + data.key, 
                    updateTrigger: now, 
                    heldKeys: [...lastItem.heldKeys, data.key]
                  };
                  updatedGroups[updatedGroups.length - 1] = { ...lastGroup, items: updatedItems };
                  return updatedGroups;
                }
              } else {
                updatedItems[updatedItems.length - 1] = {
                  ...lastItem, 
                  keyStr: keyString, 
                  updateTrigger: now, 
                  heldKeys: [...lastItem.heldKeys, data.key]
                };
                updatedGroups[updatedGroups.length - 1] = { ...lastGroup, items: updatedItems };
                return updatedGroups;
              }
            }
          }

          if (timeSinceLastItem <= 200 && lastGroup.items.length < 15) {
            const updatedGroups = [...prev];
            updatedGroups[updatedGroups.length - 1] = {
              ...lastGroup,
              items: [...lastGroup.items, newItemTemplate]
            };
            return updatedGroups;
          }
        }

        if (!currentOpts.enableHistory) {
          if (timeSinceLastItem > 400 && physicallyHeldKeys.size === 0) {
            prev.forEach(g => g.items.forEach(i => {
              if (timersRef.current[i.id]) clearTimeout(timersRef.current[i.id]);
            }));
            return [{ id: data.id + '-group', items: [newItemTemplate] }];
          }
        }

        const newGroups = [...prev, { id: data.id + '-group', items: [newItemTemplate] }];
        if (newGroups.length > effectiveMaxCount) {
          const removedGroup = newGroups.shift();
          removedGroup.items.forEach(i => {
            if (timersRef.current[i.id]) clearTimeout(timersRef.current[i.id]);
          });
        }
        return newGroups;
      });
    };
    
    if (isElectron) {
       const cleanup = window.electronAPI.onInputEvent(handleInput);
       return cleanup;
    } else {
       socket = io(window.location.hostname === 'localhost' && window.location.port !== '28499' ? 'http://localhost:28499' : '/');
       socket.on('settings-changed', (newSettings) => {
         if (setSettings) setSettings(newSettings);
       });
       socket.on('input-event', handleInput);
       return () => socket.disconnect();
    }
  }, [isElectron, setSettings]);

  return { activeKeys, isOverlay, isElectron };
}