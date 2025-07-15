# gen-test Extension per Scaffold-ETH 2

Questa **Advanced Extension** potenzia il tuo progetto Scaffold-ETH 2 aggiungendo:

1. **Script** per generare boilerplate di test a partire dalle ABI già compilate:
   - `packages/hardhat/scripts/gen-test.js`
   - `packages/hardhat/scripts/templates/test.ejs`

2. **Dipendenze** aggiuntive (iniettate nel `package.json` di root):
   ```json5
   {
     "devDependencies": {
       "fs-extra": "^10.0.0",
       "ejs": "^3.1.6"
     }
   }
