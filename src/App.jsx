import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

import USSRTokenABI from "./USSRToken.abi.json";
import USSRNFTABI from "./USSRNFT.abi.json";
import USSRStakingABI from "./USSRStaking.abi.json";
import deployed from "./deployed_addresses.json";

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
      setLog("❌ MetaMask не найден");
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

      setLog("✅ Кошелёк подключён: " + accounts[0]);
    } catch (err) {
      setLog("❌ Ошибка подключения: " + err.message);
    }
  };

  const checkBalance = async () => {
    try {
      if (!tokenContract || !walletAddress) {
        setLog("❌ Контракт или адрес не задан");
        return;
      }
      const bal = await tokenContract.balanceOf(walletAddress);
      setLog("📗 Баланс: " + ethers.formatUnits(bal, 18));
    } catch (err) {
      setLog("❌ Ошибка баланса: " + err.message);
    }
  };

  // mintNFT функция
const mintNFT = async () => {
  try {
    if (!nftContract || !walletAddress) {
      setLog("❌ Контракт или адрес не задан!");
      return;
    }

    const tx = await nftContract.mint();
    await tx.wait();
    setLog("✅ NFT успешно заминчен!");
  } catch (err) {
    if (err.message.includes("All NFTs minted")) {
      setLog("ℹ️ Все NFT уже заминчены.");
    } else {
      setLog("❌ Ошибка минтинга NFT: " + err.message);
    }
  }
};

// getTokens функция
const getTokens = async () => {
  try {
    const amount = ethers.parseUnits("1000", 18);
    const tx = await tokenContract.mint(walletAddress, amount);
    await tx.wait();
    setLog("✅ Токены успешно заминчены!");
  } catch (err) {
    setLog("❌ Ошибка минтинга токенов: " + err.message);
  }
};

// stake функция
const stake = async () => {
  try {
    if (!stakingContract || !amount) {
      setLog("❌ Контракт или сумма не указаны!");
      return;
    }
    const parsedAmount = ethers.parseUnits(amount, 18);
    const tx = await stakingContract.stake(parsedAmount);
    await tx.wait();
    setLog("✅ Успешный стейкинг!");
  } catch (err) {
    setLog("❌ Ошибка стейкинга: " + err.message);
  }
};

// claim функция
const claim = async () => {
  try {
    if (!stakingContract) {
      setLog("❌ Контракт не инициализирован!");
      return;
    }

    const tx = await stakingContract.getReward();  // <-- исправлено
    await tx.wait();
    setLog("✅ Успешный клейм!");
  } catch (err) {
    setLog("❌ Ошибка клейма: " + err.message);
  }
};

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">🪙 CCCP DeFi + Metamask</h1>
      <Button onClick={connectWallet}>🔌 Подключить MetaMask</Button>

      <Input
        className="my-3"
        placeholder="Ваш адрес"
        value={walletAddress}
        readOnly
      />

      <div className="flex gap-2 flex-wrap">
        <Button onClick={mintNFT}>🎨 Минт NFT</Button>
        <Button onClick={getTokens}>💸 Получить токены</Button>
        <Button onClick={checkBalance}>🧾 Проверить баланс</Button>
      </div>

      <div className="flex gap-2 flex-wrap mt-4">
        <Input
          type="text"
          placeholder="Сумма для стейкинга"
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

