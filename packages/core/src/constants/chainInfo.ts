import { Address } from "viem";
import { SupportedChainId } from "./chains";

interface Info {
  chainId: string;
  chainName: string;
  label: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrl: string;
  blockExplorerUrl: string;
  WRAPPED_NATIVE_ADDRESS: Address;
}

export const ChainInfo: { [chainId: number]: Info } = {
  [SupportedChainId.MAINNET]: {
    chainId: "0x1",
    chainName: "Ethereum Mainnet",
    label: "Ethereum",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrl: "https://mainnet.infura.io/v3/",
    blockExplorerUrl: "https://etherscan.io",
    WRAPPED_NATIVE_ADDRESS: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  },
  [SupportedChainId.ROPSTEN]: {
    chainId: "0x3",
    chainName: "Ropsten Testnet",
    label: "Ropsten",
    nativeCurrency: {
      name: "Ropsten Ether",
      symbol: "ropETH",
      decimals: 18,
    },
    rpcUrl: "https://ropsten.infura.io/v3/",
    blockExplorerUrl: "https://ropsten.etherscan.io",
    WRAPPED_NATIVE_ADDRESS: "0x",
  },
  [SupportedChainId.RINKEBY]: {
    chainId: "0x4",
    chainName: "Rinkeby Testnet",
    label: "Rinkeby",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrl: "https://rinkeby.infura.io/v3/",
    blockExplorerUrl: "https://rinkeby.etherscan.io",
    WRAPPED_NATIVE_ADDRESS: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
  },
  [SupportedChainId.BSC]: {
    chainId: "0x38",
    chainName: "BNB Smart Chain",
    label: "BNB",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrl: "https://bsc-dataseed1.binance.org",
    blockExplorerUrl: "https://bscscan.com",
    WRAPPED_NATIVE_ADDRESS: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  },
  [SupportedChainId.BSC_TESTNET]: {
    chainId: "0x61",
    chainName: "Binance Smart Chain Testnet",
    label: "Test BSC",
    nativeCurrency: {
      name: "tBNB",
      symbol: "tBNB",
      decimals: 18,
    },
    rpcUrl: "https://bsc-testnet.public.blastapi.io",
    // rpcUrl: 'https://data-seed-prebsc-1-s3.binance.org:8545/',
    blockExplorerUrl: "https://testnet.bscscan.com/",
    WRAPPED_NATIVE_ADDRESS: "0x5b3e2bc1da86ff6235d9ead4504d598cae77dbcb",
  },
  [SupportedChainId.POLYGON]: {
    chainId: "0x89",
    chainName: "Matic Mainnet",
    label: "Polygon",
    nativeCurrency: {
      name: "MATIC",
      symbol: "Matic",
      decimals: 18,
    },
    rpcUrl: "https://polygon-rpc.com",
    blockExplorerUrl: "https://polygonscan.com",
    WRAPPED_NATIVE_ADDRESS: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
  },
  [SupportedChainId.FANTOM]: {
    chainId: "0xfa",
    chainName: "Fantom Opera",
    label: "Fantom",
    nativeCurrency: {
      name: "FTM",
      symbol: "FTM",
      decimals: 18,
    },
    rpcUrl: "https://rpc.ftm.tools",
    blockExplorerUrl: "https://ftmscan.com",
    WRAPPED_NATIVE_ADDRESS: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
  },
  [SupportedChainId.ARBITRUM]: {
    chainId: "0xA4B1",
    chainName: "Arbitrum",
    label: "Arbitrum",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    blockExplorerUrl: "https://arbiscan.io",
    WRAPPED_NATIVE_ADDRESS: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
  },
  [SupportedChainId.BASE]: {
    chainId: "0x2105",
    chainName: "Base",
    label: "Base",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrl: "https://mainnet.base.org",
    blockExplorerUrl: "https://basescan.org/",
    WRAPPED_NATIVE_ADDRESS: "0x4200000000000000000000000000000000000006",
  },
};

/**
 * Overloaded method for returning ChainInfo given a chainID
 * Return type varies depending on input type:
 * number | undefined -> returns ChainInfo | undefined
 * SupportedChainId -> returns L1ChainInfo | L2ChainInfo
 * SupportedL1ChainId -> returns L1ChainInfo
 * SupportedL2ChainId -> returns L2ChainInfo
 */
export function getChainInfo(chainId: any): any {
  if (chainId) {
    return ChainInfo[chainId] ?? undefined;
  }
  return undefined;
}
