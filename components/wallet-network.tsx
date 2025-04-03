"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

interface WalletNode {
  id: string;
  group: number;
  value: number;
  balance: number;
  transactionCount: number;
  firstSeen: string;
  lastActive: string;
  type: "contract" | "wallet" | "exchange";
  riskScore: number;
  tags: string[];
}

interface WalletLink {
  source: string;
  target: string;
  value: number;
  type: "transfer" | "interaction" | "contract_call";
  timestamp: string;
  amount?: number;
}

// Sample data - replace with real data
const nodes: WalletNode[] = [
  {
    id: "0x1234...5678",
    group: 1,
    value: 5,
    balance: 100.5,
    transactionCount: 150,
    firstSeen: "2023-01-15",
    lastActive: "2024-03-20",
    type: "wallet",
    riskScore: 0.2,
    tags: ["whale", "active"],
  },
  {
    id: "0xabcd...efgh",
    group: 1,
    value: 3,
    balance: 50.2,
    transactionCount: 75,
    firstSeen: "2023-03-10",
    lastActive: "2024-03-19",
    type: "contract",
    riskScore: 0.1,
    tags: ["defi", "verified"],
  },
  {
    id: "0x2468...1357",
    group: 2,
    value: 4,
    balance: 20.8,
    transactionCount: 200,
    firstSeen: "2022-12-05",
    lastActive: "2024-03-18",
    type: "exchange",
    riskScore: 0.3,
    tags: ["cex", "high_volume"],
  },
  {
    id: "0x9876...5432",
    group: 2,
    value: 2,
    balance: 10.1,
    transactionCount: 30,
    firstSeen: "2023-06-20",
    lastActive: "2024-03-17",
    type: "wallet",
    riskScore: 0.4,
    tags: ["new", "low_activity"],
  },
  {
    id: "0x1357...2468",
    group: 3,
    value: 6,
    balance: 30.7,
    transactionCount: 500,
    firstSeen: "2022-08-15",
    lastActive: "2024-03-16",
    type: "contract",
    riskScore: 0.05,
    tags: ["nft", "verified"],
  },
  {
    id: "0x5432...9876",
    group: 3,
    value: 3,
    balance: 15.3,
    transactionCount: 100,
    firstSeen: "2023-09-01",
    lastActive: "2024-03-15",
    type: "wallet",
    riskScore: 0.6,
    tags: ["suspicious", "high_risk"],
  },
];

const links: WalletLink[] = [
  {
    source: "0x1234...5678",
    target: "0xabcd...efgh",
    value: 2,
    type: "transfer",
    timestamp: "2024-03-20T10:30:00Z",
    amount: 5.2,
  },
  {
    source: "0x1234...5678",
    target: "0x2468...1357",
    value: 1,
    type: "interaction",
    timestamp: "2024-03-19T15:45:00Z",
  },
  {
    source: "0xabcd...efgh",
    target: "0x9876...5432",
    value: 3,
    type: "contract_call",
    timestamp: "2024-03-18T08:20:00Z",
  },
  {
    source: "0x2468...1357",
    target: "0x1357...2468",
    value: 2,
    type: "transfer",
    timestamp: "2024-03-17T12:15:00Z",
    amount: 2.8,
  },
  {
    source: "0x9876...5432",
    target: "0x5432...9876",
    value: 1,
    type: "interaction",
    timestamp: "2024-03-16T09:30:00Z",
  },
];

