"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

// Define the Trainer type
interface Trainer {
  name: string;
  email: string;
  phone: string;
}

export default function AssignedTrainerPage() {
  const [trainer, setTrainer] = useState<Trainer | null>(null);

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const { data } = await axios.get<Trainer>("http://localhost:5000/api/trainers/assigned-trainer");
        setTrainer(data);
      } catch  {
        toast.error("Failed to fetch trainer details");
      }
    };

    fetchTrainer();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Assigned Trainer</h1>

      {trainer ? (
        <div className="mt-4 p-4 border border-gray-600 rounded-lg">
          <p>Name: {trainer.name}</p>
          <p>Email: {trainer.email}</p>
          <p>Phone: {trainer.phone}</p>
        </div>
      ) : (
        <p className="mt-4 text-gray-400">No trainer assigned.</p>
      )}
    </div>
  );
}