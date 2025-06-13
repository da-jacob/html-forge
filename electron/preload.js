const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("electronApi", {
    minimize: () => ipcRenderer.send("window-minimize"),
    close: () => ipcRenderer.send("window-close"),
    getProjects: () => ipcRenderer.send("get-projects"),
    onAppData: (callback) =>
        ipcRenderer.on("app-data", (_, data) => callback(data)),
    checkSetup: () => ipcRenderer.send("check-setup"),
    selectDirectory: () => ipcRenderer.invoke("select-directory"),
    saveConfig: (data) => ipcRenderer.invoke("save-config", data),
    createProject: (data) => ipcRenderer.invoke("create-project", data),
    serverStatus: (data) => ipcRenderer.invoke('server-status', data),
    serverStop: (data) => ipcRenderer.invoke('server-stop', data),
    serverStart: (data) => ipcRenderer.invoke('server-start', data),
    buildProject: (data) => ipcRenderer.invoke('project-build', data),
    openExternal: (url) => ipcRenderer.send('open-external', url),
});
