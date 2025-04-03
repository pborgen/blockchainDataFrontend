import { MyResponse, TransactionGroupBy } from "../types/transactions";
import { ViewMode } from "../types/view-modes";

// Mock transactions data
export async function fetchTransactions() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return [
    {
      id: "1",
      hash: "0x7cb6cdef845cd43c9a5a6e58c9f9d6c7b5a4e3d2c1b0a9f8e7d6c5b4a3f2e1d0",
      from: "0x1234567890abcdef1234567890abcdef12345678",
      to: "0xabcdef1234567890abcdef1234567890abcdef12",
      value: "0.42",
      timestamp: Math.floor(Date.now() / 1000) - 300, // 5 minutes ago
      type: "out" as const,
    },
    {
      id: "2",
      hash: "0x8dc7efab956de54f0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3",
      from: "0xfedcba0987654321fedcba0987654321fedcba09",
      to: "0x1234567890abcdef1234567890abcdef12345678",
      value: "1.337",
      timestamp: Math.floor(Date.now() / 1000) - 1800, // 30 minutes ago
      type: "in" as const,
    },
    {
      id: "3",
      hash: "0x9ef0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f",
      from: "0x1234567890abcdef1234567890abcdef12345678",
      to: "0x2468ace02468ace02468ace02468ace02468ace0",
      value: "0.05",
      timestamp: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
      type: "out" as const,
    },
    {
      id: "4",
      hash: "0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1",
      from: "0x13579bdf13579bdf13579bdf13579bdf13579bdf",
      to: "0x1234567890abcdef1234567890abcdef12345678",
      value: "0.25",
      timestamp: Math.floor(Date.now() / 1000) - 14400, // 4 hours ago
      type: "in" as const,
    },
    {
      id: "5",
      hash: "0xb2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
      from: "0x1234567890abcdef1234567890abcdef12345678",
      to: "0xfedcba0987654321fedcba0987654321fedcba09",
      value: "0.1",
      timestamp: Math.floor(Date.now() / 1000) - 86400, // 1 day ago
      type: "out" as const,
    },
  ];
}

// Mock blocks data
export async function fetchBlocks() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const now = Math.floor(Date.now() / 1000);

  return [
    {
      id: "1",
      number: 18245367,
      hash: "0xd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4",
      timestamp: now - 12,
      transactions: 142,
      miner: "0xf1e2d3c4b5a6978695a4b3c2d1e0f9a8b7c6d5e4",
      gasUsed: "12,345,678",
    },
    {
      id: "2",
      number: 18245366,
      hash: "0xe5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5",
      timestamp: now - 24,
      transactions: 98,
      miner: "0xa1b2c3d4e5f6789012345678901234567890abcd",
      gasUsed: "8,765,432",
    },
    {
      id: "3",
      number: 18245365,
      hash: "0xf6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6",
      timestamp: now - 36,
      transactions: 121,
      miner: "0xf1e2d3c4b5a6978695a4b3c2d1e0f9a8b7c6d5e4",
      gasUsed: "10,987,654",
    },
    {
      id: "4",
      number: 18245364,
      hash: "0xa7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7",
      timestamp: now - 48,
      transactions: 87,
      miner: "0x2468ace02468ace02468ace02468ace02468ace0",
      gasUsed: "7,654,321",
    },
    {
      id: "5",
      number: 18245363,
      hash: "0xb8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8",
      timestamp: now - 60,
      transactions: 156,
      miner: "0xa1b2c3d4e5f6789012345678901234567890abcd",
      gasUsed: "13,579,246",
    },
  ];
}

// Mock network stats
export async function fetchNetworkStats() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return {
    price: 3245.67,
    priceChange: 2.34,
    marketCap: 389456789012,
    transactions: 1234567,
    tps: 15.7,
    blockTime: 12.3,
    difficulty: 12345678901234,
  };
}

// Mock wallet info
export async function fetchWalletInfo() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return {
    address: "0x1234567890abcdef1234567890abcdef12345678",
    balance: {
      eth: 4.2069,
      usd: 13654.23,
    },
    tokens: [
      {
        id: "1",
        symbol: "ETH",
        name: "Ethereum",
        balance: 4.2069,
        value: 13654.23,
        change24h: 2.34,
      },
      {
        id: "2",
        symbol: "USDC",
        name: "USD Coin",
        balance: 1250.0,
        value: 1250.0,
        change24h: 0.01,
      },
      {
        id: "3",
        symbol: "LINK",
        name: "Chainlink",
        balance: 75.5,
        value: 1132.5,
        change24h: -1.25,
      },
      {
        id: "4",
        symbol: "UNI",
        name: "Uniswap",
        balance: 42.0,
        value: 378.0,
        change24h: 5.67,
      },
    ],
  };
}

