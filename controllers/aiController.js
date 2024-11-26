const { Configuration, OpenAIApi } = require('openai');

// OpenAI அமைப்பு ஆரம்பிக்கவும்
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // API Key-ஐ சூட்சுமமாக கையாளவும்
});
const openai = new OpenAIApi(configuration);

exports.chatbotResponse = async (req, res) => {
    const { message } = req.body;

    // செய்தியை நுனி துடைத்து சற்றே சீரமைக்கவும்
    const userMessage = message.trim();

    try {
        // OpenAI-க்கு பதில் பெறவும்
        const response = await openai.createCompletion({
            model: 'text-davinci-003', // பிற மாதிரிகளைப் பயன்படுத்தலாம்
            prompt: userMessage,
            max_tokens: 150,
            temperature: 0.7, // சிறந்த கற்பனை அளவை அமைக்கவும்
        });

        const botResponse = response.data.choices[0].text.trim();
        return res.json({ response: botResponse });

    } catch (error) {
        console.error('OpenAI உடன் தொடர்பு கொண்டு பிழை:', error);
        return res.status(500).json({ error: 'AI-யுடன் தொடர்பு கொள்ள தோல்வி' });
    }
};
