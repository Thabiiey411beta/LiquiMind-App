npm cache clean --force
cd /workspaces/LiquiMind-App/frontend
npm install
import { useState } from "react";
import { ThirdwebProvider, ConnectButton, useContract, useContractWrite, TransactionButton, MediaRenderer, useReadContract, NFTProvider, NFTMedia } from "@thirdweb-dev/react";
import { getContract } from "thirdweb";
import { sepolia, ethereum } from "thirdweb/chains";
import "./App.css";

// Thirdweb client (replace with your client ID)
const THIRDWEB_CLIENT = { clientId: import.meta.env.VITE_TEMPLATE_CLIENT_ID };

// Supra Testnet configuration
const chainConfig = {
  chainId: 128,
  rpc: ["https://rpc-testnet.supra.com"],
  nativeCurrency: { name: "Supra", symbol: "SUPRA", decimals: 18 },
};

// Contracts (update addresses from thirdweb dashboard after deployment)
const twCoinContract = getContract({
  address: "0xACf072b740a23D48ECd302C9052fbeb3813b60a6", // Replace with your MindToken address
  chain: chainConfig,
  client: THIRDWEB_CLIENT,
});

const nftContract = getContract({
  address: "0x8CD193648f5D4E8CD9fD0f8d3865052790A680f6", // Replace with your MindNFT address
  chain: chainConfig,
  client: THIRDWEB_CLIENT,
});

const onChainCryptoPunks = getContract({
  address: "0x16F5A35647D6F03D5D3da7b35409D65ba03aF3B2",
  chain: ethereum,
  client: THIRDWEB_CLIENT,
});

function App() {
  const [tokenAddress, setTokenAddress] = useState("");
  const [nftAddress, setNftAddress] = useState("");
  const [nftURI, setNftURI] = useState("ipfs://QmZ1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3");
  const [receiverAddress, setReceiverAddress] = useState("0xa2525317402889d48AF009E1ae4E5a8baAa6e11c");

  // Read NFT image (CryptoPunks example)
  const { data: punkImage } = useReadContract({
    contract: onChainCryptoPunks,
    method: "function punkImageSvg(uint16 index) view returns (string svg)",
    params: [1],
  });

  // Mint ERC-1155 via API
  const mintErc1155 = async () => {
    const url = `https://your-engine-url/contract/${chainConfig.chainId}/${nftContract.address}/erc1155/mint-to`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: "Bearer ${process.env.THIRDWEB_SECRET_KEY}",
          "Content-Type": "application/json",
          "X-Backend-Wallet-Address": "0xa2525317402889d48AF009E1ae4E5a8baAa6e11c",
        },
        body: JSON.stringify({
          receiver: receiverAddress,
          metadataWithSupply: {
            metadata: {
              name: "LiquiMind Strategy NFT",
              description: "AI-driven trading strategy for ETH/USD",
              image: nftURI,
            },
            supply: "1",
          },
        }),
      });
      const data = await response.json();
      alert(`Mint queued! Queue ID: ${data.queueId}`);
    } catch (error) {
      console.error("Minting failed:", error);
      alert("Minting failed");
    }
  };

  // Claim ERC-20 tokens (MindToken)
  const { mutateAsync: claimTokens } = useContractWrite(twCoinContract, "claimTo");

  // Mint ERC-721 (MindNFT)
  const { mutateAsync: mintNFT } = useContractWrite(nftContract, "mintTo");

  return (
    <ThirdwebProvider clientId={THIRDWEB_CLIENT.clientId} supportedChains={[chainConfig, sepolia, ethereum]}>
      <div className="App">
        <h1>LiquiMind</h1>
        <ConnectButton />

        {/* Mint ERC-721 (MindNFT) */}
        <div>
          <h2>Mint NFT (ERC-721)</h2>
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
          <button onClick={() => mintNFT({ args: [receiverAddress, nftURI] })}>
            Mint NFT
          </button>
        </div>

        {/* Mint ERC-1155 via API */}
        <div>
          <h2>Mint ERC-1155 via API</h2>
          <input
            type="text"
            placeholder="Receiver Address"
            value={receiverAddress}
            onChange={(e) => setReceiverAddress(e.target.value)}
          />
          <button onClick={mintErc1155}>Mint ERC-1155</button>
        </div>

        {/* Claim ERC-20 Tokens (MindToken) */}
        <div>
          <h2>Claim Tokens (ERC-20)</h2>
          <TransactionButton
            transaction={() =>
              claimTokens({
                to: receiverAddress,
                quantity: "10",
              })
            }
          >
            Claim 10 MIND Tokens
          </TransactionButton>
        </div>

        {/* Display CryptoPunks Image */}
        <div>
          <h2>CryptoPunks Image (Token #1)</h2>
          {punkImage ? (
            <MediaRenderer client={THIRDWEB_CLIENT} src={punkImage} />
          ) : (
            <p>Loading Punk image...</p>
          )}
        </div>

        {/* Render NFT Media */}
        <div>
          <h2>NFT Media</h2>
          <NFTProvider tokenId={0n} contract={nftContract}>
            <NFTMedia
              className="h-40 w-40 rounded-md"
              mediaResolver={{
                src: "ipfs://QmeGCqV1mSHTZrvuFzW1XZdCRRGXB6AmSotTqHoxA2xfDo/1.mp4",
                poster: "ipfs://QmeGCqV1mSHTZrvuFzW1XZdCRRGXB6AmSotTqHoxA2xfDo/0.png",
              }}
            />
          </NFTProvider>
        </div>
      </div>
    </ThirdwebProvider>
  );
}

export default App;
