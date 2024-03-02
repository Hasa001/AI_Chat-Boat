import chat from "./utils.js";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5000;
// const ApiKey = process.env.API_KEY;

// CORS options 
const corsOptions = {
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true, 
};

app.use(cors(corsOptions));
app.use(express.json()); 

// const genAI = new GoogleGenerativeAI(ApiKey)

let conversationHistory = [
  { role: "system", content: "You are a helpful assistant." },
];

app.post("/ask", async (req, res) => {
  const userMessage = req.body.message;

  conversationHistory.push({ role: "user", content: userMessage });

  try {

    const result = await chat.sendMessage(userMessage);
    const response =  result.response;
    console.log(response.text());
    const botResponse = response.text();

    conversationHistory.push({ role: "assistant", content: botResponse });

    res.json({ message: botResponse });
  } catch (error) {
    console.error("Error calling OpenAI: ", error);
    res.status(500).send("Error generating response from OpenAI");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// node --version # Should be >= 18
// npm install @google/generative-ai


