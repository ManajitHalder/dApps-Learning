# Hardhat Installation and Usage on Mac OS

Creating a hardhat new hardhat project.

```
$ mkdir hardhat-simple-storage-fcc
$ cd hardhat-simple-storage-fcc
```

Answer all the question of command yarn init:

```
$ yarn init
yarn init v1.22.22
warning ../../../../../package.json: No license field
question name (hardhat-simple-storage-fcc):
question version (1.0.0):
question description:
question entry point (index.js):
question repository url:
question author:
question license (MIT):
question private:
success Saved package.json
✨  Done in 20.39s.
```

```
yarn add --dev hardhat
```

Create a hardhat project:

```
yarn hardhat
```

Compile hardhat project:

```
yarn hardhat compile
```

## Code formatting

### Add prettier and prettier-plugin-solidity for code formatting:

```
yarn add --dev prettier prettier-plugin-solidity
```

### Add .prettierrc in project directory

```
touch .prettierrc
```

### Add following contents to .prettierrc file:

```
{
    "tabWidth": 4,
    "useTabs": false,
    "semi": false,
    "singleQuote": false
}
```

### Add file .prettierignore and add files in it to ignore formatting for these files:

```
node_modules
package.json
img
artifacts
cache
coverage
.env
.*
README.md
coverage.json
```
