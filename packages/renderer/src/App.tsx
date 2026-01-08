import { useState } from 'react';
import { VoiceOrb } from './components/VoiceOrb';
import { ChatPanel } from './components/ChatPanel';
import { useAppStore } from './store';

// Declare the electronAPI type
declare global {
    interface Window {
        electronAPI: {
            window: {
                expand: () => Promise<{ success: boolean }>;
                collapse: () => Promise<{ success: boolean }>;
                minimize: () => Promise<{ success: boolean }>;
                close: () => Promise<{ success: boolean }>;
            };
            voice: {
                startListening: () => Promise<{ success: boolean }>;
                stopListening: () => Promise<{ success: boolean }>;
            };
            chat: {
                sendMessage: (message: string) => Promise<{ success: boolean; response: string }>;
            };
            app: {
                getVersion: () => Promise<string>;
            };
        };
    }
}

function App() {
    const { isExpanded, setExpanded } = useAppStore();

    const handleExpand = async () => {
        await window.electronAPI.window.expand();
        setExpanded(true);
    };

    const handleCollapse = async () => {
        await window.electronAPI.window.collapse();
        setExpanded(false);
    };

    return (
        <div className="app">
            {isExpanded ? (
                <ChatPanel onCollapse={handleCollapse} />
            ) : (
                <VoiceOrb onExpand={handleExpand} />
            )}
        </div>
    );
}

export default App;
