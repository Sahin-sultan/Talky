// Welcome Animation with Particles Effect

function playWelcomeSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create a simple pleasant beep sequence
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 (major chord)
        
        notes.forEach((frequency, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            
            const startTime = audioContext.currentTime + (index * 0.15);
            const duration = 0.2;
            
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
        });
    } catch (error) {
        // Silently fail if audio not supported
        console.log('Audio not supported');
    }
}

function createWelcomeParticles() {
    const container = document.createElement('div');
    container.id = 'welcome-particles';
    container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
        overflow: hidden;
    `;
    
    document.body.appendChild(container);
    
    // Create particles
    const particleCount = 30;
    const colors = ['#5b7cff', '#7b4dff', '#00f2fe', '#667eea'];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 8 + 4;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const startX = Math.random() * 100;
        const endX = startX + (Math.random() * 40 - 20);
        const duration = Math.random() * 2 + 1.5;
        const delay = Math.random() * 0.5;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            left: ${startX}%;
            top: -20px;
            opacity: 0.8;
            animation: particleFall ${duration}s ease-in ${delay}s forwards;
            box-shadow: 0 0 10px ${color};
        `;
        
        container.appendChild(particle);
    }
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particleFall {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 0.8;
            }
            100% {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Play welcome sound
    playWelcomeSound();
    
    // Remove particles after animation
    setTimeout(() => {
        container.remove();
        style.remove();
    }, 3000);
}

// Make function globally available
window.createWelcomeParticles = createWelcomeParticles;
