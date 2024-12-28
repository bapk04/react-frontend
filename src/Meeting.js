import React, { useState, useEffect, useRef, useMemo } from 'react';
import io from 'socket.io-client';
import axios from 'axios'; 

import classNames from "classnames";
import VideoTag from "./VideoTag";
import Chat from './Chat';

function Meeting({
  handleMicBtn,
  handleCameraBtn,
  handelScreenBtn,
  handleLeaveBtn,
  localVideoStream,
  onlineUsers,
  remoteTracks,
  username,
  roomName,
  meetingInfo,
  micShared,
  cameraShared,
  screenShared,
}) {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  const totalParticipants = onlineUsers.length + (localVideoStream ? 1 : 0);


  const sendMessage = (message) => {
    socketRef.current.send(`${username}: ${message}`);
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomName).then(() => {
      alert("Room code copied to clipboard!");
    }).catch(() => {
      alert("Failed to copy room code");
    });
  };

  const updateParticipantsInDatabase = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/update-participants/${roomName}`, {
        participants: totalParticipants
      });
  
      if (response.data.success) {
        console.log("Participants count updated successfully!");
      } else {
        console.error("Failed to update participants count.");
      }
    } catch (error) {
      console.error("Error updating participants count:", error);
    }
  };
  

  useEffect(() => {
    socketRef.current = io('http://localhost:5000');
    
    socketRef.current.on('message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
      setHasNewMessage(true);
    });

    return () => {
      socketRef.current.off('message');
      socketRef.current.disconnect();
    };
  }, []);

  const userStreamMap = useMemo(() => {
    let map = {};
    for (let trackItem of remoteTracks) {
      if (!map[trackItem.participantSessionId]) {
        map[trackItem.participantSessionId] = [];
      }
      map[trackItem.participantSessionId].push(trackItem);
    }
    return map;
  }, [remoteTracks]);

  const remoteParticipantTags = useMemo(() => {
    return onlineUsers.map(user => {
      if (user._id === meetingInfo.participantSessionId) {
        return null;
      }
      let videoTags = [];
      if (userStreamMap[user._id] && userStreamMap[user._id].length > 0) {
        for (let trackItem of userStreamMap[user._id]) {
          let stream = new MediaStream();
          stream.addTrack(trackItem.track);

          if (trackItem.type === "video") {
            videoTags.push(
              <VideoTag key={trackItem.streamId} srcObject={stream} style={{ width: "504px", height: "285px", borderRadius: "8px"  }} />
            );
          }
          if (trackItem.type === "audio") {
            videoTags.push(
              <VideoTag
                key={trackItem.streamId}
                srcObject={stream}
                style={{ display: "none" }}
              />
            );
          }
        }
      } else {
        videoTags.push(
          <div
            key={user._id}
            className="bg-black flex items-center justify-center"
            style={{ width: "504px", height: "285px", borderRadius: "8px"  }}
          >
            <span className="text-white text-2xl font-bold">
              {user.name[0].toUpperCase()}
            </span>
          </div>
        );
      }

      return (
        <div key={user._id} style={{ padding: '7px' }}>
          <div id="remoteVideos" style={{ border: '1px solid #ddd', borderRadius: '4px' ,width: "505px", height: "285px" }}>{videoTags}</div>
          <div id="username" className="bg-black text-white text-center" style={{ border: '1px solid #ddd', borderRadius: '4px' ,width: "505px" }}>
            {user.name}
          </div>
        </div>
      );
    }).filter(Boolean);
  }, [onlineUsers, userStreamMap, meetingInfo.participantSessionId]);

  const localVideoTag = useMemo(() => {
    if (localVideoStream) {
      return (
        <VideoTag
          id="meetingAreaLocalVideo"
          muted={true}
          srcObject={localVideoStream}
          style={{ padding: 0, margin: 0, width: "200px", height: "150px", borderRadius: "8px" }}
        />
      );
    }
    return (
      <div
        className="bg-black flex items-center justify-center"
        style={{ width: "200px", height: "150px", borderRadius: "8px" }}
      >
        <span className="text-white text-2xl font-bold">
          {username[0].toUpperCase()}
        </span>
      </div>
    );
  }, [localVideoStream, username]);

  const getGridClass = (count) => {
    if (count <= 3) {
      return "grid grid-cols-3";
    } else if (count <= 6) {
      return "grid grid-cols-3 grid-rows-2";
    } else {
      return "grid grid-cols-3 grid-rows-3";
    }
  };

  
  

  // Cập nhật handleLeaveBtn để gọi API end meeting
  const handleLeaveMeeting = async () => {
    try {
      // Gọi API kết thúc cuộc họp
      const response = await axios.post(`http://localhost:5000/api/end-meeting/${roomName}`);
      
      if (response.data.success) {
        alert("Meeting ended successfully!");
        // Điều hướng ra ngoài hoặc xử lý thêm nếu cần
        handleLeaveBtn(); // Gọi hàm kết thúc cuộc họp, ví dụ: quay về trang chủ
        await updateParticipantsInDatabase();

      } else {
        alert("Failed to end meeting.");
      }
      
    } catch (error) {
      console.error("Error ending meeting:", error);
      alert("Error ending meeting.");
    }
  };

  return (
    <div id="meetingView" className="flex flex-col">
      <div className="h-8 text-center bg-black">MeetingID: {roomName}
      <button onClick={copyRoomCode} className="btn btn-sm btn-outline ml-2">
      Copy
      </button>
      </div>
      
      <div className="flex">
        <div
          className={classNames("flex-1", getGridClass(onlineUsers.length))}
          id="remoteParticipantContainer"
          style={{ gap: '10px', paddingTop: "5px", paddingBottom: "7px", paddingRight: "10px"  }}
        >
          {remoteParticipantTags}
        </div>

        {showChat && (
          <div className="flex flex-col bg-base-300" style={{ width: "300px", marginLeft: "10px" }}>
            <Chat username={username} messages={messages} sendMessage={sendMessage} roomName={roomName} />
          </div>
        )}
      </div>

      <div className="flex flex-col bg-base-300 mx-5" style={{ width: "200px" }}>
        {localVideoTag}

        <div id="meetingAreaUsername" className="bg-base-300 bg-black" style={{ textAlign: "center", padding: "20px" }}>
          {username}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }} className="space-x-4">
        <button id="meetingViewMicrophone" className={classNames("btn", micShared ? "btn-primary" : "")} onClick={handleMicBtn}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
          </svg>
        </button>

        <button id="meetingViewCamera" className={classNames("btn", cameraShared ? "btn-primary" : "")} onClick={handleCameraBtn}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
        </button>

        <button id="meetingViewScreen" className={classNames("btn", screenShared ? "btn-primary" : "")} onClick={handelScreenBtn}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'/>
          </svg>
        </button>

        <button id='toggleChatButton' className='btn' onClick={() => {setShowChat(!showChat); setHasNewMessage(false);}}>
          <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7a2 2 0 002 2h4l4 4v-4h4a2 2 0 002-2z'/>
          </svg>
          {hasNewMessage && <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>}
        </button>
        
        <button id="meetingViewLeave" className="btn" onClick={handleLeaveMeeting}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Meeting;
