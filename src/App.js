import React, { useState } from "react";
import axios from "axios";

const ChatGPT = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleAnswerRequest = async () => {
    const apiUrl = "https://api.openai.com/v1/chat/completions";
    const apiHeaders = {
      "Content-Type": "application/json",
      Authorization: "Bearer YOUR_API_KEY",
    };
    const apiBody = JSON.stringify({
      stream: true,
      max_tokens: 1000,
      model: "gpt-3.5-turbo",
      temperature: 0.8,
      top_p: 1,
      presence_penalty: 1,
      messages: [
        {
          role: "user",
          content: question,
        },
      ],
    });

    const response = await axios({
      url: apiUrl,
      method: "POST",
      headers: apiHeaders,
      body: apiBody,
    });

    const answerData = response.data.choices[0];
    setAnswer(answerData.text);
  };
  
  return (
    <div>
      <input
        type="text"
        placeholder="Enter your question"
        onChange={handleQuestionChange}
        value={question}
      />
      <button onClick={handleAnswerRequest}>Get Answer</button>
      <p>{answer}</p>
    </div>
  );
};

export default ChatGPT;
