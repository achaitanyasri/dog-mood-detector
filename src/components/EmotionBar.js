// File: src/components/EmotionBar.js
import React from "react";
import "../App.css";

const moodEmojis = {
  happy: "😄",
  sad: "😢",
  angry: "😠",
  relaxed: "😌",
};

export function EmotionBar({ detectedMood }) {
  const moodLabel = detectedMood?.label?.toLowerCase();

  const map = {
    happy: "happy",
    sad: "sad",
    angry: "angry",
    relaxed: "relaxed",
    calm: "relaxed" 
  };

  const normalized = map[moodLabel];

  return (
    <div className="emotion-bar">
      {Object.entries(moodEmojis).map(([mood, emoji]) => {
        const isActive = normalized === mood;
        return (
          <div
            key={mood}
            className={`emoji-container ${isActive ? "highlighted" : ""}`}
          >
            <span className="emoji">{emoji}</span>
          </div>
        );
      })}
    </div>
  );
}
