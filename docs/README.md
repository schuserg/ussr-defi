# USSR DeFi DApp

USSR is a fully functional DeFi project that includes the following features:

- NFT minting (via MetaMask and backend)
- Token staking
- Reward claiming
- Airdrop faucet

## Technology Stack
- Python + Flask (backend API)
- Solidity (NFT and Token smart contracts)
- React (frontend UI with MetaMask support)
- IPFS (metadata storage for NFTs)
- Web3.py (blockchain interaction)

## Setup and Run

### Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.template .env  # fill in ALCHEMY_API_URL, PRIVATE_KEY, PUBLIC_KEY
python faucet_server_web3_staking.py

Frontend
cd frontend
npm install
npm run dev

Examples
Mint via /mint_nft
Stake via /stake
Claim via /claim
All actions are recorded in mint_state.json and log files.

Smart Contracts
NFT: [LINK TO EXPLORER]
Token: [LINK TO EXPLORER]

 Screenshots
![mint_confirm.png](screenshots_github/mint_confirm.png)
![frontend_wallet_view.png](screenshots_github/frontend_wallet_view.png)
![mint_success.png](screenshots_github/mint_success.png)
![all_nfts_metamask.png](screenshots_github/all_nfts_metamask.png)
![mint_tokens_success.png](screenshots_github/mint_tokens_success.png)
![stake_success.png](screenshots_github/stake_success.png)
![claim_success.png](screenshots_github/claim_success.png)
![opensea_nft_list.png](screenshots_github/opensea_nft_list.png)

🪪 License
MIT

 
