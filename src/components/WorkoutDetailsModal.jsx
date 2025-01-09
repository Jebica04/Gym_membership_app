import React from "react";

const WorkoutDetailsModal = ({ workout, onClose }) => {
  let videoId = null;

  // Extract the YouTube video ID
  try {
    const url = new URL(workout.videoLink);
    if (url.hostname === "www.youtube.com" || url.hostname === "youtube.com") {
      videoId = url.searchParams.get("v"); // Extract "v" parameter for YouTube links
    } else if (url.hostname === "youtu.be") {
      videoId = url.pathname.substring(1); // Extract video ID for shortened links
    }
  } catch (error) {
    console.error("Invalid video link:", workout.videoLink);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4">{workout.name}</h2>
        <p><strong>Tip:</strong> {workout.type}</p>
        <p><strong>Grupa Muschi:</strong> {workout.muscleGroup}</p>
        <p><strong>Reps x Sets:</strong> {workout.reps} x {workout.sets}</p>
        <div className="mt-4">
          {videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="Workout Video"
              className="w-full h-64 rounded-lg"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          ) : (
            <p className="text-red-600">Invalid or missing video link.</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default WorkoutDetailsModal;
