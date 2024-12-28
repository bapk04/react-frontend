function MeetingEnded() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center" style={{
      backgroundImage: 'url(https://media.istockphoto.com/vectors/empty-classroom-school-education-background-vector-id1336441139?k=20&m=1336441139&s=612x612&w=0&h=5cMGEpRtvJnz6mCstjAyYAov3Pp6ajyBlP7S-jErb4g=)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative'
    }} >
      <div className="bg-white p-8 rounded shadow-md text-center" >
        <h1 className="text-3xl font-bold mb-4">Meeting Ended</h1>
        <p className="text-gray-600 mb-6">Thank you for attending the meeting.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

export default MeetingEnded;
