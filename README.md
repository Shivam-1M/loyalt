# Welcome to LoyalT

The Loyalty Points application aims to revolutionize the online shopping experience by rewarding users for browsing time on e-commerce sites like Amazon and Walmart. It features real-time point accumulation and conversion of points to tokens, enhancing user engagement and satisfaction. Users can view their blockchain wallet details, ensuring transparency in transaction tracking. This blockchain-based system, speeds up reward accumulation and redemption, similar to Singapore Airlines' versatile air mile points program. It eliminates intermediaries, providing a seamless and universally applicable reward system, thus boosting customer loyalty and platform usage.

## Smart Contract Info

```
├── code
│   ├── backend
│   │   ├── CHANGELOG.md
│   │   ├── LICENSE
│   │   ├── backend.cabal
│   │   ├── cabal.project
│   │   └── src
│   │       └── <span style="color:green;">PointsValidator.hs</span>
```

The smart contract for this application validates the unique identity number of this application. The UID of this application allows to unlock tokens for the users.

Note: Feel free to use the smart contract with the provided UID or create your own by changing the datum value.


## Running Application on the Local Server

On Linux machine or WSL environment on Windows:
1. Navigate into the **code** folder. 

        cd code

```
├── <span style="color:green;">code</span>
│   ├── README.md
│   ├── backend
│   ├── next.config.js
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   ├── src
```

2. Install the required packages by running the below command: (make sure you have node.js installed)

        npm install next@latest react@latest react-dom@latest

3. Run the app.

        npm run dev

## How to Connect

1. Choose from the various Cardano Wallets and download the browser extension:

    |         |                                        |
    |---------|----------------------------------------|
    | Eternal | https://ccvault.io/app/mainnet/welcome |
    | Lace    | https://www.lace.io/                   |
    | Nami    | https://namiwallet.io/                 | 

    Note: These are just some of the popular Cardano wallets, you can choose any other which you like but should be compatible with Cardano.

2. Currently the application leverages Cardano Testnet, so make sure that the wallet account you create is on **testnet network**.

3. Look for the **DApp intgration** option in your wallet which will allow you to integrate your wallet to the websites. (Latest wallets like Lace will automatically identify your application and will ask you to authorize it before integrating the wallet).
![Eternal Wallet Connectivity](image.png)


## App Data Flow

![Data Flow Diagram](dfd.png)