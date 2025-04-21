import axios from "axios";

const API_URL = "/api";

export const translateText = async (
  text: string,
  targetLanguage: string,
): Promise<string> => {
  try {
    const response = await axios.post(`${API_URL}/translate`, {
      text,
      targetLanguage,
    });
    return response.data.result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === "ERR_NETWORK") {
        throw new Error(
          "Cannot connect to server. Please make sure the Python server is running.",
        );
      }
      throw new Error(error.response?.data?.error || "Translation failed");
    }
    throw error;
  }
};

export const convertSpeechToText = async (
  audioBlob: Blob,
  targetLanguage: string,
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("audio", audioBlob);
    formData.append("targetLanguage", targetLanguage);

    const response = await axios.post(`${API_URL}/speech-to-text`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.text;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === "ERR_NETWORK") {
        throw new Error(
          "Cannot connect to server. Please make sure the Python server is running.",
        );
      }
      throw new Error(
        error.response?.data?.error || "Speech to text conversion failed",
      );
    }
    throw error;
  }
};
