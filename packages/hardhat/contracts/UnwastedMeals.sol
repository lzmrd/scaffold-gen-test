// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title Unwasted Meals Token (UMEALS)
 * @dev ERC20 token that can be minted and burned by accounts with the MINTER_ROLE.
 */
contract UnwastedMeals is ERC20Burnable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /**
     * @dev Grants `DEFAULT_ADMIN_ROLE` and `MINTER_ROLE` to the deployer
     * and sets token name and symbol.
     */
    constructor() ERC20("Unwasted Meals Token", "UMEALS") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    /**
     * @dev Creates `amount` tokens and assigns them to `to`,
     * increasing the total supply.
     * Can only be called by an account with the MINTER_ROLE.
     */
    function mint(address to, uint256 amount) public {
        require(hasRole(MINTER_ROLE, msg.sender), "UnwastedMealsToken: must have minter role to mint");
        _mint(to, amount);
    }
}
