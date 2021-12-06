# Getting Started
```
git clone repository
```


## to deploy contracts:

1. Install metamask and create a new account

2. Rename sample.env to .env and add your own private and public keys for deployment

3. Add the polygon mumbai testnet to your metamask

4. Get some matic on the mumbai testnet faucet for your wallet

5. Ensure that you have installed hardhat (`npm install --save-dev hardhat`)

6. Run the following:

```
npx hardhat run scripts/deploy-upgradeable.js
```

```
npx hardhat run scripts/deploy-upgradeable.js --network mumbai
```
upgrade
```
npx hardhat run scripts/upgrade.js --network mumbai
```

verify contract on polygonscan (in contracts root directory)
```
#first export all variables in .env file into your terminal environment
#set -o allexport; source .env; set +o allexport 
#then run verify command (probably overkill)
#npx hardhat verify --network mumbai $NFT_CONTRACT_IMPLEMENTATION_ADDRESS 
npx hardhat verify --network mumbai NFT_CONTRACT_IMPLEMENTATION_ADDRESS 

```

hardhat console for quick testing
```
npx hardhat console --network mumbai
```

## Notes

BCT token
https://polygonscan.com/address/0x2f800db0fdb5223b3c3f354886d907a671414a7f

install solt to create verified contract 
https://github.com/hjubb/solt

run in project root directory 


100 gwei
0.000000000000000100
100 BCT is in wei:
100000000000000000000


# Advanced Sample Hardhat Project

This project demonstrates an advanced Hardhat use case, integrating other tools commonly used alongside Hardhat in the ecosystem.

The project comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts. It also comes with a variety of other tools, preconfigured to work with the project code.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat run scripts/deploy.js
node scripts/deploy.js
npx eslint '**/*.js'
npx eslint '**/*.js' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```

# Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Ropsten.

In this project, copy the .env.example file to a file named .env, and then edit it to fill in the details. Enter your Etherscan API key, your Ropsten node URL (eg from Alchemy), and the private key of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract:

```shell
hardhat run --network ropsten scripts/deploy.js
```

Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
npx hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS "Hello, Hardhat!"
```
