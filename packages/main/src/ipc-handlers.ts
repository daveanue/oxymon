import { ipcMain } from 'electron';
import { expandWindow, collapseWindow, getMainWindow } from './window.js';

import { VoiceProvider } from '@app/core/providers/voice/VoiceProvider';
import { ProsodyPlan } from '@app/core/types/ProsodySchema';

export function registerIpcHandlers(voiceProvider?: VoiceProvider) {
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

    // Voice assistant handlers
    ipcMain.handle('voice:startListening', async () => {
        if (voiceProvider) {
            await voiceProvider.startListening();
            return { success: true };
        }
        return { success: false, error: 'Voice provider not configured' };
    });

    ipcMain.handle('voice:stopListening', async () => {
        if (voiceProvider) {
            await voiceProvider.stopListening();
            return { success: true };
        }
        return { success: false, error: 'Voice provider not configured' };
    });

    ipcMain.handle('voice:speak', async (_event, text: string, prosody?: ProsodyPlan) => {
        if (voiceProvider) {
            await voiceProvider.speak(text, prosody);
            return { success: true };
        }
        return { success: false, error: 'Voice provider not configured' };
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
