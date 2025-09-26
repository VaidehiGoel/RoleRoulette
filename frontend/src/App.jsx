import { useState } from "react";
import IdentityCard from "./identityCard";

function App() {
  const [identity, setIdentity] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setIdentity(null); // reset before fetching new one
    try {
      const res = await fetch("/api/generate");
      const data = await res.json();

      // Simulate a small delay for animation effect
      setTimeout(() => {
        setIdentity(data);
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error("Error fetching identity:", err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-green-400 font-mono">
      <h1 className="text-5xl font-bold mb-6 tracking-widest glitch">
        Role Roulette
      </h1>
      <button
        onClick={handleGenerate}
        className="px-8 py-3 bg-green-600 text-black font-bold rounded-lg shadow-lg hover:bg-green-500 active:scale-95 transition-transform"
      >
        Generate Me
      </button>

      {loading && (
        <div className="mt-8 animate-pulse text-green-500">
          Generating your role...
        </div>
      )}

      {identity && <IdentityCard identity={identity} />}
    </div>
  );
}

export default App;
