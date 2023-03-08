// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol"; 
import "@openzeppelin/contracts/access/Ownable.sol";

contract Mint is ERC721URIStorage, Ownable {
     
    using Counters for Counters.Counter;
    Counters.Counter public goldsMinted;
    Counters.Counter public diamondsMinted;
    Counters.Counter public totalMinted;

    using Strings for uint256;

    string internal baseURIVenus;
    string internal baseURIMars_1;
    string internal baseURIJupiter;
    string internal baseURIUranus;
    string internal baseURINeptune;
    string internal baseURIMars_2;

    uint private indexVenus;
    uint private indexMars_1;
    uint private indexJupiterG;
    uint private indexJupiterD;
    uint private indexUranus;
    uint private indexNeptune;
    uint private indexMars_2;

    address payable incAccount;
    uint public balance;

    bool public canWhitelistforPreMint;
    bool public canWhitelistforFreeMint;
    uint public goldCost = 1 ether; // 25 MATIC normally
    uint public diamondCost = 5 ether; // 130 MATIC normally
    uint private nonce;

    struct User {
        uint diamondsBought;
        uint goldsBought;
    }

    mapping (address => User) users;

    mapping (address => bool) canPreMint;
    mapping (address => bool) canFreeMint;
    

    event UserCanPreMint(address userAddress);
    event UserCanFreeMint(address userAddress);

    constructor (string memory _collectionName, string memory _collectionSymbol, string[] memory _baseURIs) ERC721 (_collectionName, _collectionSymbol) {
        setBaseURI(_baseURIs);
        canWhitelistforPreMint = true;
        nonce = 0;
        incAccount = payable(msg.sender);
    }

    modifier preMintAllowed () {
        require (canPreMint[msg.sender], "You are not whitelisted for pre mint");
        _;
    }

    modifier freeMintAllowed () {
        require (canFreeMint[msg.sender], "You are not whitelisted for free mint");
        _;
    }

    function setBaseURI (string[] memory _baseURIs) internal onlyOwner {
        baseURIVenus = _baseURIs[0];
        baseURIMars_1 = _baseURIs[1];
        baseURIJupiter = _baseURIs[2];
        baseURIUranus = _baseURIs[3];
        baseURINeptune = _baseURIs[4];
        baseURIMars_2 = _baseURIs[5];
    }

    function whitelistForPreMint (address _address) external onlyOwner {
        require(canWhitelistforPreMint == true, "pre mint whitelisting phase is over");
        canPreMint[_address] = true;
        emit UserCanPreMint(_address);
    }

    function whitelistForFreeMint (address _address) external onlyOwner {
        require(canWhitelistforFreeMint == true, "free mint whitelisting phase is over");
        canFreeMint[_address] = true;
        emit UserCanFreeMint(_address);
    }

    function finishPreMintListing () external onlyOwner {
        require(canWhitelistforPreMint == true, "pre mint whitelisting phase is over");
        canWhitelistforPreMint = false;
        canWhitelistforFreeMint = true;
    }

    function finishFreeMintListing () external onlyOwner {
        require(canWhitelistforFreeMint == true, "free mint whitelisting phase is over");
        canWhitelistforFreeMint = false;
    }

    function random(uint from, uint to) private returns (uint) {
        uint range = to - from;
        uint randomNumber = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, nonce)));
        nonce++;
        return (randomNumber % range) + from;
    }

    function startMint(uint id, string memory characterURI) internal {
        string memory currentURI = string(abi.encodePacked(characterURI, id.toString(), ".json"));
        _mint(msg.sender, totalMinted._value + 1);
        _setTokenURI(totalMinted._value + 1, currentURI);
        totalMinted.increment();
    }


    function gold() internal {
        uint id = random(1, 100);
        if (id >= 1 && id <= 50)
        {
            if (indexVenus >= 350)
            {
                if (indexMars_1 >= 245)
                {
                    indexJupiterG++;
                    startMint(indexJupiterG, baseURIJupiter);
                }
                indexMars_1++;
                startMint(indexMars_1, baseURIMars_1);
            }
            else
            {
                indexVenus++;
                startMint(indexVenus, baseURIVenus);
            }
        }
        else if (id >= 51 && id <= 85)
        {
            if (indexMars_1 >= 245)
            {
                if (indexVenus >= 350)
                {
                    indexJupiterG++;
                    startMint(indexJupiterG, baseURIJupiter);
                }
                indexVenus++;
                startMint(indexVenus, baseURIVenus);
            }
            else
            {
                indexMars_1++;
                startMint(indexMars_1, baseURIMars_1);
            }
        }
        else if (id >= 86 && id <= 100)
        {
            if (indexJupiterG >= 105)
            {
                if (indexVenus >= 350)
                {
                    indexMars_1++;
                    startMint(indexMars_1, baseURIMars_1);
                }
                indexVenus++;
                startMint(indexVenus, baseURIVenus);
            }
            else
            {
                indexJupiterG++;
                startMint(indexJupiterG, baseURIJupiter);
            }
        }
    }

    function diamond() internal {
        uint id = random(1, 1000);
        if (id >= 1 && id <= 350)
        {
            if (indexJupiterD >= 105)
            {
                if (indexUranus >= 90)
                {
                    if (indexNeptune >= 53)
                    {
                        indexMars_2++;
                        startMint(indexMars_2, baseURIMars_2);
                    }
                    else
                    {
                        indexNeptune++;
                        startMint(indexNeptune, baseURINeptune);
                    }
                }
                else
                {
                    indexUranus++;
                    startMint(indexUranus, baseURIUranus);
                }
            }
            else
            {
                indexJupiterD++;
                startMint(indexJupiterD, baseURIJupiter);
            }
        }
        else if (id >= 351 && id <= 650)
        {
            if (indexUranus >= 90)
            {
                if (indexJupiterD >= 105)
                {
                    if (indexNeptune >= 53)
                    {
                        indexMars_2++;
                        startMint(indexMars_2, baseURIMars_2);
                    }
                    else
                    {
                        indexNeptune++;
                        startMint(indexNeptune, baseURINeptune);
                    }
                }
                else
                {
                    indexJupiterD++;
                    startMint(indexJupiterD, baseURIJupiter);
                }
            }
            else
            {
                indexUranus++;
                startMint(indexUranus, baseURIUranus);
            }
        }
        else if (id >= 651 && id <= 827)
        {
            if (indexNeptune >= 53)
            {
                if (indexJupiterD >= 105)
                {
                    if (indexUranus >= 90)
                    {
                        indexMars_2++;
                        startMint(indexMars_2, baseURIMars_2);
                    }
                    else
                    {
                        indexUranus++;
                        startMint(indexUranus, baseURIUranus);
                    }
                }
                else
                {
                    indexJupiterD++;
                    startMint(indexJupiterD, baseURIJupiter);
                }
            }
            else
            {
                indexNeptune++;
                startMint(indexNeptune, baseURINeptune);
            }
        }
        else if (id >= 828 && id <= 1000)
        {
            if (indexMars_2 >= 52)
            {
                if (indexJupiterD >= 105)
                {
                    if (indexUranus >= 90)
                    {
                        indexNeptune++;
                        startMint(indexNeptune, baseURINeptune);
                    }
                    else
                    {
                        indexUranus++;
                        startMint(indexUranus, baseURIUranus);
                    }
                }
                else
                {
                    indexJupiterD++;
                    startMint(indexJupiterD, baseURIJupiter);
                }
            }
            else
            {
                indexMars_2++;
                startMint(indexMars_2, baseURIMars_2);
            }
        }
    } 

    function preMintGold () external payable preMintAllowed {
        require(users[msg.sender].goldsBought < 5, "You cannot mint anymore gold capsule");
        require(msg.value == goldCost, "Price is 25 Matic");
        require(goldsMinted._value <= 700, "All gold capsules have been minted");
        gold();
        incAccount.transfer(msg.value);
        goldsMinted.increment();
        users[msg.sender].goldsBought++;
    }

    function preMintDiamond () external payable preMintAllowed {
        require(users[msg.sender].diamondsBought < 2, "You cannot mint anymore diamond capsule");
        require(msg.value == diamondCost, "Price is 130 Matic");
        require(diamondsMinted._value <= 300, "All diamond capsules have been minted");
        diamond();
        incAccount.transfer(msg.value);
        diamondsMinted.increment();
        users[msg.sender].goldsBought++;
    }

    function withdrawAll() external onlyOwner {
        address ownr = owner(); 
        payable(ownr).transfer(address(this).balance);
    }
}
