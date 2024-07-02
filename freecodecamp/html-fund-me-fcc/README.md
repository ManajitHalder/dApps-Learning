# Frontend for FundMe Contract using html and javascript

## Create index.html file

Add ! content

Connect to Metamask wallet

## Write javascript code inside index.html inside the body tag

## Add .prettierrc and install prettier

```
yarn add --dev prettier
```

Changes in .prettierrc file:

```
{
    "tabWidth": 4,
    "useTabs": false,
    "semi": false,
    "singleQuote": false
}
```

## Fund

To be able to send a transaction using fund we need a provider / connection to the blockchain

signer / wallet / someone with some gas,

contract that we are interacting with, and to get the contract we need the ABI and the address.

Copy ethers code from https://cdn.ethers.io/lib/ethers-5.1.esm.min.js to a file with same name in your project. Refer url *[https://docs.ethers.org/v5/getting-started/](https://docs.ethers.org/v5/getting-started/)* for details.
