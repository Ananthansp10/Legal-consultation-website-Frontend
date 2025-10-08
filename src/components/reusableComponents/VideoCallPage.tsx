import { useEffect, useRef, useState } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MessageSquare,
  Phone,
  X,
  Send,
  Star,
  Paperclip,
  FileText,
  Image,
  Download,
} from "lucide-react";
import { connectSocket } from "../../config/socket";
import {
  addFeedback,
  addFinalNote,
  startMeeting,
} from "../../services/lawyer/lawyerService";
import { useNavigate } from "react-router-dom";

const VideoCallPage = ({ role, roomId }: { role: string; roomId: string }) => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [showEndCallModal, setShowEndCallModal] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [summary, setSummary] = useState("");
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [uploading, setUploading] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const socket = connectSocket();

  useEffect(() => {
    startMeeting(roomId);
    const init = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      pcRef.current = pc;

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
        if (remoteVideoRef.current)
          remoteVideoRef.current.srcObject = event.streams[0];
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) socket.emit("candidate", event.candidate, roomId);
      };

      socket.on("candidate", async (candidate: RTCIceCandidateInit) => {
        if (pcRef.current) {
          try {
            await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (err) {
            console.error("Error adding ICE candidate:", err);
          }
        }
      });

      socket.emit("join-room", role, roomId);

      if (role === "lawyer") {
        socket.on("peer-joined", async () => {
          console.log("Peer joined, creating offer...");
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit("offer", offer, roomId);
        });

        socket.on("answer", async (answer: RTCSessionDescriptionInit) => {
          if (pcRef.current?.signalingState === "have-local-offer") {
            await pcRef.current.setRemoteDescription(answer);
            console.log("Remote answer set successfully");
          }
        });
      }

      if (role === "user") {
        socket.on("offer", async (offer: RTCSessionDescriptionInit) => {
          console.log("Offer received");
          await pcRef.current?.setRemoteDescription(offer);
          const answer = await pcRef.current?.createAnswer();
          await pcRef.current?.setLocalDescription(answer!);
          socket.emit("answer", answer, roomId);
          console.log("Answer sent");
        });
      }
    };

    init();

    return () => {
      pcRef.current?.close();
      socket.off("candidate");
      socket.off("offer");
      socket.off("answer");
      socket.off("peer-joined");
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const handleToggleCamera = () => {
    streamRef.current?.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setIsCameraOn(track.enabled);
    });
  };

  const handleToggleMic = () => {
    streamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setIsMicOn(track.enabled);
    });
  };

  const showChatSection = () => {
    setMessages((prev) => prev.map((msg) => ({ ...msg, status: true })));
    setShowChat(!showChat);
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const fileMessage = {
        type: "file",
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        fileType: getFileType(file.type),
        url: URL.createObjectURL(file),
        sender: "You",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: false,
      };

      setMessages((prev) => [...prev, fileMessage]);

      socket.emit(
        "send_video_call_message",
        {
          type: "file",
          fileName: file.name,
          fileSize: formatFileSize(file.size),
          fileType: getFileType(file.type),
          url: "simulated-url",
        },
        roomId,
        role,
      );
    } catch (error) {
      console.error("File upload failed:", error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileType = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType.startsWith("audio/")) return "audio";
    if (mimeType.includes("pdf")) return "pdf";
    if (mimeType.includes("word") || mimeType.includes("document"))
      return "document";
    if (mimeType.includes("spreadsheet") || mimeType.includes("excel"))
      return "spreadsheet";
    return "file";
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "image":
        return <Image size={16} />;
      case "pdf":
        return <FileText size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  const handleDownload = (url: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        type: "text",
        text: messageInput,
        sender: "You",
        status: false,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, newMessage]);
      socket.emit(
        "send_video_call_message",
        {
          type: "text",
          text: messageInput,
        },
        roomId,
        role,
      );
      setMessageInput("");
    }
  };

  useEffect(() => {
    const handleReceiveMessage = (messageData: any, userType: string) => {
      const newMessage = {
        ...messageData,
        sender:
          userType === role ? "You" : userType === "lawyer" ? "Lawyer" : "User",
        status: false,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, newMessage]);
    };

    socket.on("recieve_video_call_message", handleReceiveMessage);

    return () => {
      socket.off("recieve_video_call_message", handleReceiveMessage);
    };
  }, [socket, role]);

  const handleEndCall = () => {
    pcRef.current?.close();
    socket.off("candidate");
    socket.off("offer");
    socket.off("answer");
    socket.off("peer-joined");
    setShowEndCallModal(true);
  };

  const handleSubmitModal = () => {
    pcRef.current?.close();
    pcRef.current = null;
    socket.off("candidate");
    socket.off("offer");
    socket.off("answer");
    socket.off("peer-joined");
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    console.log(role === "lawyer" ? { summary } : { rating, feedback });
    if (role == "lawyer") {
      addFinalNote(roomId, summary).then(() => {
        navigate("/lawyer-dashboard");
      });
    } else {
      addFeedback(roomId, { feedback: feedback, rating: rating }).then(() => {
        navigate("/user-dashboard");
      });
    }
    setShowEndCallModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto h-screen flex flex-col gap-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-5 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">
                Video Consultation
              </h1>
              <div className="flex items-center gap-3">
                <p className="text-sm text-indigo-200">
                  Room:{" "}
                  <span className="font-mono font-semibold">{roomId}</span>
                </p>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 text-emerald-300 rounded-full text-xs font-semibold">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  Connected
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-indigo-300 mb-1">Role</div>
              <div className="px-4 py-1.5 bg-indigo-500/30 backdrop-blur-sm border border-indigo-400/40 text-white rounded-lg text-sm font-semibold capitalize">
                {role}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex gap-4 min-h-0">
          <div
            className={`${showChat ? "flex-1" : "w-full"} transition-all duration-500 ease-in-out`}
          >
            <div className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-900 to-black rounded-2xl overflow-hidden relative shadow-2xl border border-white/10">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none"></div>

              <div className="absolute top-6 right-6 w-48 h-36 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl overflow-hidden shadow-2xl border-2 border-white/30 transition-transform hover:scale-105 duration-300">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 text-xs text-white/80 font-medium bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
                  You
                </div>
              </div>

              <div className="absolute bottom-6 left-6 flex gap-3">
                {!isMicOn && (
                  <div className="bg-red-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg border border-red-400/30 animate-pulse">
                    <MicOff size={16} /> Muted
                  </div>
                )}
                {!isCameraOn && (
                  <div className="bg-red-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg border border-red-400/30 animate-pulse">
                    <VideoOff size={16} /> Camera Off
                  </div>
                )}
              </div>
            </div>
          </div>

          {showChat && (
            <div className="w-96 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-bold text-white text-lg">Chat</h3>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-200"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 p-5 overflow-y-auto space-y-3 custom-scrollbar">
                {messages.length === 0 ? (
                  <div className="text-center mt-12">
                    <MessageSquare
                      size={48}
                      className="mx-auto text-white/20 mb-3"
                    />
                    <p className="text-white/40 text-sm">No messages yet</p>
                    <p className="text-white/30 text-xs mt-1">
                      Start the conversation
                    </p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/10 hover:bg-white/15 transition-all duration-200 ${
                        msg.sender === "You"
                          ? "border-l-4 border-l-indigo-400"
                          : "border-l-4 border-l-emerald-400"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm text-white">
                          {msg.sender}
                        </span>
                        <span className="text-xs text-white/50">
                          {msg.time}
                        </span>
                      </div>

                      {msg.type === "file" ? (
                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                          <div className="text-indigo-300">
                            {getFileIcon(msg.fileType)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white font-medium truncate">
                              {msg.fileName}
                            </p>
                            <p className="text-xs text-white/60">
                              {msg.fileSize}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              handleDownload(msg.url, msg.fileName)
                            }
                            className="text-white/70 hover:text-white p-1 rounded transition-colors"
                            title="Download file"
                          >
                            <Download size={16} />
                          </button>
                        </div>
                      ) : (
                        <p className="text-sm text-white/90 leading-relaxed">
                          {msg.text}
                        </p>
                      )}
                    </div>
                  ))
                )}

                {uploading && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/10 border-l-4 border-l-indigo-400">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm text-white">
                        You
                      </span>
                      <span className="text-xs text-white/50">
                        Uploading...
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-400 border-t-transparent"></div>
                      <p className="text-sm text-white/70">Uploading file...</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-5 border-t border-white/10 flex gap-2">
                <button
                  onClick={handleFileUploadClick}
                  disabled={uploading}
                  className="px-3 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Upload file"
                >
                  <Paperclip size={20} />
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="*/*"
                />

                <input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-sm text-white placeholder-white/40"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20">
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={handleToggleMic}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${
                isMicOn
                  ? "bg-white/20 text-white hover:bg-white/30 border border-white/30"
                  : "bg-red-500 text-white hover:bg-red-600 border border-red-400"
              }`}
            >
              {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
            </button>

            <button
              onClick={handleToggleCamera}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${
                isCameraOn
                  ? "bg-white/20 text-white hover:bg-white/30 border border-white/30"
                  : "bg-red-500 text-white hover:bg-red-600 border border-red-400"
              }`}
            >
              {isCameraOn ? <Video size={24} /> : <VideoOff size={24} />}
            </button>

            <button
              onClick={handleEndCall}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 flex items-center justify-center shadow-xl hover:shadow-red-500/50 transition-all duration-300 border border-red-400/50 transform hover:scale-105"
            >
              <Phone size={24} className="transform rotate-135" />
            </button>

            <button
              onClick={() => showChatSection()}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg relative ${
                showChat
                  ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white border border-indigo-400"
                  : "bg-white/20 text-white hover:bg-white/30 border border-white/30"
              }`}
            >
              <MessageSquare size={24} />
              {messages.filter((msg) => msg.sender !== "You" && !msg.status)
                .length > 0 &&
                !showChat && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold border-2 border-slate-900">
                    {
                      messages.filter(
                        (msg) => msg.sender !== "You" && !msg.status,
                      ).length
                    }
                  </div>
                )}
            </button>
          </div>
        </div>

        {showEndCallModal && role === "lawyer" && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl max-w-md w-full p-8 border border-white/20 animate-in zoom-in-95 duration-300">
              <h2 className="text-3xl font-bold text-white mb-6">
                Final Note Summary
              </h2>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Enter consultation summary..."
                className="w-full h-48 px-5 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none text-sm text-white placeholder-white/40"
              />
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setShowEndCallModal(false)}
                  className="flex-1 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 text-white font-semibold transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitModal}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 font-semibold shadow-lg hover:shadow-indigo-500/50 transition-all duration-200"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {showEndCallModal && role === "user" && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl max-w-md w-full p-8 border border-white/20 animate-in zoom-in-95 duration-300">
              <h2 className="text-3xl font-bold text-white mb-6">
                Rate Your Experience
              </h2>
              <div className="flex gap-2 mb-6 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={36}
                    className={`${rating >= star ? "text-yellow-400 fill-yellow-400" : "text-white/30"} cursor-pointer transition-all duration-200 hover:scale-110`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your feedback..."
                className="w-full h-48 px-5 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none text-sm text-white placeholder-white/40"
              />
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setShowEndCallModal(false)}
                  className="flex-1 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 text-white font-semibold transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitModal}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 font-semibold shadow-lg hover:shadow-indigo-500/50 transition-all duration-200"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default VideoCallPage;