export default function WalletNetwork() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeNode, setActiveNode] = useState<WalletNode | null>(null);
  const [activeLink, setActiveLink] = useState<WalletLink | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Create the simulation
    const simulation = d3
      .forceSimulation(nodes as any)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(50));

    // Create the links
    const link = svg
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", (d) => {
        switch (d.type) {
          case "transfer":
            return "#22d3ee"; // cyan
          case "interaction":
            return "#a78bfa"; // purple
          case "contract_call":
            return "#f472b6"; // pink
          default:
            return "#4b5563"; // gray
        }
      })
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d) => Math.sqrt(d.value));

    // Create the nodes
    const node = svg
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d) => d.value * 5)
      .attr("fill", (d) => {
        switch (d.type) {
          case "wallet":
            return "#22d3ee"; // cyan
          case "contract":
            return "#a78bfa"; // purple
          case "exchange":
            return "#f472b6"; // pink
          default:
            return "#9ca3af"; // gray
        }
      })
      .attr("stroke", "#1f2937")
      .attr("stroke-width", 2);

    // Add labels
    const label = svg
      .append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text((d) => d.id)
      .attr("font-size", "12px")
      .attr("fill", "#9ca3af")
      .attr("text-anchor", "middle")
      .attr("dy", 4);

    // Add tooltips
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "rgba(0, 0, 0, 0.8)")
      .style("color", "#fff")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("max-width", "300px");

    // Common function to show node details
    const showNodeDetails = (event: any, d: WalletNode) => {
      tooltip.transition().duration(200).style("opacity", 0.9);

      const riskColor = d.riskScore > 0.5 ? "#ef4444" : "#22c55e";
      const riskText = d.riskScore > 0.5 ? "High Risk" : "Low Risk";

      tooltip
        .html(
          `
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-medium text-cyan-400">${d.id}</span>
            <span class="text-xs px-2 py-1 rounded" style="background-color: ${riskColor}">${riskText}</span>
          </div>
          <div class="text-sm">
            <div class="flex justify-between">
              <span class="text-gray-400">Type:</span>
              <span class="text-gray-200">${d.type}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Balance:</span>
              <span class="text-gray-200">${d.balance} ETH</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Transactions:</span>
              <span class="text-gray-200">${d.transactionCount}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">First Seen:</span>
              <span class="text-gray-200">${new Date(
                d.firstSeen
              ).toLocaleDateString()}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Last Active:</span>
              <span class="text-gray-200">${new Date(
                d.lastActive
              ).toLocaleDateString()}</span>
            </div>
            <div class="mt-2">
              <span class="text-gray-400">Tags:</span>
              <div class="flex flex-wrap gap-1 mt-1">
                ${d.tags
                  .map(
                    (tag) =>
                      `<span class="text-xs px-2 py-0.5 rounded bg-gray-800">${tag}</span>`
                  )
                  .join("")}
              </div>
            </div>
          </div>
        </div>
      `
        )
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 28 + "px");
    };

    // Common function to show link details
    const showLinkDetails = (event: any, d: WalletLink) => {
      tooltip.transition().duration(200).style("opacity", 0.9);

      const sourceNode = nodes.find((n) => n.id === d.source);
      const targetNode = nodes.find((n) => n.id === d.target);

      tooltip
        .html(
          `
        <div class="space-y-2">
          <div class="font-medium text-cyan-400">${d.type.toUpperCase()}</div>
          <div class="text-sm">
            <div class="flex justify-between">
              <span class="text-gray-400">From:</span>
              <span class="text-gray-200">${sourceNode?.id}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">To:</span>
              <span class="text-gray-200">${targetNode?.id}</span>
            </div>
            ${
              d.amount
                ? `
              <div class="flex justify-between">
                <span class="text-gray-400">Amount:</span>
                <span class="text-gray-200">${d.amount} ETH</span>
              </div>
            `
                : ""
            }
            <div class="flex justify-between">
              <span class="text-gray-400">Time:</span>
              <span class="text-gray-200">${new Date(
                d.timestamp
              ).toLocaleString()}</span>
            </div>
          </div>
        </div>
      `
        )
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 28 + "px");
    };

    // Node event handlers
    node
      .on("mouseover", (event, d) => {
        showNodeDetails(event, d);
        node
          .filter((n) => n === d)
          .attr("stroke", "#ffffff")
          .attr("stroke-width", 3);
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
        node.attr("stroke", "#1f2937").attr("stroke-width", 2);
      })
      .on("click", (event, d) => {
        showNodeDetails(event, d);
        setActiveNode(d);
        node.attr("stroke", "#1f2937").attr("stroke-width", 2);
        node
          .filter((n) => n === d)
          .attr("stroke", "#ffffff")
          .attr("stroke-width", 3);
      });

    // Link event handlers
    link
      .on("mouseover", (event, d) => {
        showLinkDetails(event, d);
        link
          .filter((l) => l === d)
          .attr("stroke-opacity", 1)
          .attr("stroke-width", (d) => Math.sqrt(d.value) * 1.5);
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
        link
          .attr("stroke-opacity", 0.6)
          .attr("stroke-width", (d) => Math.sqrt(d.value));
      })
      .on("click", (event, d) => {
        showLinkDetails(event, d);
        setActiveLink(d);
        link
          .attr("stroke-opacity", 0.6)
          .attr("stroke-width", (d) => Math.sqrt(d.value));
        link
          .filter((l) => l === d)
          .attr("stroke-opacity", 1)
          .attr("stroke-width", (d) => Math.sqrt(d.value) * 1.5);
      });

    // Update positions on each tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);

      label.attr("x", (d: any) => d.x).attr("y", (d: any) => d.y);
    });

    // Add drag behavior
    // node.call(
    //   d3
    //     .drag<SVGCircleElement, WalletNode>()
    //     .on("start", (event) => {
    //       if (!event.active) simulation.alphaTarget(0.3).restart();
    //       event.subject.fx = event.subject.x;
    //       event.subject.fy = event.subject.y;
    //     })
    //     .on("drag", (event) => {
    //       event.subject.fx = event.x;
    //       event.subject.fy = event.y;
    //     })
    //     .on("end", (event) => {
    //       if (!event.active) simulation.alphaTarget(0);
    //       event.subject.fx = null;
    //       event.subject.fy = null;
    //     })
    // );

    return () => {
      simulation.stop();
      tooltip.remove();
    };
  }, []);

  return (
    <div className="h-[500px] w-full rounded-lg border border-gray-800 bg-black/40 p-4">
      <div className="relative max-w-md">
        <Input
          placeholder="Token Address"
          className="border-gray-800 bg-black/40 pl-10 text-gray-300 placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500/20"
        />
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      </div>
      <h3 className="mb-4 text-lg font-medium text-gray-100">
        Wallet Interactions
      </h3>
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  );
}
