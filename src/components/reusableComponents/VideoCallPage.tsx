import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MessageCircle,
  Settings,
  Phone,
  Send,
  X
} from 'lucide-react';
import { connectSocket } from '../../config/socket';
import { useParams, useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  sender: 'lawyer' | 'client';
  timestamp: Date;
}

function VideoCallPage() {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Good afternoon, Mr. Doe. Thank you for joining today\'s consultation.',
      sender: 'lawyer',
      timestamp: new Date(Date.now() - 2 * 60 * 1000)
    },
    {
      id: '2',
      text: 'Thank you for accommodating this virtual meeting.',
      sender: 'client',
      timestamp: new Date(Date.now() - 1 * 60 * 1000)
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isEndCallModalOpen, setIsEndCallModalOpen] = useState(false);
  const [finalNotes, setFinalNotes] = useState('');

  const { appointmentId } = useParams();
  const navigate = useNavigate();


  const localVideoContainerRef = useRef<HTMLDivElement | null>(null);
  const remoteVideoContainerRef = useRef<HTMLDivElement | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const socket = useRef<any>(null);

  // Timer effect for call duration
  useEffect(() => {
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format call duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'lawyer',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Toggle microphone
  const toggleMic = () => {
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  // Toggle camera
  const toggleCamera = () => {
    if (localStream.current) {
      const videoTrack = localStream.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  // End call function
  const endCall = () => {
    // Stop all media tracks
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => {
        track.stop();
      });
    }

    // Close peer connection
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    // Disconnect socket
    if (socket.current) {
      socket.current.emit('leave-room', appointmentId);
      socket.current.disconnect();
    }

    // Navigate back or to a different page
    navigate('/dashboard'); // Adjust the route as needed
  };

  // Show end call modal
  const showEndCallModal = () => {
    setIsEndCallModalOpen(true);
  };

  // Handle final end call with notes
  const handleFinalEndCall = () => {
    // Here you can save the final notes if needed
    console.log('Final consultation notes:', finalNotes);

    // Close modal and end call
    setIsEndCallModalOpen(false);
    endCall();
  };

  // Setup media stream
  useEffect(() => {
    async function setupStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });

        localStream.current = stream;

        if (localVideoContainerRef.current) {
          const videoElement = document.createElement("video");
          videoElement.srcObject = stream;
          videoElement.autoplay = true;
          videoElement.playsInline = true;
          videoElement.muted = true;
          videoElement.className = "w-full h-full object-cover";

          localVideoContainerRef.current.innerHTML = "";
          localVideoContainerRef.current.appendChild(videoElement);
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
        // Handle error - maybe show user a message
      }
    }

    setupStream();

    // Cleanup function
    return () => {
      if (localStream.current) {
        localStream.current.getTracks().forEach(track => {
          track.stop();
        });
      }
    };
  }, []);

  // Setup peer connection
  useEffect(() => {
    peerConnection.current = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    });

    peerConnection.current.ontrack = (event) => {
      if (remoteVideoContainerRef.current) {
        const videoElement = document.createElement("video");
        videoElement.srcObject = event.streams[0];
        videoElement.autoplay = true;
        videoElement.playsInline = true;
        videoElement.className = "w-full h-full object-cover";

        remoteVideoContainerRef.current.innerHTML = "";
        remoteVideoContainerRef.current.appendChild(videoElement);
      }
    };

    // Add local stream to peer connection
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => {
        peerConnection.current?.addTrack(track, localStream.current!);
      });
    }

    return () => {
      if (peerConnection.current) {
        peerConnection.current.close();
      }
    };
  }, []);

  // Setup socket connection
  useEffect(() => {
    socket.current = connectSocket();

    socket.current.emit("join-room", appointmentId, 'lawyer');

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [appointmentId]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Bar */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-40 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="text-lg font-semibold text-gray-900">
            Case #12345 – John Doe
          </div>
          <div className="text-sm text-gray-500">
            Personal Injury Consultation
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
            {formatDuration(callDuration)}
          </div>
        </div>
      </header>

      {/* Main Video Area */}
      <main className="flex-1 pt-20 pb-24 px-6 relative">
        <div className="max-w-6xl mx-auto h-full flex items-center justify-center">
          {/* Client Video Feed */}
          <div ref={remoteVideoContainerRef} className="w-full max-w-4xl bg-gray-900 rounded-2xl shadow-2xl overflow-hidden relative">
            <div className="aspect-video bg-gradient-to-br from-blue-900 to-gray-900 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl font-bold">JD</span>
                </div>
                <h3 className="text-2xl font-semibold mb-2">John Doe</h3>
                <p className="text-blue-200">Client</p>
              </div>
            </div>

            {/* Lawyer's Self-View */}
            <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-xl shadow-lg border-2 border-white overflow-hidden">
              <div ref={localVideoContainerRef} className="w-full h-full">
                {!isVideoOn && (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <span className="text-lg font-semibold">AL</span>
                      </div>
                      <p className="text-sm">Attorney Lisa</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Control Bar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 px-6 py-4 flex items-center space-x-4">
          {/* Mic Toggle */}
          <button
            onClick={toggleMic}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${isMuted
              ? 'bg-red-100 text-red-600 hover:bg-red-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          {/* Camera Toggle */}
          <button
            onClick={toggleCamera}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${!isVideoOn
              ? 'bg-red-100 text-red-600 hover:bg-red-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
          </button>

          {/* Chat Toggle */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${isChatOpen
              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            <MessageCircle size={20} />
          </button>

          {/* Settings */}
          <button className="w-12 h-12 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-center transition-all duration-200">
            <Settings size={20} />
          </button>

          {/* Divider */}
          <div className="w-px h-8 bg-gray-300"></div>

          {/* End Call */}
          <button
            onClick={showEndCallModal}
            className="w-14 h-12 rounded-full bg-red-500 text-white hover:bg-red-600 flex items-center justify-center transition-all duration-200 shadow-md"
          >
            <Phone size={20} className="rotate-180" />
          </button>
        </div>
      </div>

      {/* Chat Panel */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${isChatOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
        <div className="h-full flex flex-col">
          {/* Chat Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Consultation Chat</h3>
            <button
              onClick={() => setIsChatOpen(false)}
              className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 flex items-center justify-center transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'lawyer' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-2 rounded-2xl ${message.sender === 'lawyer'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
                  }`}>
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.sender === 'lawyer' ? 'text-blue-200' : 'text-gray-500'
                    }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex space-x-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                className="w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 flex items-center justify-center transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Backdrop */}
      {isChatOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsChatOpen(false)}
        ></div>
      )}

      {/* End Call Modal */}
      {isEndCallModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 9999 }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 relative">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">End Consultation</h3>
              <p className="text-sm text-gray-600 mt-1">Add your final consultation summary before ending the call</p>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Final Notes & Summary
              </label>
              <textarea
                value={finalNotes}
                onChange={(e) => setFinalNotes(e.target.value)}
                placeholder="Add any final notes, recommendations, or next steps from this consultation..."
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setIsEndCallModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleFinalEndCall}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
              >
                End Call
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoCallPage;