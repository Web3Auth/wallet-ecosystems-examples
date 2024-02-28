// WAGMI Libraries
import { WagmiProvider, createConfig, http, useAccount, useConnect, useDisconnect } from "wagmi";
import { coinbaseWallet, walletConnect } from "wagmi/connectors";
import { polygon, optimism, polygonMumbai } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' 
import {MocaverseConnector} from "@web3auth/mocaverse-wagmi-connector";

import { SendTransaction } from "./sendTransaction";
import { SwitchChain } from "./switchNetwork";
import { Balance } from "./balance";
import { SignMessage } from "./signMessage";

import "./App.css";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";

const queryClient = new QueryClient() 

const web3AuthClientId =
  "BANbxuTYFGeYi8HxUzaPQkvQlSAXiKRtUqb1vqsXbsZsZKrNr05PEPCM2J2PhUJZpIYl0XzQa6jxUjnYzSU9LXY";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: `0x${polygon.id.toString(16)}`,
  rpcTarget: polygon.rpcUrls.default.http[0], // This is the public RPC we have added, please pass on your own endpoint while creating an app
  displayName: polygon.name,
  tickerName: polygon.nativeCurrency?.name,
  ticker: polygon.nativeCurrency?.symbol,
  blockExplorerUrl: polygon.blockExplorers?.default.url[0] as string,
  logo: "https://cryptologos.cc/logos/polygon-matic-logo.png",
};

// Set up client
const config = createConfig({
  chains: [polygon, optimism, polygonMumbai],
  transports: {
    [polygon.id]: http(),
    [optimism.id]: http(),
    [polygonMumbai.id]: http(),
  },
  connectors: [
    walletConnect({
      projectId: "3314f39613059cb687432d249f1658d2",
      showQrModal: true, 
    }),
    coinbaseWallet({ appName: 'wagmi' }),
    MocaverseConnector({
      web3AuthClientId,
      web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
      initParams: {
        buildEnv: "testing",
        chainConfig,
        enableLogging: true,
      }
    })
  ],
});

function Profile() {
  const { address, connector, isConnected } = useAccount();
  const { connect, connectors, error } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="main">
        <div className="title">Connected to {connector?.name}</div>
        <div>{address}</div>
        <button className="card" onClick={disconnect as any}>
          Disconnect
        </button>
        <SendTransaction />
        <Balance />
        <SwitchChain />
        <SignMessage />
      </div>
    );
  } else {
    return (
      <div className="main">
        {connectors.map((connector) => {
          return (
            <button className="card" key={connector.id} onClick={() => connect({ connector })}>
              {connector.name}
            </button>
          );
        })}
        {error && <div>{error.message}</div>}
      </div>
    );
  }
}

// Pass client to React Context Provider
function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
      <div className="container">
        <Profile />
      </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
