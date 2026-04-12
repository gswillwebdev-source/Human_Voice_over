const express = require('express');
const cors = require('cors');
const path = require('path');
const gTTS = require('gtts');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// TTS endpoint using gTTS (Google Text-to-Speech)
app.post('/api/synthesize', async (req, res) => {
  try {
    console.log('Request received');
    const { text, language = 'en' } = req.body;

    if (!text || typeof text !== 'string' || text.trim() === '') {
      console.log('Error: Text is empty or missing');
      return res.status(400).json({ error: 'Text is required' });
    }

    console.log(`Synthesizing: "${text.substring(0, 50)}..." (${text.length} chars) in ${language}`);

    // Map language codes
    const langMap = {
      'en-US': 'en',
      'en-GB': 'en',
      'fr-FR': 'fr',
      'es-ES': 'es',
      'de-DE': 'de'
    };
    const lang = langMap[language] || 'en';

    try {
      // Split text into chunks if needed (gTTS has character limits)
      const maxChunkSize = 100;
      const chunks = [];
      const words = String(text).split(' ');
      let currentChunk = '';

      for (const word of words) {
        const testChunk = currentChunk ? currentChunk + ' ' + word : word;
        if (testChunk.length > maxChunkSize) {
          if (currentChunk) chunks.push(currentChunk.trim());
          currentChunk = word;
        } else {
          currentChunk = testChunk;
        }
      }
      if (currentChunk.trim()) chunks.push(currentChunk.trim());

      console.log(`Split text into ${chunks.length} chunks`);

      // Collect all audio buffers
      const audioChunks = [];

      for (let i = 0; i < chunks.length; i++) {
        const chunkText = String(chunks[i]).trim();
        if (!chunkText) continue;
        
        console.log(`Processing chunk ${i + 1}/${chunks.length}... (${chunkText.length} chars)`);

        try {
          const speech = new gTTS(chunkText, lang);
          
          // Get audio as buffer
          const audioBuffer = await new Promise((resolve, reject) => {
            const buffers = [];
            speech.stream()
              .on('data', (chunk) => buffers.push(chunk))
              .on('end', () => {
                const combined = Buffer.concat(buffers);
                console.log(`  Chunk size: ${combined.length} bytes`);
                resolve(combined);
              })
              .on('error', (err) => {
                console.error(`  Stream error:`, err.message);
                reject(err);
              });
          });

          if (audioBuffer && audioBuffer.length > 0) {
            audioChunks.push(audioBuffer);
          }
        } catch (chunkError) {
          console.error(`Failed to process chunk ${i + 1}:`, chunkError.message);
          throw chunkError;
        }
      }

      if (audioChunks.length === 0) {
        throw new Error('No audio data generated');
      }

      // Combine all chunks
      const fullAudio = Buffer.concat(audioChunks);
      console.log(`Combined ${audioChunks.length} chunks, total size: ${fullAudio.length} bytes`);

      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Length', fullAudio.length);
      res.send(fullAudio);

    } catch (ttsError) {
      console.error('TTS Error:', ttsError.message);
      res.status(500).json({ error: 'Text-to-speech service failed: ' + ttsError.message });
    }

  } catch (error) {
    console.error('Server Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🎤 AI Text-to-Speech app running on http://localhost:${PORT}`);
});
