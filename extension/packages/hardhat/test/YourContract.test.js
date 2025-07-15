const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("YourContract", function () {
  let contract;
  before(async function () {
    const Factory = await ethers.getContractFactory("YourContract");
    contract = await Factory.deploy();
    await contract.deployed();
  });

  it("deploys successfully", async function () {
    expect(contract.address).to.be.properAddress;
  });

  // Puoi usare l'ABI per generare ulteriori stub di test:
  
  it("stub for greeting()", async function () {
    // TODO: test greeting
  });
  
  it("stub for owner()", async function () {
    // TODO: test owner
  });
  
  it("stub for premium()", async function () {
    // TODO: test premium
  });
  
  it("stub for setGreeting()", async function () {
    // TODO: test setGreeting
  });
  
  it("stub for totalCounter()", async function () {
    // TODO: test totalCounter
  });
  
  it("stub for userGreetingCounter()", async function () {
    // TODO: test userGreetingCounter
  });
  
  it("stub for withdraw()", async function () {
    // TODO: test withdraw
  });
  
});
