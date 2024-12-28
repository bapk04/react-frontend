import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


function Join({ handleCreateMeeting, handleJoinMeeting }) {
  const generateGuestName = () => {
    const randomNum = Math.floor(Math.random() * 1000) + 1;
    return `guest${randomNum}`;
  };

  const [username, setUsername] = useState(localStorage.getItem("username") || generateGuestName());
  const [roomName, setRoomName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Nếu username là "Guest", thay thế bằng tên ngẫu nhiên
    if (username.toLowerCase() === "guest") {
      const newGuestName = generateGuestName();
      setUsername(newGuestName);
      localStorage.setItem("username", newGuestName);
    }
  }, [username]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login", { replace: true });
  };


  return (
    <div
      id="joinView"
      className="w-full h-screen flex items-center justify-center"
      style={{
        backgroundImage:
          'url(https://media.istockphoto.com/vectors/empty-classroom-school-education-background-vector-id1336441139?k=20&m=1336441139&s=612x612&w=0&h=5cMGEpRtvJnz6mCstjAyYAov3Pp6ajyBlP7S-jErb4g=)',
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      <div className="bg-white bg-opacity-80 w-11/12 max-w-screen-md rounded shadow-lg p-10 relative z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-gray-800 text-2xl">
            Chào mừng bạn, <span className="font-bold">{username}</span> đến với Video Chat Online!
          </h2>
          <button
            onClick={handleLogout}
            className="btn bg-red-500 hover:bg-red-700 text-white text-sm px-4 py-2 rounded"
          >
            Đăng xuất
          </button>
        </div>
        <label className="label">
          <span className="label-text text-gray-800">Name:</span>
        </label>
        <input
          value={username}
          type="text"
          className="w-full input input-primary input-bordered bg-gray-100 text-black"
          placeholder="Enter your name"
          readOnly
        />
        <div className="divider">AND</div>
        <div className="flex flex-row items-center justify-between">
          <div className="form-control flex-1">
            <div className="relative">
              <input
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                id="meetingId"
                type="text"
                placeholder="Meeting ID"
                className="w-full pr-16 input input-primary input-bordered bg-gray-100 text-black"
              />
              <button
                id="joinExistingMeeting"
                className="absolute top-0 right-0 rounded-l-none btn bg-blue-500 hover:bg-blue-700 text-white text-xs"
                onClick={() => handleJoinMeeting(roomName, username)}
              >
                <span className="hidden sm:block">Join Existing Meeting</span>
                <span className="sm:hidden">Join</span>
              </button>
            </div>
          </div>
          <div className="divider divider-horizontal flex-0">OR</div>
          <div className="flex flex-1">
            <button
              onClick={() => handleCreateMeeting(username)}
              id="createANewMeeting"
              className="btn bg-blue-500 hover:bg-blue-700 text-white px-20"
            >
              Create a new meeting
            </button>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-black opacity-25 z-0"></div>
    </div>
  );
}

export default Join;
