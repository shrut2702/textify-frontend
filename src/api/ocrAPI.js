import axios from "axios";
/*
export const predictText = async (file, textThreshold, size, proximity) => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("text_threshold", textThreshold);
  formData.append("size", size);
  formData.append("proximity", proximity);

  try {
    const response = await axios.post(
      "http://localhost:5000/predict",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Prediction error:", error);
    throw error;
  }
}; */

const apiUrl = process.env.REACT_APP_API_URL;

export async function predictTextStream(
  file,
  text_type,
  threshold,
  size,
  proximity,
  onPhaseUpdate
) {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("text_type", text_type);
  formData.append("text_threshold", threshold);
  formData.append("size", size);
  formData.append("proximity", proximity);

  const response = await fetch(`${apiUrl}/predict-stream`, {
    method: "POST",
    body: formData,
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n");

    for (const line of lines) {
      if (line.startsWith("data:")) {
        const message = line.replace("data: ", "").trim();
        if (message.startsWith("DONE::")) {
          fullText = message.replace("DONE::", "");
        } else if (message.startsWith("ERROR::")) {
          throw new Error(message.replace("ERROR::", ""));
        } else {
          onPhaseUpdate(message);
        }
      }
    }
  }

  return { text: fullText };
}
