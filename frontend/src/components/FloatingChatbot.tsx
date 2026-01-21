import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Sprout, Send } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', message: 'Hello! I am KrishiSarthi AI, your farming assistant. How can I help you today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const sessionId = "ks-" + Math.random().toString(36).slice(2);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMsg = message;
    setChatMessages(prev => [...prev, { role: "user", message: userMsg }]);
    setMessage("");
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:5000/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          farmer_id: localStorage.getItem("farmer_id"),
          session_id: sessionId
        })
      });

      const data = await res.json();

      setChatMessages(prev => [...prev, { role: "ai", message: data.reply }]);
    } catch (e) {
      setChatMessages(prev => [...prev, { role: "ai", message: "Sorry, I could not reach the server." }]);
    }

    setIsTyping(false);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full shadow-xl flex items-center justify-center z-50"
          >
            <Sprout className="text-white w-8 h-8" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            className="fixed bottom-6 right-6 w-96 z-50"
          >
            <Card className="border-4 border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 shadow-2xl">

              {/* Header */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 flex justify-between">
                <div className="flex items-center gap-2">
                  <Sprout className="text-white w-6 h-6" />
                  <h3 className="text-white">KrishiSarthi AI</h3>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="h-96 overflow-y-auto p-4 space-y-3 bg-white/40">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] p-3 rounded-xl ${
                      msg.role === "user" ? "bg-green-600 text-white" : "bg-white border-2 border-green-300 text-green-900"
                    }`}>
                      {msg.message}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="p-3 bg-white border-2 border-green-300 rounded-xl">
                      <div className="flex gap-1">
                        {[0,1,2].map(i => (
                          <motion.div key={i}
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                            className="w-2 h-2 bg-green-600 rounded-full"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-3 border-t bg-white/70">
                <div className="flex gap-2">
                  <Textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Ask me anything…"
                    className="border-2 border-green-300 rounded-xl resize-none"
                    rows={2}
                    onKeyDown={e => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                  />
                  <Button onClick={handleSend} className="bg-green-600 text-white px-4">
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>

            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}