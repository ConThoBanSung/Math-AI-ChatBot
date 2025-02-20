import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown"; // Import thư viện Markdown
import botAvatar from "./Gemini_Generated_Image_nxoz1ynxoz1ynxoz.jpeg"; // Avatar của chatbot

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const genAI = new GoogleGenerativeAI("AIzaSyBm2qwV2cZ5jN_31QWK-mGoJOgcAhoM4T0");
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  useEffect(() => {
    document.body.style.opacity = "1";
  }, []);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
  
    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput(""); 
    setLoading(true);
  
    try {
      const result = await model.generateContent(input);
      const botResponse = result.response.text();
      setMessages([...newMessages, { text: botResponse, sender: "bot" }]);
    } catch (error) {
      setMessages([...newMessages, { text: "Lỗi khi gọi API!", sender: "bot" }]);
      console.error(error);
    }
  
    setLoading(false);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      setInput("");
      e.preventDefault();
      handleSend();
    }
  };  

  return (
    <>
      <div className="chatbot-title">ChatBot AI</div>
      <div className="chat-container">
        <div className="chat-box">
          {messages.map((msg, index) => (
            <div key={index} className={`message-container ${msg.sender}`}>
              {msg.sender === "bot" && (
                <img src={botAvatar} alt="Bot Avatar" className="avatar" />
              )}
              <div className={`message ${msg.sender}-message`}>
                {msg.sender === "bot" ? (
                  <ReactMarkdown>{msg.text}</ReactMarkdown> // Xử lý Markdown
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
        </div>
        <div className="input-container">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập tin nhắn..."
            onKeyDown={handleKeyPress}
          />
          <button onClick={handleSend} disabled={loading}>
            Gửi
          </button>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
