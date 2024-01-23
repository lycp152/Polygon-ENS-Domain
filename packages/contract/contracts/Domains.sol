// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

// インポートを忘れずに。
import {StringUtils} from "./libraries/StringUtils.sol";

import "hardhat/console.sol";

contract Domains {
    // トップレベルドメイン(TLD)です。
    string public tld;

    mapping(string => address) public domains;
    mapping(string => string) public records;

    // constructorに"payable"を加えます。
    constructor(string memory _tld) payable {
        tld = _tld;
        console.log("%s name service deployed", _tld);
    }

    // domainの長さにより価格が変わります。
    function price(string calldata name) public pure returns (uint) {
        uint len = StringUtils.strlen(name);
        require(len > 0);
        if (len == 3) {
            // 3文字のドメインの場合 (通常,ドメインは3文字以上とされます。あとのセクションで触れます。)
            return 0.005 * 10 ** 18; // 5 MATIC = 5 000 000 000 000 000 000 (18ケタ).あとでfaucetから少量もらう関係 0.005MATIC。
        } else if (len == 4) {
            //4文字のドメインの場合
            return 0.003 * 10 ** 18; // 0.003MATIC
        } else {
            return 0.001 * 10 ** 18; // 0.001MATIC
        }
    }

    function register(string calldata name) public payable {
        require(domains[name] == address(0));
        uint _price = price(name);

        // トランザクションを処理できる分だけのMATICがあるか確認
        require(msg.value >= _price, "Not enough Matic paid");

        domains[name] = msg.sender;
        console.log("%s has registered a domain!", msg.sender);
    }

    function getAddress(string calldata name) public view returns (address) {
        return domains[name];
    }

    function setRecord(string calldata name, string calldata record) public {
        // トランザクションの送信者であることを確認しています。
        require(domains[name] == msg.sender);
        records[name] = record;
    }

    function getRecord(
        string calldata name
    ) public view returns (string memory) {
        return records[name];
    }
}
