// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "./Admin.css"; // Đảm bảo rằng bạn tạo file Admin.css

// function Admin() {
//   const [meetings, setMeetings] = useState([]);
//   const [selectedMeetingDetails, setSelectedMeetingDetails] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchMeetings = async () => {
//       try {
//         const username = localStorage.getItem("username");
//         if (username !== "admin") {
//           navigate("/admin-login"); // Chuyển hướng nếu không phải admin
//           return;
//         }

//         const response = await axios.get("http://localhost:5000/api/meeting-presence");
//         setMeetings(response.data);
//       } catch (error) {
//         console.error("Error fetching meetings:", error);
//       }
//     };

//     fetchMeetings();
//   }, [navigate]);

//   const fetchMeetingDetails = async (roomCode) => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`http://localhost:5000/api/meeting-details/${roomCode}`);
//       setSelectedMeetingDetails(response.data);
//     } catch (error) {
//       console.error("Error fetching meeting details:", error);
//       setSelectedMeetingDetails(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="admin-container">
//       <h1 className="admin-title">Admin Dashboard</h1>
      
//       <table className="meeting-table">
//         <thead>
//           <tr>
//             <th>Room Code</th>
//             <th>Participants</th>
//             <th>Start Time</th>
//             <th>End Time</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {meetings.map((meeting, index) => (
//             <tr key={index}>
//               <td>{meeting.room_code}</td>
//               <td>{meeting.participants}</td>
//               <td>{meeting.start_time}</td>
//               <td>{meeting.end_time || "Ongoing"}</td>
//               <td>
//                 <button className="details-button" onClick={() => fetchMeetingDetails(meeting.room_code)}>
//                   View Details
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {loading && <div className="loading">Loading...</div>}

//       {selectedMeetingDetails && (
//         <div className="meeting-details">
//           <h2>Meeting Details</h2>
//           <p><strong>Room Code:</strong> {selectedMeetingDetails.room_code}</p>
//           <p><strong>Participants:</strong> {selectedMeetingDetails.participants}</p>
//           <p><strong>Start Time:</strong> {selectedMeetingDetails.start_time}</p>
//           <p><strong>End Time:</strong> {selectedMeetingDetails.end_time || "Ongoing"}</p>
//           <h3>Messages:</h3>
//           {selectedMeetingDetails.messages.length > 0 ? (
//             <ul>
//               {selectedMeetingDetails.messages.map((message, index) => (
//                 <li key={index}>
//                   <strong>{message.sender}:</strong> {message.message} <em>({message.timestamp})</em>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p>No messages found for this meeting.</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// export default Admin;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

function Admin() {
  const [meetings, setMeetings] = useState([]);
  const [selectedMeetingDetails, setSelectedMeetingDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const username = localStorage.getItem("username");
        if (username !== "admin") {
          navigate("/admin-login"); // Chuyển hướng nếu không phải admin
          return;
        }

        const response = await axios.get("http://localhost:5000/api/meeting-presence");
        setMeetings(response.data);
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };

    fetchMeetings();
  }, [navigate]);

  const fetchMeetingDetails = async (roomCode) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/meeting-details/${roomCode}`);
      setSelectedMeetingDetails(response.data);
      setIsModalOpen(true); // Mở modal khi nhận được dữ liệu
    } catch (error) {
      console.error("Error fetching meeting details:", error);
      setSelectedMeetingDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false); // Đóng modal
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>
      
      <table className="meeting-table">
        <thead>
          <tr>
            <th>Room Code</th>
            <th>Participants</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {meetings.map((meeting, index) => (
            <tr key={index}>
              <td>{meeting.room_code}</td>
              <td>{meeting.participants}</td>
              <td>{meeting.start_time}</td>
              <td>{meeting.end_time || "Ongoing"}</td>
              <td>
                <button className="details-button" onClick={() => fetchMeetingDetails(meeting.room_code)}>
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {loading && <div className="loading">Loading...</div>}

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>&times;</button>
            <h2>Meeting Details</h2>
            <p><strong>Room Code:</strong> {selectedMeetingDetails.room_code}</p>
            <p><strong>Participants:</strong> {selectedMeetingDetails.participants}</p>
            <p><strong>Start Time:</strong> {selectedMeetingDetails.start_time}</p>
            <p><strong>End Time:</strong> {selectedMeetingDetails.end_time || "Ongoing"}</p>
            <h3>Messages:</h3>
            {selectedMeetingDetails.messages.length > 0 ? (
              <ul>
                {selectedMeetingDetails.messages.map((message, index) => (
                  <li key={index}>
                    <strong>{message.sender}:</strong> {message.message} <em>({message.timestamp})</em>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No messages found for this meeting.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
