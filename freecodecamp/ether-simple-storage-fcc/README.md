# Instructions

> **ℹ️ Topics:** Instructions for writing deploy.js file. Using ethers, dotenv and calling smart contract methods

## Store private key and other sensitive information in .evn file:

- Adding .env

  - touch .evn
  - open .evn and add
  - PRIVATE_KEY='0x671b3fb68315f12ef5690ff33abb75a542b83d099da7271ba45d2dadd8c406c0'

- Add to deploy.js
  - require('dotenv').config;
  - Use process.env.PRIVATE_KEY instead of using private key directly in code.
