import React from 'react';
import { getImageUrl, formatTimeAgo } from '../../utils/helpers';
import { MessageSquare, Circle } from 'lucide-react';

const ChatSidebar = ({ chats, activeChat, onSelectChat, currentUserId, onlineUsers = [] }) => {
  return (
    <div className="w-full md:w-80 glass-panel border-r border-slate-800 flex flex-col h-full">
      <div className="p-4 border-b border-slate-800/80 flex items-center space-x-2">
        <MessageSquare className="h-5 w-5 text-indigo-400" />
        <h2 className="text-base font-bold text-white">Direct Messages</h2>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50">
        {chats.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No active conversations yet. Start a chat from Marketplace or Roommate listings!
          </div>
        ) : (
          chats.map((chat) => {
            const otherUser = chat.user1Id === currentUserId ? chat.user2 : chat.user1;
            const isSelected = activeChat && activeChat.id === chat.id;
            const isOnline = otherUser && onlineUsers.includes(otherUser.id);

            return (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat)}
                className={`p-3.5 flex items-center space-x-3 cursor-pointer transition-colors ${
                  isSelected ? 'bg-indigo-600/20 border-l-4 border-indigo-500' : 'hover:bg-slate-900/60'
                }`}
              >
                <div className="relative">
                  <img
                    src={getImageUrl(otherUser?.avatar)}
                    alt={otherUser?.name || 'User'}
                    className="h-10 w-10 rounded-full object-cover border border-slate-700"
                  />
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-950"></span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-sm font-semibold text-slate-200 truncate">{otherUser?.name}</h4>
                    <span className="text-[10px] text-slate-500">{formatTimeAgo(chat.lastMessageAt)}</span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{chat.lastMessage || 'Click to view chat'}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
