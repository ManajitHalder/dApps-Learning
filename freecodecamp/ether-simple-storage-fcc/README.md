# Instructions

> **ℹ️ Topics:** Instructions for writing deploy.js file. Using ethers, dotenv and calling smart contract methods

## Store private key and other sensitive information in .evn file:

- Add .env file

  - Right click New file
  - open .evn file and add
  - PRIVATE_KEY='Your private key'
    - For example PRIVATE_KEY='0x671b3fb68315f12ef5690ff33abb75a542b83d099da7271ba45d2dadd8c406c0'
  - RPC_URL='Your RPC URL'
    - For example RPC_URL=http://127.0.0.1:7545

- Update deploy.js using dotenv and keys
  - require('dotenv').config;
  - Use process.env.PRIVATE_KEY instead of using private key directly in code.
  - Use RPC URL

Add dotenv version ^16.4.5

```
yarn add dotenv@^16.4.5
```

Compile your code

```
yarn compile
```

Run your application

```
node deploy.js
```

Add .env to .gitignore file to keep it local. Adding it to github will expose sensitive information to everyone

```
touch .gitignore
```

Add .env and commit .gitignore to github


## Encript environment variables

- Storing environment variables directly in .evn files exposes to others. We can store test accounts details in .evn file but not main account details instead we can encrypt the keys 

Add a file encryptKey.js


