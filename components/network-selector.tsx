import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Network {
  id: string;
  name: string;
  chainId: number;
  icon?: string;
  testnet?: boolean;
}

const networks: Network[] = [
  {
    id: "ethereum",
    name: "Ethereum",
    chainId: 1,
  },
  {
    id: "polygon",
    name: "Polygon",
    chainId: 137,
  },
  {
    id: "arbitrum",
    name: "Arbitrum",
    chainId: 42161,
  },
  {
    id: "optimism",
    name: "Optimism",
    chainId: 10,
  },
  {
    id: "goerli",
    name: "Goerli",
    chainId: 5,
    testnet: true,
  },
];

export function NetworkSelector() {
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(networks[0]);

  const handleNetworkChange = async (network: Network) => {
    // Here you would typically:
    // 1. Switch the network in your Web3 provider
    // 2. Update any relevant state in your app
    setSelectedNetwork(network);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 border-gray-800 bg-black/40 text-gray-300 hover:bg-gray-900 hover:text-cyan-400"
        >
          {selectedNetwork.name}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 border-gray-800 bg-black/90 backdrop-blur-sm"
      >
        {networks.map((network) => (
          <DropdownMenuItem
            key={network.id}
            className="flex items-center justify-between text-gray-300 focus:bg-gray-800 focus:text-cyan-400"
            onClick={() => handleNetworkChange(network)}
          >
            <span className="flex items-center gap-2">
              {network.name}
              {network.testnet && (
                <span className="rounded bg-gray-800 px-1.5 py-0.5 text-xs text-gray-400">
                  Testnet
                </span>
              )}
            </span>
            {selectedNetwork.id === network.id && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
