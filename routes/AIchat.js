const express = require('express');
const router = express.Router();
const axios = require('axios');

// AI Chat route
router.post("/chat", async (req, res) => {
    const userMessage = req.body.message;
  
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: userMessage }],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );
  
      const botMessage = response.data.choices[0].message.content;
      res.json({ message: botMessage });
    } catch (error) {
      console.error("Error with OpenAI API:", error.response ? error.response.data : error.message);
      res.status(500).json({ error: "Something went wrong." });
    }
  });
  
module.exports = router;
