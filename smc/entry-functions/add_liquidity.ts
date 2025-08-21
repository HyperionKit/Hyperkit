import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  
  const LIQUIDITY_POOL_ADDRESS = "0xd872880d7dA4135Df17d5c470c187A61548B1e69";
  const TOKEN_A_ADDRESS = "0x3d5fb85F00ea1119d099d0dfBb12f24c9c6860BB";
  const TOKEN_B_ADDRESS = "0xF7692Db18990eB5c239eF3f33e7Dc4A8Dc4E9019";

  const liquidityPool = await ethers.getContractAt("LiquidityPool", LIQUIDITY_POOL_ADDRESS);
  const tokenA = await ethers.getContractAt("MockERC20", TOKEN_A_ADDRESS);
  const tokenB = await ethers.getContractAt("MockERC20", TOKEN_B_ADDRESS);

  console.log("Deployer:", deployer.address);

  // Check if pair exists
  try {
    const pairInfo = await liquidityPool.getPairInfo(TOKEN_A_ADDRESS, TOKEN_B_ADDRESS);
    console.log("Pair exists - Reserves:");
    console.log("Reserve A:", ethers.formatEther(pairInfo.reserveA));
    console.log("Reserve B:", ethers.formatEther(pairInfo.reserveB));
    console.log("Total Liquidity:", ethers.formatEther(pairInfo.totalLiquidity));
  } catch (error) {
    console.log("Pair doesn't exist, creating...");
    const tx = await liquidityPool.createPair(TOKEN_A_ADDRESS, TOKEN_B_ADDRESS);
    await tx.wait();
    console.log("Pair created");
  }

  // Check token balances
  const balanceA = await tokenA.balanceOf(deployer.address);
  const balanceB = await tokenB.balanceOf(deployer.address);
  console.log("\nToken balances:");
  console.log("Token A:", ethers.formatEther(balanceA));
  console.log("Token B:", ethers.formatEther(balanceB));

  // Define amounts to add
  const amountA = ethers.parseEther("100");
  const amountB = ethers.parseEther("200");

  console.log("\nAdding liquidity:");
  console.log("Amount A:", ethers.formatEther(amountA));
  console.log("Amount B:", ethers.formatEther(amountB));

  // Check if we have enough balance
  if (balanceA < amountA) {
    console.error("❌ Insufficient Token A balance");
    return;
  }
  if (balanceB < amountB) {
    console.error("❌ Insufficient Token B balance");
    return;
  }

  // Step 1: Approve tokens
  console.log("\n1. Approving tokens...");
  const approveATx = await tokenA.approve(LIQUIDITY_POOL_ADDRESS, amountA);
  await approveATx.wait();
  console.log("✓ Token A approved");

  const approveBTx = await tokenB.approve(LIQUIDITY_POOL_ADDRESS, amountB);
  await approveBTx.wait();
  console.log("✓ Token B approved");

  // Verify allowances
  const allowanceA = await tokenA.allowance(deployer.address, LIQUIDITY_POOL_ADDRESS);
  const allowanceB = await tokenB.allowance(deployer.address, LIQUIDITY_POOL_ADDRESS);
  console.log("Allowance A:", ethers.formatEther(allowanceA));
  console.log("Allowance B:", ethers.formatEther(allowanceB));

  // Step 2: Add liquidity
  console.log("\n2. Adding liquidity...");
  try {
    const addLiquidityTx = await liquidityPool.addLiquidity(
      TOKEN_A_ADDRESS,
      TOKEN_B_ADDRESS,
      amountA,
      amountB,
      amountA,
      amountB
    );
    const receipt = await addLiquidityTx.wait();
    console.log("✓ Liquidity added successfully!");
    console.log("Transaction hash:", receipt?.hash);

    // Check final state
    console.log("\n=== Final State ===");
    const finalPairInfo = await liquidityPool.getPairInfo(TOKEN_A_ADDRESS, TOKEN_B_ADDRESS);
    console.log("Reserve A:", ethers.formatEther(finalPairInfo.reserveA));
    console.log("Reserve B:", ethers.formatEther(finalPairInfo.reserveB));
    console.log("Total Liquidity:", ethers.formatEther(finalPairInfo.totalLiquidity));

    const userLiquidity = await liquidityPool.getUserLiquidity(TOKEN_A_ADDRESS, TOKEN_B_ADDRESS, deployer.address);
    console.log("Your liquidity position:", ethers.formatEther(userLiquidity));

    // Test swap quote
    console.log("\n=== Swap Quote ===");
    const swapAmount = ethers.parseEther("10");
    const amountOut = await liquidityPool.getAmountOut(swapAmount, TOKEN_A_ADDRESS, TOKEN_B_ADDRESS);
    console.log(`💱 ${ethers.formatEther(swapAmount)} Token A → ${ethers.formatEther(amountOut)} Token B`);

  } catch (error) {
    console.error("❌ Failed to add liquidity:", error);
  }
}

main().catch(console.error);