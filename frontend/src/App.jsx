import { useState } from "react";
import IdentityCard from "./components/IdentityCard";
import ChatRoom from "./components/ChatRoom";

function App() {
  const [identity, setIdentity] = useState(null);

  const generateIdentity = async () => {
    const res = await fetch("http://localhost:5000/generate");
    const data = await res.json();
    setIdentity(data);
  };

  return (
    <div className="p-6">
      {!identity ? (
        <div className="text-center">
          <h1 className="text-2xl mb-4">Who will you be today?</h1>
          <button
            onClick={generateIdentity}
            className="px-4 py-2 bg-green-500 text-black font-bold rounded"
          >
            Generate Me
          </button>
        </div>
      ) : (
        <>
          <IdentityCard identity={identity} />
          <ChatRoom identity={identity} />
        </>
      )}
    </div>
  );
}

export default App;
