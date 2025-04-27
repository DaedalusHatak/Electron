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

## 📚 Notes
This app is currently only in Polish.

WebSocket connection is local network only (LAN). No encryption — please use in trusted environments.

Only basic security is in place. No authentication or encryption for WebSocket yet.

Make sure your firewall allows WebSocket traffic (default port configurable inside the app).
