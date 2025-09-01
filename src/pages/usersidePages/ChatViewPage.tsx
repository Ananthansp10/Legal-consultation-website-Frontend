import { Circle, Send, Paperclip, Smile, Check, CheckCheck } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { connectSocket } from '../../config/socket';
import { Socket } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { getLawyerChatProfile, getUserChat } from '../../services/user/userService';

interface Messages{
  senderId:string;
  receiverId:string;
  message:string;
  isRead:boolean;
  createdAt:Date
}

interface LawyerProfile{
  name:string;
  profileImage:string;
  specialization:string;
  courtName:string;
}

function ChatViewPage() {

  const [message,setMessage]=useState('')
  const [socket,setSocket]=useState<Socket | null>(null)
  const [chats,setChats]=useState<Messages[]>([])
  const [lawyerProfile,setLawyerProfile]=useState<LawyerProfile>()

  const {lawyerId}=useParams()
  const userId=useSelector((state:RootState)=>state.auth.user?.id)

  useEffect(()=>{
    let sock=connectSocket()
    setSocket(sock)

    sock.on("connect",()=>{
      console.log("connected",sock.id)
    })

    sock.emit("register",userId)

     return (()=>{
       sock.off("connect")
     })
  },[])

  useEffect(()=>{
    getUserChat(userId!,lawyerId!).then((response)=>{
      setChats(response.data.data || [])
    })
  },[])

  function sendMessage(){
    if(message.trim() === '') return;
    
    const newMessage = {
      senderId:userId!,
      receiverId:lawyerId!,
      message:message,
      isRead:false,
      createdAt:new Date()
    }

    setChats((prevChat)=>[...prevChat,newMessage])

    socket?.emit("send_message",{
      senderId:userId,
      receiverId:lawyerId,
      message:newMessage
    })
    setMessage('')
  }

  useEffect(()=>{
    getLawyerChatProfile(lawyerId!).then((response)=>{
      setLawyerProfile(response.data.data)
    })
  },[])

  const isMyMessage = (senderId: string) => senderId === userId;

  return (
    <div className="h-screen flex flex-col bg-gray-50 font-inter">
      <div className="bg-white border-b border-gray-200 px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={lawyerProfile?.profileImage}
              alt={lawyerProfile?.name}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-gray-100"
            />
            <div className="absolute -bottom-1 -right-1">
              <div className="relative">
                <Circle className="w-4 h-4 text-green-500" fill="currentColor" />
                <Circle className="absolute inset-0 w-4 h-4 text-white" fill="currentColor" />
                <Circle className="absolute inset-0.5 w-3 h-3 text-green-500" fill="currentColor" />
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 truncate">{lawyerProfile?.name}</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{lawyerProfile?.courtName}, {lawyerProfile?.specialization}</span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-sm font-medium text-green-600">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-6 md:px-6">
        <div className="max-w-4xl mx-auto">
          {chats.length>0 && chats.map((chat, index) => {
            const isMine = isMyMessage(chat.senderId);
            
            return (
              <div key={index} className={`flex mb-4 animate-in slide-in-from-bottom-1 duration-300 ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-xs md:max-w-md lg:max-w-lg">
                  <div className={`px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                    isMine 
                      ? 'bg-blue-500 text-white rounded-br-md' 
                      : 'bg-gray-100 text-gray-900 rounded-bl-md'
                  }`}>
                    <p className="text-sm md:text-base leading-relaxed">
                      {chat.message}
                    </p>
                  </div>
                  <div className={`flex items-center mt-1 ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-500">
                        {new Date(chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMine && (
                        <div className="ml-1">
                          {chat.isRead ? (
                            <CheckCheck className="w-3 h-3 text-blue-500" />
                          ) : (
                            <Check className="w-3 h-3 text-gray-400" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {/* <div className="flex justify-start mb-4 animate-in slide-in-from-bottom-1 duration-300">
            <div className="max-w-xs">
              <div className="bg-gray-100 px-4 py-3 rounded-2xl shadow-sm">
                <div className="flex space-x-1">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-start mt-1">
                <span className="text-xs text-gray-500">Attorney typing...</span>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-end space-x-3">
          <div className="flex space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-200">
              <Paperclip className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-200">
              <Smile className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 relative">
            <textarea
              onChange={(e)=>setMessage(e.target.value)}
              value={message}
              placeholder="Type your legal question..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
          </div>
          
          <button onClick={sendMessage} className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-200 transform hover:scale-105 active:scale-95">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatViewPage;