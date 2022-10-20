import "./styles.css";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import ContractABI from "./ContractABI.json";
import React, { useState, useEffect } from "react";
import WalletConnect from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";

export default function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [contract, setContract] = useState(null);
  const [chainId, setChainId] = useState();

  // Uniswap
  const ContractAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

  const providerOptions = {
    walletlink: {
      package: CoinbaseWalletSDK, // Required
      options: {
        appName: "Web 3 Modal Demo", // Required
        infuraId: process.env.INFURA_KEY // Required unless you provide a JSON RPC url; see `rpc` below
      }
    },
    walletconnect: {
      package: WalletConnect, // required
      options: {
        infuraId: process.env.INFURA_KEY // required
      }
    }
  };

  const connectWallet = async () => {
    const web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions // required
    });
    const instance = await web3Modal.connect();
    // Provider
    const p = new ethers.providers.Web3Provider(instance);
    setProvider(p);
    const addresses = await p.listAccounts();
    if (addresses.length) {
      // Signer
      const s = p.getSigner(addresses[0]);
      setSigner(s);
      const a = await s.getAddress();
      setAddress(a);
      const b = ethers.utils
        .formatEther((await s.getBalance()).toString())
        .substring(0, 6);
      setBalance(b);
      // Contract
      const c = new ethers.Contract(ContractAddress, ContractABI, s);
      setContract(c);
    }
  };

  // useEffect(() => {
  //   if (provider?.on) {
  //     const handleAccountsChanged = (accounts) => {
  //       setAddress(accounts);
  //     };

  //     const handleChainChanged = (chainId) => {
  //       setChainId(chainId);
  //     };

  //     const handleDisconnect = () => {
  //       disconnect();
  //     };

  //     provider.on("accountsChanged", handleAccountsChanged);
  //     provider.on("chainChanged", handleChainChanged);
  //     provider.on("disconnect", handleDisconnect);

  //     return () => {
  //       if (provider.removeListener) {
  //         provider.removeListener("accountsChanged", handleAccountsChanged);
  //         provider.removeListener("chainChanged", handleChainChanged);
  //         provider.removeListener("disconnect", handleDisconnect);
  //       }
  //     };
  //   }
  // }, [provider]);

  // Reading WETH value from Uniswap Smart Contract
  const returnWETH = async () => {
    if (!contract) return;
    const owner = await contract.WETH();
    console.log(owner);
  };

  return (
    <div className="App">
      <h1>Wallet Connect</h1>
      <button onClick={connectWallet}>Connect Wallet</button>
      <br></br>
      <button onClick={returnWETH}>WETH</button>
      {/* <button onClick={disconnect}>Disconnect</button> */}
    </div>
  );
}
