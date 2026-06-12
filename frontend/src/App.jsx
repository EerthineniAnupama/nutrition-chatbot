import { useState } from "react";

function App() {
  // Chatbot
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const [loading, setLoading] = useState(false);

  // BMI
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmiResult, setBmiResult] = useState(null);

  // Calories
  const [calorieData, setCalorieData] = useState({
    age: "",
    gender: "",
    weight: "",
    height: "",
    activity_level: "",
  });

  const [caloriesResult, setCaloriesResult] = useState(null);

  // Ask chatbot
  const askQuestion = async () => {
  try {
    setLoading(true);

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
  } catch (error) {
    console.error(error);
    setAnswer("Failed to connect to server.");
  } finally {
    setLoading(false);
  }
};

  // BMI
  const calculateBMI = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/bmi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          height: Number(height),
          weight: Number(weight),
        }),
      });

      const data = await response.json();
      setBmiResult(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Calories
  const calculateCalories = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/calories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          age: Number(calorieData.age),
          gender: calorieData.gender,
          weight: Number(calorieData.weight),
          height: Number(calorieData.height),
          activity_level: calorieData.activity_level,
        }),
      });

      const data = await response.json();
      setCaloriesResult(data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
  <div
    style={{
      minHeight: "100vh",
      background: "#0f172a",
      color: "white",
      padding: "30px",
      fontFamily: "Arial, sans-serif",
    }}
  >
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "42px",
          marginBottom: "10px",
        }}
      >
        🥗 Nutrition AI Assistant
      </h1>

      <p
        style={{
          textAlign: "center",
          color: "#94a3b8",
          marginBottom: "30px",
        }}
      >
        AI-powered nutrition guidance with BMI and calorie tracking
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "30px",
        }}
      >
        <button onClick={() => setActiveTab("chat")}>
          Chatbot
        </button>

        <button onClick={() => setActiveTab("bmi")}>
          BMI
        </button>

        <button onClick={() => setActiveTab("calories")}>
          Calories
        </button>
      </div>

      {/* CHAT */}
      {activeTab === "chat" && (
        <div
          style={{
            background: "#1e293b",
            padding: "25px",
            borderRadius: "15px",
          }}
        >
          <h2>Nutrition Chatbot</h2>

          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a nutrition question..."
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              marginTop: "10px",
            }}
          />

          <button
            onClick={askQuestion}
            style={{
              marginTop: "15px",
              padding: "12px 20px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Ask Question
          </button>

          {loading && (
            <p style={{ marginTop: "15px" }}>
              Thinking...
            </p>
          )}

          {answer && (
            <div
              style={{
                marginTop: "20px",
                background: "#334155",
                padding: "15px",
                borderRadius: "10px",
              }}
            >
              {answer}
            </div>
          )}
        </div>
      )}

      {/* BMI */}
      {activeTab === "bmi" && (
        <div
          style={{
            background: "#1e293b",
            padding: "25px",
            borderRadius: "15px",
          }}
        >
          <h2>BMI Calculator</h2>

          <input
            type="number"
            placeholder="Height (cm)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "10px",
            }}
          />

          <input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
            }}
          />

          <button
            onClick={calculateBMI}
            style={{
              marginTop: "15px",
              padding: "12px 20px",
              background: "#16a34a",
              color: "white",
              border: "none",
              borderRadius: "8px",
            }}
          >
            Calculate BMI
          </button>

          {bmiResult && (
            <div
              style={{
                marginTop: "20px",
                background: "#14532d",
                padding: "15px",
                borderRadius: "10px",
              }}
            >
              <h3>BMI: {bmiResult.bmi}</h3>
              <p>{bmiResult.category}</p>
            </div>
          )}
        </div>
      )}

      {/* CALORIES */}
      {activeTab === "calories" && (
        <div
          style={{
            background: "#1e293b",
            padding: "25px",
            borderRadius: "15px",
          }}
        >
          <h2>🔥 Calorie Calculator</h2>

          <input
            placeholder="Age"
            onChange={(e) =>
              setCalorieData({
                ...calorieData,
                age: e.target.value,
              })
            }
            style={{ width: "100%", padding: "12px", marginBottom: "10px" }}
          />

          <input
            placeholder="Gender"
            onChange={(e) =>
              setCalorieData({
                ...calorieData,
                gender: e.target.value,
              })
            }
            style={{ width: "100%", padding: "12px", marginBottom: "10px" }}
          />

          <input
            placeholder="Weight (kg)"
            onChange={(e) =>
              setCalorieData({
                ...calorieData,
                weight: e.target.value,
              })
            }
            style={{ width: "100%", padding: "12px", marginBottom: "10px" }}
          />

          <input
            placeholder="Height (cm)"
            onChange={(e) =>
              setCalorieData({
                ...calorieData,
                height: e.target.value,
              })
            }
            style={{ width: "100%", padding: "12px", marginBottom: "10px" }}
          />

          <input
            placeholder="Activity Level"
            onChange={(e) =>
              setCalorieData({
                ...calorieData,
                activity_level: e.target.value,
              })
            }
            style={{ width: "100%", padding: "12px" }}
          />

          <button
            onClick={calculateCalories}
            style={{
              marginTop: "15px",
              padding: "12px 20px",
              background: "#ea580c",
              color: "white",
              border: "none",
              borderRadius: "8px",
            }}
          >
            Calculate Calories
          </button>

          {caloriesResult && (
            <div
              style={{
                marginTop: "20px",
                background: "#7c2d12",
                padding: "15px",
                borderRadius: "10px",
              }}
            >
              <h3>
                Maintenance: {caloriesResult.maintenance_calories}
              </h3>

              <p>
                Weight Loss: {caloriesResult.goal.weight_loss}
              </p>

              <p>
                Weight Gain: {caloriesResult.goal.weight_gain}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);

  
}

export default App;