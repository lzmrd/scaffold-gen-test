import { createPublicClient, createWalletClient, http, parseAbiItem } from 'viem';
import { mainnet } from '@viem/chains';
import * as dotenv from 'dotenv';
dotenv.config();

// Configurazione del provider e del wallet client
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});
const walletClient = createWalletClient({
  chain: mainnet,
  transport: http(),
  account: process.env.DEPLOYER_ADDRESS,
  key: process.env.PRIVATE_KEY,
});

// ABI ridotta per le funzioni di grantRole e grantDonor
const UNWASTED_MEALS_ABI = [
  parseAbiItem('function MINTER_ROLE() view returns (bytes32)'),
  parseAbiItem('function grantRole(bytes32 role, address account)'),
];
const PLATFORM_ABI = [
  parseAbiItem('function grantDonor(address account)'),
];

// Indirizzi da .env
const tokenAddress = process.env.TOKEN_ADDRESS;
const platformAddress = process.env.PLATFORM_ADDRESS;

async function main() {
  // 1. Ottieni il valore di MINTER_ROLE
  const minterRole = await publicClient.readContract({
    address: tokenAddress,
    abi: UNWASTED_MEALS_ABI,
    functionName: 'MINTER_ROLE',
  });
  console.log('MINTER_ROLE:', minterRole);

  // 2. Grant MINTER_ROLE al contratto Platform
  const tx1 = await walletClient.writeContract({
    address: tokenAddress,
    abi: UNWASTED_MEALS_ABI,
    functionName: 'grantRole',
    args: [minterRole, platformAddress],
  });
  console.log('Tx grantRole:', tx1);
  await publicClient.waitForTransactionReceipt({ hash: tx1 });

  // 3. Grant DONOR_ROLE (via grantDonor) al deployer/admin
  const tx2 = await walletClient.writeContract({
    address: platformAddress,
    abi: PLATFORM_ABI,
    functionName: 'grantDonor',
    args: [process.env.DEPLOYER_ADDRESS],
  });
  console.log('Tx grantDonor:', tx2);
  await publicClient.waitForTransactionReceipt({ hash: tx2 });

  console.log('Ruoli configurati con successo!');
}

main().catch(console.error);