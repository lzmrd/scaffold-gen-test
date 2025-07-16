// in cima al file
import * as dotenv from "dotenv";
dotenv.config();
import { createPublicClient, createWalletClient, http } from "viem";
import { avalancheFuji } from "viem/chains";
import UnwastedMealsArtifact from "../artifacts/contracts/UnwastedMeals.sol/UnwastedMeals.json";
import FoodRescuePlatformArtifact from "../artifacts/contracts/FoodRescuePlatform.sol/FoodRescuePlatform.json";
import type { Abi } from "viem";

// Controllo runtime delle env-var
const {
  RPC_URL,
  DEPLOYER_ADDRESS,
  PRIVATE_KEY,
  TOKEN_ADDRESS,
  PLATFORM_ADDRESS,
} = process.env;
if (!RPC_URL || !DEPLOYER_ADDRESS || !PRIVATE_KEY || !TOKEN_ADDRESS || !PLATFORM_ADDRESS) {
  throw new Error("Ti mancano RPC_URL, DEPLOYER_ADDRESS, PRIVATE_KEY, TOKEN_ADDRESS o PLATFORM_ADDRESS in .env");
}

// Helper per assicurarsi che le stringhe inizino con "0x"
function ensure0x(s: string) {
  return s.startsWith("0x") ? s : `0x${s}`;
}

// ABI “vere” generate da Hardhat
const UNWASTED_MEALS_ABI = UnwastedMealsArtifact.abi as Abi;
const PLATFORM_ABI        = FoodRescuePlatformArtifact.abi as Abi;

const publicClient = createPublicClient({
  chain: avalancheFuji,
  transport: http(RPC_URL),
});
const walletClient = createWalletClient({
  chain: avalancheFuji,
  transport: http(RPC_URL),
  account: ensure0x(DEPLOYER_ADDRESS) as `0x${string}`,
  key: ensure0x(PRIVATE_KEY),
});

async function main() {
  const minterRole = await publicClient.readContract({
    address: ensure0x(TOKEN_ADDRESS) as `0x${string}`,
    abi: UNWASTED_MEALS_ABI,
    functionName: "MINTER_ROLE",
  });
  console.log("MINTER_ROLE:", minterRole);

  const tx1 = await walletClient.writeContract({
    address: ensure0x(TOKEN_ADDRESS) as `0x${string}`,
    abi: UNWASTED_MEALS_ABI,
    functionName: "grantRole",
    args: [minterRole, ensure0x(PLATFORM_ADDRESS) as `0x${string}`],
  });
  console.log("Tx grantRole:", tx1);
  await publicClient.waitForTransactionReceipt({ hash: tx1 });

  const tx2 = await walletClient.writeContract({
    address: ensure0x(PLATFORM_ADDRESS) as `0x${string}`,
    abi: PLATFORM_ABI,
    functionName: "grantDonor",
    args: [ensure0x(DEPLOYER_ADDRESS) as `0x${string}`],
  });
  console.log("Tx grantDonor:", tx2);
  await publicClient.waitForTransactionReceipt({ hash: tx2 });

  console.log("Ruoli configurati con successo!");
}

main().catch(console.error);
