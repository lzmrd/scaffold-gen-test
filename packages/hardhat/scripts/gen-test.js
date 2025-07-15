#!/usr/bin/env node
const fs = require('fs-extra');
const path = require('path');
const abiDir = path.join(__dirname, '../artifacts/contracts');
const ejs = require('ejs');

async function main() {
  const [,, contractName] = process.argv;
  if (!contractName) {
    console.error('Usage: scaffold:gen-test <ContractName>');
    process.exit(1);
  }
  const abiPath = path.join(
    __dirname,
    '../artifacts/contracts',
    `${contractName}.sol`,
    `${contractName}.json`
  );
  if (!fs.existsSync(abiPath)) {
    console.error(`ABI not found: hai compilato i contratti? (${abiPath})`);
    process.exit(1);
  }
  const tpl = path.join(__dirname, 'templates/test.ejs');
  const out = path.join(process.cwd(), 'packages/hardhat/test', `${contractName}.test.js`);
  const { abi } = require(abiPath);
  const content = await ejs.renderFile(tpl, { contractName, abi });
  await fs.outputFile(out, content);
  console.log(`✅ Test skeleton generated at ${out}`);
}
main();
