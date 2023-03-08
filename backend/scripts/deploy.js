const hre = require("hardhat");
const fs = require("fs");

const URIs = [
  "https://bafybeibccnxylyz2ontxgvmjdxr4j7gms4pbcga5d7wfzh4nh64ybigzku.ipfs.nftstorage.link/",
  "https://bafybeibkz5v2exikhpovbdtgi6tm5n2wodmz7u6cm2onire7kxksnw32ia.ipfs.nftstorage.link/",
  "https://bafybeih7aj6nnlqwgq6hxfgdsy7ruoknf7mhhriyquw74jmfdecsfh4koy.ipfs.nftstorage.link/",
  "https://bafybeifutl5qxjddidimcrublfnrqk3rs2bzm2z6goahxypbayuhlxtcna.ipfs.nftstorage.link/",
  "https://bafybeibpagcmqkeoz2o2njuavnl57lwf7y56eid2qre4zvlhbio7555n3m.ipfs.nftstorage.link/",
  "https://bafybeiecvkk7dg4g4ghbl3jy2u5n7xeqsk5cmva2xbniejoomcgrfk4fjy.ipfs.nftstorage.link/"
]

async function main() {

  // Déploiement des contrats
  const Mint = await hre.ethers.getContractFactory("Mint");
  const mint = await Mint.deploy("Human Divergence", "HD", URIs);
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

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// "https://bafybeibccnxylyz2ontxgvmjdxr4j7gms4pbcga5d7wfzh4nh64ybigzku.ipfs.nftstorage.link/, https://bafybeibkz5v2exikhpovbdtgi6tm5n2wodmz7u6cm2onire7kxksnw32ia.ipfs.nftstorage.link/, https://bafybeih7aj6nnlqwgq6hxfgdsy7ruoknf7mhhriyquw74jmfdecsfh4koy.ipfs.nftstorage.link/, https://bafybeifutl5qxjddidimcrublfnrqk3rs2bzm2z6goahxypbayuhlxtcna.ipfs.nftstorage.link/, https://bafybeibpagcmqkeoz2o2njuavnl57lwf7y56eid2qre4zvlhbio7555n3m.ipfs.nftstorage.link/, https://bafybeiecvkk7dg4g4ghbl3jy2u5n7xeqsk5cmva2xbniejoomcgrfk4fjy.ipfs.nftstorage.link/"
