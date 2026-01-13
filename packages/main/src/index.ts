import 'dotenv/config'; // Load env vars
import { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { createWindow, getMainWindow } from './window.js';
import { registerIpcHandlers } from './ipc-handlers.js';
import { CartesiaTTSProvider } from './providers/CartesiaTTSProvider.js';
import { logger } from '@app/core/utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        const mainWindow = getMainWindow();
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });
}

let tray: Tray | null = null;
let voiceProvider: CartesiaTTSProvider | null = null;

app.whenReady().then(async () => {
    // Initialize providers
    const cartesiaKey = process.env.CARTESIA_API_KEY;
    if (cartesiaKey) {
        voiceProvider = new CartesiaTTSProvider(cartesiaKey);
        logger.info('Cartesia TTS Provider initialized');
    } else {
        logger.warn('CARTESIA_API_KEY not found, TTS will be disabled');
    }

    // Register IPC handlers
    registerIpcHandlers(voiceProvider || undefined);

    // Create main window
    await createWindow();

    // Create system tray
    createTray();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

function createTray() {
    // Create a simple tray icon (you can replace with custom icon)
    const icon = nativeImage.createEmpty();
    tray = new Tray(icon);

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show',
            click: () => {
                const mainWindow = getMainWindow();
                mainWindow?.show();
            },
        },
        {
            label: 'Quit',
            click: () => {
                app.quit();
            },
        },
    ]);

    tray.setToolTip('Voice Assistant');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
        const mainWindow = getMainWindow();
        mainWindow?.show();
    });
}

// Handle graceful shutdown
app.on('before-quit', () => {
    if (tray) {
        tray.destroy();
    }
});
