"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { x: 100, y: 200, size: 80, name: "ETH" },
  { x: 120, y: 100, size: 60, name: "BTC" },
  { x: 170, y: 300, size: 40, name: "USDT" },
  { x: 140, y: 250, size: 70, name: "USDC" },
  { x: 150, y: 400, size: 50, name: "DAI" },
  { x: 110, y: 280, size: 90, name: "WBTC" },
  { x: 130, y: 200, size: 65, name: "WETH" },
  { x: 160, y: 150, size: 45, name: "LINK" },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-gray-800 bg-black/90 p-3 shadow-lg">
        <p className="text-sm font-medium text-cyan-400">
          {payload[0].payload.name}
        </p>
        <p className="text-xs text-gray-400">Value: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function BubbleGraph() {
  return (
    <div className="h-[400px] w-full rounded-lg border border-gray-800 bg-black/40 p-4">
      <h3 className="mb-4 text-lg font-medium text-gray-100">
        Token Relationships
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            type="number"
            dataKey="x"
            name="Value"
            stroke="#9ca3af"
            tick={{ fill: "#9ca3af" }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Volume"
            stroke="#9ca3af"
            tick={{ fill: "#9ca3af" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Scatter
            data={data}
            fill="#22d3ee"
            opacity={0.6}
            name="Tokens"
            dataKey="size"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
