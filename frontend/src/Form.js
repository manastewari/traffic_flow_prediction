import React, { useState } from "react";
import { predictTraffic } from "./api";

const options = {
  City: ["Ecoopolis", "Technotown", "Autoville", "SolarCity"],
  "Vehicle Type": ["Drone", "Autonomous Car", "Hyperloop", "Electric Scooter"],
  Weather: ["Clear", "Rainy", "Stormy", "Snowy", "Foggy"],
  "Economic Condition": ["Stable", "Boom", "Recession"],
  "Day Of Week": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
};

const initialForm = {
  City: "Ecoopolis",
  "Vehicle Type": "Drone",
  Weather: "Clear",
  "Economic Condition": "Stable",
  "Day Of Week": "Monday",
  "Hour Of Day": 9,
  Speed: 60,
  "Is Peak Hour": 1,
  "Random Event Occurred": 0,
  "Energy Consumption": 40,
};

export default function Form({ setPrediction }) {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [trafficLevel, setTrafficLevel] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const isNumber = ["Hour Of Day", "Speed", "Is Peak Hour", "Random Event Occurred", "Energy Consumption"].includes(name);
    setFormData({ ...formData, [name]: isNumber ? Number(value) : value });
  };

  const getTrafficCategory = (density) => {
    if (density >= 0 && density < 0.3) return "Low";
    else if (density >= 0.3 && density < 0.7) return "Medium";
    else return "High";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await predictTraffic(formData);
      const category = getTrafficCategory(result.predicted_traffic_density);
      setTrafficLevel(category);
      setPrediction(category);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow-2xl rounded-2xl">
      <h2 className="text-2xl font-bold mb-4 text-center">🚦 Predict Traffic Flow</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(options).map((key) => (
          <div key={key}>
            <label className="block mb-1 font-medium">{key}</label>
            <select
              name={key}
              value={formData[key]}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg bg-gray-50"
            >
              {options[key].map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        ))}

        {["Hour Of Day", "Speed", "Is Peak Hour", "Random Event Occurred", "Energy Consumption"].map((key) => (
          <div key={key}>
            <label className="block mb-1 font-medium">{key}</label>
            <input
              type="number"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>
        ))}

        {error && <p className="text-red-600 font-semibold">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition"
        >
          {loading ? "Predicting..." : "Predict Traffic Density"}
        </button>

        {trafficLevel && (
          <div className="mt-4 text-center text-xl font-semibold">
            Predicted Traffic Level: <span className="text-blue-800">{trafficLevel}</span>
          </div>
        )}
      </form>
    </div>
  );
}
