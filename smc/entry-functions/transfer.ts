import { ethers } from "hardhat";

async function main() {
  const [sender] = await ethers.getSigners();
  const token = await ethers.getContractAt("MockERC20", "0xF7692Db18990eB5c239eF3f33e7Dc4A8Dc4E9019");
  
  const tx = await token.transfer("0xe469933aA0BfC55C4338d50B664570347036034c", ethers.parseEther("50000"));
  console.log("Transfer completed:", tx.hash);
}

main().catch(console.error);