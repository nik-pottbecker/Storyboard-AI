
import React, { useState, useRef, useEffect } from 'react';
import { createChat } from '../services/geminiService';
import type { ChatMessage } from '../types';
import type { Chat } from '@google/genai';
import { Loader } from './Loader';
import { SendIcon } from './icons';

export const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: "Hello! I'm your creative assistant. How can I help you with your script today?" }
  ]);
  const [input, setInput] = useState<string>('');
  const [isResponding, setIsResponding] = useState<boolean>(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatRef.current) {
      chatRef.current = createChat();
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isResponding || !chatRef.current) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsResponding(true);

    try {
      const response = await chatRef.current.sendMessage({ message: input });
      const modelMessage: ChatMessage = { role: 'model', content: response.text };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = { role: 'model', content: "Sorry, I encountered an error. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsResponding(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-12rem)]">
       <h1 className="text-3xl sm:text-4xl font-bold text-center text-text-primary tracking-tight mb-2">
        Creative Assistant Chat
      </h1>
      <p className="text-center text-lg text-text-secondary mb-6">
        Ask about script formatting, character development, or plot ideas.
      </p>
      <div className="flex-grow bg-base-200 rounded-lg p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-lg p-3 rounded-lg ${msg.role === 'user' ? 'bg-brand-primary text-white' : 'bg-base-300 text-text-primary'}`}>
              <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
            </div>
          </div>
        ))}
         {isResponding && (
            <div className="flex justify-start">
                <div className="max-w-lg p-3 rounded-lg bg-base-300 text-text-primary">
                   <Loader className="w-5 h-5" />
                </div>
            </div>
         )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="mt-4 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="flex-grow p-3 bg-base-200 border border-base-300 rounded-lg text-text-primary focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-200"
          disabled={isResponding}
        />
        <button
          type="submit"
          disabled={isResponding || !input.trim()}
          className="p-3 bg-brand-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 hover:bg-brand-secondary"
        >
          <SendIcon className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
};
