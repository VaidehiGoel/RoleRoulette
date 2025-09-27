import { useState, useEffect } from "react";
import IdentityCard from "./components/identityCard";
import TerminalLoading from "./components/terminalloading.jsx";

function App() {
  const [identity, setIdentity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  const handleGenerate = async () => {
    setLoading(true);
    setIdentity(null);
    setLogs(["> Initializing Role Roulette engine..."]);

    // Fake terminal logs to display while backend responds
    const fakeLogs = [
      "> Establishing secure connection...",
      "> Negotiating cipher suites...",
      "> Bypassing firewalls...",
      "> Cracking root access...",
      "> Generating digital identity..."
    ];

    // progressively push logs
    let i = 0;
    const logInterval = setInterval(() => {
      if (i < fakeLogs.length) {
        setLogs((prev) => [...prev, fakeLogs[i]]);
        i++;
      } else {
        clearInterval(logInterval);
      }
    }, 550);

    try {
      const res = await fetch("/api/generate");
      if (!res.ok) throw new Error("Failed to fetch identity");
      const data = await res.json();

      // Wait a little so logs are visible and feel cinematic
      setTimeout(() => {
        setIdentity(data);
        setLoading(false);
        setLogs([]);
      }, 2000);
    } catch (err) {
      console.error("Error fetching identity:", err);
      setLogs((prev) => [...prev, "> ERROR: Could not generate identity."]);
      setLoading(false);
      setTimeout(() => setLogs([]), 3000);
    }
  };

  useEffect(() => {
    // optional: keyboard shortcut (G) to generate
    const onKey = (e) => {
      if (e.key.toLowerCase() === "g" && !loading) handleGenerate();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line
  }, [loading]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-green-400 font-mono px-4">
      <h1 className="text-5xl font-extrabold mb-6 tracking-widest glitch neon-glow">
        Role Roulette
      </h1>

      <div className="flex gap-4">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-8 py-3 bg-green-600 text-black font-bold rounded-lg shadow-lg hover:bg-green-500 active:scale-95 transition-transform neon-glow disabled:opacity-60"
        >
          {loading ? "Generating..." : "Generate Me"}
        </button>
        <button
          onClick={() => {
            setIdentity(null);
            setLogs([]);
            setLoading(false);
          }}
          className="px-6 py-3 border border-green-600 rounded-lg hover:bg-green-900/20 transition"
        >
          Reset
        </button>
      </div>

      {/* Loading Terminal (animated) */}
      <div className="mt-8 w-full max-w-xl">
        {loading && <TerminalLoading logs={logs} />}

        {!loading && identity && (
          <div className="mt-6 flex justify-center">
            <IdentityCard identity={identity} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
