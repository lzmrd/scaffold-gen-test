// packages/hardhat/ignition/modules/UnwastedMeals.ts

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "ethers";

// Calcoliamo off-chain la costante MINTER_ROLE
const MINTER_ROLE = ethers.keccak256(
  ethers.toUtf8Bytes("MINTER_ROLE")
);

export default buildModule("UnwastedMeals", (m) => {
  // 1) Deploy del token UMEALS
  const token = m.contract("UnwastedMeals", []);

  // 2) Deploy della piattaforma, passando l'indirizzo future del token
  const platform = m.contract("FoodRescuePlatform", [token]);

  // 3) Dopo che entrambi sono deployati, assegniamo il MINTER_ROLE al platform
  //    Nota: platform è un Future che verrà risolto all'indirizzo reale
  m.call(token, "grantRole", [MINTER_ROLE, platform]);

  // 4) Esportiamo gli handle per eventuali dipendenze o logging
  return { token, platform };
});
