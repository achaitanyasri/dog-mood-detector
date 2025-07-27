// src/components/ImageUploader.js
import React from "react";
import "../App.css";

export function ImageUploader({ image, setImage, petName, setPetName }) {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="uploader-container">
      
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="file-input"
      />

      {image && (
        <img
          src={image}
          alt="Pet Preview"
          className="preview-image"
        />
      )}
    </div>
  );
}
