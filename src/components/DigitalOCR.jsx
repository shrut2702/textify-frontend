import React, { useState } from "react";
import { FaGear } from "react-icons/fa6";
import { BsInfoCircleFill } from "react-icons/bs";
import { LuCopy } from "react-icons/lu";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import { predictText } from "../api/ocrAPI";
import { predictTextStream } from "../api/ocrAPI";
import "../styles/main.css";

function DigitalOCR() {
  const [sliders, setSliders] = useState({
    threshold: 0.7,
    size: 0.4,
    proximity: 0.4,
  });
  const [file, setFile] = useState(null);
  const [ocrText, setOcrText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [ocrPhase, setOcrPhase] = useState(""); // New state to track phase
  const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "bmp"];

  const handleSliderChange = (key, value) => {
    setSliders((prev) => ({ ...prev, [key]: value }));
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file && isValidExtension(file.name)) {
      handleFileChange(file);
      e.target.value = null;
    } else {
      toast.error("Please upload an image file (JPG, JPEG, PNG, BMP)");
      e.target.value = null;
    }
  };

  const isValidExtension = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    return ALLOWED_EXTENSIONS.includes(ext);
  };

  const handleFileChange = (selectedFile) => setFile(selectedFile);

  const handleExtractClick = async () => {
    if (!file) {
      toast.error("Please upload an image first!");
      return;
    }

    setLoading(true);
    setOcrText(""); // Clear previous result
    setOcrPhase("Processing the Image...");

    try {
      const result = await predictTextStream(
        file,
        "digital",
        sliders.threshold,
        sliders.size,
        sliders.proximity,
        setOcrPhase
      );
      setOcrText(result.text ? result.text : "No text detected.");
      setOcrPhase("");
    } catch {
      setOcrPhase("");
      setOcrText("");
      toast.error("Prediction failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="app digital-bg">
      <header className="header">
        <h1 className="header-title">TEXTIFY</h1>
        <a href="/handwritten" className="mode-switch">
          Switch to Handwritten
        </a>
      </header>

      <main className="main-content glass0">
        <div>
          <h2 className="title">Text Recognition</h2>
          <p className="subtitle">Extract digital text from images</p>
        </div>

        <div
          className="upload-area glass1 drag-drop"
          onClick={() => document.getElementById("fileInput").click()}
        >
          <p className="upload-text">{file?.name || "Drag & Drop an image"}</p>
          <p className="upload-text">or</p>
          <button className="browse-button">Browse Image</button>
          <input
            id="fileInput"
            type="file"
            accept=".jpg,.jpeg,.png,.bmp"
            className="hidden-input"
            onChange={handleInputChange}
          />
        </div>

        <div
          className={`detected-text glass2 ${loading ? "loading-glow" : ""}`}
        >
          {/* <p className="detected-text-content">
            {ocrText || "Detected text will appear here."}
          </p> */}
          <p className="detected-text-content">
            {loading
              ? ocrPhase || "Processing..."
              : ocrText || "Detected text will appear here."}
          </p>
          {ocrText !== "No text detected." && ocrText !== "" && (
            <button
              className="copy-button"
              onClick={() => {
                navigator.clipboard.writeText(ocrText);
                toast.success("Copied", {
                  style: {
                    background: "#2b1d38",
                    color: "white",
                  },
                });
              }}
            >
              <LuCopy />
            </button>
          )}
        </div>

        <div className="action-buttons">
          <button
            onClick={handleExtractClick}
            disabled={!file}
            className="extract-button"
          >
            Extract Text
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="settings-button"
          >
            <FaGear />
          </button>
        </div>

        <div
          className={`advanced-settings ${
            showSettings ? "expanded" : "collapsed"
          }`}
        >
          {[
            {
              key: "threshold",
              label: "Text Threshold",
              tooltip:
                "How strict the model is in detecting text. Lower for more text, higher for precision.",
            },
            {
              key: "size",
              label: "Low Text Threshold (Size)",
              tooltip:
                "Recovers faint or weak text. Lower captures more faded and larger text.",
            },
            {
              key: "proximity",
              label: "Link Threshold (Proximity)",
              tooltip:
                "Controls how closely characters must be to form words. Lower links more, higher splits more.",
            },
          ].map(({ key, label, tooltip }) => (
            <div key={key} className="setting-item">
              <label>
                {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
                <span>{sliders[key]}</span>
                <span className="tooltip-container">
                  <span className="tooltip-icon">
                    <BsInfoCircleFill />
                  </span>
                  <span className="tooltip-box">
                    <b>{label}:</b> <br /> {tooltip}
                  </span>
                </span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={sliders[key]}
                onChange={(e) =>
                  handleSliderChange(key, parseFloat(e.target.value))
                }
                style={{
                  background: `linear-gradient(to right, rgba(255,255,255,0.4) ${
                    sliders[key] * 100
                  }%, rgba(255,255,255,0.1) ${sliders[key] * 100}%)`,
                }}
              />
            </div>
          ))}
        </div>
      </main>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        toastClassName="custom-toast"
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default DigitalOCR;
