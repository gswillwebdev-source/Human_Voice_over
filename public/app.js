// Text-to-Speech Application with Audio Recording
class TextToSpeechApp {
    constructor() {
        // Initialize speech synthesis (for voice selection UI only)
        this.synth = window.speechSynthesis;
        this.utterance = null;
        this.isPlaying = false;
        this.isPaused = false;
        this.history = this.loadHistory();

        // Audio playback
        this.audioElement = null;
        this.audioChunks = []; // Stores the audio blob for download

        this.initializeElements();
        this.attachEventListeners();
        this.populateVoices();
        this.renderHistory();

        // Re-populate voices when they are loaded
        this.synth.onvoiceschanged = () => this.populateVoices();
    }

    initializeElements() {
        this.scriptInput = document.getElementById('scriptInput');
        this.charCount = document.getElementById('charCount');
        this.languageSelect = document.getElementById('languageSelect');
        this.voiceSelect = document.getElementById('voiceSelect');
        this.speedControl = document.getElementById('speedControl');
        this.speedValue = document.getElementById('speedValue');
        this.pitchControl = document.getElementById('pitchControl');
        this.pitchValue = document.getElementById('pitchValue');
        this.playBtn = document.getElementById('playBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resumeBtn = document.getElementById('resumeBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.status = document.getElementById('status');
        this.historyList = document.getElementById('historyList');
    }

    attachEventListeners() {
        this.scriptInput.addEventListener('input', () => this.updateCharCount());
        this.languageSelect.addEventListener('change', () => this.populateVoices());
        this.speedControl.addEventListener('input', (e) => {
            this.speedValue.textContent = e.target.value + 'x';
        });
        this.pitchControl.addEventListener('input', (e) => {
            this.pitchValue.textContent = e.target.value + 'x';
        });

        this.playBtn.addEventListener('click', () => this.play());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resumeBtn.addEventListener('click', () => this.resume());
        this.stopBtn.addEventListener('click', () => this.stop());
        this.downloadBtn.addEventListener('click', () => this.downloadAudio());
    }

    updateCharCount() {
        const length = this.scriptInput.value.length;
        this.charCount.textContent = `${length}`;
        if (length > 0) {
            this.charCount.parentElement.style.color = '#666';
        } else {
            this.charCount.parentElement.style.color = '#999';
        }
    }

    populateVoices() {
        const voices = this.synth.getVoices();
        const selectedLanguage = this.languageSelect.value;

        // Clear existing options except the first one
        while (this.voiceSelect.options.length > 1) {
            this.voiceSelect.remove(1);
        }

        // Filter voices by language
        const filteredVoices = voices.filter(voice => {
            return voice.lang.startsWith(selectedLanguage.split('-')[0]);
        });

        if (filteredVoices.length === 0) {
            // If no voices for this language, show all available
            filteredVoices.push(...voices);
        }

        // Separate storyteller voices
        const storytellerKeywords = ['david', 'mark', 'guy', 'male', 'father', 'narrator', 'zira'];
        const storytellerVoices = [];
        const regularVoices = [];

        filteredVoices.forEach((voice) => {
            const voiceName = voice.name.toLowerCase();
            const isStoryteller = storytellerKeywords.some(keyword => voiceName.includes(keyword));
            if (isStoryteller) {
                storytellerVoices.push(voice);
            } else {
                regularVoices.push(voice);
            }
        });

        // Add storyteller voices first with group
        if (storytellerVoices.length > 0) {
            const storytellerGroup = document.createElement('optgroup');
            storytellerGroup.label = '🎭 Storyteller Voices';
            storytellerVoices.forEach((voice) => {
                const option = document.createElement('option');
                option.value = voices.indexOf(voice);
                option.textContent = `${voice.name} (${voice.lang})`;
                storytellerGroup.appendChild(option);
            });
            this.voiceSelect.appendChild(storytellerGroup);
        }

        // Add regular voices with group
        if (regularVoices.length > 0) {
            const regularGroup = document.createElement('optgroup');
            regularGroup.label = '🗣️ Standard Voices';
            regularVoices.forEach((voice) => {
                const option = document.createElement('option');
                option.value = voices.indexOf(voice);
                option.textContent = `${voice.name} (${voice.lang})`;
                regularGroup.appendChild(option);
            });
            this.voiceSelect.appendChild(regularGroup);
        }

        // Fallback if no voices in groups
        if (storytellerVoices.length === 0 && regularVoices.length === 0) {
            filteredVoices.forEach((voice) => {
                const option = document.createElement('option');
                option.value = voices.indexOf(voice);
                option.textContent = `${voice.name} (${voice.lang})`;
                this.voiceSelect.appendChild(option);
            });
        }
    }

    async play() {
        const scriptText = this.scriptInput.value.trim();

        if (!scriptText) {
            this.updateStatus('Please enter some text to read!', 'error');
            return;
        }

        // Stop any existing speech
        if (this.synth.speaking) {
            this.synth.cancel();
        }

        this.isPlaying = true;
        this.isPaused = false;
        const selectedLanguage = this.languageSelect.value;

        this.updateStatus(`🔄 Generating audio... (${scriptText.length} characters)`, 'playing');
        this.updateButtonStates();

        try {
            // Get audio from server
            const response = await fetch('/api/synthesize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: scriptText,
                    language: selectedLanguage,
                    speed: parseFloat(this.speedControl.value),
                    pitch: parseFloat(this.pitchControl.value)
                })
            });

