
# USSR DeFi DApp

USSR — это полноценный DeFi-проект, в котором реализованы:
- Минт NFT (через MetaMask и backend)
- Stake токенов
- Claim наград
- Airdrop faucet

## Стек технологий
- Python + Flask (backend API)
- Solidity (контракты NFT и Token)
- React (frontend UI с поддержкой MetaMask)
- IPFS (хранение метаданных для NFT)
- Web3.py (взаимодействие с блокчейном)

## Установка и запуск

### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.template .env  # и заполни ALCHEMY_API_URL, PRIVATE_KEY, PUBLIC_KEY
python faucet_server_web3_staking.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Пример
- Минт через `/mint_nft`
- Stake через `/stake`
- Claim через `/claim`
- Все действия фиксируются в mint_state.json и log-файлах

## Контракты
- NFT: [ССЫЛКА НА EXPLORER]
- Token: [ССЫЛКА НА EXPLORER]

## Скриншоты
![mint_confirm.png](screenshots_github/mint_confirm.png)
![frontend_wallet_view.png](screenshots_github/frontend_wallet_view.png)
![mint_success.png](screenshots_github/mint_success.png)
![all_nfts_metamask.png](screenshots_github/all_nfts_metamask.png)
![mint_tokens_success.png](screenshots_github/mint_tokens_success.png)
![stake_success.png](screenshots_github/stake_success.png)
![claim_success.png](screenshots_github/claim_success.png)
![opensea_nft_list.png](screenshots_github/opensea_nft_list.png)

## Лицензия
MIT
