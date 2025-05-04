/* import React, { useState } from "react";
import Header from "./components/Header";
import UploadArea from "./components/UploadArea";
import DetectedText from "./components/DetectedText";
import ActionButtons from "./components/ActionButtons";
import AdvancedSettings from "./components/AdvancedSettings";
import { predictText } from "./api/ocrAPI";
import "./styles/main.css";

function App() {
  const [isDigital, setIsDigital] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const [sliders, setSliders] = useState({
    threshold: 0.7,
    size: 0.4,
    proximity: 0.4,
  });

  const [file, setFile] = useState(null); // << store file here
  const [ocrText, setOcrText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSliderChange = (key, value) => {
    setSliders((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile); // only store file, do NOT call API yet
  };

  const handleExtractClick = async () => {
    if (!file) {
      alert("Please upload an image first!");
      return;
    }

    setLoading(true);
    try {
      const result = await predictText(
        file,
        sliders.threshold,
        sliders.size,
        sliders.proximity
      );
      setOcrText(result.text);
    } catch (error) {
      console.error("Prediction failed:", error);
      setOcrText("Prediction failed.");
    }
    setLoading(false);
  };

  return (
    <div className="app">
      <Header isDigital={isDigital} setIsDigital={setIsDigital} />
      <main className="main-content glass">
        <h2 className="title">Text Recognition</h2>
        <p className="subtitle">Extract text from images with AI technology</p>

        <UploadArea handleFileChange={handleFileChange} file={file} />

        {loading ? (
          <p className="detected-text-content">Loading...</p>
        ) : (
          <DetectedText ocrText={ocrText} />
        )}

        <ActionButtons
          setShowSettings={setShowSettings}
          handleExtractClick={handleExtractClick}
          file={file}
        />

        <AdvancedSettings
          showSettings={showSettings}
          sliders={sliders}
          handleSliderChange={handleSliderChange}
        />
      </main>
    </div>
  );
}

export default App;
 */

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import DigitalOCR from "./components/DigitalOCR";
import HandwrittenOCR from "./components/HandwrittenOCR";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/digital" />} />
        <Route path="/digital" element={<DigitalOCR />} />
        <Route path="/handwritten" element={<HandwrittenOCR />} />
      </Routes>
    </Router>
  );
}

export default App;
