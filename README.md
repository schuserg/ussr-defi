# USSR DeFi

**A decentralized platform with NFTs, staking, and a faucet system.**

---

## 📁 Project Structure
ussr-defi/
├── frontend/ # React + Vite based web interface
├── backend/ # Python Flask backend for faucet and staking
├── contracts/ # Smart contract ABI files and deployed addresses
├── docs/ # Screenshots and documentation


---

## 🚀 Getting Started
### Frontend

```bash
cd frontend
npm install
npm run dev

Backend (Faucet & Staking API)

cd backend
pip install -r requirements.txt
python faucet_server_web3_staking.py  # dev mode

# or run in production using Gunicorn:
gunicorn -w 4 -b 127.0.0.1:5000 faucet_server_web3_staking:app

🔐 Contracts

Deployed contract ABIs and addresses are located in the /contracts folder:

USSRNFT.abi.json

USSRToken.abi.json

USSRStaking.abi.json

deployed_addresses.json

📸 Screenshots
See docs/screenshots_github/ for UI examples of the DApp in action.

📦 Dependencies
React, Vite, Tailwind CSS (Frontend)

Flask, Web3.py (Backend)

Solidity (Contracts)

🧪 Development Notes
Use .env.template as a base for environment variables.

Ensure you have a local or remote Web3 provider (e.g. Ganache, Infura) for backend interaction.
