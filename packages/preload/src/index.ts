import { contextBridge, ipcRenderer } from 'electron';

/**
 * Preload script - exposes safe APIs to the renderer process
 * All Electron/Node.js APIs must go through here
 */

// Window control API
const windowAPI = {
    expand: () => ipcRenderer.invoke('window:expand'),
    collapse: () => ipcRenderer.invoke('window:collapse'),
    minimize: () => ipcRenderer.invoke('window:minimize'),
    close: () => ipcRenderer.invoke('window:close'),
};

// Voice API
const voiceAPI = {
    startListening: () => ipcRenderer.invoke('voice:startListening'),
    stopListening: () => ipcRenderer.invoke('voice:stopListening'),
    speak: (text: string, prosody?: any) => ipcRenderer.invoke('voice:speak', text, prosody),
    onAudioPlayback: (callback: (buffer: ArrayBuffer) => void) => {
        const subscription = (_event: any, buffer: ArrayBuffer) => callback(buffer);
        ipcRenderer.on('voice:play-audio', subscription);
        return () => ipcRenderer.removeListener('voice:play-audio', subscription);
    },
};

// Chat API
const chatAPI = {
    sendMessage: (message: string) => ipcRenderer.invoke('chat:sendMessage', message),
};

// App API
const appAPI = {
    getVersion: () => ipcRenderer.invoke('app:getVersion'),
};

// Expose APIs to renderer
contextBridge.exposeInMainWorld('electronAPI', {
    window: windowAPI,
    voice: voiceAPI,
    chat: chatAPI,
    app: appAPI,
});

// Type declarations for the exposed API
export type ElectronAPI = {
    window: typeof windowAPI;
    voice: typeof voiceAPI;
    chat: typeof chatAPI;
    app: typeof appAPI;
};
