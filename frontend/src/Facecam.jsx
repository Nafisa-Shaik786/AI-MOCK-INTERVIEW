import React, { useRef, useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";

const FaceCam = () => {
    const webcamRef = useRef(null);
    const [faceConfidence, setFaceConfidence] = useState(100);
    const [socket, setSocket] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [pdfFile, setPdfFile] = useState(null);
    const [questionsGenerated, setQuestionsGenerated] = useState(false);

    useEffect(() => {
        let ws;

        const connectWebSocket = () => {
            ws = new WebSocket("ws://127.0.0.1:8000/face-confidence");

            ws.onopen = () => {
                console.log("Connected to FastAPI WebSocket.");
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.face_confidence !== undefined) {
                        setFaceConfidence(data.face_confidence);
                    }
                } catch (error) {
                    console.error("Error parsing WebSocket message:", error);
                }
            };

            ws.onclose = (event) => {
                console.log("WebSocket connection closed.", event);
                setTimeout(connectWebSocket, 2000); // Reconnect after 2 seconds
            };

            ws.onerror = (error) => {
                console.error("WebSocket error:", error);
                ws.close();
            };

            setSocket(ws);
        };

        connectWebSocket();

        return () => {
            ws.close();
        };
    }, []);

    const captureFrame = useCallback(() => {
        if (webcamRef.current && socket && socket.readyState === WebSocket.OPEN) {
            const imageSrc = webcamRef.current.getScreenshot();
            socket.send(JSON.stringify({ image: imageSrc }));
        }
    }, [socket]);

    useEffect(() => {
        const interval = setInterval(captureFrame, 200);
        return () => clearInterval(interval);
    }, [captureFrame]);

    const handleFileChange = (event) => {
        setPdfFile(event.target.files[0]);
    };

    const uploadPdf = async () => {
        if (!pdfFile) {
            alert("Please select a PDF file.");
            return;
        }

        setIsUploading(true);
        setIsProcessing(true);

        const formData = new FormData();
        formData.append("file", pdfFile);

        try {
            const response = await fetch("http://127.0.0.1:8000/upload-pdf", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                alert("✅ PDF uploaded and questions generated!");
                setQuestionsGenerated(true);
            } else {
                alert("❌ Failed to process PDF: " + data.detail);
            }
        } catch (error) {
            console.error("Error uploading PDF:", error);
            alert("❌ Error uploading PDF. Please try again.");
        } finally {
            setIsUploading(false);
            setIsProcessing(false);
        }
    };

    const playQuestion = async () => {
        if (isPlaying || !questionsGenerated) return;

        setIsPlaying(true);

        try {
            const response = await fetch("http://127.0.0.1:8000/play-next-question", {
                method: "GET",
            });

            const data = await response.json();
            if (data.audio_url) {
                const audio = new Audio(data.audio_url);
                audio.play();
                audio.onended = () => {
                    setIsPlaying(false);
                };
            } else {
                alert("No more questions available.");
                setIsPlaying(false);
            }
        } catch (error) {
            console.error("Error fetching question audio:", error);
            alert(" Error playing question. Please try again.");
            setIsPlaying(false);
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Face Confidence: {faceConfidence.toFixed(2)}%</h2>
            <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ width: 640, height: 480 }}
            />
            <br />

            {/* PDF Upload Section */}
            <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                style={{ marginTop: "10px" }}
            />
            <br />
            <button
                onClick={uploadPdf}
                disabled={isUploading}
                style={{
                    marginTop: "10px",
                    padding: "10px",
                    fontSize: "16px",
                    backgroundColor: isUploading ? "#ccc" : "#007BFF",
                    color: "white",
                    border: "none",
                    cursor: isUploading ? "not-allowed" : "pointer",
                }}
            >
                {isUploading ? "Uploading..." : "Upload PDF & Generate Questions"}
            </button>
            <br />

            {/* Play Question Button */}
            <button
                onClick={playQuestion}
                disabled={isPlaying || !questionsGenerated}
                style={{
                    marginTop: "10px",
                    padding: "10px",
                    fontSize: "16px",
                    backgroundColor: isPlaying ? "#ccc" : "#28A745",
                    color: "white",
                    border: "none",
                    cursor: isPlaying || !questionsGenerated ? "not-allowed" : "pointer",
                }}
            >
                {isPlaying ? "Playing..." : questionsGenerated ? "Play Next Question" : "Upload PDF First"}
            </button>
        </div>
    );
};

export default FaceCam;
