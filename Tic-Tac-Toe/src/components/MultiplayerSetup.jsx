// Multiplayer.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MultiplayerSetup() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const navigate = useNavigate();

  function generateRoomID() {
    return Math.random().toString(36).substring(2, 8);
  }

  async function handleCreateRoom(e) {
    e.preventDefault();
    const trimmedName = name.trim() || "Player 1";
    const roomId = generateRoomID();

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(roomId);
      } else {
        const input = document.createElement("input");
        input.value = roomId;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }
    } catch (err) {
      console.error("Room copy failed", err);
    }

    navigate(`/lobby?room=${roomId}&name=${trimmedName}&type=host`);
  }

  function handleJoinRoom(e) {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedRoom = room.trim();

    if (!trimmedName || !trimmedRoom) {
      alert("Please enter both name and room ID");
      return;
    }

    navigate(`/lobby?room=${trimmedRoom}&name=${trimmedName}&type=guest`);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050713] px-6 py-12 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl sm:h-96 sm:w-96" />
        <div className="absolute bottom-[-15%] right-[-10%] h-[26rem] w-[26rem] rounded-full bg-indigo-500/20 blur-[150px]" />
        <div className="absolute left-1/2 top-10 h-40 w-40 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-2xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-[0_35px_80px_rgba(15,23,42,0.55)] backdrop-blur-xl md:p-10">
        <div className="mb-6 flex flex-col gap-2 text-center">
          <span className="mx-auto rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-slate-200">
            Multiplayer Arena
          </span>
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">
            Set up your match
          </h1>
          <p className="text-sm text-slate-300 sm:text-base">
            Create a room to host a friend or jump straight into a friend’s
            lobby using their code.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-6">
            <h2 className="text-lg font-semibold text-emerald-100">
              Create a room
            </h2>
            <p className="mt-2 text-sm text-emerald-200/80">
              Generate a private lobby and share the room code with your friend.
            </p>

            <label className="mt-5 block text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200/70">
              Your name
            </label>
            <input
              type="text"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-emerald-200/50 focus:border-emerald-300/60 focus:outline-none focus:ring-1 focus:ring-emerald-300/50"
              placeholder="Enter nickname"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <button
              onClick={handleCreateRoom}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-emerald-400/90 to-emerald-500/90 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-slate-900 shadow-lg shadow-emerald-500/30 transition hover:brightness-110"
            >
              Create & copy room code
            </button>
            <p className="mt-3 text-xs text-emerald-100/70">
              A six-character room ID will be generated automatically.
            </p>
          </div>

          <div className="rounded-2xl border border-indigo-400/20 bg-indigo-400/10 p-6">
            <h2 className="text-lg font-semibold text-indigo-100">
              Join a room
            </h2>
            <p className="mt-2 text-sm text-indigo-200/80">
              Already have an invite? Enter the host’s room ID below to hop in.
            </p>

            <label className="mt-5 block text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200/70">
              Your name
            </label>
            <input
              type="text"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-indigo-200/50 focus:border-indigo-300/60 focus:outline-none focus:ring-1 focus:ring-indigo-300/50"
              placeholder="Enter nickname"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label className="mt-5 block text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200/70">
              Room ID
            </label>
            <input
              type="text"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-indigo-200/50 focus:border-indigo-300/60 focus:outline-none focus:ring-1 focus:ring-indigo-300/50"
              placeholder="e.g. 9kq4xv"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />

            <button
              onClick={handleJoinRoom}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-indigo-400/90 to-purple-500/90 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-slate-900 shadow-lg shadow-indigo-500/30 transition hover:brightness-110"
            >
              Join room
            </button>
            <p className="mt-3 text-xs text-indigo-100/70">
              Make sure the room ID is exactly six characters long.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm text-slate-200">
          <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
            How it works
          </h3>
          <ol className="mt-3 space-y-2">
            <li>1. One player creates a room and shares the generated code.</li>
            <li>2. The other player enters the code to join the lobby.</li>
            <li>3. When both players are ready, the host starts the match.</li>
            <li>4. Your game syncs automatically with real-time moves.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
