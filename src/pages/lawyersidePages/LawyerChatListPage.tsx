import React, { useState, useMemo, useEffect } from 'react';
import { Search, MessageCircle, Users } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import { getAllChats } from '../../services/lawyer/lawyerService';

interface Chat {
  userId: string;
  name: string;
  profileImage: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline?: boolean;
}

function LawyerChatListPage() {
  const [chats, setChats] = useState<Chat[]>([])
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const lawyerId: string | undefined = useSelector((state: RootState) => state.lawyerAuth.lawyer?._id)
  const navigate = useNavigate()

  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) {
      return chats;
    }

    return chats.filter(chat =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [chats, searchQuery]);

  const totalUnread = chats.reduce((sum, chat) => sum + chat.unreadCount, 0);

  const handleSearchClick = () => {
    setIsSearchVisible(!isSearchVisible);
    if (!isSearchVisible) {
      setSearchQuery('');
    }
  };

  const handleChatClick = (userId: string) => {
    navigate(`/lawyer/chat-view/${userId}`)
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    const baseTitle = 'ChatFlow';
    document.title = totalUnread > 0 ? `(${totalUnread}) ${baseTitle}` : baseTitle;
  }, [totalUnread]);

  useEffect(() => {
    getAllChats(lawyerId!).then((response) => {
      setChats(response.data.data || [])
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 rounded-full p-2">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Chats</h1>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSearchClick}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      {isSearchVisible && (
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto mt-7">
        {filteredChats.length === 0 && searchQuery ? (
          <div className="py-16 px-4 text-center">
            <p className="text-gray-600">No conversations found for "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Clear search
            </button>
          </div>
        ) : filteredChats.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-12 h-12 text-blue-600" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border-3 border-white shadow-md">
                <Users className="w-5 h-5 text-gray-600" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-3">No chats yet</h3>
            <p className="text-gray-600 text-center max-w-md leading-relaxed mb-8">
              Start a new conversation to connect with friends, colleagues, or family members.
              Your conversations will appear here.
            </p>
          </div>
        ) : (
          /* Chat List */
          <div className="bg-white shadow-sm">
            {filteredChats.map((chat) => (
              <div
                key={chat.name}
                onClick={() => handleChatClick(chat.userId)}
                className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0"
              >
                <div className="relative flex-shrink-0 mr-3">
                  {chat.profileImage ? (
                    <img
                      src={chat.profileImage}
                      alt={chat.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium text-sm">
                      {getInitials(chat.name)}
                    </div>
                  )}
                  {chat.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {formatTime(chat.lastMessageTime)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate flex-1">
                      {chat.lastMessage}
                    </p>
                    {chat.unreadCount > 0 && (
                      <span className="ml-2 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full min-w-[20px] text-center">
                        {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default LawyerChatListPage;