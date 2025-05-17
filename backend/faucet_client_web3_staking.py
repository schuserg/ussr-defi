
import requests

SERVER_URL = "http://127.0.0.1:5000"
RECIPIENT_ADDRESS = "0xED0cB22ddcac032d907F6d87E8B2C924a55e6873"

def main():
    print("== Web3 Faucet Client ==")
    print("1 - Request tokens via Web3")
    print("2 - Check USSRToken balance")
    print("3 - Mint NFT via Web3")
    print("4 - Stake tokens")
    print("5 - Claim rewards")

    choice = input("\nSelect an action: ")

    if choice == "1":
        data = {"recipient": RECIPIENT_ADDRESS}
        try:
            response = requests.post(f"{SERVER_URL}/faucet_token", json=data)
            print(response.json())
        except Exception as e:
            print(f"Connection error: {e}")

    elif choice == "2":
        try:
            response = requests.get(f"{SERVER_URL}/check_balance", params={"address": RECIPIENT_ADDRESS})
            print(response.json())
        except Exception as e:
            print(f"Connection error: {e}")

    elif choice == "3":
        data = {"recipient": RECIPIENT_ADDRESS}
        try:
            response = requests.post(f"{SERVER_URL}/mint_nft", json=data)
            print(response.json())
        except Exception as e:
            print(f"Connection error: {e}")

    elif choice == "4":
        amount = input("Enter the amount of tokens to stake: ")
        data = {
            "recipient": RECIPIENT_ADDRESS,
            "amount": amount
        }
        try:
            response = requests.post(f"{SERVER_URL}/stake", json=data)
            print(response.json())
        except Exception as e:
            print(f"Connection error: {e}")

    elif choice == "5":
        try:
            response = requests.post(f"{SERVER_URL}/claim")
            print(response.json())
        except Exception as e:
            print(f"Connection error: {e}")

    else:
        print("Invalid choice.")

if __name__ == "__main__":
    main()
