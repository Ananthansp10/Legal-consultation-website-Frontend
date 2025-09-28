import React, { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { connectSocket } from '../../config/socket';

// Type definitions for simple-peer
interface PeerInstance {
  signal: (data: any) => void;
  destroy: () => void;
  on: (event: string, callback: (...args: any[]) => void) => void;
}

interface PeerConstructor {
  new (options: PeerOptions): PeerInstance;
}

interface PeerOptions {
  initiator: boolean;
  trickle: boolean;
  stream?: MediaStream;
}

// Declare the global Peer constructor (assumes simple-peer is loaded globally)
declare global {
  const Peer: PeerConstructor;
}

// Socket event types
interface CallUserData {
  from: string;
  signal: any;
}

interface CallUserEmitData {
  userToCall: string;
  signalData: any;
  from: string;
}

interface AnswerCallEmitData {
  signal: any;
  to: string;
}

function VideoCallPage(): JSX.Element {
  const socket: Socket = connectSocket();
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [peerId, setPeerId] = useState<string>('');
  const [callerId, setCallerId] = useState<string>('');
  const [receivingCall, setReceivingCall] = useState<boolean>(false);
  const [callAccepted, setCallAccepted] = useState<boolean>(false);
  const [callEnded, setCallEnded] = useState<boolean>(false);

  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<PeerInstance | any>(null);

  useEffect(() => {
    // Get user media (camera and microphone)
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream: MediaStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      })
      .catch((err: Error) => console.error("Error accessing media devices:", err));

    // Listen for own ID from signaling server
    socket.on('me', (id: string) => {
      setPeerId(id);
    });

    // Listen for incoming calls
    socket.on('callUser', ({ from, signal }: CallUserData) => {
      setReceivingCall(true);
      setCallerId(from);
      connectionRef.current = signal; // Store the incoming signal
    });

    // Cleanup function
    return () => {
      socket.off('me');
      socket.off('callUser');
      socket.off('callAccepted');
    };
  }, [socket]);

  const callUser = (id: string): void => {
    if (!stream) {
      console.error('No stream available');
      return;
    }

    const peer: PeerInstance = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', (data: any) => {
      const callData: CallUserEmitData = {
        userToCall: id,
        signalData: data,
        from: peerId
      };
      socket.emit('callUser', callData);
    });

    peer.on('stream', (currentStream: MediaStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    socket.on('callAccepted', (signal: any) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = (): void => {
    if (!stream) {
      console.error('No stream available');
      return;
    }

    setCallAccepted(true);
    const peer: PeerInstance = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data: any) => {
      const answerData: AnswerCallEmitData = {
        signal: data,
        to: callerId
      };
      socket.emit('answerCall', answerData);
    });

    peer.on('stream', (currentStream: MediaStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    peer.signal(connectionRef.current); // Use the stored incoming signal
    connectionRef.current = peer;
  };

  const leaveCall = (): void => {
    setCallEnded(true);
    if (connectionRef.current) {
      connectionRef.current.destroy(); // Destroy the peer connection
    }
    
    // Stop all tracks in the stream
    if (stream) {
      stream.getTracks().forEach((track: MediaStreamTrack) => {
        track.stop();
      });
    }
    
    // Clean up video elements
    if (myVideo.current) {
      myVideo.current.srcObject = null;
    }
    if (userVideo.current) {
      userVideo.current.srcObject = null;
    }
  };

  const handleCallerIdChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCallerId(e.target.value);
  };

  return (
    <div>
      <h1>WebRTC with simple-peer</h1>
      <div>
        <h2>My Video</h2>
        <video 
          playsInline 
          muted 
          ref={myVideo} 
          autoPlay 
          style={{ width: '300px' }} 
        />
        <p>My ID: {peerId}</p>
      </div>
      <div>
        <h2>Remote Video</h2>
        {callAccepted && !callEnded ? (
          <video 
            playsInline 
            ref={userVideo} 
            autoPlay 
            style={{ width: '300px' }} 
          />
        ) : null}
      </div>
      <div>
        <input
          type="text"
          placeholder="Enter ID to call"
          value={callerId}
          onChange={handleCallerIdChange}
        />
        <button onClick={() => callUser(callerId)} disabled={!stream || !peerId}>
          Call
        </button>
        {receivingCall && !callAccepted ? (
          <div>
            <p>{callerId} is calling...</p>
            <button onClick={answerCall}>Answer</button>
          </div>
        ) : null}
        {callAccepted && !callEnded ? (
          <button onClick={leaveCall}>End Call</button>
        ) : null}
      </div>
    </div>
  );
}

export default VideoCallPage;