// Mock price chart data
export async function fetchPriceData(timeRange: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const now = Date.now();
  const dataPoints = 100;
  let startTime: number;

  switch (timeRange) {
    case "1D":
      startTime = now - 24 * 60 * 60 * 1000; // 1 day
      break;
    case "1W":
      startTime = now - 7 * 24 * 60 * 60 * 1000; // 1 week
      break;
    case "1M":
      startTime = now - 30 * 24 * 60 * 60 * 1000; // 1 month
      break;
    case "3M":
      startTime = now - 90 * 24 * 60 * 60 * 1000; // 3 months
      break;
    case "1Y":
      startTime = now - 365 * 24 * 60 * 60 * 1000; // 1 year
      break;
    case "ALL":
      startTime = now - 5 * 365 * 24 * 60 * 60 * 1000; // 5 years
      break;
    default:
      startTime = now - 24 * 60 * 60 * 1000; // Default to 1 day
  }

  const basePrice = 3245.67;
  const volatility =
    timeRange === "1D" ? 0.02 : timeRange === "1W" ? 0.05 : 0.2;
  const trend = 0.01; // Slight upward trend

  const chartData = [];

  for (let i = 0; i < dataPoints; i++) {
    const timestamp = Math.floor(
      startTime + (i * (now - startTime)) / dataPoints / 1000
    );
    const randomFactor = 1 + (Math.random() - 0.5) * volatility;
    const trendFactor = 1 + trend * (i / dataPoints);
    const price = basePrice * randomFactor * trendFactor;

    chartData.push({
      timestamp,
      price,
    });
  }

  const current = chartData[chartData.length - 1].price;
  const first = chartData[0].price;
  const change = current - first;
  const changePercent = (change / first) * 100;

  // Calculate 24h high and low
  const prices = chartData.map((d) => d.price);
  const high24h = Math.max(...prices);
  const low24h = Math.min(...prices);

  return {
    current,
    change,
    changePercent,
    high24h,
    low24h,
    chartData,
  };
}

// Mock liquidity pools data
export async function fetchLiquidityPools(dexId: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Base pools that will be modified based on the selected DEX
  const basePools = [
    {
      id: "1",
      tokenPair: "ETH/USDC",
      token0Symbol: "ETH",
      token1Symbol: "USDC",
      tvl: 245000000,
      apy: 12.5,
      volume24h: 32000000,
      feeTier: "0.3%",
    },
    {
      id: "2",
      tokenPair: "ETH/WBTC",
      token0Symbol: "ETH",
      token1Symbol: "BTC",
      tvl: 189000000,
      apy: 8.2,
      volume24h: 18500000,
      feeTier: "0.05%",
    },
    {
      id: "3",
      tokenPair: "USDC/USDT",
      token0Symbol: "USDC",
      token1Symbol: "USDT",
      tvl: 320000000,
      apy: 4.8,
      volume24h: 45000000,
      feeTier: "0.01%",
    },
    {
      id: "4",
      tokenPair: "ETH/DAI",
      token0Symbol: "ETH",
      token1Symbol: "DAI",
      tvl: 112000000,
      apy: 9.7,
      volume24h: 15000000,
      feeTier: "0.3%",
    },
    {
      id: "5",
      tokenPair: "LINK/ETH",
      token0Symbol: "LINK",
      token1Symbol: "ETH",
      tvl: 78000000,
      apy: 15.3,
      volume24h: 8900000,
      feeTier: "1%",
    },
    {
      id: "6",
      tokenPair: "UNI/ETH",
      token0Symbol: "UNI",
      token1Symbol: "ETH",
      tvl: 65000000,
      apy: 18.2,
      volume24h: 7500000,
      feeTier: "0.3%",
    },
  ];

  // Modify data based on the selected DEX
  switch (dexId) {
    case "uniswap":
      return basePools.map((pool) => ({
        ...pool,
        apy: pool.apy * 1.1, // Uniswap has slightly higher APY
        feeTier: ["0.01%", "0.05%", "0.3%", "1%"][
          Math.floor(Math.random() * 4)
        ],
      }));

    case "sushiswap":
      return basePools.map((pool) => ({
        ...pool,
        tvl: pool.tvl * 0.7, // SushiSwap has less TVL
        apy: pool.apy * 1.3, // but higher APY
        volume24h: pool.volume24h * 0.8,
        feeTier: "0.3%", // SushiSwap has fixed fee tier
      }));

    case "pancakeswap":
      return basePools.map((pool) => ({
        ...pool,
        tvl: pool.tvl * 0.8,
        apy: pool.apy * 1.2,
        volume24h: pool.volume24h * 0.9,
        feeTier: ["0.17%", "0.25%", "0.5%"][Math.floor(Math.random() * 3)],
      }));

    case "curve":
      return basePools
        .filter(
          (pool) =>
            pool.tokenPair.includes("USD") || pool.tokenPair.includes("DAI")
        ) // Curve focuses on stablecoins
        .map((pool) => ({
          ...pool,
          tvl: pool.tvl * 1.2,
          apy: pool.apy * 0.7, // Lower APY for stablecoins
          volume24h: pool.volume24h * 1.1,
          feeTier: "0.04%", // Curve has low fees
        }));

    case "balancer":
      return basePools.map((pool) => ({
        ...pool,
        tvl: pool.tvl * 0.6,
        apy: pool.apy * 1.1,
        volume24h: pool.volume24h * 0.7,
        feeTier: ["0.1%", "0.3%", "0.5%"][Math.floor(Math.random() * 3)],
      }));

    default:
      return basePools;
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
console.log(API_BASE_URL);
export async function fetchTransferEventsGroupBy(
  address: string,
  viewMode: ViewMode
): Promise<MyResponse<TransactionGroupBy[]>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/transfer-events/${address}?viewMode=${viewMode}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching wallet network:", error);
    throw error;
  }
}
