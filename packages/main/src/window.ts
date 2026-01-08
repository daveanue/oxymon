import { BrowserWindow, screen } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let mainWindow: BrowserWindow | null = null;

export function getMainWindow(): BrowserWindow | null {
    return mainWindow;
}

export async function createWindow(): Promise<BrowserWindow> {
    const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;

    // Start with minimal floating orb size
    const windowWidth = 120;
    const windowHeight = 120;

    mainWindow = new BrowserWindow({
        width: windowWidth,
        height: windowHeight,
        x: screenWidth - windowWidth - 20,
        y: screenHeight - windowHeight - 20,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        skipTaskbar: false,
        resizable: true,
        webPreferences: {
            preload: path.join(__dirname, '../../preload/dist/index.js'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true,
        },
    });

    // Load content based on environment
    const devServerUrl = process.env.VITE_DEV_SERVER_URL;

    if (devServerUrl) {
        // Development: load from Vite dev server
        await mainWindow.loadURL(devServerUrl);
        // Open DevTools in development (can be toggled)
        // mainWindow.webContents.openDevTools({ mode: 'detach' });
    } else {
        // Production: load from built files
        await mainWindow.loadFile(
            path.join(__dirname, '../../renderer/dist/index.html')
        );
    }

    // Handle window close
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Hide instead of close when clicking X (minimize to tray)
    mainWindow.on('close', (event) => {
        if (process.platform === 'darwin') {
            event.preventDefault();
            mainWindow?.hide();
        }
    });

    return mainWindow;
}

// Window control functions for IPC
export function expandWindow() {
    if (mainWindow) {
        mainWindow.setSize(400, 600);
        mainWindow.setAlwaysOnTop(false);
    }
}

export function collapseWindow() {
    if (mainWindow) {
        const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;
        mainWindow.setSize(120, 120);
        mainWindow.setPosition(screenWidth - 140, screenHeight - 140);
        mainWindow.setAlwaysOnTop(true);
    }
}
