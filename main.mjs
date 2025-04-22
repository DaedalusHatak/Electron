import Store from "electron-store";
import { app, Tray, Menu, BrowserWindow, ipcMain } from "electron";
import path from "path";
import WebSocket from "ws";
import { WebSocketServer } from "ws";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";

const configFilePath = path.join(app.getPath("userData"), "config.json");
console.log(configFilePath)
function getConfig() {
  if (fs.existsSync(configFilePath)) {
    const configData = JSON.parse(fs.readFileSync(configFilePath, "utf-8"));
    if (!configData.serverIP) {
      return null;
    }
    return configData;
  }
  return null;
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const store = new Store({ defaults: { notifications: [], showPopups: true } });

let tray = null;
let mainWindow = null; // Okno historii
let sendWindow = null; // Okno wysyłania powiadomień
let wsServer = null;
let wsClient = null;
let configWindow = null;
function createConfigWindow() {
   configWindow = new BrowserWindow({
    width: 400,
    height: 300,
    resizable: false,
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  configWindow.removeMenu();
  configWindow.loadFile("renderer/config.html");
}


function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    show: true,
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow.removeMenu();
  mainWindow.loadFile("renderer/index.html");
  mainWindow.on("close", (event) => {
    event.preventDefault();
    mainWindow.hide();
  });
}

function createSendWindow() {
  sendWindow = new BrowserWindow({
    width: 500,
    height: 300,
    show: true,
    alwaysOnTop:true,
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  sendWindow.removeMenu();
  sendWindow.loadFile("renderer/send.html");
  sendWindow.on("close", (event) => {
    event.preventDefault();
    sendWindow.hide();
  });
}


function createPopupWindow(notification) {
  if (!store.get("showPopups")) return;

  // Utwórz całkowicie nowe okno aplikacji na powiadomienie
  const popupWindow = new BrowserWindow({
    width: 600,
    height: 330,
    alwaysOnTop: true,
    frame: true,
    transparent: false,
  
  fullscreenable: false,
    center: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });


  popupWindow.removeMenu();
  // Załaduj treść powiadomienia w tym oknie
  popupWindow.loadFile("renderer/popup.html");

  // Po załadowaniu, wyślij dane do nowego okna
  popupWindow.once("ready-to-show", () => {
    popupWindow.webContents.send("notification", notification);
  });


  // Zamknij okno po kliknięciu 'OK'
  ipcMain.once("popup-ok", () => {
    popupWindow.close();
  });
}


function setupTray() {
  tray = new Tray(path.join(__dirname, "icons/tray.png"));
  const contextMenu = Menu.buildFromTemplate([
    { label: "Pokaż historię", click: () => mainWindow.show() },
    { label: "Wyślij powiadomienie", click: () => sendWindow.show() },
    { type: "separator" },
    {
      label: "Pokazuj popupy",
      type: "checkbox",
      checked: store.get("showPopups"),
      click: (menuItem) => store.set("showPopups", menuItem.checked),
    },
    {
      label: "Pokaż taskId w formularzu",
      type: "checkbox",
      checked: store.get("showTaskId"),
      click: (menuItem) => {
        store.set("showTaskId", menuItem.checked);
        sendWindow.webContents.send("toggle-show-task-id", menuItem.checked);
      },
    },
    { label: "Ustawienia", click: () => createConfigWindow() },
    { type: "separator" },
    { label: "Zamknij", click: () => {if (tray) tray.destroy(); // zniszcz tray
      BrowserWindow.getAllWindows().forEach(win => win.destroy());
      app.quit(); } }
  ]);
  tray.setToolTip("Notifier App");
  tray.setContextMenu(contextMenu);
}
ipcMain.handle("get-show-task-id", () => store.get("showTaskId"));

ipcMain.on("toggle-show-task-id", (_, show) => {
  store.set("showTaskId", show);
  sendWindow.webContents.send('toggle-show-task-id', show);

});
function setupWebSocketServer() {
  wsServer = new WebSocketServer({ port: 9001 });
  wsServer.on("connection", (socket) => {
    socket.on("message", (msg) => {
      const data = JSON.parse(msg);
      handleNotification(data); // 👈 ten sam zapis
    });
  });
}
let connectionCounter = 0;

function handleConnectionError(ip, message) {
  console.warn("[WebSocket] Błąd połączenia:", message);
  updateConnectingDialogText(`
    <p style="color: red;"><b>Błąd połączenia z ${ip}:9001</b></p>
    <p>${message}</p>
  `);

  setTimeout(() => {
    closeConnectingDialog();
    if (!configWindow) {
      createConfigWindow();
    }
  }, 500);
}

function setupWebSocketClient(targetIP) {
  if (wsClient) {
    try {
      wsClient.terminate();
    } catch (err) {
      console.error("Błąd przy zamykaniu klienta:", err);
    }
  }

  const thisConnection = ++connectionCounter;
  const wsURL = `ws://${targetIP}:9001`;

  showConnectingDialog(targetIP);
  updateConnectingDialogText(`<p>Łączenie z <b>${targetIP}:9001</b>...</p>`);

  wsClient = new WebSocket(wsURL);

  const timeout = setTimeout(() => {
    if (thisConnection === connectionCounter && wsClient.readyState !== WebSocket.OPEN) {
      wsClient.terminate();
      handleConnectionError(targetIP, "Nie udało się połączyć z serwerem (timeout).");
    }
  }, 5000);

  wsClient.on("open", () => {
    if (thisConnection !== connectionCounter) return;
    clearTimeout(timeout);
    console.log("[WebSocket] Połączono z serwerem.");
    closeConnectingDialog();
    if (configWindow) configWindow.close();
  });

  wsClient.on("error", (err) => {
    if (thisConnection !== connectionCounter) return;
    clearTimeout(timeout);
    const msg = err.message.includes("ETIMEDOUT") || err.message.includes("ECONNREFUSED")
      ? "Nie udało się połączyć z serwerem (błąd sieci)."
      : `Błąd: ${err.message}`;
    handleConnectionError(targetIP, msg);
  });

  wsClient.on("close", () => {
    if (thisConnection !== connectionCounter) return;
    clearTimeout(timeout);
    if (wsClient.readyState !== WebSocket.OPEN) {
      handleConnectionError(targetIP, "WebSocket został zamknięty przed ustanowieniem połączenia.");
    }
  });
}


let loadingWindow = null;

function showConnectingDialog(ip) {
  if (loadingWindow) return;

  loadingWindow = new BrowserWindow({
    width: 360,
    height: 180,
    resizable: false,
    frame: false,
    alwaysOnTop: true,
    modal: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const html = `
    <html>
      <body style="font-family: sans-serif; text-align: center; padding-top: 40px;">
        <div id="content">
          <p>Łączenie z <b>${ip}:9001</b>...</p>
        </div>
        <script>
          window.updateText = function (html) {
            document.getElementById("content").innerHTML = html;
          }
        </script>
      </body>
    </html>
  `;

  loadingWindow.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(html));
}

function updateConnectingDialogText(html) {
  if (loadingWindow) {
    loadingWindow.webContents.executeJavaScript(`window.updateText(${JSON.stringify(html)})`);
  }
}

function closeConnectingDialog() {
  if (loadingWindow) {
    loadingWindow.close();
    loadingWindow = null;
  }
}

function showConnectionErrorAndExit(ip, message) {
  const errorWindow = new BrowserWindow({
    width: 400,
    height: 200,
    resizable: false,
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const htmlContent = `
    <html>
    <body style="font-family:sans-serif; padding:20px;">
      <h3>Blad połączenia z ${ip}:9001</h3>
      <p>${message}</p>
      <button onclick="window.close()">Zamknij aplikację</button>
      <script>
        const { ipcRenderer } = require('electron');
        window.onunload = () => ipcRenderer.send('force-quit');
      </script>
    </body>
    </html>
  `;

  errorWindow.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(htmlContent));
}

function handleNotification(data) {
  const notifications = store.get("notifications");

  if (!notifications.some((n) => n.taskId === data.taskId)) {
    const updated = [data, ...notifications];
    store.set("notifications", updated);
    mainWindow.webContents.send("new-notification", data);

    createPopupWindow(data);
    mainWindow.show();
  }
}
ipcMain.on("send-notification", (_, data) => {
  if (wsClient?.readyState === WebSocket.OPEN) {
    wsClient.send(JSON.stringify(data));
  }

  handleNotification(data); // 👈 tylko tutaj zapis
});

ipcMain.on("remove-notification", (_, taskId) => {
  let notifications = store.get("notifications");
  notifications = notifications.filter(
    (notification) => notification.taskId !== taskId
  );
  store.set("notifications", notifications);
  mainWindow.webContents.send("new-notification", notifications);
});

ipcMain.handle("get-history", () => store.get("notifications"));

app.whenReady().then(() => {
  const config = getConfig();

  if (!config) {
    createConfigWindow(); // Wywołaj okno konfiguracji
  } else {
    const { serverIP} = config;
  
    createMainWindow();
    createSendWindow();
    setupTray();
  
   setupWebSocketServer();
    setupWebSocketClient(serverIP);
  }
});
ipcMain.handle("get-config", () => {
  if (fs.existsSync(configFilePath)) {
    return JSON.parse(fs.readFileSync(configFilePath));
  }
  return {};
});

ipcMain.on("save-config", (_, config) => {
  // Pobierz istniejące dane konfiguracyjne
  let existingConfig = {};
  if (fs.existsSync(configFilePath)) {
    existingConfig = JSON.parse(fs.readFileSync(configFilePath, "utf-8"));
  }

  // Zaktualizuj dane konfiguracyjne tylko o nowe wartości
  const updatedConfig = {
    ...existingConfig, // Zachowaj stare dane
    ...config, // Zaktualizuj danymi przekazanymi w `config`
  };

  // Zapisz zaktualizowane dane do pliku
  fs.writeFileSync(configFilePath, JSON.stringify(updatedConfig, null, 2));

  // Teraz tylko uruchom ponownie konfigurację w aplikacji, bez jej zamykania
  updateAppWithConfig();
});


function updateAppWithConfig(){
  const config = getConfig();
  const { serverIP} = config;



  if (!mainWindow) {
    createMainWindow();
      // Inicjalizuj tray
  setupTray();
  }

  // Zawsze twórz nowe okno do wysyłania powiadomień
 if(!sendWindow){
  createSendWindow();
 }
setupWebSocketClient(serverIP)

}
app.on("window-all-closed", (e) => e.preventDefault());
