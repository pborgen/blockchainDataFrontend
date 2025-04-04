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
import { FilterMode, ViewMode } from "@/types/view-modes";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import ReactDOM from "react-dom/client";

export default function WalletNetwork() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeNode, setActiveNode] = useState<TransactionNode | null>(null);
  const [activeLink, setActiveLink] = useState<TransactionLink | null>(null);

  const [searchAddress, setSearchAddress] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>(FilterMode.ALL);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.GRID);

  const [transactionGroupByData, setTransactionGroupByData] = useState<
    TransactionGroupBy[] | null
  >(null);
  const [nodes, setNodes] = useState<TransactionNode[]>([]);
  const [links, setLinks] = useState<TransactionLink[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchAddress) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchTransferEventsGroupBy(
        searchAddress,
        filterMode
      );

      // Transform the data into nodes and links
      const data = response.data;

      setTransactionGroupByData(data);

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
    if (viewMode === ViewMode.BUBBLE_CHART) {
      return createNetworkVisualization(
        svgRef,
        nodes,
        links,
        setActiveNode,
        setActiveLink
      );
    } else {
      return createGridVisualization(transactionGroupByData);
    }
  }, [nodes, links, filterMode, viewMode]);

  // Add new useEffect for filter mode changes
  useEffect(() => {
    handleSearch();
  }, [filterMode]);

  return (
    <div className="h-[calc(100vh-2rem)] w-full rounded-lg border border-gray-800 bg-black/40 p-4">
      <div className="flex items-center gap-4">
        <div className="relative max-w-md flex-1">
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

        <div className="flex items-center gap-4 border border-gray-800 rounded-md p-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="filterMode"
              value={FilterMode.ALL}
              checked={filterMode === FilterMode.ALL}
              onChange={(e) => setFilterMode(e.target.value as FilterMode)}
              className="text-cyan-500 focus:ring-cyan-500"
            />
            <span className="text-sm text-gray-300">All</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="filterMode"
              value={FilterMode.INCOMING}
              checked={filterMode === FilterMode.INCOMING}
              onChange={(e) => setFilterMode(e.target.value as FilterMode)}
              className="text-cyan-500 focus:ring-cyan-500"
            />
            <span className="text-sm text-gray-300">Incoming</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="filterMode"
              value={FilterMode.OUTGOING}
              checked={filterMode === FilterMode.OUTGOING}
              onChange={(e) => setFilterMode(e.target.value as FilterMode)}
              className="text-cyan-500 focus:ring-cyan-500"
            />
            <span className="text-sm text-gray-300">Outgoing</span>
          </label>
        </div>

        <div className="flex items-center gap-4 border border-gray-800 rounded-md p-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="viewMode"
              value={ViewMode.BUBBLE_CHART}
              checked={viewMode === ViewMode.BUBBLE_CHART}
              onChange={(e) => setViewMode(e.target.value as ViewMode)}
              className="text-cyan-500 focus:ring-cyan-500"
            />
            <span className="text-sm text-gray-300">Bubble Chart</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="viewMode"
              value={ViewMode.GRID}
              checked={viewMode === ViewMode.GRID}
              onChange={(e) => setViewMode(e.target.value as ViewMode)}
              className="text-cyan-500 focus:ring-cyan-500"
            />
            <span className="text-sm text-gray-300">Grid</span>
          </label>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-2 text-red-500 bg-red-500/10 rounded">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-[calc(100%-8rem)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
        </div>
      ) : (
        <div className="h-[calc(100%-8rem)]">
          {viewMode === ViewMode.BUBBLE_CHART ? (
            <svg ref={svgRef} className="w-full h-full"></svg>
          ) : (
            <div className="grid-container"></div>
          )}
        </div>
      )}
    </div>
  );
}

const createGridVisualization = (
  transactionGroupByData: TransactionGroupBy[] | null
) => {
  if (!transactionGroupByData) return;

  const columns: GridColDef[] = [
    {
      field: "fromAddress",
      headerName: "From",
      flex: 1,
      renderCell: (params) => (
        <div
          className="font-medium text-cyan-400 truncate"
          title={params.value}
        >
          {params.value.slice(0, 6)}...{params.value.slice(-4)}
        </div>
      ),
    },
    {
      field: "toAddress",
      headerName: "To",
      flex: 1,
      renderCell: (params) => (
        <div
          className="font-medium text-cyan-400 truncate"
          title={params.value}
        >
          {params.value.slice(0, 6)}...{params.value.slice(-4)}
        </div>
      ),
    },
    {
      field: "transactionCount",
      headerName: "Transactions",
      width: 130,
      type: "number",
      align: "right",
      headerAlign: "center",
      renderCell: (params) => (
        <div className="font-medium text-cyan-400">{params.value}</div>
      ),
    },
  ];

  const rows = transactionGroupByData.map((item, index) => ({
    id: index,
    fromAddress: item.FromAddress,
    toAddress: item.ToAddress,
    transactionCount: item.TransactionCount,
  }));

  const container = document.querySelector(".grid-container");
  if (!container) return;

  // Clear existing content
  container.innerHTML = "";

  // Create DataGrid
  const gridContainer = document.createElement("div");
  gridContainer.style.height = "100%";
  gridContainer.style.width = "100%";
  container.appendChild(gridContainer);

  // Create root and store it in a variable
  const root = ReactDOM.createRoot(gridContainer);

  // Render the DataGrid
  root.render(
    <DataGrid
      rows={rows}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: { page: 0, pageSize: 25 },
        },
      }}
      pageSizeOptions={[10, 25, 50, 100]}
      disableRowSelectionOnClick
      sx={{
        border: "none",
        "& .MuiDataGrid-cell": {
          borderColor: "rgba(75, 85, 99, 0.2)",
        },
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: "rgba(17, 24, 39, 0.5)",
          borderBottom: "none",
        },
        "& .MuiDataGrid-row": {
          "&:hover": {
            backgroundColor: "rgba(17, 24, 39, 0.4)",
          },
        },
        "& .MuiDataGrid-footerContainer": {
          backgroundColor: "rgba(17, 24, 39, 0.5)",
          borderTop: "none",
        },
        "& .MuiTablePagination-root": {
          color: "rgb(156, 163, 175)",
        },
        "& .MuiDataGrid-columnHeaderTitle": {
          color: "rgb(156, 163, 175)",
          fontWeight: "500",
        },
      }}
    />
  );

  // Return cleanup function
  return () => {
    // Use setTimeout to ensure cleanup happens after current render
    setTimeout(() => {
      root.unmount();
    }, 0);
  };
};

const createNetworkVisualization = (
  svgRef: React.RefObject<SVGSVGElement | null>,
  nodes: TransactionNode[],
  links: TransactionLink[],
  setActiveNode: (node: TransactionNode | null) => void,
  setActiveLink: (link: TransactionLink | null) => void
) => {
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
    .attr("r", (d) => d.transactionCount * 2.5)
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

    // @ts-ignore
    const from = d.source.id;
    // @ts-ignore
    const to = d.target.id;

    tooltip
      .html(
        `
      <div class="space-y-2">
        <div class="font-medium text-cyan-400">${d.type.toUpperCase()}</div>
        <div class="text-sm">
          <div class="flex justify-between">
            <span class="text-gray-400">From:</span>
            <span class="text-gray-200">${from}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">To:</span>
            <span class="text-gray-200">${to}</span>
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
};
