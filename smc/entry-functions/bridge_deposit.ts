import { ethers } from "hardhat";
import { Bridge } from "../typechain-types"; 

async function main() {
    const TOKEN_ADDRESS = "0x9b52D326D4866055F6c23297656002992e4293FC"; 
    const DESTINATION_ADDRESS = "0xa43B752B6E941263eb5A7E3b96e2e0DEA1a586Ff"; 
    const DESTINATION_CHAIN_ID = 59902; 
    const DEPOSIT_AMOUNT = ethers.parseUnits("3000000", 6); 
    const BRIDGE_FEE = ethers.parseEther("0.001");

    const [signer] = await ethers.getSigners();

    const bridgeAddress = "0xfF064Fd496256e84b68dAE2509eDA84a3c235550"; 
    const bridge: Bridge = await ethers.getContractAt("Bridge", bridgeAddress);

    const tokenContract = await ethers.getContractAt("IERC20", TOKEN_ADDRESS);
    await tokenContract.approve(bridgeAddress, DEPOSIT_AMOUNT);
    console.log(`Approved ${DEPOSIT_AMOUNT.toString()} tokens for the Bridge contract.`);

    const tx = await bridge.deposit(
        TOKEN_ADDRESS,
        DEPOSIT_AMOUNT,
        DESTINATION_CHAIN_ID,
        DESTINATION_ADDRESS,
        { value: BRIDGE_FEE }
    );

    console.log(`Depositing ${DEPOSIT_AMOUNT.toString()} tokens...`);
    await tx.wait();
    console.log(`Deposit successful! Transaction hash: ${tx.hash}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });