import React, { useEffect } from "react";
import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
import catGif from "./assets/cat.gif";

// 定数
const TWITTER_HANDLE = "UNCHAIN_tech";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // ウォレットの接続を確認します。
  const checkIfWalletIsConnected = () => {
    // window.ethereumの設定。この表記法はJavascriptの「分割代入」を参照。
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have MetaMask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }
  };

  // まだウォレットに接続されていない場合のレンダリングです。
  const renderNotConnectedContainer = () => (
    <div className="connect-wallet-container">
      <img src={catGif} alt="Ninja gif" />
      <button className="cta-button connect-wallet-button">
        Connect Wallet
      </button>
    </div>
  );

  // ページがリロードされると呼び出されます。
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <header>
            <div className="left">
              <p className="title">🐱🐈 Nyanko Name Service</p>
              <p className="subtitle">Your immortal API on the blockchain!</p>
            </div>
          </header>
        </div>

        {/* render 関数をここに追加します */}
        {renderNotConnectedContainer()}

        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >
            {`built with @${TWITTER_HANDLE}`}
          </a>
        </div>
      </div>
    </div>
  );
};

export default App;
