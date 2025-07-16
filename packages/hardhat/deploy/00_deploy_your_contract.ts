async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with", deployer.address);

  const Token = await ethers.getContractFactory("UnwastedMealsToken");
  const token = await Token.deploy();
  await token.deployed();
  console.log("Token at", token.address);

  const Platform = await ethers.getContractFactory("FoodRescuePlatform");
  const platform = await Platform.deploy(token.address);
  await platform.deployed();
  console.log("Platform at", platform.address);

  // assegna il MINTER_ROLE al Platform
  const MINTER = await token.MINTER_ROLE();
  await token.grantRole(MINTER, platform.address);
  console.log("Granted MINTER_ROLE to platform");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
