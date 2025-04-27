\ud83d\udce2 Electron Notification App

Electron Notification App is a lightweight tool built with Electron that allows sending and receiving instant pop-up notifications between PCs over WebSocket.Notifications open on top of all other windows, ensuring visibility even during focused work.

Currently, the app's interface is only available in Polish \ud83c\uddf5\ud83c\uddf1.

\u2728 Features

\ud83d\udd14 Send notifications to a specific PC (or to your own machine).

\ud83c\udf10 WebSocket-based communication \u2014 configure the target PC via IP address.

\ud83d\udccb Notification history \u2014 locally stores received notifications.

\ud83d\uddd1\ufe0f Delete notifications \u2014 with an option to disable the delete button for extra control.

\ud83d\udcf4 Disable notifications \u2014 temporarily stop displaying pop-ups if needed.

\ud83d\udeb1\ufe0f Always on top \u2014 notifications always appear above all other apps.

\ud83d\udc85\ufe0f Configurable target PC \u2014 change the receiver's IP anytime.

\ud83c\uddf5\ud83c\uddf1 Polish-only interface (for now).

\ud83d\udce6 Installation

git clone https://github.com/your-username/electron-notification-app.git
cd electron-notification-app
npm install
npm start

To package the app for Windows:

npm run build

(Supports Windows 7 and newer.)

\u2699\ufe0f Usage

Launch the app on the PC(s) you want to communicate with.

Set the IP address of the receiving PC in the app settings.

Send notifications \u2014 they will appear instantly on top of all windows.

Manage your local notification history: delete individual notifications or disable the delete option if needed.

Toggle notification pop-ups globally via the "Disable Notifications" switch.

\ud83d\udcf8 Screenshots

(Coming soon!)

\ud83d\udcda Notes

This app is currently only in Polish.

WebSocket connection is local network only (LAN). No encryption \u2014 please use in trusted environments.

Only basic security is in place. No authentication or encryption for WebSocket yet.

Make sure your firewall allows WebSocket traffic (default port configurable inside the app).

\ud83d\ude80 Roadmap



\ud83e\udd1d Contributions

Contributions, feature suggestions, and pull requests are welcome!Feel free to fork the project and open a PR.

\ud83d\udcc4 License

This project is licensed under the MIT License \u2014 see the LICENSE file for details.

\ud83d\udcec Contact

If you encounter any issues or have ideas, feel free to open an issue on GitHub!

