import { useState } from "react";
import { useStoreActions } from "easy-peasy";
import axios from "axios";

export default function RegistrationModal(props) {
  const setLoggedIn = useStoreActions((actions) => actions.login.setLoggedIn);
  const setHideModal = useStoreActions(
    (actions) => actions.modals.setHideModal
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordconfirmation, setPasswordconfirmation] = useState("");

  const submit = async () => {
    const response = await axios.post("/api/auth/register", {
      email,
      password,
      passwordconfirmation,
    });

    if (response.data.status === "error") {
      alert(response.data.message);
      return;
    }

    setLoggedIn(true);
    setHideModal(true);
  };

  return (
    <>
      <h2>Sign up</h2>
      <div>
        <form
          onSubmit={(event) => {
            submit();
            event.preventDefault();
          }}
        >
          <input
            id="email"
            type="email"
            placeholder="Email address"
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            id="password"
            type="password"
            placeholder="Password"
            onChange={(event) => setPassword(event.target.value)}
          />
          <input
            id="passwordconfirmation"
            type="password"
            placeholder="Enter password again"
            onChange={(event) => setPasswordconfirmation(event.target.value)}
          />
          <button>Sign up</button>
        </form>
      </div>
      <p>
        Already have an account? <a onClick={() => props.showLogin()}>Log in</a>
      </p>
      <style jsx>{`
        a {
          cursor: pointer;
          text-decoration: underline;
        }
      `}</style>
    </>
  );
}
