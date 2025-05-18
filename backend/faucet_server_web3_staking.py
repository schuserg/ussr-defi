import json
from pathlib import Path
from flask import Flask, request, jsonify
from web3 import Web3
from dotenv import load_dotenv
import os

# === CONFIG ===
load_dotenv()
ALCHEMY_API_URL = os.getenv("ALCHEMY_API_URL")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
PUBLIC_KEY = os.getenv("PUBLIC_KEY")

# === INIT ===
w3 = Web3(Web3.HTTPProvider(ALCHEMY_API_URL))
app = Flask(__name__)

# === CONTRACT LOAD ===
with open("../contracts/USSRNFT.abi.json") as f:
    nft_abi = json.load(f)

with open("../contracts/deployed_addresses.json") as f:
    deployed = json.load(f)

nft_address = deployed["USSRNFT"]
nft_contract = w3.eth.contract(address=nft_address, abi=nft_abi)
token_address = deployed["USSRToken"]
with open("../contracts/USSRToken.abi.json") as f:
    token_abi = json.load(f)

token_contract = w3.eth.contract(address=token_address, abi=token_abi)

# === CONST ===
METADATA_FOLDER = "metadata"
INDEX_FILE = "mint_state.json"
MINTED_LOG = "minted_nfts_log.json"

# === UTILS ===
def get_next_metadata_index():
    try:
        with open(INDEX_FILE) as f:
            return json.load(f).get("last_index", 0)
    except FileNotFoundError:
        return 0

def update_metadata_index(index):
    with open(INDEX_FILE, "w") as f:
        json.dump({"last_index": index + 1}, f)

def log_minted_nft(index, tx_hash, uri):
    log = []
    if Path(MINTED_LOG).exists():
        with open(MINTED_LOG) as f:
            log = json.load(f)
    log.append({
        "index": index,
        "tx_hash": tx_hash,
        "uri": uri
    })
    with open(MINTED_LOG, "w") as f:
        json.dump(log, f, indent=2)

# === ROUTES ===
@app.route("/mint_nft", methods=["POST"])
def mint_nft():
    index = get_next_metadata_index()
    metadata_path = Path(METADATA_FOLDER) / f"{index}.json"

    if not metadata_path.exists():
        return jsonify({"error": "All NFTs have been minted"}), 400

    try:
        with open(metadata_path) as f:
            metadata = json.load(f)
            token_uri = metadata["image"].replace(".png", ".json")

        nonce = w3.eth.get_transaction_count(PUBLIC_KEY)

        txn = nft_contract.functions.mint().build_transaction({
            "chainId": 11155111,
            "gas": 300000,
            "gasPrice": w3.to_wei("10", "gwei"),
            "nonce": nonce,
            "from": PUBLIC_KEY
        })

        signed_tx = w3.eth.account.sign_transaction(txn, private_key=PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
        tx_hash_hex = tx_hash.hex()

        update_metadata_index(index)
        log_minted_nft(index, tx_hash_hex, token_uri)

        return jsonify({
            "message": f"🎉 NFT minted with URI {token_uri}",
            "tx_hash": tx_hash_hex
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
        
@app.route("/faucet_token", methods=["POST"])
def faucet_token():
    try:
        data = request.get_json()
        recipient = data.get("recipient")

        if not recipient:
            return jsonify({"error": "Missing recipient"}), 400

        # 🔧 You can insert token transfer logic here:
        # tx = token_contract.functions.transfer(recipient, AMOUNT).build_transaction({...})

        return jsonify({"message": f"🎉 Tokens sent to {recipient}"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
        
@app.route("/check_balance", methods=["GET"])
def check_balance():
    try:
        address = request.args.get("address")
        if not address:
            return jsonify({"error": "Missing address parameter"}), 400

        raw_balance = token_contract.functions.balanceOf(address).call()
        balance = raw_balance / (10 ** 18)

        return jsonify({"address": address, "balance": balance})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
        
@app.route("/stake", methods=["POST"])
def stake_tokens():
    try:
        data = request.get_json()
        recipient = data.get("recipient")
        amount = int(data.get("amount"))

        if not recipient or not amount:
            return jsonify({"error": "Missing recipient or amount"}), 400

        # TODO: Call stake() on the staking contract
        # Пример:
        # txn = staking_contract.functions.stake(amount).build_transaction({...})
        # ...

        return jsonify({"message": f"🔥 {amount} tokens staked for {recipient}"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
        
@app.route("/claim", methods=["POST"])
def claim_rewards():
    try:
        data = request.get_json()
        recipient = data.get("recipient")

        if not recipient:
            return jsonify({"error": "Missing recipient"}), 400

        # 💡 Пример вызова контракта claim
        # txn = staking_contract.functions.claim().build_transaction({
        #     "from": recipient,
        #     ...
        # })

        return jsonify({"message": f"💰 Rewards claimed for {recipient}"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# === MAIN ===
if __name__ == "__main__":
    app.run(debug=False)

