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


## 🛠️ Configurazione manuale

**❗ Prima di eseguire `yarn install`**, è necessario aggiungere a mano lo script CLI e le dipendenze di sviluppo nel file `package.json` del progetto Scaffold-ETH generato.

1. Apri il file `package.json` (nella root del progetto) e, sotto la sezione `"scripts"`, aggiungi:

   ```jsonc
   {
     "scripts": {
       // … le righe già esistenti …
       "scaffold:gen-test": "node packages/hardhat/scripts/gen-test.js"
     }
   }

2. Sempre in package.json, sotto "devDependencies", aggiungi:
{
  "devDependencies": {
    // … le righe già esistenti …
    "fs-extra": "^10.0.0",
    "ejs": "^3.1.6"
  }
}

3. A questo punto puoi installare tutte le dipendenze del progetto:

yarn install

4. Compila i contratti e lancia il generator di test:

cd packages/hardhat
yarn compile
cd ../..
yarn scaffold:gen-test <ContractName>
