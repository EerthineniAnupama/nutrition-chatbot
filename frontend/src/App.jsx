import { useState } from "react";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const askQuestion = async () => {
    const response = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: question,
      }),
    });

    const data = await response.json();
    setAnswer(data.answer);
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Nutrition Assistant</h1>

      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a nutrition question..."
      />

      <button onClick={askQuestion}>
        Ask
      </button>

      <h3>Answer</h3>
      <p>{answer}</p>
    </div>
  );
}

export default App;