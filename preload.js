const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    sendNotification: (data) => ipcRenderer.send('send-notification', data),
    getHistory: () => ipcRenderer.invoke('get-history'),
    onNewNotification: (callback) => ipcRenderer.on('new-notification', (_, data) => callback(data)),
    onShowSend: (callback) => ipcRenderer.on('show-send', () => callback()),
    popupOK: () => ipcRenderer.send('popup-ok'),
    onPopup: (callback) => ipcRenderer.on('notification', (_, data) => callback(data)),
    removeNotification: (taskId) => ipcRenderer.send('remove-notification', taskId),
    getShowTaskId: () => ipcRenderer.invoke('get-show-task-id'),
    toggleShowTaskId: (show) => ipcRenderer.send('toggle-show-task-id', show),
    onToggleShowTaskId: (callback) => ipcRenderer.on('toggle-show-task-id', (_, show) => callback(show)),
    onToggleDeleteButton: (callback) => ipcRenderer.on('toggle-delete-button', (_, state) => callback(state)),
    getButtonDisabled: () => ipcRenderer.invoke('get-button-disabled'),
    saveConfig: (config) => ipcRenderer.send("save-config", config),
    getConfig: () => ipcRenderer.invoke("get-config"),
    showSendWindow: () => ipcRenderer.send('show-send-window'),
  });