            if (!response.ok) {
                let errorMsg = `Server error (${response.status})`;
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.error || errorMsg;
                } catch (e) {
                    // Response wasn't JSON, use generic error
                }
                throw new Error(errorMsg);
            }

            // Get audio blob
            const audioBlob = await response.blob();

            if (audioBlob.size === 0) {
                throw new Error('Received empty audio file');
            }

            this.audioChunks = [audioBlob]; // Store for download

            // Create audio element for playback
            if (this.audioElement && this.audioElement.parentNode) {
                this.audioElement.parentNode.removeChild(this.audioElement);
            }

            this.audioElement = new Audio();
            const audioUrl = URL.createObjectURL(audioBlob);
            this.audioElement.src = audioUrl;

            // Set up event listeners
            this.audioElement.onplay = () => {
                this.isPlaying = true;
                this.isPaused = false;
                this.updateStatus(`🔊 Reading in ${this.getLanguageName(selectedLanguage)}... (${scriptText.length} characters)`, 'playing');
                this.updateButtonStates();
            };

            this.audioElement.onpause = () => {
                if (this.audioElement.currentTime < this.audioElement.duration) {
                    this.isPaused = true;
                    this.updateStatus('⏸ Paused', 'paused');
                    this.updateButtonStates();
                }
            };

            this.audioElement.onended = () => {
                this.isPlaying = false;
                this.isPaused = false;
                URL.revokeObjectURL(audioUrl);
                this.updateStatus('✅ All done! Ready to download or read another script.', 'stopped');
                this.updateButtonStates();
                this.addToHistory(scriptText);
            };

            this.audioElement.onerror = (error) => {
                this.updateStatus(`❌ Error playing audio`, 'error');
                this.isPlaying = false;
                URL.revokeObjectURL(audioUrl);
                this.updateButtonStates();
            };

            // Start playing
            await this.audioElement.play();

        } catch (error) {
            console.error('Play error:', error);
            this.updateStatus(`❌ Error: ${error.message}`, 'error');
            this.isPlaying = false;
            this.updateButtonStates();
        }
    }

    pause() {
        if (this.audioElement && this.audioElement.playing) {
            this.audioElement.pause();
        }
    }

    resume() {
        if (this.audioElement && this.audioElement.paused) {
            this.audioElement.play();
        }
    }

    stop() {
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
        }
        this.isPlaying = false;
        this.isPaused = false;
        this.updateStatus('⏹ Stopped', 'stopped');
        this.updateButtonStates();
    }

    downloadAudio() {
        if (this.audioChunks.length === 0) {
            this.updateStatus('⚠️ Please play the audio first, then download it.', 'error');
            return;
        }

        try {
            // Get the audio blob (stored when synthesized)
            const audioBlob = this.audioChunks[0];
            const url = URL.createObjectURL(audioBlob);
            const link = document.createElement('a');
            link.href = url;

            // Generate filename with timestamp
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            const filename = `voiceover-${timestamp}.mp3`;

            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Delay URL revocation to ensure download completes
            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 100);

            this.updateStatus(`✅ Audio downloaded as: ${filename}`, 'stopped');
        } catch (error) {
            console.error('Download error:', error);
            this.updateStatus('❌ Error downloading audio. Please try again.', 'error');
        }
    }

    startAudioRecording() {
        // Audio is now handled server-side, no need for client-side recording
    }

    stopAudioRecording() {
        // Audio is now handled server-side, no need for client-side recording
    }

    getLanguageName(langCode) {
        const languages = {
            'en-US': 'English',
            'en-GB': 'English (British)',
            'fr-FR': 'French',
            'es-ES': 'Spanish',
            'de-DE': 'German'
        };
        return languages[langCode] || langCode;
    }

    addToHistory(text) {
        const timestamp = new Date().toLocaleTimeString();
        const historyItem = {
            text: text,
            time: timestamp,
        };

        this.history.unshift(historyItem);
        if (this.history.length > 10) {
            this.history.pop(); // Keep only 10 recent items
        }

        this.saveHistory();
        this.renderHistory();
    }

    saveHistory() {
        localStorage.setItem('ttsHistory', JSON.stringify(this.history));
    }

    loadHistory() {
        const saved = localStorage.getItem('ttsHistory');
        return saved ? JSON.parse(saved) : [];
    }

    renderHistory() {
        if (this.history.length === 0) {
            this.historyList.innerHTML = '<p class="empty-history">No recent scripts yet</p>';
            return;
        }

        this.historyList.innerHTML = this.history
            .map(
                (item, index) => `
      <div class="history-item" onclick="app.loadFromHistory(${index})">
        <span class="history-item-text">${this.escapeHtml(item.text)}</span>
        <span class="history-item-time">${item.time}</span>
      </div>
    `
            )
            .join('');
    }

    loadFromHistory(index) {
        if (this.history[index]) {
            this.scriptInput.value = this.history[index].text;
            this.updateCharCount();
            this.scriptInput.focus();
        }
    }

    updateStatus(message, condition = '') {
        this.status.textContent = message;
        const statusSection = this.status.parentElement;
        statusSection.classList.remove('playing', 'paused', 'stopped', 'error');
        if (condition) {
            statusSection.classList.add(condition);
        }
    }

    updateButtonStates() {
        const hasText = this.scriptInput.value.trim() !== '';
        const hasAudio = this.audioChunks.length > 0;

        if (this.isPlaying && !this.isPaused) {
            this.playBtn.disabled = true;
            this.pauseBtn.disabled = false;
            this.pauseBtn.classList.remove('hidden');
            this.resumeBtn.classList.add('hidden');
            this.stopBtn.disabled = false;
            this.downloadBtn.disabled = true;
        } else if (this.isPaused) {
            this.playBtn.disabled = true;
            this.pauseBtn.classList.add('hidden');
            this.resumeBtn.disabled = false;
            this.resumeBtn.classList.remove('hidden');
            this.stopBtn.disabled = false;
            this.downloadBtn.disabled = true;
        } else {
            this.playBtn.disabled = !hasText;
            this.pauseBtn.disabled = true;
            this.pauseBtn.classList.remove('hidden');
            this.resumeBtn.classList.add('hidden');
            this.resumeBtn.disabled = true;
            this.stopBtn.disabled = true;
            this.downloadBtn.disabled = !hasAudio;
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TextToSpeechApp();
});
