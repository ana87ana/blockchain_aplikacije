// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

interface I_app_klub_mladih_Token {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /// Uloga: bilo tko moze procitati; SPEC: K1.
    function name() external view returns (string memory);

    /// Uloga: bilo tko moze procitati; SPEC: K1.
    function symbol() external view returns (string memory);

    /// Uloga: bilo tko moze procitati; SPEC: K1.
    function decimals() external view returns (uint8);

    /// Uloga: bilo tko moze procitati; SPEC: K2, K9, K10.
    function totalSupply() external view returns (uint256);

    /// Uloga: bilo tko moze procitati; SPEC: model podataka na lancu.
    function balanceOf(address account) external view returns (uint256);

    /// Uloga: vlasnik tokena; SPEC: K6, K7, K8.
    function transfer(address to, uint256 amount) external returns (bool);

    /// Uloga: bilo tko moze procitati; SPEC: ERC-20 API.
    function allowance(address owner, address spender) external view returns (uint256);

    /// Uloga: vlasnik tokena; SPEC: ERC-20 API.
    function approve(address spender, uint256 value) external returns (bool);

    /// Uloga: potrosac kojemu je odobrena kolicina; SPEC: ERC-20 API.
    function transferFrom(address from, address to, uint256 value) external returns (bool);

    /// Uloga: samo administrator; SPEC: prijenos uz prethodno zasebno odobrenje.
    function odobriPrijenos(address posiljatelj, address primatelj, uint256 kolicina) external;

    /// Uloga: bilo tko moze procitati; SPEC: Odluke o tokenu (administratorski novcanik).
    function administrator() external view returns (address);

    /// Uloga: samo administrator; SPEC: K4, K9.
    function dodijeliZTN(address primatelj, uint256 kolicina) external;
}

// Funkcije nisu deklarirane jer ulazi i pravila predlaganja i glasanja nisu definirani.
interface I_app_klub_mladih_Modul {}

contract AppKlubMladihToken is ERC20, Ownable, I_app_klub_mladih_Token {
    mapping(address posiljatelj => mapping(address primatelj => mapping(uint256 kolicina => bool odobreno)))
        private _odobreniPrijenosi;

    constructor() ERC20(unicode"Žeton", "ZTN") Ownable(msg.sender) {}

    /// Uloga: bilo tko moze procitati; SPEC: K1.
    function name() public view override(ERC20, I_app_klub_mladih_Token) returns (string memory) {
        return super.name();
    }

    /// Uloga: bilo tko moze procitati; SPEC: K1.
    function symbol() public view override(ERC20, I_app_klub_mladih_Token) returns (string memory) {
        return super.symbol();
    }

    /// Uloga: bilo tko moze procitati; SPEC: K1.
    function decimals() public pure override(ERC20, I_app_klub_mladih_Token) returns (uint8) {
        return 3;
    }

    /// Uloga: bilo tko moze procitati; SPEC: K2, K9, K10.
    function totalSupply()
        public
        view
        override(ERC20, I_app_klub_mladih_Token)
        returns (uint256)
    {
        return super.totalSupply();
    }

    /// Uloga: bilo tko moze procitati; SPEC: model podataka na lancu.
    function balanceOf(address account)
        public
        view
        override(ERC20, I_app_klub_mladih_Token)
        returns (uint256)
    {
        return super.balanceOf(account);
    }

    /// Uloga: bilo tko moze procitati; SPEC: ERC-20 API.
    function allowance(address account, address spender)
        public
        view
        override(ERC20, I_app_klub_mladih_Token)
        returns (uint256)
    {
        return super.allowance(account, spender);
    }

    /// Uloga: vlasnik tokena; SPEC: K6, K7, K8.
    function transfer(address to, uint256 value)
        public
        override(ERC20, I_app_klub_mladih_Token)
        returns (bool)
    {
        return super.transfer(to, value);
    }

    /// Uloga: vlasnik tokena; SPEC: ERC-20 API.
    function approve(address spender, uint256 value)
        public
        override(ERC20, I_app_klub_mladih_Token)
        returns (bool)
    {
        return super.approve(spender, value);
    }

    /// Uloga: potrosac kojemu je odobrena kolicina; SPEC: ERC-20 API.
    function transferFrom(address from, address to, uint256 value)
        public
        override(ERC20, I_app_klub_mladih_Token)
        returns (bool)
    {
        return super.transferFrom(from, to, value);
    }

    /// Uloga: bilo tko moze procitati; SPEC: administratorski novcanik.
    function administrator() external view override returns (address) {
        return owner();
    }

    /// Uloga: samo administrator; SPEC: K5.
    function odobriPrijenos(address posiljatelj, address primatelj, uint256 kolicina) external override {
        require(msg.sender == owner(), "Samo administrator moze odobriti prijenos ZTN-a.");
        if (kolicina == 0) revert();
        _odobreniPrijenosi[posiljatelj][primatelj][kolicina] = true;
    }

    /// Uloga: samo administrator; SPEC: K4, K9.
    function dodijeliZTN(address primatelj, uint256 kolicina) external override {
        require(msg.sender == owner(), "Samo administrator moze dodijeliti ZTN.");
        if (kolicina == 0) revert();
        _mint(primatelj, kolicina);
    }

    function _update(address from, address to, uint256 value) internal override {
        if (value == 0) revert();

        if (from != address(0) && to != address(0)) {
            require(_odobreniPrijenosi[from][to][value], "Prijenos ZTN-a nije odobren.");
            require(balanceOf(from) >= value, "Nedovoljno ZTN-a za prijenos.");
            delete _odobreniPrijenosi[from][to][value];
        }

        super._update(from, to, value);
    }
}
