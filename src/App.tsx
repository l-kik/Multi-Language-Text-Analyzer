import { ArrowRight, Languages, Loader2 } from "lucide-react";
import { useState } from "react";
// import { convertSpeechToText, translateText } from "./api";

const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Russian",
  "Japanese",
  "Korean",
  "Chinese",
  "Arabic",
  "Hindi",
  "Dutch",
  "Greek",
  "Turkish",
].sort();

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState("English");
  const [targetLanguage, setTargetLanguage] = useState("Spanish");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  // const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  // const chunksRef = useRef<Blob[]>([]);

  // useEffect(() => {
  //   return () => {
  //     if (mediaRecorderRef.current && isRecording) {
  //       mediaRecorderRef.current.stop();
  //     }
  //   };
  // }, []);

  // const startRecording = async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  //     const mediaRecorder = new MediaRecorder(stream);
  //     mediaRecorderRef.current = mediaRecorder;
  //     chunksRef.current = [];

  //     mediaRecorder.ondataavailable = (e) => {
  //       chunksRef.current.push(e.data);
  //     };

  //     mediaRecorder.onstop = async () => {
  //       const audioBlob = new Blob(chunksRef.current, { type: "audio/wav" });
  //       try {
  //         setIsProcessing(true);
  //         const text = await convertSpeechToText(audioBlob, targetLanguage);
  //         setInputText(text);
  //         await processText(text);
  //       } catch (error) {
  //         console.error("Error processing audio:", error);
  //       } finally {
  //         setIsProcessing(false);
  //       }
  //       stream.getTracks().forEach((track) => track.stop());
  //     };

  //     mediaRecorder.start();
  //     setIsRecording(true);
  //   } catch (error) {
  //     console.error("Error accessing microphone:", error);
  //   }
  // };

  // const stopRecording = () => {
  //   if (mediaRecorderRef.current && isRecording) {
  //     mediaRecorderRef.current.stop();
  //     setIsRecording(false);
  //   }
  // };

  // const toggleRecording = () => {
  //   if (isRecording) {
  //     stopRecording();
  //   } else {
  //     startRecording();
  //   }
  // };

  // const processText = async (text: string = inputText) => {
  //   if (!text.trim()) return;

  //   setIsProcessing(true);
  //   try {
  //     const result = await translateText(text, sourceLanguage, targetLanguage);
  //     setOutputText(result);
  //   } catch (error) {
  //     console.error("Translation error:", error);
  //     setOutputText("Error occurred during translation");
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // };

  const handleManualTranslate = async () => {
    if (!inputText.trim()) return;

    setIsProcessing(true);

    try {
      console.log("Sending text:", inputText, "to", targetLanguage);

      // before fetch
      console.log("Before fetch");
      const response = await fetch("http://localhost:5000/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
          tgt_Lang: targetLanguage, // Make sure this variable is defined
        }),
      });
      // after fetch
      console.log("After fetch");

      const data = await response.json();
      console.log("Response:", data);

      if (response.ok) {
        setOutputText(data.result);
      } else {
        console.error("Translation error:", data.error);
      }
    } catch (error) {
      console.error("Network or server error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
      <div className="min-h-screen bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_100%)] px-6 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-white/10 to-white/5 rounded-full backdrop-blur-sm mb-6 animate-pulse-slow">
              <Languages className="w-12 h-12 text-white/80" />
            </div>
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-white mb-3 animate-gradient">
              Universal Translator
            </h1>
            <p className="text-gray-400 text-lg animate-fade-in-up">
              Transform your words across languages
            </p>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-transparent backdrop-blur-sm rounded-3xl p-8 shadow-[0_0_50px_-12px] shadow-white/10 animate-fade-in-up">
            {/* Language Selection */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Source Language
                </label>
                <select
                  value={sourceLanguage}
                  onChange={(e) => setSourceLanguage(e.target.value)}
                  className="w-full bg-black/30 border-white/10 text-white rounded-xl focus:ring-white/30 focus:border-white/30 transition-all hover:border-white/20"
                  disabled={isProcessing || isRecording}
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang} className="bg-zinc-900">
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              <div className="hidden md:flex items-center self-center mt-6">
                <div className="p-3 bg-gradient-to-br from-white/10 to-white/5 rounded-full backdrop-blur-sm animate-pulse-slow hover:from-white/15 hover:to-white/10 transition-all">
                  <ArrowRight className="w-6 h-6 text-white/80" />
                </div>
              </div>

              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target Language
                </label>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="w-full bg-black/30 border-white/10 text-white rounded-xl focus:ring-white/30 focus:border-white/30 transition-all hover:border-white/20"
                  disabled={isProcessing || isRecording}
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang} className="bg-zinc-900">
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Text Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="animate-fade-in-left">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-gray-300">
                    Input Text
                  </label>
                  {/* <button
                    onClick={toggleRecording}
                    disabled={isProcessing}
                    className={`p-3 rounded-xl transition-all ${
                      isRecording
                        ? "bg-red-500/80 hover:bg-red-600/80"
                        : "bg-white/5 hover:bg-white/10"
                    } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {isRecording ? (
                      <MicOff className="w-5 h-5 text-white" />
                    ) : (
                      <Mic className="w-5 h-5 text-white" />
                    )}
                  </button> */}
                </div>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full h-48 bg-black/30 border-white/10 text-white rounded-xl focus:ring-white/30 focus:border-white/30 transition-all hover:border-white/20 placeholder-gray-500"
                  placeholder="Enter or speak your text here..."
                  disabled={isRecording || isProcessing}
                />
              </div>

              <div className="animate-fade-in-right">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-gray-300">
                    Output Text
                  </label>
                  <div className="w-[52px]" />{" "}
                  {/* Spacer to match input side */}
                </div>
                <div className="relative group h-48">
                  <textarea
                    value={outputText}
                    readOnly
                    className="w-full h-full bg-black/30 border-white/10 text-white rounded-xl focus:ring-white/30 focus:border-white/30 transition-all group-hover:border-white/20 placeholder-gray-500"
                    placeholder="Translation will appear here..."
                  />
                  {isProcessing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-xl backdrop-blur-sm">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 animate-fade-in-up">
              <button
                onClick={() => {
                  setInputText("");
                  setOutputText("");
                }}
                className="px-6 py-3 text-gray-300 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                disabled={isProcessing || isRecording}
              >
                Clear
              </button>
              <button
                onClick={handleManualTranslate}
                disabled={isProcessing || isRecording || !inputText.trim()}
                className={`px-8 py-3 bg-gradient-to-r from-white/20 to-white/10 rounded-xl hover:from-white/30 hover:to-white/20 transition-all flex items-center gap-2 text-white
                  ${
                    isProcessing || isRecording || !inputText.trim()
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Translate"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
