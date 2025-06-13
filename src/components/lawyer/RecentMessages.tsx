import React from 'react';
import { MessageCircle, Reply } from 'lucide-react';

const RecentMessages: React.FC = () => {
  const messages = [
    {
      id: 1,
      clientName: 'John Davis',
      clientImage: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150',
      message: 'Hi Sarah, I have some questions about the contract terms we discussed...',
      time: '2 min ago',
      unread: true
    },
    {
      id: 2,
      clientName: 'Lisa Park',
      clientImage: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150',
      message: 'Thank you for the consultation. When can we schedule the next meeting?',
      time: '15 min ago',
      unread: true
    },
    {
      id: 3,
      clientName: 'Robert Kim',
      clientImage: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150',
      message: 'I\'ve reviewed the documents you sent. Everything looks good to proceed.',
      time: '1 hour ago',
      unread: false
    },
    {
      id: 4,
      clientName: 'Amanda Foster',
      clientImage: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150',
      message: 'Could you please clarify the timeline for the trademark application?',
      time: '3 hours ago',
      unread: false
    },
    {
      id: 5,
      clientName: 'Marcus Johnson',
      clientImage: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=150',
      message: 'The merger documents are ready for your review. Please let me know...',
      time: '5 hours ago',
      unread: false
    }
  ];

  return (
    <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-[#e2e8f0]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[#334155] flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Recent Messages
        </h2>
        <button className="text-sm text-[#3b82f6] hover:text-[#2563eb] font-medium transition-colors">
          View All
        </button>
      </div>

      <div className="max-h-[400px] overflow-y-auto space-y-1">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex items-center gap-4 p-3 rounded-lg hover:bg-white/50 transition-all duration-200 cursor-pointer ${
              index !== messages.length - 1 ? 'border-b border-[#e2e8f0]' : ''
            }`}
          >
            <div className="relative">
              <img
                src={message.clientImage}
                alt={message.clientName}
                className="h-10 w-10 rounded-full border-2 border-[#e2e8f0] object-cover"
              />
              {message.unread && (
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-[#ef4444] rounded-full border-2 border-white"></div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className={`text-sm ${message.unread ? 'font-semibold text-[#334155]' : 'font-medium text-[#334155]'}`}>
                  {message.clientName}
                </h3>
                <span className="text-xs text-[#64748b]">{message.time}</span>
              </div>
              <p className={`text-sm text-[#64748b] truncate ${message.unread ? 'font-medium' : ''}`}>
                {message.message}
              </p>
            </div>

            <button className="bg-[#3b82f6] text-white p-2 rounded-lg shadow-md hover:scale-105 transition-transform duration-200 opacity-0 group-hover:opacity-100">
              <Reply className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentMessages;