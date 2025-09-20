import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MessageCircle,
  FileText,
  Phone,
  Send,
  X,
  Circle
} from 'lucide-react';
import { connectSocket } from '../../config/socket';
import { useParams, useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  sender: 'lawyer' | 'user';
  text: string;
  timestamp: Date;
}

export default function UserVideoCallPage() {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [notes, setNotes] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'lawyer',
      text: 'Hello! I\'m ready to discuss your corporate law questions today.',
      timestamp: new Date()
    }
  ]);

  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const localVideoRef = useRef<HTMLDivElement | null>(null);
  const remoteVideoRef = useRef<HTMLDivElement | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const socket = useRef<any>(null);

  // Call timer
  useEffect(() => {
    const timer = setInterval(() => setCallDuration(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const sendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'user',
        text: chatMessage,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
      setChatMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
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
    navigate('/user-dashboard'); // Adjust the route as needed
  };

  // Setup local media
  useEffect(() => {
    async function setupLocalStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStream.current = stream;

        if (localVideoRef.current) {
          const videoEl = document.createElement('video');
          videoEl.srcObject = stream;
          videoEl.autoplay = true;
          videoEl.playsInline = true;
          videoEl.muted = true;
          videoEl.className = "w-full h-full object-cover";

          localVideoRef.current.innerHTML = '';
          localVideoRef.current.appendChild(videoEl);
        }

        // Add tracks to peer connection
        stream.getTracks().forEach(track => peerConnection.current?.addTrack(track, stream));
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    }

    peerConnection.current = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    });

    // Remote stream
    peerConnection.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        const videoEl = document.createElement('video');
        videoEl.srcObject = event.streams[0];
        videoEl.autoplay = true;
        videoEl.playsInline = true;
        videoEl.className = "w-full h-full object-cover";

        remoteVideoRef.current.innerHTML = '';
        remoteVideoRef.current.appendChild(videoEl);
      }
    };

    setupLocalStream();

    // Socket signaling
    socket.current = connectSocket();
    socket.current.emit("join-room", appointmentId, "user");

    socket.current.on("offer", async (offer: RTCSessionDescriptionInit) => {
      if (!peerConnection.current) return;
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.current.emit("answer", answer, appointmentId);
    });

    socket.current.on("ice-candidate", async (candidate: RTCIceCandidateInit) => {
      try {
        await peerConnection.current?.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("Error adding received ICE candidate", err);
      }
    });

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current.emit("ice-candidate", event.candidate, appointmentId);
      }
    };

    // Cleanup function
    return () => {
      if (localStream.current) {
        localStream.current.getTracks().forEach(track => {
          track.stop();
        });
      }
      if (socket.current) {
        socket.current.disconnect();
      }
      if (peerConnection.current) {
        peerConnection.current.close();
      }
    };
  }, [appointmentId]);

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
              SC
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Sarah Chen</h1>
              <p className="text-sm text-gray-600">Corporate Law Specialist</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Circle className="w-3 h-3 fill-green-500 text-green-500" />
              <span className="text-sm font-medium text-gray-700">Connected</span>
            </div>
            <div className="text-sm text-gray-600">
              Case: <span className="font-medium">#CLW-2024-0158</span>
            </div>
            <div className="text-sm font-mono text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
              {formatTime(callDuration)}
            </div>
          </div>
        </div>
      </header>

      {/* Video area */}
      <div className="pt-20 h-screen flex items-center justify-center relative">
        {/* Remote video */}
        <div className="w-full max-w-4xl h-[600px] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl relative">
          <div ref={remoteVideoRef} className="w-full h-full bg-gradient-to-br from-blue-900 via-blue-800 to-slate-800 flex items-center justify-center"></div>

          {/* User self video */}
          <div ref={localVideoRef} className="absolute top-4 right-4 w-48 h-32 bg-gray-800 rounded-xl overflow-hidden shadow-lg border-2 border-white/20">
            {!isVideoOn && (
              <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-sm font-semibold">You</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="bg-white rounded-full shadow-lg border border-gray-200 px-6 py-3 flex items-center gap-4">
            <button
              onClick={toggleMic}
              className={`p-3 rounded-full transition-all duration-200 ${isMuted ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <button
              onClick={toggleCamera}
              className={`p-3 rounded-full transition-all duration-200 ${!isVideoOn ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
            >
              {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`p-3 rounded-full transition-all duration-200 ${isChatOpen ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
            >
              <MessageCircle className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsNotesOpen(!isNotesOpen)}
              className={`p-3 rounded-full transition-all duration-200 ${isNotesOpen ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
            >
              <FileText className="w-5 h-5" />
            </button>

            <div className="w-px h-8 bg-gray-300 mx-2" />

            <button
              onClick={endCall}
              className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all duration-200 hover:scale-105"
            >
              <Phone className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat and Notes panels */}
      {/* Chat */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl border-l border-gray-200 transform transition-transform duration-300 z-40 ${isChatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Chat</h3>
          <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: 'calc(100vh - 140px)' }}>
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-gray-100 text-gray-900' : 'bg-blue-500 text-white'}`}>
                <p className="text-sm">{msg.text}</p>
                <p className="text-xs opacity-70 mt-1">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={chatMessage}
              onChange={e => setChatMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button onClick={sendMessage} className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className={`fixed top-0 left-0 h-full w-96 bg-white shadow-2xl border-r border-gray-200 transform transition-transform duration-300 z-40 ${isNotesOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Private Notes</h3>
          <button onClick={() => setIsNotesOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 h-full">
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Take private notes during your consultation..."
            className="w-full h-full resize-none border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{ height: 'calc(100vh - 120px)' }}
          />
        </div>
      </div>

      {/* Overlay */}
      {(isChatOpen || isNotesOpen) && (
        <div className="fixed inset-0 bg-black/10 z-30" onClick={() => { setIsChatOpen(false); setIsNotesOpen(false); }} />
      )}
    </div>
  );
}