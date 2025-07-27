// File: src/App.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ImageUploader } from "./components/ImageUploader";
import { EmotionBar } from "./components/EmotionBar";
import axios from "axios";
import "./App.css";

const moodMap = {
  happy: { label: "Happy", emoji: "😄", color: "mood-yellow" },
  sad: { label: "Sad", emoji: "😢", color: "mood-blue" },
  angry: { label: "Angry", emoji: "😠", color: "mood-red" },
  relaxed: { label: "Relaxed", emoji: "😌", color: "mood-green" },
};

const behaviorOptions = {
  posture: ["Standing tall", "Crouching low", "Rolling over"],
  activity: ["Running", "Sitting still", "Digging"],
  sound: ["Barking", "Whining", "Growling", "Silent"],
  facial: ["Relaxed eyes", "Wide eyes", "Bared teeth"],
  tail: ["Wagging fast", "Tail tucked", "Tail stiff"],
  humanInteraction: ["Licking owner's face", "Avoiding eye contact"],
  dogInteraction: ["Playing with other dogs", "Growling at other dogs"],
};

export default function App() {
  const [image, setImage] = useState(null);
  const [petName, setPetName] = useState("");
  const [mood, setMood] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("upload");
  const [description, setDescription] = useState("");
  const [exampleBehavior, setExampleBehavior] = useState({});

  const handlePredictMood = async () => {
    if (mode === "upload" && !image) return;
    if ((mode === "describe" || mode === "example") && !description) return;

    setLoading(true);
    try {
      if (mode === "upload") {
        const tokenRes = await axios.post(
          "https://www.nyckel.com/connect/token",
          new URLSearchParams({
            grant_type: "client_credentials",
            client_id: "y9m1dsn6raemjiflp95gymf5ywi9qr5e",
            client_secret: "wgz5xyjweg046h7g9ntr1wqbuh3haef050p2j9orp91hmaygo2z3xdd0qnbfu2l0",
          }),
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        const accessToken = tokenRes.data.access_token;

        const res = await axios.post(
          "https://www.nyckel.com/v1/functions/dog-emotions-identifier/invoke",
          { data: image },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Nyckel result:", res.data);

        const prediction = Array.isArray(res.data) ? res.data[0] : res.data;
        const label = prediction.labelName || prediction.label;
        const confidence = prediction.confidence ? (prediction.confidence * 100).toFixed(2) : undefined;
        const moodKey = label.toLowerCase();

        setMood({
          ...(moodMap[moodKey] || { label }),
          confidence: confidence,
        });
      } else {
        let finalDescription = description;
        if (mode === "example") {
          finalDescription = Object.values(exampleBehavior)
            .filter(Boolean)
            .join(", ");
        }

        const res = await axios.post(
          "http://localhost:5000/predict",
          { description: finalDescription },
          { headers: { "Content-Type": "application/json" } }
        );

        const label = res.data.mood;
        const confidence = res.data.confidence;
        const moodKey = label.toLowerCase();

        setMood({
          ...(moodMap[moodKey] || { label }),
          confidence: confidence,
        });
      }
    } catch (err) {
      console.error("Mood detection failed:", err);
      setMood(null);
    } finally {
      setLoading(false);
    }
  };

  const getSuggestions = (mood) => {
    switch (mood.label) {
      case "Happy":
        return [`Give ${petName} a treat!`, "Maybe play some fetch!"];
      case "Sad":
        return [`Cheer up ${petName} with their favorite toy!`, "A cuddle session might help!"];
      case "Angry":
        return [`Give ${petName} some space to calm down.`, "Maybe try some calming music for pets."];
      case "Relaxed":
        return [`It's a perfect time for a cozy nap for ${petName}.`, "Maybe a gentle rub on the belly?"];
      default:
        return [];
    }
  };

  return (
    <div className="app-root">
      <h1 className="title">🐾 Pet Mood Detector</h1>
      <p className="subtitle">your dog's emotions, detected with a click!</p>

      <div className="card">
        <div className="mode-select">
          <label>
            <input
              type="radio"
              value="upload"
              checked={mode === "upload"}
              onChange={() => { setMode("upload"); setMood(null); }}
            />
            Upload Image
          </label>
          <label style={{ marginLeft: "20px" }}>
            <input
              type="radio"
              value="describe"
              checked={mode === "describe"}
              onChange={() => { setMode("describe"); setMood(null); }}
            />
            Describe Behavior
          </label>
          <label style={{ marginLeft: "20px" }}>
            <input
              type="radio"
              value="example"
              checked={mode === "example"}
              onChange={() => { setMode("example"); setMood(null); }}
            />
            Choose Example Behavior
          </label>
        </div>

        <div className="uploader-container">
          <label className="label">Your Pet's Name:</label>
          <input
            type="text"
            placeholder="Enter your pet's name"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            className="input-field"
          />

          {mode === "upload" && (
            <ImageUploader image={image} setImage={setImage} />
          )}

          {mode === "describe" && (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="description-box"
              placeholder="Describe your pet's behavior..."
              rows={3}
            />
          )}

          {mode === "example" && (
            <div className="example-selects" style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
              {Object.keys(behaviorOptions).map((category) => (
                <select
                  key={category}
                  value={exampleBehavior[category] || ""}
                  onChange={(e) => setExampleBehavior((prev) => ({ ...prev, [category]: e.target.value }))}
                  className="input-field"
                  style={{ padding: "8px", borderRadius: "8px", borderColor: "#C19A6B", backgroundColor: "#fdf6ed", color: "#3C2F2F" }}
                >
                  <option value="">Select {category.replace(/([A-Z])/g, ' $1')}</option>
                  {behaviorOptions[category].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handlePredictMood}
          className="submit-button"
          disabled={loading}
        >
          {loading ? "Detecting..." : "Detect Mood"}
        </button>

        {mood && <EmotionBar detectedMood={mood} />}

        {mood && (
          <motion.div
            key={mood.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`mood-result ${mood.color}`}
          >
            <div className="mood-emoji">{mood.emoji}</div>
            <div className="mood-label">{mood.label}</div>
            {mood.confidence && (
              <div className="mood-confidence">
                ({mood.confidence}% confident)
              </div>
            )}
            {petName && (
              <div className="mood-suggestions">
                <p>
                  {petName} seems to be feeling {mood.label.toLowerCase()} today.
                  Here are some suggestions:
                </p>
                <ul>
                  {getSuggestions(mood).map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </div>

      <footer className="footer">
        Built by Chaitanya • using React & Flask
      </footer>
    </div>
  );
}
