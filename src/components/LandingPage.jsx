import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 min-h-screen text-white">
      <header className="container mx-auto p-6">
        <nav className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Poli Gym</h1>
        </nav>
      </header>

      <main className="container mx-auto text-center py-20">
        <h1 className="text-5xl font-extrabold mb-6">
          Transforma-ti Viata cu Poli Gym
        </h1>
        <p className="text-lg mb-12">
          Pentru cand ai mers prea mult la sala de mese
        </p>
        <div className="space-x-4">
          <Link
            to="/signup"
            className="bg-white text-blue-600 py-3 px-6 rounded-lg shadow-lg hover:bg-gray-100"
          >
            Incepe-ti winter arc-ul
          </Link>
          <Link
            to="/login"
            className="bg-transparent border border-white py-3 px-6 rounded-lg hover:bg-gray-100 hover:text-blue-600"
          >
            Login
          </Link>
        </div>
      </main>

      <section className="bg-gray-100 text-gray-800 py-16">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <img
              src="https://via.placeholder.com/300"
              alt="Modern Equipment"
              className="w-full rounded-lg shadow-lg mb-6"
            />
            <h3 className="text-xl font-semibold mb-4">Modern Equipment</h3>
            <p>Experience the latest and best fitness technology available.</p>
          </div>
          <div>
            <img
              src="https://via.placeholder.com/300"
              alt="Expert Trainers"
              className="w-full rounded-lg shadow-lg mb-6"
            />
            <h3 className="text-xl font-semibold mb-4">Expert Trainers</h3>
            <p>Work with certified professionals to reach your goals faster.</p>
          </div>
          <div>
            <img
              src="https://via.placeholder.com/300"
              alt="Flexible Hours"
              className="w-full rounded-lg shadow-lg mb-6"
            />
            <h3 className="text-xl font-semibold mb-4">Flexible Hours</h3>
            <p>Find the perfect time to work out, no matter your schedule.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
