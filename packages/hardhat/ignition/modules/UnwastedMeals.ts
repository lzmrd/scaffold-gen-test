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

// Fuji Testnet:
// Deployed Addresses

// UnwastedMeals#UnwastedMeals - 0x05077a9BF201E9e0a6b9a78EE0e4B5c3E12d73Df
// UnwastedMeals#FoodRescuePlatform - 0x7c3D48B2556E5c1f9b99AD029e8ec1ae85629bFe



// baseSepolia:
//Deployed Addresses

//UnwastedMeals#UnwastedMeals - 0x25CFA7a894dbA05Fb1E0AE8e9c7d83000775dd2D
//UnwastedMeals#FoodRescuePlatform - 0xf9B54077E7bB77a63F5FB771B434D64A7C0626f5

