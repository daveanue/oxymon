import { motion } from 'framer-motion';
import { useAppStore } from '../store';

interface VoiceOrbProps {
    onExpand: () => void;
}

export function VoiceOrb({ onExpand }: VoiceOrbProps) {
    const { isListening, isSpeaking, setListening } = useAppStore();

    const handleClick = () => {
        if (isListening) {
            window.electronAPI.voice.stopListening();
            setListening(false);
        } else {
            window.electronAPI.voice.startListening();
            setListening(true);
        }
    };

    const handleDoubleClick = () => {
        onExpand();
    };

    // Determine orb color based on state
    const getOrbColor = () => {
        if (isSpeaking) return ['#22c55e', '#16a34a']; // Green when speaking
        if (isListening) return ['#3b82f6', '#2563eb']; // Blue when listening
        return ['#6366f1', '#4f46e5']; // Purple default
    };

    const [color1, color2] = getOrbColor();

    return (
        <div className="voice-orb-container" onDoubleClick={handleDoubleClick}>
            <motion.div
                className="voice-orb"
                onClick={handleClick}
                animate={{
                    scale: isListening ? [1, 1.1, 1] : 1,
                    boxShadow: isListening
                        ? [
                            `0 0 20px ${color1}40`,
                            `0 0 40px ${color1}60`,
                            `0 0 20px ${color1}40`,
                        ]
                        : `0 0 20px ${color1}40`,
                }}
                transition={{
                    duration: 1.5,
                    repeat: isListening ? Infinity : 0,
                    ease: 'easeInOut',
                }}
                style={{
                    background: `linear-gradient(135deg, ${color1}, ${color2})`,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <motion.div
                    className="voice-orb-icon"
                    animate={{
                        opacity: isListening ? [0.7, 1, 0.7] : 1,
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: isListening ? Infinity : 0,
                    }}
                >
                    {isListening ? (
                        <svg viewBox="0 0 24 24" fill="white" width="40" height="40">
                            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z" />
                            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" fill="white" width="40" height="40">
                            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                        </svg>
                    )}
                </motion.div>
            </motion.div>
            <p className="voice-orb-hint">
                {isListening ? 'Listening...' : 'Click to speak'}
            </p>
        </div>
    );
}
