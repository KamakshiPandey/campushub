import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Circle } from 'lucide-react';
import { getImageUrl, formatTimeAgo } from '../../utils/helpers';

const ChatWindow = ({ activeChat, currentUserId, messages, onSendMessage, onlineUsers = [] }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const otherUser = activeChat
    ? activeChat.user1Id === currentUserId
      ? activeChat.user2
      : activeChat.user1
    : null;

  const isOnline = otherUser && onlineUsers.includes(otherUser.id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  if (!activeChat || !otherUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 glass-panel">
        <div className="h-16 w-16 rounded-full bg-slate-900 flex items-center justify-center mb-4">
          <User className="h-8 w-8 text-slate-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-300">Your Messages</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          Select a chat from the sidebar or click "Chat with Seller / Owner" on any post to start messaging.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full glass-panel">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/40">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={getImageUrl(otherUser.avatar)}
              alt={otherUser.name}
              className="h-10 w-10 rounded-full object-cover border border-indigo-500/30"
            />
            {isOnline && (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-950"></span>
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{otherUser.name}</h3>
            <p className="text-xs text-slate-400">
              {isOnline ? (
                <span className="text-emerald-400 font-medium flex items-center space-x-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Online now</span>
                </span>
              ) : (
                'Offline'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-slate-500 text-xs py-8">
            Say hello to {otherUser.name}! 👋
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div
                key={msg.id || Math.random()}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMe
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20'
                      : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700/60'
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 px-1">
                  {formatTimeAgo(msg.createdAt)}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-slate-800/80 bg-slate-900/60 flex items-center space-x-2">
        <input
          type="text"
          placeholder={`Message ${otherUser.name}...`}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-all shadow-md shadow-indigo-600/30"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
