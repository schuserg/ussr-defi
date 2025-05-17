import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

import USSRTokenABI from "../../contracts/USSRToken.abi.json";
import USSRNFTABI from "../../contracts/USSRNFT.abi.json";
import USSRStakingABI from "../../contracts/USSRStaking.abi.json";
import deployed from "../../contracts/deployed_addresses.json";

const USSRStakingAddress = deployed.USSRStaking;
const USSRTokenAddress = deployed.USSRToken;
const USSRNFTAddress = deployed.USSRNFT;

export default function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [log, setLog] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [nftContract, setNftContract] = useState(null);
  const [stakingContract, setStakingContract] = useState(null);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const prov = new ethers.BrowserProvider(window.ethereum);
      setProvider(prov);
    }
  }, []);

  const connectWallet = async () => {
    if (!provider) {
      setLog("❌ MetaMask not found");
      return;
    }

    try {
      const accounts = await provider.send("eth_requestAccounts", []);
      const userSigner = await provider.getSigner();

      setSigner(userSigner);
      setWalletAddress(accounts[0]);

      const token = new ethers.Contract(USSRTokenAddress, USSRTokenABI, userSigner);
      const nft = new ethers.Contract(USSRNFTAddress, USSRNFTABI, userSigner);
      const staking = new ethers.Contract(USSRStakingAddress, USSRStakingABI, userSigner);

      setTokenContract(token);
      setNftContract(nft);
      setStakingContract(staking);

      setLog("✅ Wallet connected: " + accounts[0]);
    } catch (err) {
      setLog("❌ Connection error: " + err.message);
    }
  };

  const checkBalance = async () => {
    try {
      if (!tokenContract || !walletAddress) {
        setLog("❌ Contract or address not set");
        return;
      }
      const bal = await tokenContract.balanceOf(walletAddress);
      setLog("📗 Balance: " + ethers.formatUnits(bal, 18));
    } catch (err) {
      setLog("❌ Balance error: " + err.message);
    }
  };

  // mintNFT function
const mintNFT = async () => {
  try {
    if (!nftContract || !walletAddress) {
      setLog("❌ NFT minted successfully!");
      return;
    }

    const tx = await nftContract.mint();
    await tx.wait();
    setLog("✅ NFT minted successfully!");
  } catch (err) {
    if (err.message.includes("All NFTs minted")) {
      setLog("ℹ️ All NFTs are already minted.");
    } else {
      setLog("❌ NFT minting error: " + err.message);
    }
  }
};

// getTokens function
const getTokens = async () => {
  try {
    const amount = ethers.parseUnits("1000", 18);
    const tx = await tokenContract.mint(walletAddress, amount);
    await tx.wait();
    setLog("✅ Tokens minted successfully!");
  } catch (err) {
    setLog("❌ Token minting error: " + err.message);
  }
};

// stake function
const stake = async () => {
  try {
    if (!stakingContract || !amount) {
      setLog("❌ Contract is not initialized!");
      return;
    }
    const parsedAmount = ethers.parseUnits(amount, 18);
    const tx = await stakingContract.stake(parsedAmount);
    await tx.wait();
    setLog("✅ Staking successful!");
  } catch (err) {
    setLog("❌ Staking error: " + err.message);
  }
};

// claim function
const claim = async () => {
  try {
    if (!stakingContract) {
      setLog("❌ Contract is not initialized!");
      return;
    }

    const tx = await stakingContract.getReward();  // <-- исправлено
    await tx.wait();
    setLog("✅ Claim successful!");
  } catch (err) {
    setLog("❌ Claim error: " + err.message);
  }
};

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">🪙 USSR DeFi + Metamask</h1>
      <Button onClick={connectWallet}>🔌 Connect MetaMask</Button>

      <Input
        className="my-3"
        placeholder="Your address"
        value={walletAddress}
        readOnly
      />

      <div className="flex gap-2 flex-wrap">
        <Button onClick={mintNFT}>🎨 Mint NFT</Button>
        <Button onClick={getTokens}>💸 Get Tokens</Button>
        <Button onClick={checkBalance}>🧾 Check Balance</Button>
      </div>

      <div className="flex gap-2 flex-wrap mt-4">
        <Input
          type="text"
          placeholder="Amount to stake"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button onClick={stake}>🌾 Стейк</Button>
        <Button onClick={claim}>🪙 Claim</Button>
      </div>

      <Card className="mt-4 p-4 text-sm">{log}</Card>
    </div>
  );
}

