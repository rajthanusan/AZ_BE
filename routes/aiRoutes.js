// routes/aiRoutes.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const faiss = require('faiss-node');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

dotenv.config();

const router = express.Router();
router.use(cors());
router.use(express.json());

const GOOGLEAI_API_KEY = process.env.GOOGLEAI_API_KEY;
const genAI = new GoogleGenerativeAI(GOOGLEAI_API_KEY);
const model = genAI.getGenerativeModel({model:'gemini-1.5-flash'});

const dimension = 768;
const index = new faiss.IndexFlatL2(dimension);
const upload = multer({ dest: 'uploads/' });

async function getEmbeddings(text) {
  try {
    const result = await model.generateContent(`Summarize the following text in 5 key points:\n\n${text}`);
    const summary = result.response.text();
    const words = summary.toLowerCase().split(/\W+/).filter(word => word.length > 0);
    const embedding = new Array(dimension).fill(0);

    for (let i = 0; i < words.length && i < dimension; i++) {
      embedding[i] = words[i].charCodeAt(0) / 255; // Normalize to [0, 1]
    }

    return embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    return new Array(dimension).fill(0).map(() => Math.random());
  }
}

// PDF processing logic
async function processSpecificPDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    const text = data.text;

    const chunks = [];
    const chunkSize = 1000;
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize));
    }

    const chunkStore = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await getEmbeddings(chunk);
      index.add(embedding);
      chunkStore.push({ id: i, text: chunk });
    }

    fs.writeFileSync('chunkStore.json', JSON.stringify(chunkStore));
  } catch (error) {
    console.error('Error processing PDF:', error);
  }
}

// PDF Upload Route
router.post('/upload-pdf', upload.single('file'), async (req, res) => {
  const pdfPath = req.file.path;
  await processSpecificPDF(pdfPath);
  res.json({ message: 'PDF processed successfully.' });
});

// Chat Route
// Chat Route
router.post('/chat', async (req, res) => {
  const { message } = req.body;

  // Service details
  const services = `
    - Construction: Foundation work, bricklaying, roofing, flooring
    - Plumbing: Water line installation, drain cleaning
    - Electrical: Wiring, lighting, panel upgrades
    - Interior and Exterior Painting
    - Carpentry: Custom woodwork, repairs
    - Flooring installation, aluminum and glass fitting, marble fitting
    - HVAC installation and repair
    - Appliance installation and general handyman services
    - Landscaping and gardening
  `;

  // Custom room design info
  const customRoomDesign = `
    To use the custom room design tool, first upload an image of your room or hall. Then, you can upload furniture items, resize, and move them to your preference to design the layout.
  `;

  // Location info
  const locationInfo = `
    Our services are currently available in the Northern Province only.
  `;

  // Workers info
  const workersInfo = `
    All our workers are highly trained, certified, and trustworthy professionals with years of experience in property management and maintenance.
  `;

  // Plans info
  const plans = `
    We offer three tailored property management packages:
    - **Premium**: $90 - Includes all weekly base plans, deep cleaning (inside and outside), window and door cleaning, garden maintenance, interior maintenance, and security checks.
    - **Basic**: $80 - Covers regular cleaning, outside cleaning, outside floors, waste management, basic repairs, and utility management.
    - **Pro**: $95 - Includes all premium plans along with full property management.
  `;

  // Greet the user with a welcome message if they say "hi" or "hello"
  const greetings = /hi|hello|hey/i.test(message);
  if (greetings) {
    res.json({
      response: `Welcome to Azboard! How can I help you today?`
    });
    return;
  }

  // Check if the message contains specific keywords and return relevant info
  const isServiceQuery = /service/i.test(message);
  const isLocationQuery = /location/i.test(message);
  const isCustomRoomDesignQuery = /custom room design/i.test(message);
  const isWorkerQuery = /worker|workers/i.test(message);
  const isPlanQuery = /plan|plans/i.test(message);

  if (isServiceQuery) {
    res.json({
      response: `Here are the services we offer:\n${services}`
    });
    return;
  }

  if (isLocationQuery) {
    res.json({
      response: `Our services are available in the Northern Province only.`
    });
    return;
  }

  if (isCustomRoomDesignQuery) {
    res.json({
      response: customRoomDesign
    });
    return;
  }

  if (isWorkerQuery) {
    res.json({
      response: workersInfo
    });
    return;
  }

  if (isPlanQuery) {
    res.json({
      response: `Here are our property management plans:\n${plans}`
    });
    return;
  }

  // If no specific keyword matches, continue to generate an AI response based on the message
  const queryEmbedding = await getEmbeddings(message);
  const ntotal = index.ntotal();
  const k = Math.min(5, ntotal);

  if (k === 0) {
    res.json({ response: "I'm sorry, but I don't have any information to work with yet." });
    return;
  }

  const searchResult = index.search(queryEmbedding, k);
  const distances = searchResult.distances || [];
  const chunkStore = JSON.parse(fs.readFileSync('chunkStore.json', 'utf8'));
  const neighbors = distances.map((_, index) => index).sort((a, b) => distances[a] - distances[b]).slice(0, k);
  const relevantDocs = neighbors.map(id => chunkStore[id].text);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `
    Context: ${relevantDocs.join('\n\n')}
    User: ${message}
    AI: Respond appropriately to the user's query.
  `;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  res.json({
    response: response.trim() // Return the AI's response
  });
});



module.exports = router;
