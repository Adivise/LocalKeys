import { uIOhook, UiohookKey } from 'uiohook-napi';

let currentDragThreshold = 50;
let eventCounter = 0; // Global counter to ensure unique IDs

// Helper function to generate a truly unique ID
const generateUniqueId = () => `${Date.now()}-${eventCounter++}`;

export function updateCaptureSettings(settings) {
  if (settings.dragThreshold !== undefined) {
    currentDragThreshold = settings.dragThreshold;
  }
}

function mapKeycodeToName(keycode) {
    const keyMap = {
        [UiohookKey.A]: 'A', [UiohookKey.B]: 'B', [UiohookKey.C]: 'C',
        [UiohookKey.D]: 'D', [UiohookKey.E]: 'E', [UiohookKey.F]: 'F',
        [UiohookKey.G]: 'G', [UiohookKey.H]: 'H', [UiohookKey.I]: 'I',
        [UiohookKey.J]: 'J', [UiohookKey.K]: 'K', [UiohookKey.L]: 'L',
        [UiohookKey.M]: 'M', [UiohookKey.N]: 'N', [UiohookKey.O]: 'O',
        [UiohookKey.P]: 'P', [UiohookKey.Q]: 'Q', [UiohookKey.R]: 'R',
        [UiohookKey.S]: 'S', [UiohookKey.T]: 'T', [UiohookKey.U]: 'U',
        [UiohookKey.V]: 'V', [UiohookKey.W]: 'W', [UiohookKey.X]: 'X',
        [UiohookKey.Y]: 'Y', [UiohookKey.Z]: 'Z',
        [UiohookKey.VC_0]: '0', [UiohookKey.VC_1]: '1', [UiohookKey.VC_2]: '2', [UiohookKey.VC_3]: '3', [UiohookKey.VC_4]: '4',
        [UiohookKey.VC_5]: '5', [UiohookKey.VC_6]: '6', [UiohookKey.VC_7]: '7', [UiohookKey.VC_8]: '8', [UiohookKey.VC_9]: '9',
        [UiohookKey.Space]: 'Space', [UiohookKey.Enter]: 'Enter', [UiohookKey.Tab]: 'Tab', [UiohookKey.Escape]: 'Esc',
        [UiohookKey.Backspace]: 'Backspace', [UiohookKey.Delete]: 'Del', [UiohookKey.Insert]: 'Ins',
        [UiohookKey.Home]: 'Home', [UiohookKey.End]: 'End', [UiohookKey.PageUp]: 'PgUp', [UiohookKey.PageDown]: 'PgDn',
        [UiohookKey.Shift]: 'Shift', [UiohookKey.ShiftRight]: 'Shift',
        [UiohookKey.Ctrl]: 'Ctrl', [UiohookKey.CtrlRight]: 'Ctrl',
        [UiohookKey.Alt]: 'Alt', [UiohookKey.AltRight]: 'Alt',
        [UiohookKey.Meta]: 'Win', [UiohookKey.MetaRight]: 'Win',
        [UiohookKey.ArrowUp]: '↑', [UiohookKey.ArrowDown]: '↓', [UiohookKey.ArrowLeft]: '←', [UiohookKey.ArrowRight]: '→',
        [UiohookKey.Semicolon]: ';', [UiohookKey.Equal]: '=', [UiohookKey.Comma]: ',', [UiohookKey.Minus]: '-',
        [UiohookKey.Period]: '.', [UiohookKey.Slash]: '/', [UiohookKey.Backquote]: '`',
        [UiohookKey.BracketLeft]: '[', [UiohookKey.BracketRight]: ']', [UiohookKey.Quote]: "'", [UiohookKey.Backslash]: '\\'
    };
    return keyMap[keycode] || null;
}

export function startCapture(onEventCallback) {
  let isMouseDown = false;
  let isDragging = false;
  let startX = 0;
  let startY = 0;

  uIOhook.on('keydown', (e) => {
    let keyName = mapKeycodeToName(e.keycode);
    if (keyName) onEventCallback({ type: 'keyboard', key: keyName, id: generateUniqueId(), state: 'down' });
  });

  uIOhook.on('keyup', (e) => {
    let keyName = mapKeycodeToName(e.keycode);
    if (keyName) onEventCallback({ type: 'keyboard', key: keyName, id: generateUniqueId(), state: 'up' });
  });

  uIOhook.on('mousedown', (e) => {
    isMouseDown = true;
    isDragging = false;
    startX = e.x; 
    startY = e.y;
    let buttonName = e.button === 1 ? 'Left Click' : e.button === 2 ? 'Right Click' : e.button === 3 ? 'Middle Click' : '';
    if (buttonName) onEventCallback({ type: 'mouse', key: buttonName, button: e.button, id: generateUniqueId(), state: 'down' });
  });

  uIOhook.on('mouseup', (e) => {
    isMouseDown = false;
    let buttonName = e.button === 1 ? 'Left Click' : e.button === 2 ? 'Right Click' : e.button === 3 ? 'Middle Click' : '';
    if (buttonName) onEventCallback({ type: 'mouse', key: buttonName, button: e.button, id: generateUniqueId(), state: 'up' });
    if (isDragging) {
      onEventCallback({ type: 'mouse', key: 'Drag', id: generateUniqueId(), state: 'up' });
      isDragging = false;
    }
  });

  uIOhook.on('mousemove', (e) => {
    if (isMouseDown && !isDragging) {
      const distance = Math.hypot(e.x - startX, e.y - startY);
      if (distance >= currentDragThreshold) {
        isDragging = true;
        onEventCallback({ type: 'mouse', key: 'Drag', id: generateUniqueId(), state: 'down' });
      }
    }
  });

  uIOhook.on('wheel', (e) => {
    const direction = e.rotation > 0 ? 'Scroll Down' : 'Scroll Up';
    const eventId = generateUniqueId();
    onEventCallback({ type: 'mouse', key: direction, id: eventId, state: 'down' });
    setTimeout(() => {
      onEventCallback({ type: 'mouse', key: direction, id: generateUniqueId(), state: 'up' });
    }, 100);
  });

  uIOhook.start();
}