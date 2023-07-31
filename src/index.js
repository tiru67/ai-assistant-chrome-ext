// app.js

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';

function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleGenerateAnswer = async () => {
    const apiUrl = "https://api.openai.com/v1/chat/completions";
    const apiHeaders = {
      "Content-Type": "application/json",
      Authorization: "Bearer ",
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

    try {
      const response = await axios.post(apiUrl, apiBody, { headers: apiHeaders });

      // The response data is not iterable directly. We need to access the 'choices' array separately.
// Split the string into an array of messages
      const messages = response.data.split('\n\n');

      // Map over the array and parse each message as JSON
      const jsonMessages = messages.map(message => {
        // Remove 'data: ' from the start of the message
        const jsonStr = message.replace('data: ', '');

        // Parse the remaining string as JSON
        if(jsonStr!=='[DONE]' & jsonStr!==''){
        try {
          return JSON.parse(jsonStr);
        } catch (e) {
          console.error('Error parsing JSON:', e);
          return null;
        }
      }else{
        return null;
      }
      });

      let answerText = '';
      for (const message of jsonMessages) {
        if (!message) continue;
        answerText += message.choices[0].delta['content'];
      }
      setAnswer(answerText);
    } catch (error) {
      console.error("Error fetching answer:", error);
      setAnswer("Error fetching answer. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h1>Question Answering App</h1>
      <div className="form-group mt-3">
        <label htmlFor="questionInput">Enter your question:</label>
        <input
          type="text"
          className="form-control"
          id="questionInput"
          value={question}
          onChange={handleQuestionChange}
        />
      </div>
      <button className="btn btn-primary mt-3" onClick={handleGenerateAnswer}>
        Generate Answer
      </button>
      {answer && (
        <div className="mt-3">
          <strong>Answer:</strong>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
