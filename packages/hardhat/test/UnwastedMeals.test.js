const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UnwastedMeals", function () {
  let contract;
  before(async function () {
    const Factory = await ethers.getContractFactory("UnwastedMeals");
    contract = await Factory.deploy();
    await contract.deployed();
  });

  it("deploys successfully", async function () {
    expect(contract.address).to.be.properAddress;
  });

  // Puoi usare l'ABI per generare ulteriori stub di test:
  
  it("stub for DEFAULT_ADMIN_ROLE()", async function () {
    // TODO: test DEFAULT_ADMIN_ROLE
  });
  
  it("stub for MINTER_ROLE()", async function () {
    // TODO: test MINTER_ROLE
  });
  
  it("stub for allowance()", async function () {
    // TODO: test allowance
  });
  
  it("stub for approve()", async function () {
    // TODO: test approve
  });
  
  it("stub for balanceOf()", async function () {
    // TODO: test balanceOf
  });
  
  it("stub for burn()", async function () {
    // TODO: test burn
  });
  
  it("stub for burnFrom()", async function () {
    // TODO: test burnFrom
  });
  
  it("stub for decimals()", async function () {
    // TODO: test decimals
  });
  
  it("stub for getRoleAdmin()", async function () {
    // TODO: test getRoleAdmin
  });
  
  it("stub for grantRole()", async function () {
    // TODO: test grantRole
  });
  
  it("stub for hasRole()", async function () {
    // TODO: test hasRole
  });
  
  it("stub for mint()", async function () {
    // TODO: test mint
  });
  
  it("stub for name()", async function () {
    // TODO: test name
  });
  
  it("stub for renounceRole()", async function () {
    // TODO: test renounceRole
  });
  
  it("stub for revokeRole()", async function () {
    // TODO: test revokeRole
  });
  
  it("stub for supportsInterface()", async function () {
    // TODO: test supportsInterface
  });
  
  it("stub for symbol()", async function () {
    // TODO: test symbol
  });
  
  it("stub for totalSupply()", async function () {
    // TODO: test totalSupply
  });
  
  it("stub for transfer()", async function () {
    // TODO: test transfer
  });
  
  it("stub for transferFrom()", async function () {
    // TODO: test transferFrom
  });
  
});
