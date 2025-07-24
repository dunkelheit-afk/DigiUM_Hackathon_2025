'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Kita tidak lagi memerlukan AnalysisDataContext karena chatbot akan mengambil datanya sendiri
// import { useAnalysisData } from '@/app/contexts/AnalysisDataContext'; 
import ReactMarkdown from 'react-markdown';

// Definisikan tipe untuk setiap pesan
interface Message {
    sender: 'user' | 'ai';
    text: string;
}

// --- Komponen Ikon ---
const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const SendIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
    </svg>
);

// --- Komponen Utama Chatbot ---
export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'ai', text: "Halo! Saya adalah asisten AI keuangan Anda. Ada yang bisa saya bantu?" }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Efek untuk auto-scroll
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const messageText = userInput.trim();
        if (messageText === '' || isLoading) return;

        setMessages(prev => [...prev, { sender: 'user', text: messageText }]);
        setUserInput('');
        setIsLoading(true);

        try {
            // --- PERUBAHAN UTAMA: Mengambil data langsung saat pesan dikirim ---
            let analysisData = null;
            try {
                // Panggil API route Next.js yang mengambil data dari Supabase (yang diisi oleh Python)
                const analysisResponse = await fetch('/api/analysis/latest');
                if (analysisResponse.ok) {
                    analysisData = await analysisResponse.json();
                }
            } catch (fetchError) {
                console.error("Gagal mengambil data analisis:", fetchError);
                // Biarkan chatbot tetap berjalan meskipun data gagal diambil
            }

            // Buat "konteks" untuk AI berdasarkan data yang baru saja diambil
            let contextPrompt = "Anda adalah seorang analis keuangan ahli yang membantu pemilik UMKM. Tugas Anda adalah memberikan analisis HANYA berdasarkan nilai-nilai rasio keuangan yang diberikan. Jangan membuat asumsi lain. Berikan jawaban yang terstruktur menggunakan format markdown.\n\nBerikut adalah data hasil analisis terbaru dari backend:\n";
            
            if (analysisData) {
                contextPrompt += `
- Status Kesehatan: ${analysisData.prediction_status || 'Belum dihitung'}
- Margin Laba Bersih (NPM): ${analysisData.net_profit_margin ? (analysisData.net_profit_margin * 100).toFixed(2) + '%' : 'Belum dihitung'}
- Rasio Lancar (Current Ratio): ${analysisData.current_ratio ? analysisData.current_ratio.toFixed(2) : 'Belum dihitung'}
- Utang terhadap Ekuitas (DER): ${analysisData.debt_to_equity ? analysisData.debt_to_equity.toFixed(2) : 'Belum dihitung'}
- Return on Assets (ROA): ${analysisData.roa ? (analysisData.roa * 100).toFixed(2) + '%' : 'Belum dihitung'}
- Perputaran Aset (Asset Turnover): ${analysisData.asset_turnover ? analysisData.asset_turnover.toFixed(2) : 'Belum dihitung'}
`;
            } else {
                contextPrompt += "Saat ini tidak ada data analisis keuangan yang dapat saya temukan.\n";
            }
            
            contextPrompt += "\n--- Berdasarkan data di atas, jawab pertanyaan pengguna berikut ---\n";
            const finalMessage = contextPrompt + messageText;

            const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
            if (!apiKey) {
                throw new Error("Kunci API Gemini tidak ditemukan. Mohon atur di file .env.local");
            }

            const payload = { contents: [{ role: "user", parts: [{ text: finalMessage }] }] };
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Gagal mendapatkan respons dari API.");

            const result = await response.json();
            const aiResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;

            if (aiResponse) {
                setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
            } else {
                throw new Error("Struktur respons API tidak valid.");
            }

        } catch (error) {
            console.error("Error:", error);
            const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan.";
            setMessages(prev => [...prev, { sender: 'ai', text: `Maaf, terjadi masalah: ${errorMessage}` }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-transform duration-200 hover:scale-110"
                aria-label="Buka Obrolan"
            >
                <ChatIcon />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-24 right-6 w-full max-w-md h-[70vh] bg-white rounded-2xl shadow-2xl flex flex-col z-50"
                    >
                        <header className="bg-purple-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-bold">Asisten AI Keuangan</h2>
                                <p className="text-xs text-purple-200">Online</p>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-purple-700">
                                <CloseIcon />
                            </button>
                        </header>
                        <main ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`p-3 rounded-lg max-w-xs md:max-w-md ${msg.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-800'}`}>
                                        {msg.sender === 'ai' ? (
                                            <div className="prose prose-sm max-w-none prose-p:my-1">
                                                <ReactMarkdown>
                                                    {msg.text}
                                                </ReactMarkdown>
                                            </div>
                                        ) : (
                                            <p className="text-sm">{msg.text}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-200 p-3 rounded-lg">
                                        <div className="flex items-center justify-center space-x-1">
                                            <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
                                            <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                            <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </main>
                        <footer className="p-3 bg-white border-t border-slate-200 rounded-b-2xl">
                            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    className="flex-1 w-full px-4 py-2 bg-slate-100 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Ketik pertanyaan..."
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    className="bg-purple-600 text-white rounded-full p-3 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-transform duration-200 active:scale-95 disabled:bg-purple-300"
                                    disabled={isLoading}
                                    aria-label="Kirim Pesan"
                                >
                                    <SendIcon />
                                </button>
                            </form>
                        </footer>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
