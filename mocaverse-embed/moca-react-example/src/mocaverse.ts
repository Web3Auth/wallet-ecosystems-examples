import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import MocaEmbed from "@web3auth/mocaverse-embed";

const web3AuthClientId =
  "BANbxuTYFGeYi8HxUzaPQkvQlSAXiKRtUqb1vqsXbsZsZKrNr05PEPCM2J2PhUJZpIYl0XzQa6jxUjnYzSU9LXY"; // get from https://dashboard.web3auth.io

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x89", // hex of 137, polygon mainnet
  rpcTarget: "https://rpc.ankr.com/polygon",
  // Avoid using public rpcTarget in production.
  // Use services like Infura, Quicknode etc
  displayName: "Polygon Mainnet",
  blockExplorerUrl: "https://polygonscan.com",
  ticker: "MATIC",
  tickerName: "MATIC",
  logo: "https://cryptologos.cc/logos/polygon-matic-logo.png",
};

let mocaEmbed: MocaEmbed | null = null;

async function init() {
  if (mocaEmbed) return;
  mocaEmbed = new MocaEmbed({
    web3AuthClientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  });
  await mocaEmbed.init({
    buildEnv: "testing",
    chainConfig,
    enableLogging: true,
    whiteLabel: { mode: "dark" }
  });
}

export { mocaEmbed, init };
