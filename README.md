<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=200&section=header&text=LocalKeys&fontSize=80&fontAlignY=35&animation=twinkling&fontColor=gradient"/>
</p>

**LocalKeys** is a stylish, highly customizable real-time keystroke and mouse click overlay designed specifically for streamers, VTubers, and tutorial creators. 

Inspired by apps like Keyviz, LocalKeys captures your inputs and hosts them on a secure local web server, allowing you to easily add them as a "Browser Source" in streaming software like **OBS Studio**.

---

## ✨ Features

* **Smart Input Grouping:** Automatically groups rapid key presses (e.g., `[W] x3`) and detects modifier combos (e.g., `[Ctrl + C]`).
* **Dynamic Layouts:** Choose between Classic Row mode or Terminal-style Column mode (newest inputs push old ones up).
* **Highly Customizable:** Tweak fonts, colors, border radii, sizes, and animations to perfectly match your stream's aesthetic.
* **Mouse Support:** Tracks Left/Right/Middle clicks, scroll wheel, and mouse dragging.
* **Auto-Save:** Your configurations are automatically saved and restored on the next launch.

---

## 🚀 How to Use (For Streaming)

1. Open the **LocalKeys Desktop App**.
2. Customize your overlay in the Settings Dashboard.
3. Look at the bottom left of the Dashboard to find your overlay URL (usually `http://localhost:28499/overlay`).
4. In **OBS Studio** add a new **Browser Source**.
5. Paste the URL into the source settings.
6. Start typing, and watch your inputs appear on stream!

---

## 🔒 Security Note (Access Restricted)

LocalKeys has a built-in security measure to prevent unauthorized access to your settings while you are live. 

The Settings Dashboard can **ONLY** be accessed from within the LocalKeys Desktop App. If you or someone else attempts to open the dashboard URL in a standard web browser (like Chrome or Edge), an **"Access Restricted"** screen will appear. This ensures your configurations remain safe and cannot be tampered with via external browsers.

---

## ⬇️ Installation

> **Note:** Currently, LocalKeys is only available for **Windows**. Support for macOS and Linux may be added in the future.

### Windows Users
- Click [here](https://github.com/Adivise/localkeys/releases/latest/download/localkeys-1.0.0.exe) to download the recommended Windows installer
- Alternative downloads from the [latest release](https://github.com/Adivise/localkeys/releases/latest):
  - **Portable (.exe)**
    - `localkeys-1.0.0-portable.exe` (no installation required)
  - **MSI Installer (.msi)**
    - `localkeys-1.0.0.msi` (alternative for enterprise environments)
  > *Note: The portable version doesn't save settings between sessions. The installer saves all configuration. Choose the format that best fits your needs.*

---

Built with ❤️ by [Adivise](https://github.com/Adivise)