mkdir -p contracts
cat <<EOF > contracts/MindToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@thirdweb-dev/contracts/base/ERC20Base.sol";

contract MindToken is ERC20Base {
    constructor(
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps
    ) ERC20Base(_name, _symbol, _royaltyRecipient, _royaltyBps) {}
}
EOF