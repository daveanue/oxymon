import { ipcMain } from 'electron';
import { expandWindow, collapseWindow, getMainWindow } from './window.js';

export function registerIpcHandlers() {
    // Window controls
    ipcMain.handle('window:expand', () => {
        expandWindow();
        return { success: true };
    });

    ipcMain.handle('window:collapse', () => {
        collapseWindow();
        return { success: true };
    });

    ipcMain.handle('window:minimize', () => {
        getMainWindow()?.minimize();
        return { success: true };
    });

    ipcMain.handle('window:close', () => {
        getMainWindow()?.close();
        return { success: true };
    });

    // App info
    ipcMain.handle('app:getVersion', () => {
        return process.env.npm_package_version || '0.1.0';
    });

    // Voice assistant handlers (to be implemented)
    ipcMain.handle('voice:startListening', async () => {
        // TODO: Implement voice provider integration
        console.log('Voice: Start listening');
        return { success: true };
    });

    ipcMain.handle('voice:stopListening', async () => {
        // TODO: Implement voice provider integration
        console.log('Voice: Stop listening');
        return { success: true };
    });

    ipcMain.handle('chat:sendMessage', async (_event, message: string) => {
        // TODO: Implement LLM provider integration
        console.log('Chat: Received message:', message);
        return {
            success: true,
            response: 'This is a placeholder response. LLM integration coming soon!'
        };
    });
}
