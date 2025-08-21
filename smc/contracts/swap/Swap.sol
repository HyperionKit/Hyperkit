// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract LiquidityPool is Ownable, ReentrancyGuard {
    using Math for uint256;

    struct Pair {
        address tokenA;
        address tokenB;
        uint256 reserveA;
        uint256 reserveB;
        uint256 totalLiquidity;
        bool exists;
    }

    struct LiquidityPosition {
        uint256 liquidity;
        uint256 timestamp;
    }

    mapping(bytes32 => Pair) public pairs;
    mapping(bytes32 => mapping(address => LiquidityPosition)) public liquidityPositions;
    
    bytes32[] public pairIds;
    
    uint256 public constant MINIMUM_LIQUIDITY = 10**3;
    uint256 public constant FEE_DENOMINATOR = 10000;
    uint256 public tradingFee = 30; // 0.3%

    event PairCreated(
        address indexed tokenA,
        address indexed tokenB,
        bytes32 indexed pairId
    );
    
    event LiquidityAdded(
        bytes32 indexed pairId,
        address indexed provider,
        uint256 amountA,
        uint256 amountB,
        uint256 liquidity
    );
    
    event LiquidityRemoved(
        bytes32 indexed pairId,
        address indexed provider,
        uint256 amountA,
        uint256 amountB,
        uint256 liquidity
    );
    
    event Swap(
        bytes32 indexed pairId,
        address indexed user,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOut
    );

    constructor() Ownable(msg.sender) {}

    function createPair(address tokenA, address tokenB) external onlyOwner returns (bytes32) {
        require(tokenA != tokenB, "Identical tokens");
        require(tokenA != address(0) && tokenB != address(0), "Zero address");
        
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        bytes32 pairId = keccak256(abi.encodePacked(token0, token1));
        
        require(!pairs[pairId].exists, "Pair already exists");
        
        pairs[pairId] = Pair({
            tokenA: token0,
            tokenB: token1,
            reserveA: 0,
            reserveB: 0,
            totalLiquidity: 0,
            exists: true
        });
        
        pairIds.push(pairId);
        
        emit PairCreated(token0, token1, pairId);
        return pairId;
    }

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin
    ) external nonReentrant returns (uint256 amountA, uint256 amountB, uint256 liquidity) {
        bytes32 pairId = getPairId(tokenA, tokenB);
        require(pairs[pairId].exists, "Pair does not exist");
        
        Pair storage pair = pairs[pairId];
        
        if (pair.reserveA == 0 && pair.reserveB == 0) {
            // First liquidity provision
            amountA = amountADesired;
            amountB = amountBDesired;
        } else {
            // Calculate optimal amounts based on current reserves
            uint256 amountBOptimal = (amountADesired * pair.reserveB) / pair.reserveA;
            if (amountBOptimal <= amountBDesired) {
                require(amountBOptimal >= amountBMin, "Insufficient B amount");
                amountA = amountADesired;
                amountB = amountBOptimal;
            } else {
                uint256 amountAOptimal = (amountBDesired * pair.reserveA) / pair.reserveB;
                require(amountAOptimal <= amountADesired && amountAOptimal >= amountAMin, "Insufficient A amount");
                amountA = amountAOptimal;
                amountB = amountBDesired;
            }
        }
        
        // Calculate liquidity tokens to mint
        if (pair.totalLiquidity == 0) {
            liquidity = Math.sqrt(amountA * amountB) - MINIMUM_LIQUIDITY;
        } else {
            liquidity = Math.min(
                (amountA * pair.totalLiquidity) / pair.reserveA,
                (amountB * pair.totalLiquidity) / pair.reserveB
            );
        }
        
        require(liquidity > 0, "Insufficient liquidity minted");
        
        // Transfer tokens from user
        IERC20(pair.tokenA).transferFrom(msg.sender, address(this), amountA);
        IERC20(pair.tokenB).transferFrom(msg.sender, address(this), amountB);
        
        // Update reserves and liquidity
        pair.reserveA += amountA;
        pair.reserveB += amountB;
        pair.totalLiquidity += liquidity;
        
        // Update user's liquidity position
        liquidityPositions[pairId][msg.sender].liquidity += liquidity;
        liquidityPositions[pairId][msg.sender].timestamp = block.timestamp;
        
        emit LiquidityAdded(pairId, msg.sender, amountA, amountB, liquidity);
    }

    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin
    ) external nonReentrant returns (uint256 amountA, uint256 amountB) {
        bytes32 pairId = getPairId(tokenA, tokenB);
        require(pairs[pairId].exists, "Pair does not exist");
        require(liquidityPositions[pairId][msg.sender].liquidity >= liquidity, "Insufficient liquidity");
        
        Pair storage pair = pairs[pairId];
        
        // Calculate amounts to return
        amountA = (liquidity * pair.reserveA) / pair.totalLiquidity;
        amountB = (liquidity * pair.reserveB) / pair.totalLiquidity;
        
        require(amountA >= amountAMin && amountB >= amountBMin, "Insufficient amounts");
        
        // Update liquidity position
        liquidityPositions[pairId][msg.sender].liquidity -= liquidity;
        
        // Update reserves and total liquidity
        pair.reserveA -= amountA;
        pair.reserveB -= amountB;
        pair.totalLiquidity -= liquidity;
        
        // Transfer tokens back to user
        IERC20(pair.tokenA).transfer(msg.sender, amountA);
        IERC20(pair.tokenB).transfer(msg.sender, amountB);
        
        emit LiquidityRemoved(pairId, msg.sender, amountA, amountB, liquidity);
    }

    function swap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMin
    ) external nonReentrant returns (uint256 amountOut) {
        require(amountIn > 0, "Invalid input amount");
        require(tokenIn != tokenOut, "Identical tokens");
        
        bytes32 pairId = getPairId(tokenIn, tokenOut);
        require(pairs[pairId].exists, "Pair does not exist");
        
        Pair storage pair = pairs[pairId];
        require(pair.reserveA > 0 && pair.reserveB > 0, "Insufficient liquidity");
        
        // Check user balance
        require(IERC20(tokenIn).balanceOf(msg.sender) >= amountIn, "Insufficient balance");
        
        // Determine which token is which
        bool isTokenAInput = tokenIn == pair.tokenA;
        (uint256 reserveIn, uint256 reserveOut) = isTokenAInput 
            ? (pair.reserveA, pair.reserveB) 
            : (pair.reserveB, pair.reserveA);
        
        // Calculate output amount using constant product formula
        // amountOut = (amountIn * reserveOut) / (reserveIn + amountIn) - fee
        uint256 amountInWithFee = amountIn * (FEE_DENOMINATOR - tradingFee);
        uint256 numerator = amountInWithFee * reserveOut;
        uint256 denominator = (reserveIn * FEE_DENOMINATOR) + amountInWithFee;
        amountOut = numerator / denominator;
        
        require(amountOut >= amountOutMin, "Insufficient output amount");
        require(amountOut < reserveOut, "Insufficient liquidity");
        
        // Transfer tokens
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        IERC20(tokenOut).transfer(msg.sender, amountOut);
        
        // Update reserves
        if (isTokenAInput) {
            pair.reserveA += amountIn;
            pair.reserveB -= amountOut;
        } else {
            pair.reserveB += amountIn;
            pair.reserveA -= amountOut;
        }
        
        emit Swap(pairId, msg.sender, tokenIn, tokenOut, amountIn, amountOut);
    }

    function getAmountOut(
        uint256 amountIn,
        address tokenIn,
        address tokenOut
    ) external view returns (uint256 amountOut) {
        require(amountIn > 0, "Invalid input amount");
        
        bytes32 pairId = getPairId(tokenIn, tokenOut);
        require(pairs[pairId].exists, "Pair does not exist");
        
        Pair storage pair = pairs[pairId];
        bool isTokenAInput = tokenIn == pair.tokenA;
        (uint256 reserveIn, uint256 reserveOut) = isTokenAInput 
            ? (pair.reserveA, pair.reserveB) 
            : (pair.reserveB, pair.reserveA);
        
        require(reserveIn > 0 && reserveOut > 0, "Insufficient liquidity");
        
        uint256 amountInWithFee = amountIn * (FEE_DENOMINATOR - tradingFee);
        uint256 numerator = amountInWithFee * reserveOut;
        uint256 denominator = (reserveIn * FEE_DENOMINATOR) + amountInWithFee;
        amountOut = numerator / denominator;
    }

    function getPairId(address tokenA, address tokenB) public pure returns (bytes32) {
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        return keccak256(abi.encodePacked(token0, token1));
    }

    function getPairInfo(address tokenA, address tokenB) external view returns (
        uint256 reserveA,
        uint256 reserveB,
        uint256 totalLiquidity
    ) {
        bytes32 pairId = getPairId(tokenA, tokenB);
        require(pairs[pairId].exists, "Pair does not exist");
        
        Pair storage pair = pairs[pairId];
        reserveA = pair.reserveA;
        reserveB = pair.reserveB;
        totalLiquidity = pair.totalLiquidity;
    }

    function getUserLiquidity(address tokenA, address tokenB, address user) external view returns (uint256) {
        bytes32 pairId = getPairId(tokenA, tokenB);
        return liquidityPositions[pairId][user].liquidity;
    }

    function getAllPairs() external view returns (bytes32[] memory) {
        return pairIds;
    }

    function setTradingFee(uint256 _fee) external onlyOwner {
        require(_fee <= 1000, "Fee too high"); // Max 10%
        tradingFee = _fee;
    }
}