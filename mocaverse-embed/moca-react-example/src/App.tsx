import { useEffect, useState } from "react";
import Web3 from "web3";

import "./App.css";
import { init, mocaEmbed } from "./mocaverse";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [eoaAccount, setEoaAccount] = useState("");
  const [aaAccount, setAaAcount] = useState("");

  useEffect(() => {
    init();
  }, []);

  const login = async () => {
    try {
      const accounts = await mocaEmbed?.login();
      if (accounts) {
        setEoaAccount(accounts[1]);
        setAaAcount(accounts[0]);
        setLoggedIn(true);
        uiConsole(accounts);
      }
    } catch (error) {
      uiConsole(error);
    }
  };

  const getUserInfo = async () => {
    const user = await mocaEmbed?.getUserInfo();
    uiConsole(user);
  };

  const logout = async () => {
    // IMP START - Logout
    await mocaEmbed?.logout();
    // IMP END - Logout
    setLoggedIn(false);
    uiConsole("logged out");
  };

  // IMP START - Blockchain Calls
  const getAccounts = async () => {
    if (!loggedIn) {
      uiConsole("Not logged in");
      return;
    }
    const web3 = new Web3(mocaEmbed?.provider as any);
    // Get user's Ethereum public address
    const address = await web3.eth.getAccounts();
    setAaAcount(address[0]);
    setEoaAccount(address[1]);
    uiConsole(address);
  };

  const getBalance = async () => {
    if (!loggedIn) {
      uiConsole("Not logged in");
      return;
    }
    const web3 = new Web3(mocaEmbed?.provider as any);

    // Get user's balance in ether
    const balance = web3.utils.fromWei(
      await web3.eth.getBalance(aaAccount), // Balance is in wei
      "ether"
    );
    uiConsole(balance);
  };

  const signMessage = async () => {
    if (!loggedIn) {
      uiConsole("Not logged in");
      return;
    }
    try {
      const web3 = new Web3(mocaEmbed?.provider as any);
      const originalMessage = "YOUR_MESSAGE";
      // Sign the message
      const signedMessage = await web3.eth.personal.sign(
        originalMessage,
        eoaAccount,
        "test password!" // configure your own password here.
      );
      uiConsole(signedMessage);
    } catch (error) {
      uiConsole(error);
    }
  };
  // IMP END - Blockchain Calls

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
    console.log(...args);
  }

  const loggedInView = (
    <>
      <div className="flex-container">
        <div>
          <button onClick={getUserInfo} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={getAccounts} className="card">
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={getBalance} className="card">
            Get Balance
          </button>
        </div>
        <div>
          <button onClick={signMessage} className="card">
            Sign Message
          </button>
        </div>
        <div>
          <button onClick={logout} className="card">
            Log Out
          </button>
        </div>
      </div>
    </>
  );

  const unloggedInView = (
    <button onClick={login} className="card">
      Login
    </button>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="https://web3auth.io/docs/sdk/pnp/web/modal" rel="noreferrer">
          Mocaverse Embed{" "}
        </a>
        & ReactJS (Webpack) Quick Start
      </h1>

      <div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/wallet-ecosystems-examples/tree/main/mocaverse-embed/moca-react-example/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
      </footer>
    </div>
  );
}

export default App;
