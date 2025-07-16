// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./UnwastedMeals.sol";

/// @title FoodRescuePlatform
/// @notice Registra donazioni e minta token UMEALS al donatore
contract FoodRescuePlatform is AccessControl {
    bytes32 public constant DONOR_ROLE = keccak256("DONOR_ROLE");
    UnwastedMeals public immutable token;

    event DonationRecorded(address indexed donor, uint256 kilos, uint256 amountMinted);

    constructor(UnwastedMeals _token) {
        token = _token;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        // opzionale: puoi creare un ruolo DONOR_ROLE per approvare solo utenti registrati
        _grantRole(DONOR_ROLE, msg.sender);
    }

    /// @notice Registra un nuovo donatore (se usi un ruolo)
    function registerDonor(address donor) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(DONOR_ROLE, donor);
    }

    /// @notice Chiama questo metodo dopo aver verificato off-chain la donazione
    /// @param kilos Peso in kg di cibo salvato
    function recordDonation(uint256 kilos)
        external
        onlyRole(DONOR_ROLE)  // o togli il check se chiunque può chiamare
    {
        require(kilos > 0, "Devi specificare almeno 1 kg");
        // calcola quanti token in base ai decimali (18)
        uint256 amount = kilos * (10 ** token.decimals());
        // mint dei token direttamente al chiamante
        token.mint(msg.sender, amount);

        emit DonationRecorded(msg.sender, kilos, amount);
    }
}
