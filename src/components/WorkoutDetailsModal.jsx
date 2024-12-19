import React from "react";

const WorkoutDetailsModal = ({ workout, onClose }) => {
  const videoId = new URL(workout.videoLink).searchParams.get("v");

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
        <p><strong>Groupa Muschi:</strong> {workout.muscleGroup}</p>
        <p><strong>Repetari x Seturi:</strong> {workout.reps} x {workout.sets}</p>
        <div className="mt-4">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={workout.name}
            className="w-full h-64 rounded-lg"
            frameBorder="0"
            allowFullScreen
          ></iframe>
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
