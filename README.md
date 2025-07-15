# scaffold-gen-test

**Advanced Extension** per Scaffold-ETH 2 che genera automaticamente scheletri di test Hardhat/Mocha/Chai a partire dalle ABI già compilate.

## Caratteristiche

- Genera un file di test in `packages/hardhat/test/<ContractName>.test.js`  
- Include uno stub per ogni funzione pubblica del contratto  
- Si integra come comando CLI `yarn scaffold:gen-test`

## Installazione

### 1. Nuovo progetto Scaffold-ETH con extension

```bash
npx create-eth@latest -e lzmrd/scaffold-gen-test[:<version-tag>]
