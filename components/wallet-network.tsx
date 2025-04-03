"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { fetchTransferEventsGroupBy } from "@/lib/api";
import {
  TransactionNode,
  TransactionLink,
  TransactionGroupBy,
} from "@/types/transactions";

export default function WalletNetwork() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeNode, setActiveNode] = useState<TransactionNode | null>(null);
  const [activeLink, setActiveLink] = useState<TransactionLink | null>(null);
  const [searchAddress, setSearchAddress] = useState(
    "0xD1C4c78472638155233A1cB9CECEBed04C04E9B8"
  );
  const [nodes, setNodes] = useState<TransactionNode[]>([]);
  const [links, setLinks] = useState<TransactionLink[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchAddress) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log("Searching for address:", searchAddress);
      const response = await fetchTransferEventsGroupBy(searchAddress);
      console.log("Received data:", response);

      // Transform the data into nodes and links
      const data = response.data;

      // Create a map to track unique nodes and their transaction counts
      const nodeMap = new Map<string, TransactionNode>();

      // Process each transaction to build nodes and links
      const processedLinks: TransactionLink[] = [];

      data.forEach((item: TransactionGroupBy) => {
        // Add or update source node
        if (!nodeMap.has(item.FromAddress)) {
          nodeMap.set(item.FromAddress, {
            id: item.FromAddress,
            transactionCount: item.TransactionCount,
          });
        }

        // Add or update target node
        if (!nodeMap.has(item.ToAddress)) {
          nodeMap.set(item.ToAddress, {
            id: item.ToAddress,
            transactionCount: item.TransactionCount,
          });
        }

        // Add link
        processedLinks.push({
          source: item.FromAddress,
          target: item.ToAddress,
          value: item.TransactionCount,
          type: "transfer",
          timestamp: new Date().toISOString(),
        });
      });

      // Convert node map to array
      const processedNodes = Array.from(nodeMap.values());

      console.log("Processed nodes:", processedNodes);
      console.log("Processed links:", processedLinks);

      setNodes(processedNodes);
      setLinks(processedLinks);
    } catch (err) {
      console.error("Error details:", err);
      setError("Failed to fetch wallet data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

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
          .forceLink(links as any)
          .id((d: any) => d.id)
          .distance(50)
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
      .attr("r", (d) => d.transactionCount * 5)
      .attr("stroke", "#1f2937")
      .attr("stroke-width", 2);

    // Add drag behavior
    const drag = d3
      .drag<SVGCircleElement, TransactionNode>()
      .on("start", (event) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      })
      .on("drag", (event) => {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      })
      .on("end", (event) => {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      });

    node.call(drag as any);

    // Add labels
    const label = svg
      .append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")

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
    const showNodeDetails = (event: any, d: TransactionNode) => {
      tooltip.transition().duration(200).style("opacity", 0.9);

      tooltip
        .html(
          `
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-medium text-cyan-400">${d.id}</span>
          </div>
          <div class="text-sm">
            <div class="flex justify-between">
              <span class="text-gray-400">Transactions:</span>
              <span class="text-gray-200">${d.transactionCount}</span>
            </div>
          </div>
        </div>
      `
        )
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 28 + "px");
    };

    // Common function to show link details
    const showLinkDetails = (event: any, d: TransactionLink) => {
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

    return () => {
      simulation.stop();
      tooltip.remove();
    };
  }, [nodes, links]);

  return (
    <div className="h-[calc(100vh-2rem)] w-full rounded-lg border border-gray-800 bg-black/40 p-4">
      <div className="relative max-w-md">
        <Input
          placeholder="Token Address"
          value={searchAddress}
          onChange={(e) => setSearchAddress(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="border-gray-800 bg-black/40 pl-10 text-gray-300 placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500/20"
        />
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 cursor-pointer"
          onClick={handleSearch}
        />
      </div>
      {error && (
        <div className="mt-4 p-2 text-red-500 bg-red-500/10 rounded">
          {error}
        </div>
      )}
      <h3 className="mb-4 text-lg font-medium text-gray-100">
        Wallet Interactions
      </h3>
      {isLoading ? (
        <div className="flex items-center justify-center h-[calc(100%-8rem)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
        </div>
      ) : (
        <div className="h-[calc(100%-8rem)]">
          <svg ref={svgRef} className="w-full h-full"></svg>
        </div>
      )}
    </div>
  );
}
