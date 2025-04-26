cat <<EOF > contracts/MindNFT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@thirdweb-dev/contracts/base/ERC721Base.sol";

contract MindNFT is ERC721Base {
    uint256 private _tokenIdCounter;

    constructor(
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps
    ) ERC721Base(_name, _symbol, _royaltyRecipient, _royaltyBps) {}

    function mintTo(address _to, string memory _tokenURI) public returns (uint256) {
        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;
        _safeMint(_to, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
        return newTokenId;
    }
}
EOF