# 🎤 AI Text-to-Speech Application

A powerful and intuitive web-based text-to-speech application that converts written scripts into natural-sounding audio using AI voices. Perfect for creating voiceovers, narrations, and audio content for video projects.

## ✨ Features

### 🌍 Multi-Language Support
- **English** - Full support with multiple US English voices
- **French** - Complete French language support with French voices
- Easily switch between languages with the language dropdown
- Each language has its own set of optimized voices

### 🗣️ Multiple AI Voices
- **Dynamic Voice Selection** - Voice options automatically update based on the selected language
- **Multiple Voice Variants** - Choose from different voice personalities per language
- **High-Quality Voices** - Professional-grade speech synthesis (Microsoft voices)
- Filter voices by language for easy selection

### 🎚️ Advanced Audio Controls
- **Speed Control** - Adjust playback speed from 0.5x (slow) to 2x (fast)
- **Pitch Control** - Modify voice pitch from 0.5x to 2x for unique effects
- **Real-time Preview** - Hear how changes affect the audio output
- **Live Sliders** - Visual feedback as you adjust settings

### 🎵 Full Playback Controls
- **▶ Play** - Start reading your script
- **⏸ Pause** - Temporarily pause the audio
- **▶ Resume** - Continue from where you paused
- **⏹ Stop** - Completely stop playback
- **Character Count** - Real-time character counter for your script

### 💾 Audio Download
- **Direct Download** - Save audio files directly to your computer
- **CapCut Compatible** - Audio format `.webm` is fully compatible with CapCut and other video editors
- **Custom Filenames** - Files are automatically named with timestamps (e.g., `voiceover-2024-04-11T14-30-45.webm`)
- **File Browser Dialog** - Choose where to save your audio files

### 📝 History Management
- **Recent Scripts** - Automatically saves your last 10 scripts
- **Quick Access** - Click any recent script to load it immediately
- **Local Storage** - All history is saved locally in your browser
- **Persistent Memory** - Scripts remain saved even after closing the browser

## 🚀 Getting Started

### Prerequisites
- Node.js installed on your computer
- A modern web browser (Chrome, Firefox, Edge, Safari)

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd "c:\Users\ADMIN\OneDrive\Desktop\ai voice over"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
   ```

## 📖 How to Use

### Creating a Voiceover

1. **Paste Your Script**
   - Click in the text area
   - Paste or type your script
   - The character count updates in real-time

2. **Select Language**
   - Choose "English" or "Français (French)" from the Language dropdown
   - Voice options automatically filter to match the selected language

3. **Choose a Voice**
   - Select from the available voices for your chosen language
   - Each voice has a unique personality and accent

4. **Adjust Settings** (Optional)
   - **Speed**: Drag the slider to make speech faster (up to 2x) or slower (0.5x)
   - **Pitch**: Modify the voice pitch for different effects or character voices

5. **Play the Audio**
   - Click **▶ Play** to hear your script
   - Use **⏸ Pause** and **▶ Resume** to control playback
   - Click **⏹ Stop** to stop completely

6. **Download the Audio**
   - After playing, click **⬇ Download**
   - A file dialog will appear to choose where to save
   - Default filename format: `voiceover-YYYY-MM-DDTHH-MM-SS.webm`
   - The file is ready to import directly into CapCut

### Using Downloaded Audio in CapCut

1. Open your project in CapCut
2. Click **"Add"** → **"Audio"**
3. Select the downloaded `.webm` file
4. The audio will be imported and ready to use
5. Sync with your video clips as needed

## 🎯 Example Use Cases

- **YouTube Videos** - Add professional voiceovers to your content
- **CapCut Projects** - Create narrated videos with AI voices
- **Podcasts** - Generate episode introductions or segments
- **Educational Content** - Record lectures and tutorials
- **Marketing Videos** - Professional promotional content
- **Multilingual Content** - Create content in English or French
- **Character Voices** - Adjust pitch and speed for different characters
- **Audiobooks** - Convert text to natural-sounding audio

## 🛠️ Technical Details

### Technology Stack
- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Audio**: Web Speech API, Web Audio API, MediaRecorder API
- **Storage**: Browser LocalStorage for history

### Audio Format
- **Output Format**: WebM (Vorbis codec)
- **Compatibility**: Works with CapCut, Adobe Premier, DaVinci Resolve, OBS, and most video editors
- **Quality**: Natural, professional speech synthesis

### Browser Support
- Chrome/Chromium (recommended)
- Firefox
- Edge
- Safari (limited voice availability)

## 🔧 Troubleshooting

### Download Button is Disabled
- **Solution**: You must click "Play" first to record the audio, then the Download button will become enabled

### No Voices Available
- **Solution**: Refresh the page and wait 2-3 seconds for voices to load. Different browsers have different voice availability.

### Audio Quality is Poor
- **Solution**: 
  - Use a different voice
  - Adjust the speed (slower usually sounds better)
  - Adjust the pitch for a different effect
  - Use the default voice if available

### French Voices Not Available
- **Solution**: If your system doesn't have French voices, the app will show available alternatives. You can still set the language to French to test the language switching feature.

## 📁 Project Structure

```
ai voice over/
├── server.js              # Express server
├── package.json           # Dependencies
├── public/
│   ├── index.html         # Main UI
│   ├── app.js             # JavaScript logic
│   └── style.css          # Styling
└── README.md             # This file
```

## 🎨 Customization

You can customize the app by modifying:
- **Voice list**: Edit `app.js` to add more languages
- **Styling**: Edit `public/style.css` for colors and design
- **Controls**: Edit `public/app.js` to adjust sliders and limits

## 📝 License

This project is open source and available for personal and commercial use.

## 🆘 Support

For issues or questions:
1. Check the Troubleshooting section above
2. Ensure your browser is up to date
3. Try a different browser
4. Clear browser cache and cookies
5. Restart the application

## 🚀 Future Enhancements

Planned features for future versions:
- Additional language support (Spanish, German, Italian, etc.)
- Multiple output formats (MP3, WAV, OGG)
- Batch processing (multiple scripts at once)
- Custom voice profiles
- Pronunciation dictionary
- Voice cloning technology
- Cloud storage integration

---

**Version**: 1.0.0  
**Last Updated**: April 2024  
**Created for**: Professional AI voiceover creation

Enjoy creating professional voiceovers with AI Text-to-Speech! 🎉
