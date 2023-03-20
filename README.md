# ERC721_Mint_Dapp_Different_Rarities

Here is a basic minting dapp for whitelisted users

2 types of whitelist : 

pre mint : 1 Matic for a gold capsule and 5 Matics for a diamond one.
free mint : it's all free.

each whitelisted user can have only 5 gold capsules and 2 diamond ones.

in a Gold capsule here is the drop rate :
50% chance of getting the 'Aphrodisia' NFT character.

35% chance of getting the 'Aresio' NFT character.

15% chance of getting the 'Zeosine' NFT character.


in a Diamond capsule here is the drop rate :
35% chance of getting the 'Zeosine' NFT character.

30% chance of getting the 'Urania' NFT character.

17.8% chance of getting the 'Nelkor' NFT character.

17.2% chance of getting the 'Marlavo' NFT character.


I added a functionality so users can reveal their NFT and see the character 100 sec after purchase. (this value can be modified by contract owner).
Something I have to change is the way I store the URI in the contract.
I should rather modify the ERC721 from openzepplin in order to set the getTokenURI
function private or internal. The point is that user sould not be able to see his NFT on opensea before reveal timer. However, as I don't call the 
openzeppelin 'setTokenURI' function (to store it in my own contract), then, openzeppelin cannot see the NFT after reveal time as it's not stored in 
the standard ERC721... 

I'll work it out soon. :-)

Contract and Dapps are functional if you are whitelisted. If you want to test it, please contact me so I whitelist you.

https://mint-hd-demo.vercel.app/
