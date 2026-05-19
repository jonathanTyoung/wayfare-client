import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../data/Fetcher";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const existDialog = useRef();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    fetch(`${API_URL}/login`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((authInfo) => {
        if (authInfo.valid) {
          localStorage.setItem("wayfare_token", authInfo.token);
          navigate("/home");
        } else {
          existDialog.current.showModal();
        }
      });
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-app-bg">
      <dialog
        ref={existDialog}
        className="bg-app-surface text-stone-100 border border-stone-700/60 rounded-lg p-6 max-w-sm w-full flex-col items-center gap-4 shadow-2xl open:flex [&::backdrop]:bg-black/60 [&::backdrop]:backdrop-blur-sm"
      >
        <div>User does not exist</div>
        <button
          className="px-4 py-1.5 rounded-md bg-transparent border border-stone-700/60 text-stone-400 hover:bg-stone-800/50 hover:text-stone-100 transition-colors text-sm"
          onClick={() => existDialog.current.close()}
        >
          Close
        </button>
      </dialog>

      <section className="w-full max-w-md">
        <form
          onSubmit={handleLogin}
          className="bg-app-surface border border-stone-700/60 rounded-xl p-8 sm:p-10 flex flex-col gap-1 shadow-xl"
        >
          <h1 className="text-4xl font-special text-app-accent mt-2 mb-2">
            Wayfare
          </h1>
          <h2 className="text-lg text-stone-300 mb-8">Please sign in</h2>

          <fieldset className="mb-4">
            <label htmlFor="inputUsername" className="text-sm text-stone-300">
              Username
            </label>
            <input
              type="text"
              id="inputUsername"
              value={username}
              onChange={(evt) => setUsername(evt.target.value)}
              className="block w-full mt-1.5 px-3 py-2 rounded-md bg-app-bg border border-stone-700/60 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-app-accent focus:ring-2 focus:ring-app-accent/20"
              placeholder="Username"
              required
              autoFocus
            />
          </fieldset>

          <fieldset className="mb-6">
            <label htmlFor="inputPassword" className="text-sm text-stone-300">
              Password
            </label>
            <input
              type="password"
              id="inputPassword"
              value={password}
              onChange={(evt) => setPassword(evt.target.value)}
              className="block w-full mt-1.5 px-3 py-2 rounded-md bg-app-bg border border-stone-700/60 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-app-accent focus:ring-2 focus:ring-app-accent/20"
              placeholder="Password"
            />
          </fieldset>

          <fieldset>
            <button
              type="submit"
              className="w-full px-4 py-2.5 rounded-md bg-app-accent text-stone-900 font-medium hover:bg-app-accent-hover transition-colors"
            >
              Sign in
            </button>
          </fieldset>
        </form>

        <div className="mt-5 text-center text-sm">
          <Link
            to="/register"
            className="text-app-muted hover:text-app-accent transition-colors"
          >
            Not a member yet?
          </Link>
        </div>
      </section>
    </main>
  );
};
