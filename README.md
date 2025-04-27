# 📢 Electron Notification App

**Electron Notification App** is a lightweight tool built with Electron that allows sending and receiving instant pop-up notifications between PCs over WebSocket.  
Notifications open *on top of all other windows*, ensuring visibility even during focused work.

Currently, the app's interface is **only available in Polish** 🇵🇱.
---

## Executable

[![Download .EXE](https://img.shields.io/badge/Download-.EXE-blue?style=for-the-badge&logo=windows)](https://github.com/DaedalusHatak/Electron-Notification-App/releases/latest/download/Powiadomienia.Electron.Setup.1.0.0.exe)

---

![{59F5AEEA-C0A6-4373-9A88-3A71403E9751}](https://github.com/user-attachments/assets/03388042-cc61-45a2-b1f9-650132cd96b4)


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

## ⚙️ Usage
Launch the app on the PC(s) you want to communicate with.

Set the IP address of the receiving PC in the app settings.

Send notifications — they will appear instantly on top of all windows.

Manage your local notification history: delete individual notifications or disable the delete option if needed.

Toggle notification pop-ups globally via the "Disable Notifications" switch.

---

## 📚 Notes
This app is currently only in Polish.

WebSocket connection is local network only (LAN). No encryption — please use in trusted environments.

Only basic security is in place. No authentication or encryption for WebSocket yet.

Make sure your firewall allows WebSocket traffic (default port configurable inside the app).
