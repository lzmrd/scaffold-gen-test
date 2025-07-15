export default {
  // inserisce dipendenze e script nel package.json di root
  scripts: {
    "scaffold:gen-test": "node packages/hardhat/scripts/gen-test.js"
  },
  devDependencies: {
    "fs-extra": "^10.0.0",
    "ejs": "^3.1.6"
  }
};
