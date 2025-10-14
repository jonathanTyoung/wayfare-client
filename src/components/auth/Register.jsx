import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

export const Register = () => {
  const [email, setEmail] = useState("admina@straytor.com");
  const [password, setPassword] = useState("straytor");
  const [firstName, setFirstName] = useState("Admina");
  const [lastName, setLastName] = useState("Straytor");
  const [username, setUsername] = useState("jonyoung");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const errorDialog = useRef();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:8000/register", {
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

  return (
    <main className="container--login">
      <dialog className="dialog dialog--auth" ref={errorDialog}>
        <div>{errorMessage}</div>
        <button
          className="button--close"
          onClick={() => errorDialog.current.close()}
        >
          Close
        </button>
      </dialog>

      <section>
        <form className="form--login" onSubmit={handleRegister}>
          <h1 className="text-4xl mt-7 mb-3">Wayfare</h1>
          <h2 className="text-xl mb-10">Register new account</h2>

          <fieldset className="mb-4">
            <label htmlFor="firstName"> First name </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(evt) => setFirstName(evt.target.value)}
              className="form-control"
              placeholder=""
              required
              autoFocus
              disabled={isLoading}
            />
          </fieldset>

          <fieldset className="mb-4">
            <label htmlFor="lastName"> Last name </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(evt) => setLastName(evt.target.value)}
              className="form-control"
              placeholder=""
              required
              disabled={isLoading}
            />
          </fieldset>

          <fieldset className="mb-4">
            <label htmlFor="username"> Username </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(evt) => setUsername(evt.target.value)}
              className="form-control"
              placeholder=""
              required
              disabled={isLoading}
            />
          </fieldset>

          <fieldset className="mb-4">
            <label htmlFor="inputEmail"> Email address </label>
            <input
              type="email"
              id="inputEmail"
              value={email}
              onChange={(evt) => setEmail(evt.target.value)}
              className="form-control"
              placeholder="Email address"
              required
              disabled={isLoading}
            />
          </fieldset>

          <fieldset className="mb-4">
            <label htmlFor="inputPassword"> Password </label>
            <input
              type="password"
              id="inputPassword"
              value={password}
              onChange={(evt) => setPassword(evt.target.value)}
              className="form-control"
              placeholder="Password"
              required
              disabled={isLoading}
            />
          </fieldset>

          <fieldset>
            <button
              type="submit"
              className={`button p-3 rounded-md ${
                isLoading ? "bg-gray-400" : "bg-blue-800"
              } text-blue-100`}
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </fieldset>
        </form>
      </section>

      <div className="loginLinks">
        <section className="link--register">
          <Link
            className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
            to="/login"
          >
            Already have an account?
          </Link>
        </section>
      </div>
    </main>
  );
};
