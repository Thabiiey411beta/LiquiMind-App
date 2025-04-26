cat <<EOF > frontend/src/App.jsx
import { useState } from "react";
import { ThirdwebProvider, ConnectButton, useContract, useContractWrite } from "@thirdweb-dev/react";
import "./App.css";

const clientId = import.meta.env.VITE_TEMPLATE_CLIENT_ID;
const chainConfig = {
  chainId: 128,
  rpc: ["https://rpc-testnet.supra.com"],
  nativeCurrency: { name: "Supra", symbol: "SUPRA", decimals: 18 },
};

function App() {
  const [tokenAddress, setTokenAddress] = useState("");
  const [nftAddress, setNftAddress] = useState("");
  const [nftURI, setNftURI] = useState("ipfs://QmZ1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3");

  const { contract: tokenContract } = useContract(tokenAddress, "token");
  const { contract: nftContract } = useContract(nftAddress, "nft");
  const { mutateAsync: mintNFT } = useContractWrite(nftContract, "mintTo");

  const handleMintNFT = async () => {
    try {
      await mintNFT({
        args: ["0xa2525317402889d48AF009E1ae4E5a8baAa6e11c", nftURI],
      });
      alert("NFT minted!");
    } catch (error) {
      console.error(error);
      alert("Minting failed");
    }
  };

  return (
    <ThirdwebProvider clientId={clientId} supportedChains={[chainConfig]}>
      <div className="App">
        <h1>LiquiMind</h1>
        <ConnectButton />
        <div>
          <h2>Manage Contracts</h2>
          <input
            type="text"
            placeholder="Token Contract Address"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
          />
          <input
            type="text"
            placeholder="NFT Contract Address"
            value={nftAddress}
            onChange={(e) => setNftAddress(e.target.value)}
          />
          <input
            type="text"
            placeholder="NFT Metadata URI (IPFS)"
            value={nftURI}
            onChange={(e) => setNftURI(e.target.value)}
          />
          <button onClick={handleMintNFT} disabled={!nftAddress || !nftURI}>
            Mint NFT
          </button>
        </div>
      </div>
    </ThirdwebProvider>
  );
}

export default App;
EOF