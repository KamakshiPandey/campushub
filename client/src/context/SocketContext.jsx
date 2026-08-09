import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (user) {
      const backendUrl = process.env.REACT_APP_API_URL
        ? process.env.REACT_APP_API_URL.replace('/api', '')
        : 'http://localhost:5000';

      const newSocket = io(backendUrl, {
        transports: ['websocket', 'polling'],
      });

      newSocket.emit('setup', user);

      newSocket.on('online_users', (users) => {
        setOnlineUsers(users);
      });

      newSocket.on('new_message_notification', (msg) => {
        toast((t) => (
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-100">{msg.sender?.name || 'New Message'}</p>
              <p className="text-xs text-slate-300 truncate max-w-[200px]">{msg.content}</p>
            </div>
          </div>
        ), { icon: '💬', duration: 4000 });
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
