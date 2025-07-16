// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./UnwastedMeals.sol";

contract FoodRescuePlatform is AccessControl {
    bytes32 public constant DONOR_ROLE = keccak256("DONOR_ROLE");
    UnwastedMeals public token;
    uint256 public totalDonated;

    event Donation(address indexed donor, uint256 quantity);

    constructor(address tokenAddress) {
        token = UnwastedMeals(tokenAddress);
        // Assegna DEFAULT_ADMIN_ROLE e DONOR_ROLE a chi deploya
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(DONOR_ROLE, msg.sender);
    }

    // Solo l'admin può abilitare nuovi donatori
    function grantDonor(address account) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Only admin can grant donors");
        grantRole(DONOR_ROLE, account);
    }

    /*
    // OPTIONAL: permettere a chiunque di auto-registrarsi come donatore
    function registerAsDonor() external {
        _grantRole(DONOR_ROLE, msg.sender);
    }
    */

    function recordDonation(uint256 kilos) external {
        require(hasRole(DONOR_ROLE, msg.sender), "Must have donor role");
        totalDonated += kilos;
        // Emissione di 1 token MEAL per kg donato
        token.mint(msg.sender, kilos * (10 ** token.decimals()));
        emit Donation(msg.sender, kilos);
    }
}