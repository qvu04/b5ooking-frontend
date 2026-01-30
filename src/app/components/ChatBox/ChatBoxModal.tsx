"use client";
import { chatBoxService } from "@/app/api/chatboxService";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import AiResponseHotel from "./AiResponseHotel";
import AiResponseRoom from "./AiResponseRoom";
import AiResponseFavorite from "./AiResponseFavorite";
import AiResponseBooking from "./AiResponseBooking";
import AiResponseBlog from "./AiResponseBlog";

export default function ChatBoxModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [ask, setAsk] = useState("");
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [aiTyping, setAiTyping] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const { user } = useSelector((state: RootState) => state.userSlice);

    const handleSend = async () => {
        if (!ask.trim()) return;

        const userMsg = { sender: "user", text: ask };
        setMessages((prev) => [...prev, userMsg]);
        setAsk("");
        setAiTyping(true);
        setLoading(true);

        try {
            const currentUser = user ? { id: user.id, fullname: user.fullName } : undefined;
            const res = await chatBoxService({ ask }, currentUser);
            const aiData = res.data.data.data;

            const aiMsg = {
                sender: "ai",
                text: aiData.text,
                type: aiData.object.type,
                data: aiData.data,
            };
            console.log("data:", aiMsg.data);
            // Giả lập typing effect
            const fullText = aiMsg.text;
            let currentText = "";
            let i = 0;
            const interval = setInterval(() => {
                if (i < fullText.length) {
                    currentText += fullText[i];
                    i++;
                    setMessages((prev) => [
                        ...prev.slice(0, -1),
                        { sender: "ai", text: currentText, type: aiMsg.type, data: aiMsg.data },
                    ]);
                } else {
                    clearInterval(interval);
                    setAiTyping(false);
                }
            }, 20);

            setMessages((prev) => [...prev, { sender: "ai", text: "" }]);
        } catch (err) {
            console.error("AI Error:", err);
            setMessages((prev) => [
                ...prev,
                { sender: "ai", text: "Có lỗi xảy ra, vui lòng thử lại." },
            ]);
            setAiTyping(false);
        } finally {
            setLoading(false);
        }
    };

    // Gửi tin nhắn chào khi mở chat lần đầu
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const welcome = "Xin chào! 👋 Tôi là trợ lý ảo của B5ooking, tôi có thể giúp gì cho bạn?";
            let currentText = "";
            const typingSpeed = 35;
            const delayBeforeStart = 500;

            const startTyping = setTimeout(() => {
                const interval = setInterval(() => {
                    if (currentText.length < welcome.length) {
                        currentText += welcome[currentText.length];
                        setMessages([{ sender: "ai", text: currentText }]);
                    } else {
                        clearInterval(interval);
                    }
                }, typingSpeed);
            }, delayBeforeStart);

            return () => clearTimeout(startTyping);
        }
    }, [isOpen]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading, aiTyping]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/40 flex justify-end z-[9999]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    onClick={(e) => e.stopPropagation()}
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 300, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    className="w-[400px] h-[600px] bg-white dark:bg-gray-900 rounded-l-2xl shadow-2xl flex flex-col border border-gray-200 dark:border-gray-700"
                >
                    {/* Header */}
                    <div className="relative p-4 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 text-white rounded-tl-2xl flex justify-between items-center shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <img
                                    src="/images/logo-b5ooking.png"
                                    alt="logo"
                                    className="w-[40px] h-[40px] object-contain rounded-full border border-white/40 shadow-md"
                                />
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full animate-pulse"></span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg tracking-wide">Trợ lý ảo B5ooking</h3>
                                <p className="text-xs text-blue-100 italic">Luôn sẵn sàng hỗ trợ bạn 🌟</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Chat content */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {messages.map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className={`max-w-[85%] w-fit p-3 rounded-2xl text-sm shadow-sm ${m.sender === "user"
                                    ? "bg-blue-600 text-white self-end ml-auto rounded-br-none"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none"
                                    }`}
                            >
                                <p className="whitespace-pre-line break-words mb-2">{m.text}</p>

                                {m.type === "hotel" && <AiResponseHotel data={m.data} />}
                                {m.type === "room" && <AiResponseRoom data={m.data} />}
                                {m.type === "favoriteHotel" && <AiResponseFavorite data={m.data} />}
                                {m.type === "booking" && <AiResponseBooking data={m.data} />}
                                {m.type === "blog" && <AiResponseBlog data={m.data} />}
                            </motion.div>
                        ))}

                        {aiTyping && (
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <span className="bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-2xl animate-pulse">
                                    <span className="dot-typing"></span>
                                </span>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input */}
                    <div className="border-t dark:border-gray-700 p-3 flex items-center gap-2 bg-gray-50 dark:bg-gray-800">
                        <input
                            value={ask}
                            onChange={(e) => setAsk(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Nhập câu hỏi..."
                            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleSend}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition disabled:opacity-50"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
