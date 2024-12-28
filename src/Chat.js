// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import EmojiPicker from 'emoji-picker-react';
// import './Chat.css';
// import axios from 'axios';

// const Chat = ({ username, messages, sendMessage }) => {
//   const [message, setMessage] = useState('');
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const handleSendMessage = useCallback(() => {
//     if (message.trim() !== '') {
//       sendMessage(message);
//       setMessage('');
//     }
//   }, [message, sendMessage]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (showEmojiPicker && !event.target.closest('.emoji-picker-popup') && !event.target.closest('.emoji-btn')) {
//         setShowEmojiPicker(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [showEmojiPicker]);

//   const handleSendFile = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append('file', file);
//     setIsUploading(true);

//     try {
//       const response = await axios.post('http://localhost:5000/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       const fileData = { url: `http://localhost:5000/${response.data.url}`, name: response.data.fileName, type: response.data.fileType };
//       sendMessage(fileData);
//     } catch (error) {
//       console.error('Error uploading file:', error);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const onEmojiClick = (emojiData) => {
//     setMessage(prevMessage => prevMessage + emojiData.emoji);
//     setShowEmojiPicker(false);
//   };

//   return (
//     <div className="chat-container">
//       <div className="chat-messages">
//         {messages.map((msg, index) => (
//           <div key={index} className="chat-message">
//             {msg.url ? (
//               msg.type.startsWith('image/') ? (
//                 <img src={msg.url} alt="sent file" className="sent-image" />
//               ) : (
//                 <a href={msg.url} download={msg.name} target="_blank" rel="noopener noreferrer">
//                   {msg.name}
//                 </a>
//               )
//             ) : (
//               <span className="message-content">{msg}</span>
//             )}
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>
//       <div className="chat-input">
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Type a message..."
//           aria-label="Type a message"
//         />
//         <button
//           className={`emoji-btn ${showEmojiPicker ? 'active' : ''}`}
//           onClick={() => setShowEmojiPicker(val => !val)}
//           aria-label="Select emoji"
//         >
//           😊
//         </button>
//         {showEmojiPicker && (
//           <div className="emoji-picker-popup">
//             <EmojiPicker onEmojiClick={onEmojiClick} />
//           </div>
//         )}
//         <input
//           type="file"
//           accept="*"
//           onChange={handleSendFile}
//           style={{ display: 'none' }}
//           id="fileUpload"
//         />
//         <label htmlFor="fileUpload" className="btn-file" aria-label="Upload file">
//           {isUploading ? 'Uploading...' : '📂'}
//         </label>
//         <button className='send' onClick={handleSendMessage} aria-label="Send message">➢</button>
//       </div>
//     </div>
//   );
// };

// export default Chat;
import React, { useState, useEffect, useRef, useCallback } from 'react';
import EmojiPicker from 'emoji-picker-react';
import './Chat.css';
import axios from 'axios';

const Chat = ({ username, roomName, messages, sendMessage }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef(null);

  // Cuộn xuống cuối tin nhắn khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Hàm gửi tin nhắn
  const handleSendMessage = useCallback(async () => {
    if (message.trim() === '') return;

    // Gửi tin nhắn lên giao diện
    sendMessage(message);

    // Gửi tin nhắn lên backend
    try {
      const payload = {
        room_code: roomName, // Sử dụng roomName
        sender: username,
        message: message.trim(),
      };

      console.log('Sending payload:', payload);

      const response = await axios.post('http://localhost:5000/api/save-message', payload);
      if (!response.data.success) {
        console.error('Failed to save message:', response.data.error);
      }
    } catch (error) {
      console.error('Error saving message:', error.response?.data || error.message);
    }

    // Xóa nội dung sau khi gửi
    setMessage('');
  }, [message, sendMessage, roomName, username]);

  // Đóng Emoji Picker khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showEmojiPicker &&
        !event.target.closest('.emoji-picker-popup') &&
        !event.target.closest('.emoji-btn')
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  // Hàm gửi file
  const handleSendFile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setIsUploading(true);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const fileData = {
        url: `http://localhost:5000/${response.data.url}`,
        name: response.data.fileName,
        type: response.data.fileType,
      };
      sendMessage(fileData);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Thêm emoji vào tin nhắn
  const onEmojiClick = (emojiData) => {
    setMessage((prevMessage) => prevMessage + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message">
            {msg.url ? (
              msg.type.startsWith('image/') ? (
                <img src={msg.url} alt="sent file" className="sent-image" />
              ) : (
                <a
                  href={msg.url}
                  download={msg.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {msg.name}
                </a>
              )
            ) : (
              <span className="message-content">{msg.message || msg}</span>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          aria-label="Type a message"
        />
        <button
          className={`emoji-btn ${showEmojiPicker ? 'active' : ''}`}
          onClick={() => setShowEmojiPicker((val) => !val)}
          aria-label="Select emoji"
        >
          😊
        </button>
        {showEmojiPicker && (
          <div className="emoji-picker-popup">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
        <input
          type="file"
          accept="*"
          onChange={handleSendFile}
          style={{ display: 'none' }}
          id="fileUpload"
        />
        <label htmlFor="fileUpload" className="btn-file" aria-label="Upload file">
          {isUploading ? 'Uploading...' : '📂'}
        </label>
        <button
          className="send"
          onClick={handleSendMessage}
          aria-label="Send message"
        >
          ➢
        </button>
      </div>
    </div>
  );
};

export default Chat;
