import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../data/Fetcher";

export const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const errorDialog = useRef();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        body: JSON.stringify({
          username,
          email,
          password,
          first_name: firstName,
          last_name: lastName,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const authInfo = await response.json();

      if (response.ok && authInfo && authInfo.token) {
        localStorage.setItem("wayfare_token", authInfo.token);
        navigate("/home");
      } else {
        // Handle different types of errors based on response
        let errorMsg = "Registration failed. Please try again.";

        if (response.status === 400) {
          // Check for specific error messages from the server
          if (authInfo.message) {
            errorMsg = authInfo.message;
          } else if (authInfo.error) {
            errorMsg = authInfo.error;
          } else if (authInfo.username) {
            errorMsg = "Username is already taken";
          } else if (authInfo.email) {
            errorMsg = "Email is already registered";
          }
        } else if (response.status === 409) {
          errorMsg = "Username or email is already taken";
        } else if (response.status === 422) {
          errorMsg = "Please check your input and try again";
        } else if (!response.ok) {
          errorMsg = `Registration failed: ${response.status} ${response.statusText}`;
        }

        setErrorMessage(errorMsg);
        errorDialog.current.showModal();
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage(
        "Network error. Please check your connection and try again."
      );
      errorDialog.current.showModal();
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "block w-full mt-1.5 px-3 py-2 rounded-md bg-app-bg border border-stone-700/60 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-app-accent focus:ring-2 focus:ring-app-accent/20 disabled:opacity-60 disabled:cursor-not-allowed";
  const labelClass = "text-sm text-stone-300";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-app-bg">
      <dialog
        ref={errorDialog}
        className="bg-app-surface text-stone-100 border border-stone-700/60 rounded-lg p-6 max-w-sm w-full flex-col items-center gap-4 shadow-2xl open:flex [&::backdrop]:bg-black/60 [&::backdrop]:backdrop-blur-sm"
      >
        <div>{errorMessage}</div>
        <button
          className="px-4 py-1.5 rounded-md bg-transparent border border-stone-700/60 text-stone-400 hover:bg-stone-800/50 hover:text-stone-100 transition-colors text-sm"
          onClick={() => errorDialog.current.close()}
        >
          Close
        </button>
      </dialog>

      <section className="w-full max-w-md">
        <form
          onSubmit={handleRegister}
          className="bg-app-surface border border-stone-700/60 rounded-xl p-8 sm:p-10 flex flex-col gap-1 shadow-xl"
        >
          <h1 className="text-4xl font-special text-app-accent mt-2 mb-2">
            Wayfare
          </h1>
          <h2 className="text-lg text-stone-300 mb-8">Register new account</h2>

          <fieldset className="mb-4">
            <label htmlFor="firstName" className={labelClass}>
              First name
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(evt) => setFirstName(evt.target.value)}
              className={inputClass}
              required
              autoFocus
              disabled={isLoading}
            />
          </fieldset>

          <fieldset className="mb-4">
            <label htmlFor="lastName" className={labelClass}>
              Last name
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(evt) => setLastName(evt.target.value)}
              className={inputClass}
              required
              disabled={isLoading}
            />
          </fieldset>

          <fieldset className="mb-4">
            <label htmlFor="username" className={labelClass}>
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(evt) => setUsername(evt.target.value)}
              className={inputClass}
              required
              disabled={isLoading}
            />
          </fieldset>

          <fieldset className="mb-4">
            <label htmlFor="inputEmail" className={labelClass}>
              Email address
            </label>
            <input
              type="email"
              id="inputEmail"
              value={email}
              onChange={(evt) => setEmail(evt.target.value)}
              className={inputClass}
              placeholder="Email address"
              required
              disabled={isLoading}
            />
          </fieldset>

          <fieldset className="mb-6">
            <label htmlFor="inputPassword" className={labelClass}>
              Password
            </label>
            <input
              type="password"
              id="inputPassword"
              value={password}
              onChange={(evt) => setPassword(evt.target.value)}
              className={inputClass}
              placeholder="Password"
              required
              disabled={isLoading}
            />
          </fieldset>

          <fieldset>
            <button
              type="submit"
              className={`w-full px-4 py-2.5 rounded-md font-medium transition-colors ${
                isLoading
                  ? "bg-stone-600 text-stone-400 cursor-not-allowed"
                  : "bg-app-accent text-stone-900 hover:bg-app-accent-hover"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </fieldset>
        </form>

        <div className="mt-5 text-center text-sm">
          <Link
            to="/login"
            className="text-app-muted hover:text-app-accent transition-colors"
          >
            Already have an account?
          </Link>
        </div>
      </section>
    </main>
  );
};
