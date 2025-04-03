"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Input } from "./ui/input";
import { Search } from "lucide-react";



// Sample data - replace with real data
const nodes: TransactionNode[] = [
  {
    id: "0x1234...5678",
    group: 1,
    value: 5,
    balance: 100.5,
    transactionCount: 150,
  },
  {
    id: "0xabcd...efgh",
    group: 1,
    value: 3,
    balance: 50.2,
    transactionCount: 75,
  },
];

const links: TransactionLink[] = [
  {
    source: "0x1234...5678",
    target: "0xabcd...efgh",
    value: 2,
    type: "transfer",
    timestamp: "2024-03-20T10:30:00Z",
    amount: 5.2,
  },
];

export default function WalletNetwork() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeNode, setActiveNode] = useState<TransactionNode | null>(null);
  const [activeLink, setActiveLink] = useState<TransactionLink | null>(null);

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
    <div className="h-[calc(100vh-2rem)] w-full rounded-lg border border-gray-800 bg-black/40 p-4">
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
      <div className="h-[calc(100%-8rem)]">
        <svg ref={svgRef} className="w-full h-full"></svg>
      </div>
    </div>
  );
}
