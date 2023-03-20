import { useState, useEffect } from 'react'
import Contract from "../../backend/artifacts/contracts/Mint.sol/Mint"
import { Flex, Text, Input, Button, useToast, Alert, AlertIcon, Image, Box } from '@chakra-ui/react'
import { useAccount, useProvider, useSigner } from 'wagmi'
import { ethers } from 'ethers'
// import goldImg from 'https://bafybeib3hitmx3c67gmmspls5gm77howirksput6zfuhqeqkyx6tmbvvai.ipfs.nftstorage.link/gold.png';
// import diamond from '../public/diamond.png';

export default function Home() {

    // Wagmi
    const { address, isConnected } = useAccount();
    const provider = useProvider();
    const { data: signer } = useSigner();
  
    // from Chakra-UI
    const toast = useToast();
  
    const contractAddress = "0xDAD0d986d27bAdd9E1989C6BE654Cdc07aed86bc";
  
    // The different useStates
    const [owner, setOwner] = useState('');
    const [userAddress, setUserAddress] = useState();
    const [status, setStatus] = useState('');
  
    const [isRegistered, setIsRegistered] = useState(false);


    const [goldsLeft, setGoldsLeft] = useState("");
    const [diamondsLeft, setDiamondsLeft] = useState("");

    const [userGolds, setUserGolds] = useState("");
    const [userDiamonds, setUserDiamonds] = useState("");
   
    const [names, setNames] = useState([]);
    const [images, setImages] = useState([]);
    const [factions, setFactions] = useState([]);
    const [levels, setLevels] = useState([]);

    const [nftIds, setNftIds] = useState([]);
    const [nftIdsStr, setNftIdsStr] = useState([""]);
    // const [Uris, setUris] = useState([]);
    const [nbrNfts, setNbrNfts] = useState();
  

    const [canReveal, setCanReveal] = useState([false, false, false, false, false, false, false]);

    const [newPurchase, setNewPurchase] = useState(false);
    
    const [spinner, setSpinner] = useState(false); // put a spinner while a tx is loading

    
    const getGCLeft = async () => {
      let contractP = new ethers.Contract(contractAddress, Contract.abi, provider);
      let nb = await contractP.getGoldsMinted();
      return (700 - nb);
    }

    const getDCLeft = async () => {
      let contractP = new ethers.Contract(contractAddress, Contract.abi, provider);
      let nb = await contractP.getDiamondsMinted();
      return (300 - nb);
    }

    const getUserG = async () => {
      let contractP = new ethers.Contract(contractAddress, Contract.abi, provider);
      let nb = await contractP.getGoldsLeftToMintForUser({from: address});
      console.log("golddd === " + nb + "addresse : " + address);
      return (nb);
    }
  
    const getUserD = async () => {
      let contractP = new ethers.Contract(contractAddress, Contract.abi, provider);
      let nb = await contractP.getDiamondsLeftToMintForUser({from: address});
      console.log("dimondddd === " + nb);
      return (nb);
    }


    const updateCapsleft = async () => {
      let gold = await getGCLeft();
      setGoldsLeft(gold.toString());
      let diamond = await getDCLeft();
      setDiamondsLeft(diamond.toString());
      let userCapsG = await getUserG();
      setUserGolds(userCapsG.toString());
      let userCapsD = await getUserD();
      setUserDiamonds(userCapsD.toString());
    }
  
    /////////
    /////////
    /////////

    const fetchNftsIds = async () => {
      let contractP = new ethers.Contract(contractAddress, Contract.abi, provider);
      let ids = await contractP.getNftsIdsFromUser({from: address});
      console.log("(fetchNftsIds) typeof ids == " + typeof(ids));
      let nbNfts = await contractP.balanceOf(address);
      setNbrNfts(nbNfts);
      setNftIds(ids);
      let idsStr = [];
      for (let i = 0; i < nbNfts; i++)
      {
        console.log("ids de i = " + ids[i] + "  nb nfts == " + nbNfts);
        idsStr.push(ids[i].toString());
      }
      setNftIdsStr(idsStr);
      console.log("(reveal) nbrNFTs  === " + nbNfts + "ids(var) === " + ids + "   nftIDS == " + nftIds);
    }

    const reveal = async () => {
      let contractP = new ethers.Contract(contractAddress, Contract.abi, provider);
      console.log("(reveal) nb nfts == " + nbrNfts)
      for (let i = 0; i < nbrNfts; i++)
      {
        let id = nftIds[i];
        console.log("(reveal) id == " + id)
        console.log("(reveal) typeof nftIds == " + typeof(nftIds));
        const URI = await contractP.reveal(id, {from: address});
        if (URI)
        {
          // setUris((prevUris) => prevUris.concat(URI));
          const response = await fetch(URI);
          const metadata = await response.json();
          await setNames(prevNames => [...prevNames, metadata.name]);
          await setImages(prevImages => [...prevImages, metadata.image]);
          await setFactions(prevFactions => [...prevFactions, metadata.faction]);
          await setLevels(prevLevels => [...prevLevels, metadata.level]);
          console.log("(reveal) factionMetadata == = == == " + metadata.faction);
        }
      }
      // else {
      //   let timeLeft = await contractP.getRevealTimeLeft(id, {from: address});
      //   let timeLeftStr = timeLeft.toString();
      //   //let timeLeft = 17;
      //   toast({
      //     duration: 3000,
      //     title: "Error",
      //     description: "You must wait" + timeLeftStr + " seconds to reveal this NFT",
      //     status: "error",
      //     isClosable: true
      //   })
      // }
    }

    const logIt = async () => {
      console.log("Log IT : faction == = == == " + factions[0]);
      console.log("Log IT : name == = == == " + names[0]);
      console.log("Log IT : lev == = == == " + levels[0]);
      console.log("Log IT : img == = == == " + images[0]);
      console.log("STOP");
      console.log("Log IT : faction == = == == " + factions[1]);
      console.log("Log IT : name == = == == " + names[1]);
      console.log("Log IT : lev == = == == " + levels[1]);
      console.log("Log IT : img == = == == " + images[1]);
      console.log("STOP");
      console.log("Log IT : faction == = == == " + factions[2]);
      console.log("Log IT : name == = == == " + names[2]);
      console.log("Log IT : lev == = == == " + levels[2]);
      console.log("Log IT : img == = == == " + images[2]);
    }

    useEffect(() => {
      console.log("euuuuh HELLOOOOOOOO ????" + canReveal[0] + "  ids " + nftIds);
      console.log("euuuuh HELLOOOOOOOO ????" + canReveal[1] + "  ids " + nftIds);
      console.log("useEffect can reveal 0")
    })

    useEffect(() => {
      console.log("euuuuh HELLOOOOOOOO ????" + canReveal[0] + "  ids " + nftIds);
      if (canReveal[0])
        console.log("useEffect can reveal 0")
    }, [canReveal])

    useEffect(() => { //test
      if (images)
      {
        console.log("avant");
        logIt();
        console.log("après");
      }
    }, [images])

    useEffect(() => {
      if (nbrNfts >= 1)
      {
        console.log("avant");
        reveal();
        console.log("après");
      }
    }, [nbrNfts, newPurchase, nftIds])

    // Main useEffect to fetch events when the user is connected and load appropriate datas :
    useEffect(() => {
      if (isConnected) 
      {
        synchronize();
        updateCapsleft();
        fetchNftsIds();
      }
    }, [address, isConnected, newPurchase]) // ajouter un usestate en + genre si on buy une caps 
  
  
    const synchronize = async () => {
      const contractP = new ethers.Contract(contractAddress, Contract.abi, provider); // 'provider' : to read in the BC 
      let owner = await contractP.owner();
      setOwner(owner);
    }

    // Signers functions : 
    const preMintGold = async () => {
      setNewPurchase(false);
      try {
        setSpinner(true);
        let price = 1;
        const contractS = new ethers.Contract(contractAddress, Contract.abi, signer);
        let tx = await contractS.preMintGold({value: ethers.utils.parseEther(price.toString())});
        await tx.wait();
        synchronize();
        let contractP = new ethers.Contract(contractAddress, Contract.abi, provider);
        let id = await contractP.totalMinted();
        let nft = await contractP.tokenURI(id);
        console.log("NFT == " + nft);
        setNewPurchase(true);
        toast({
          duration: 3000,
          title: "Success",
          description: `You just minted a gold capsule !`,
          status: "success",
          isClosable: true
        });
      }
      catch(e) {
        let start = e.toString().search("reverted with reason string") + 29
        let end = e.toString().search(`'"`)
        console.log(e);
        toast({
          duration: 3000,
          title: "Error",
          description: "Error... " + e.toString().slice(start, end),
          status: "error",
          isClosable: true
        })
      }
      setSpinner(false);
    }

    const preMintDiamond = async () => {
      setNewPurchase(false);
      try {
        setSpinner(true);
        let price = 5;
        const contractS = new ethers.Contract(contractAddress, Contract.abi, signer);
        let tx = await contractS.preMintDiamond({value: ethers.utils.parseEther(price.toString())});
        await tx.wait();
        synchronize();
        let contractP = new ethers.Contract(contractAddress, Contract.abi, provider);
        let id = await contractP.totalMinted();
        let nft = await contractP.tokenURI(id);
        console.log("NFT == " + nft);
        setNewPurchase(true);
        toast({
          duration: 3000,
          title: "Success",
          description: `You just minted a diamond capsule !`,
          status: "success",
          isClosable: true
        });
      }
      catch(e) {
        let start = e.toString().search("reverted with reason string") + 29
        let end = e.toString().search(`'"`)
        console.log(e);
        toast({
          duration: 3000,
          title: "Error",
          description: "Error... " + e.toString().slice(start, end),
          status: "error",
          isClosable: true
        })
      }
      setSpinner(false);
    }

    const show = async (index) => {
      let rev = canReveal;
      if (images[index])
      {
        rev[index] = true;
      }
      await setCanReveal([...rev]);
      console.log("reveal de index : " + canReveal[index])
    }
    
    // const show = async (index) => {
    //   console.log("images de index = " + images[index]);
    //   let rev = [...canReveal];
    //   if (images[index]) {
    //     rev[index] = true;
    //   }
    //   await setCanReveal(rev, () => {
    //     console.log("reveal de index : " + canReveal[index]);
    //   });
    // }
    

    return (
      <Flex 
          width="100%" 
          direction="column" 
          alignItems="center" 
          flexWrap="wrap">
        {isConnected ?
          <>
              <Flex 
                border="1px solid black"
                width="42%" 
                direction="row"
                justifyContent="center"
                alignItems="center" margin="20px 0px"
                padding={4} 
                borderRadius={11}>
                    <Image src={"https://bafybeib3hitmx3c67gmmspls5gm77howirksput6zfuhqeqkyx6tmbvvai.ipfs.nftstorage.link/gold.png"} boxSize='150px' objectFit='cover'/>
                    <Flex
                    direction="column"
                    justifyContent="center"
                    alignItems="center">
                      <Text>Pre MINT</Text>
                      <Text marginLeft="10px">Total gold Capsules left : {goldsLeft}</Text>
                      <Text>My gold Capsules: {userGolds}/5</Text>
                      <Button 
                        marginLeft="24px"
                        isLoading={spinner} 
                        background="#00FFAE" 
                        onClick={() => {preMintGold()}}>
                        Mint gold capsule for 1 Matic
                      </Button> 
                    </Flex>
            </Flex>
            <Flex
                border="1px solid black"
                width="42%" 
                direction="row"
                justifyContent="center" 
                alignItems="center" margin="20px 0px"
                padding={4}
                borderRadius={11}>
                    <Image src={"https://bafybeib3hitmx3c67gmmspls5gm77howirksput6zfuhqeqkyx6tmbvvai.ipfs.nftstorage.link/diamond.png"} boxSize='150px' objectFit='cover'/>
                    <Flex
                    direction="column"
                    justifyContent="center"
                    alignItems="center">
                      <Text>Pre MINT</Text>
                      <Text marginLeft="10px">Total diamond Capsules left : {diamondsLeft}</Text>
                      <Text>My diamond Capsules: {userDiamonds}/2</Text>
                      <Button 
                        marginLeft="24px"
                        isLoading={spinner} 
                        background="#00FFAE" 
                        onClick={() => {preMintDiamond()}}>
                        Mint diamond capsule for 5 Matic
                      </Button> 
                    </Flex>
            </Flex>
            <Flex
              width="100%"
              justifyContent="center"
              alignItems="center" margin="20px 0px" 
              padding={4} 
              borderRadius={11}>
              <Text fontSize="2xl" fontWeight="bold" mb="2">My Capsules :</Text>
            </Flex>
            <Flex
              width="100%"
              justifyContent="center"
              direction="row"
              alignItems="center" margin="20px 0px" 
              padding={4} 
              borderRadius={11}>
              <Flex
              border="1px solid black"
              direction="column"
              justifyContent="center"
              alignItems="center" margin="15px 15px">
              <Button
                justifyContent="center"
                alignItems="center"
                background="#00FFAE" 
                onClick={() => {show(0)}}>
                Reveal NFT !
              </Button>
                {canReveal[0] ?
                  <>
                    <Image src={images[0]} boxSize='150px' objectFit='cover'/>
                    <Text>HD #{nftIdsStr[0]}</Text>
                    <Text fontWeight="italic" mb="1">Name: {names[0]}</Text>
                    <Text>Faction: {factions[0]}</Text>
                    <Text>Level: {levels[0]}</Text>
                  </>
                  :
                  <>
                    <Image src={"https://bafybeib3hitmx3c67gmmspls5gm77howirksput6zfuhqeqkyx6tmbvvai.ipfs.nftstorage.link/gold.png"} boxSize='150px' objectFit='cover'/>
                    <Text>HD #?</Text>
                    <Text>Name: ?</Text>
                    <Text>Faction: ?</Text>
                    <Text>Level: ?</Text>
                  </>
                } 
              </Flex>
              <Flex
              border="1px solid black"
              direction="column"
              justifyContent="center"
              alignItems="center" margin="15px 15px">
              <Button
                justifyContent="center"
                alignItems="center"
                background="#00FFAE" 
                onClick={() => {show(1)}}>
                Reveal NFT !
              </Button>
                {canReveal[1] ?
                  <>
                    <Image src={images[1]} boxSize='150px' objectFit='cover'/>
                    <Text>HD #{nftIdsStr[1]}</Text>
                    <Text>Name: {names[1]}</Text>
                    <Text>Faction: {factions[1]}</Text>
                    <Text>Level: {levels[1]}</Text>
                  </>
                  :
                  <>
                    <Image src={"https://bafybeib3hitmx3c67gmmspls5gm77howirksput6zfuhqeqkyx6tmbvvai.ipfs.nftstorage.link/gold.png"} boxSize='150px' objectFit='cover'/>
                    <Text>HD #?</Text>
                    <Text>Name: ?</Text>
                    <Text>Faction: ?</Text>
                    <Text>Level: ?</Text>
                  </>
                }
              </Flex>
            </Flex>
            </>
              :
              <Flex 
                  height="100%" 
                  width="100%"
                  alignItems="center"
                  justifyContent="center">
                  <Alert
                      status="warning" 
                      textAlign="center"
                      width="35vw"
                      height="19vh">
                      <AlertIcon />
                      <Flex direction="column">
                      <Text 
                          fontSize="40"
                          as="span">
                          Please connect a wallet...
                      </Text>
                      </Flex>
                  </Alert>
              </Flex>
        }
    
      </Flex >
    
    )
}