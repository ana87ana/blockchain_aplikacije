import { network } from "hardhat";

const { ethers } = await network.connect();
const [vlasnik] = await ethers.getSigners();

const token = await ethers.deployContract("ZTN");
await token.waitForDeployment();

console.log("Token objavljen na adresi:", await token.getAddress());
console.log("Administrator:", await token.administrator());
