import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Login = () => {
  // const [email, setEmail] = useState("ryanflynn@email.com");
  const [username, setUsername] = useState("ryanflynn");
  const [password, setPassword] = useState("flynn");
  const existDialog = useRef();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    fetch("http://localhost:8000/login", {
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
          navigate("/");
        } else {
          existDialog.current.showModal();
        }
      });
  };

  return (
    <main className="container--login">
      <dialog className="dialog dialog--auth" ref={existDialog}>
        <div>User does not exist</div>
        <button
          className="button--close"
          onClick={() => existDialog.current.close()}
        >
          Close
        </button>
      </dialog>

      <section>
        <form className="form--login" onSubmit={handleLogin}>
          <h1 className="text-4xl mt-7 mb-3">Wayfare</h1>
          <h2 className="text-xl mb-10">Please sign in</h2>
          <fieldset className="mb-4">
            <label htmlFor="inputEmail"> Username </label>
            <input
              type="username"
              id="inputUsername"
              value={username}
              onChange={(evt) => setUsername(evt.target.value)}
              className="form-control"
              placeholder="Username "
              required
              autoFocus
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
            />
          </fieldset>
          <fieldset>
            <button type="submit" className="button">
              Sign in
            </button>
          </fieldset>
        </form>
      </section>
      <div className="loginLinks">
        <section className="link--register">
          <Link to="/register">Not a member yet?</Link>
        </section>
      </div>
    </main>
  );
};
