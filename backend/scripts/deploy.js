const hre = require("hardhat");
const fs = require("fs");

const URIs = [
  "https://bafybeidi64hoyfixwuazwpgasqolnhju6ngtggllgfcepevnswqhwbgqua.ipfs.nftstorage.link/",
  "https://bafybeie3rasqj4gostrwlmszumi5gp2io2weojvpetynsintkemguivvdu.ipfs.nftstorage.link/",
  "https://bafybeie3nvgi4zwg5f3tpviqs2ey4xl3ntpdk2qqgyiz5o3eajcjnnyrle.ipfs.nftstorage.link/",
  "https://bafybeicmeo5go6dv26ddxy4qeca6b6d25aamkw5j7larmdlrjxtohcyc7m.ipfs.nftstorage.link/",
  "https://bafybeiflideamovma6oqeeevqyz4i7dizysji65xifirtdcqnvcqonz4wm.ipfs.nftstorage.link/",
  "https://bafybeibpwcs2y5f6fjuizzd7g7nnnodmdenwipo3t4jvanrdlggrrxc7ui.ipfs.nftstorage.link/"
]

async function main() {

  // Déploiement des contrats
  const Mint = await hre.ethers.getContractFactory("Mint");
  const mint = await Mint.deploy("Differents NFT Rarity", "NDR", URIs);
  await mint.deployed();

  console.log(
    `mint deployed to ${mint.address}`
  );


  
  // Interaction avec le contrat
  const signer = (await hre.ethers.getSigners())[0]; // récupération du premier compte
  const mintContract = new hre.ethers.Contract(mint.address, mint.interface, signer);
  
  console.log("signer = " + signer.address);
  
  var i = 0;
  var nbAddresses = 3;

  //WL for premint + freemint
  var addressesToWhitelist = [
    "0x3A3E5b07cAe317a3718E76437Fb46B0c50235D68",
    "0x1f8255238DDDF0441Fb2dCc5377675122D4Ae484",
    "0xA682C8710213567542CB537C24d1A84126D5D574"
  ];
  var result;

  while (i < nbAddresses)
  {
      result = await mintContract.whitelistForPreMint(addressesToWhitelist[i]); // appel de la fonction whitelistForPreMint
      console.log(`Address ${addressesToWhitelist[i]} whitelisted with transaction hash: ${result.hash}`);
      i++;
  }

  i = 0;
  while (i < nbAddresses)
  {
      result = await mintContract.whitelistForFreeMint(addressesToWhitelist[i]); // appel de la fonction whitelistForFreeMint
      console.log(`Address ${addressesToWhitelist[i]} whitelisted with transaction hash: ${result.hash}`);
      i++;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});