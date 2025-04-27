# 📢 Electron Notification App

**Electron Notification App** is a lightweight tool built with Electron that allows sending and receiving instant pop-up notifications between PCs over WebSocket.  
Notifications open *on top of all other windows*, ensuring visibility even during focused work.

Currently, the app's interface is **only available in Polish** 🇵🇱.

---

## ✨ Features

- 🔔 **Send notifications** to a specific PC (or to your own machine).
- 🌐 **WebSocket-based communication** — configure the target PC via IP address.
- 📋 **Notification history** — locally stores received notifications.
- 🗑️ **Delete notifications** — with an option to **disable** the delete button for extra control.
- 📴 **Disable notifications** — temporarily stop displaying pop-ups if needed.
- 🛡️ **Always on top** — notifications always appear above all other apps.
- 🖥️ **Configurable target PC** — change the receiver's IP anytime.
- 🇵🇱 **Polish-only interface** *(for now)*.

---

## 📦 Installation

```bash
git clone https://github.com/your-username/electron-notification-app.git
cd electron-notification-app
npm install
npm start
