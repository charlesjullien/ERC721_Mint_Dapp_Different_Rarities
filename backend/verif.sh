

MYARR=(https://bafybeibccnxylyz2ontxgvmjdxr4j7gms4pbcga5d7wfzh4nh64ybigzku.ipfs.nftstorage.link/ https://bafybeibkz5v2exikhpovbdtgi6tm5n2wodmz7u6cm2onire7kxksnw32ia.ipfs.nftstorage.link/ https://bafybeih7aj6nnlqwgq6hxfgdsy7ruoknf7mhhriyquw74jmfdecsfh4koy.ipfs.nftstorage.link/ https://bafybeifutl5qxjddidimcrublfnrqk3rs2bzm2z6goahxypbayuhlxtcna.ipfs.nftstorage.link/ https://bafybeibpagcmqkeoz2o2njuavnl57lwf7y56eid2qre4zvlhbio7555n3m.ipfs.nftstorage.link/ https://bafybeiecvkk7dg4g4ghbl3jy2u5n7xeqsk5cmva2xbniejoomcgrfk4fjy.ipfs.nftstorage.link/)
MYARR2="${MYARR[@]}"


echo $MYARR2

yarn hardhat verify --network polygonMumbai 0x415B1B8c5A3080678269c1220d180e7a811F7D2b "Human Divergence" "HD" "$MYARR2"


