import React, { useEffect, useRef, useState } from 'react';
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
  Circle,
} from 'lucide-react';
import { connectSocket } from '../../config/socket';
import Peer from 'simple-peer';
import { useParams } from 'react-router-dom';

export default function LawyerVideoCallPage() {
  const { appointmentId } = useParams();
  const socket = connectSocket();

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [notes, setNotes] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  const [messages, setMessages] = useState([
    { id: '1', sender: 'user', text: 'Hello! Ready for consultation.', timestamp: '2:15 PM' },
  ]);
  const [isEndCallModalOpen, setIsEndCallModalOpen] = useState(false);

  // Video call state
  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<any>(null);
  const localStream = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Get media
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      localStream.current = stream;
      if (myVideo.current) myVideo.current.srcObject = stream;

      // Join room as lawyer
      socket.emit('join-room', appointmentId, 'lawyer');

      // Initiate peer as initiator
      const peer = new Peer({ initiator: true, trickle: false, stream });

      peer.on('signal', (data) => {
        socket.emit('offer', { roomId: appointmentId, offer: data });
      });

      peer.on('stream', (remoteStream) => {
        if (userVideo.current) userVideo.current.srcObject = remoteStream;
      });

      peerRef.current = peer;
    });

    // Receive answer from user
    socket.on('receive-answer', (answer) => {
      peerRef.current.signal(answer);
    });

    // Receive ICE candidate
    socket.on('ice-candidate', (candidate) => {
      peerRef.current.signal(candidate);
    });

    return () => {
      socket.off('receive-answer');
      socket.off('ice-candidate');
      peerRef.current?.destroy();
      localStream.current?.getTracks().forEach((track) => track.stop());
    };
  }, [socket, appointmentId]);

  const leaveCall = () => {
    peerRef.current?.destroy();
    localStream.current?.getTracks().forEach((track) => track.stop());
    if (myVideo.current) myVideo.current.srcObject = null;
    if (userVideo.current) userVideo.current.srcObject = null;
    setIsEndCallModalOpen(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">LC</div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Lawyer Name</h1>
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

      {/* Video Section */}
      <div className="pt-20 h-screen flex items-center justify-center relative">
        <div className="w-full max-w-4xl h-[600px] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl relative flex">
          <video ref={myVideo} autoPlay muted playsInline className="w-2/3 h-full object-cover" />
          <video ref={userVideo} autoPlay playsInline className="w-1/3 h-full object-cover" />
        </div>

        {/* Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="bg-white rounded-full shadow-lg border border-gray-200 px-6 py-3 flex items-center gap-4">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3 rounded-full transition-all duration-200 ${isMuted ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
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
              onClick={() => setIsEndCallModalOpen(true)}
              className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all duration-200 hover:scale-105"
            >
              <Phone className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat & Notes panels */}
      {/* ... keep your existing chat & notes code ... */}

      {/* End Call Modal */}
      {isEndCallModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 relative">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">End Consultation</h3>
              <p className="text-sm text-gray-600 mt-1">Are you sure you want to end the call?</p>
            </div>
            <div className="px-6 py-4 flex justify-end space-x-3">
              <button
                onClick={() => setIsEndCallModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={leaveCall}
                className="px-6 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
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
