import React, { useEffect, useState } from "react";
import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
import { ethers } from "ethers";
import catGif from "./assets/cat.gif";
import contractAbi from "./utils/contractABI.json";

const TWITTER_HANDLE = "UNCHAIN_tech";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
// 登録したいドメインです。好みで変えてみましょう。
const tld = ".nyanko";
const CONTRACT_ADDRESS = "0x1AB36905C54eBf7c5b7Be84832E85d37c00C2C77";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  // state管理するプロパティを追加しています。
  const [domain, setDomain] = useState("");
  const [record, setRecord] = useState("");

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask -> https://metamask.io/");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };

  const mintDomain = async () => {
    // ドメインがnullのときrunしません。
    if (!domain) {
      return;
    }
    // ドメインが3文字に満たない、短すぎる場合にアラートを出します。
    if (domain.length < 3) {
      alert("Domain must be at least 3 characters long");
      return;
    }
    // ドメインの文字数に応じて価格を計算します。
    // 3 chars = 0.05 MATIC, 4 chars = 0.03 MATIC, 5 or more = 0.01 MATIC
    const price =
      domain.length === 3 ? "0.05" : domain.length === 4 ? "0.03" : "0.01";
    console.log("Minting domain", domain, "with price", price);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractAbi.abi,
          signer
        );

        console.log("Going to pop wallet now to pay gas...");
        let tx = await contract.register(domain, {
          value: ethers.utils.parseEther(price),
        });
        // ミントされるまでトランザクションを待ちます。
        const receipt = await tx.wait();

        // トランザクションが問題なく実行されたか確認します。
        if (receipt.status === 1) {
          console.log(
            "Domain minted! https://mumbai.polygonscan.com/tx/" + tx.hash
          );

          // domain,recordをセットします。
          tx = await contract.setRecord(domain, record);
          await tx.wait();

          console.log(
            "Record set! https://mumbai.polygonscan.com/tx/" + tx.hash
          );

          setRecord("");
          setDomain("");
        } else {
          alert("Transaction failed! Please try again");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // レンダリング関数です。
  const renderNotConnectedContainer = () => (
    <div className="connect-wallet-container">
      <img src={catGif} alt="Cat gif" />
      {/* ボタンクリックでconnectWallet関数を呼び出します。 */}
      <button
        onClick={connectWallet}
        className="cta-button connect-wallet-button"
      >
        Connect Wallet
      </button>
    </div>
  );

  // ドメインネームとデータの入力フォームです。
  const renderInputForm = () => {
    return (
      <div className="form-container">
        <div className="first-row">
          <input
            type="text"
            value={domain}
            placeholder="domain"
            onChange={(e) => setDomain(e.target.value)}
          />
          <p className="tld"> {tld} </p>
        </div>

        <input
          type="text"
          value={record}
          placeholder="whats ur nyanko power?"
          onChange={(e) => setRecord(e.target.value)}
        />

        <div className="button-container">
          {/* ボタンクリックで mintDomain関数 を呼び出します。 */}
          <button className="cta-button mint-button" onClick={mintDomain}>
            Mint
          </button>
        </div>
      </div>
    );
  };

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

        {!currentAccount && renderNotConnectedContainer()}
        {/* アカウントが接続されるとインプットフォームをレンダリングします。 */}
        {currentAccount && renderInputForm()}

        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
