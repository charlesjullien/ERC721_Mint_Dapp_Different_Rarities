import { useState, useEffect } from 'react'
import Contract from "../../backend/artifacts/contracts/Mint.sol/Mint"
import { Flex, Text, Input, Button, useToast, Alert, AlertIcon, Image, Box } from '@chakra-ui/react'
import { useAccount, useProvider, useSigner } from 'wagmi'
import { ethers } from 'ethers'

export default function Home() {

    // Wagmi
    const { address, isConnected } = useAccount();
    const provider = useProvider();
    const { data: signer } = useSigner();
  
    // from Chakra-UI
    const toast = useToast();
  
    const contractAddress = "0x436acD8d2f51C9b6441a76aD4B8C7B0047b50647";
  
    // The different useStates
    const [owner, setOwner] = useState('');
    const [currAddr, setCurrAddr] = useState('');
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
  
    const [isWLPreMint, setisWLpreMint] = useState();
    const [isWLFreeMint, setisWLFreeMint] = useState();

    const [canReveal, setCanReveal] = useState([false, false, false, false, false, false, false]);

    const [newPurchase, setNewPurchase] = useState(false);

    const [currIndex, setCurrIndex] = useState(0);
    
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
      return (nb);
    }
  
    const getUserD = async () => {
      let contractP = new ethers.Contract(contractAddress, Contract.abi, provider);
      let nb = await contractP.getDiamondsLeftToMintForUser({from: address});
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
      let nbNfts = await contractP.balanceOf(address);
      setNbrNfts(nbNfts);
      setNftIds(ids);
      let idsStr = [];
      for (let i = 0; i < nbNfts; i++)
      {
        idsStr.push(ids[i].toString());
      }
      setNftIdsStr(idsStr);
    }

    const show = async (index) => {
      let rev = canReveal;
      if (images[index])
      {
        rev[index] = true;
      }
      await setCanReveal([...rev]);
    }

    ////////////////////////
    ////////////////////////
    ////////////////////////
    ////////////////////////
    ////////////////////////


    const reveal = async (flexIndex) => {
      setCurrIndex(flexIndex);
      let contractP = new ethers.Contract(contractAddress, Contract.abi, provider);
      let contractS = new ethers.Contract(contractAddress, Contract.abi, signer);

      let id = nftIds[flexIndex];

      let URI = "";
      let t = await contractP.getRevealTimeLeft(id, {from: address});
      let ti = t.toString();
      if (ti == "0")
        URI = await contractS.reveal(id, {from: address});//mettre le try/catch icite
      if (URI[0] != 'h' || URI[1] != 't' || !URI)
      {
        let timeLeft = await contractP.getRevealTimeLeft(id, {from: address});
        let timeLeftStr = timeLeft.toString();
        toast({
          duration: 3000,
          title: "Error",
          description: "You must wait " + timeLeftStr + " seconds to reveal this NFT",
          status: "error",
          isClosable: true
        })
        console.log("CATCH == " + timeLeftStr);
      }


      if (URI && !names[flexIndex])
      {
        const response = await fetch(URI);
        const metadata = await response.json();
        await setNames(prevNames => [...prevNames, metadata.name]);
        await setImages(prevImages => [...prevImages, metadata.image]);
        await setFactions(prevFactions => [...prevFactions, metadata.faction]);
        await setLevels(prevLevels => [...prevLevels, metadata.level]);
      }
      setCurrIndex(flexIndex);
      await show(flexIndex);
    }

    useEffect(() => {
      if (canReveal[0])
        console.log("useEffect can reveal 0")
    }, [canReveal, address, isConnected])

    useEffect(() => {
      show(currIndex);
      whitelistPreMint();
    }, [levels, currIndex, address, isConnected])

    useEffect(() => {
      if (isConnected)
      {
        whitelistPreMint();
        whitelistFreeMint();
      }
    }, [isConnected, address])

    // Main useEffect to fetch events when the user is connected and load appropriate datas :
    useEffect(() => {
      if (isConnected) 
      {
        synchronize();
        updateCapsleft();
        fetchNftsIds();
        whitelistPreMint();
      }
    }, [address, isConnected, newPurchase]) // ajouter un usestate en + genre si on buy une caps 
  
  
    const synchronize = async () => {
      const contractP = new ethers.Contract(contractAddress, Contract.abi, provider); // 'provider' : to read in the BC 
      let owner = await contractP.owner();
      setOwner(owner);
      if (address)
      {
        if (currAddr != address)
          setCanReveal([false, false, false, false, false, false, false]);
      }
      setCurrAddr(address);
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
        let start = e.toString().search("execution reverted: ") + 29
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
        let start = e.toString().search("execution reverted: ") + 29
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

    const freeMintGold = async () => {
      setNewPurchase(false);
      try {
        setSpinner(true);
        const contractS = new ethers.Contract(contractAddress, Contract.abi, signer);
        let tx = await contractS.freeMintGold();
        await tx.wait();
        synchronize();
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
        let start = e.toString().search("execution reverted: ") + 29
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

    const freeMintDiamond = async () => {
      setNewPurchase(false);
      try {
        setSpinner(true);
        const contractS = new ethers.Contract(contractAddress, Contract.abi, signer);
        let tx = await contractS.freeMintDiamond();
        await tx.wait();
        synchronize();
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
        let start = e.toString().search("execution reverted: ") + 29
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

    const whitelistPreMint = async () => {
      let contractP = new ethers.Contract(contractAddress, Contract.abi, provider);
      let wl = await contractP.isWhitelistedForPreMint({from: address});
      await setisWLFreeMint(wl);
      console.log("WHITLISTED OU PAS ...???" + isWLFreeMint); 
    }

    const whitelistFreeMint = async () => {
      let contractP = new ethers.Contract(contractAddress, Contract.abi, provider);
      let wl = await contractP.isWhitelistedForFreeMint({from: address});
      await setisWLpreMint(wl);
      console.log("WHITLISTED OU PAS ...???" + isWLPreMint); 
    }


    return (
      <Flex 
          width="100%" 
          direction="column" 
          alignItems="center" 
          flexWrap="wrap">
        {isConnected ?
          <>
              {isWLPreMint ?
                <Text fontWeight="bold">You are whitelisted for Pre Mint</Text>
                :
                <Text fontWeight="bold">You are not whitelisted for Pre Mint</Text>
              }
              {isWLFreeMint ?
                <Text fontWeight="bold">You are whitelisted for Free Mint</Text>
                :
                <Text fontWeight="bold">You are not whitelisted for Free Mint</Text>
              }
              <Flex 
                border="1px solid black"
                width="40%" 
                direction="row"
                justifyContent="center"
                alignItems="center" margin="20px 0px"
                padding={4} 
                borderRadius={11}>
                    <Image src={"https://bafybeib3hitmx3c67gmmspls5gm77howirksput6zfuhqeqkyx6tmbvvai.ipfs.nftstorage.link/gold.png"} boxSize='180px' objectFit='cover'/>
                    <Flex
                    direction="column"
                    justifyContent="center"
                    alignItems="center">
                      <Text fontWeight="bold" marginLeft="10px">Total gold Capsules left : {goldsLeft}</Text>
                      <Text fontWeight="bold">My gold Capsules: {userGolds}/5</Text>
                      <Button 
                        marginLeft="24px"
                        isLoading={spinner} 
                        background="#00FFAE" 
                        onClick={() => {preMintGold()}}>
                        Mint gold capsule for 1 Matic
                      </Button>
                      <Button 
                        marginLeft="24px"
                        marginTop="6px"
                        isLoading={spinner} 
                        background="#00FFAE" 
                        onClick={() => {freeMintGold()}}>
                        Mint gold capsule for free
                      </Button> 
                    </Flex>
            </Flex>
            <Flex
                border="1px solid black"
                width="40%" 
                direction="row"
                justifyContent="center" 
                alignItems="center" margin="20px 0px"
                padding={4}
                borderRadius={11}>
                    <Image src={"https://bafybeib3hitmx3c67gmmspls5gm77howirksput6zfuhqeqkyx6tmbvvai.ipfs.nftstorage.link/diamond.png"} boxSize='180px' objectFit='cover'/>
                    <Flex
                    direction="column"
                    justifyContent="center"
                    alignItems="center">
                      <Text fontWeight="bold" marginLeft="10px">Total diamond Capsules left : {diamondsLeft}</Text>
                      <Text fontWeight="bold">My diamond Capsules: {userDiamonds}/2</Text>
                      <Button 
                        marginLeft="24px"
                        isLoading={spinner} 
                        background="#00FFAE" 
                        onClick={() => {preMintDiamond()}}>
                        Mint diamond capsule for 5 Matic
                      </Button>
                      <Button 
                        marginLeft="24px"
                        marginTop="6px"
                        isLoading={spinner} 
                        background="#00FFAE" 
                        onClick={() => {freeMintDiamond()}}>
                        Mint diamond capsule for free
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
              display="flex"
              flexWrap="wrap"
              width="100%"
              justifyContent="center"
              direction="row"
              alignItems="center" margin="20px 0px" 
              padding={4} 
              borderRadius={11}>
              {nftIdsStr[0] ?
                <Flex
                border="1px solid black"
                borderRadius={11}
                direction="column"
                justifyContent="center"
                alignItems="center" margin="15px 15px">
                <Button
                  width="100%"
                  justifyContent="center"
                  alignItems="center"
                  background="#00FFAE" 
                  onClick={() => {reveal(0)}}>
                  Reveal NFT !
                </Button>
                  {canReveal[0] ?
                    <>
                      <Image src={images[0]} boxSize='180px' objectFit='cover'/>
                      <Text fontWeight="bold">HD #{nftIdsStr[0]}</Text>
                      <Text fontWeight="bold">Faction: {factions[0]}</Text>
                      <Text fontWeight="bold">Name: {names[0]}</Text>
                      <Text fontWeight="bold">Level: {levels[0]}</Text>
                    </>
                    :
                    <>
                      <Image src={"https://bafybeih5caje36xssio7l2eqifbqimybzm33tiui4gkcvlyzkdumlhj7bu.ipfs.nftstorage.link/Logo%20HD%20%20300dpi%20v22%20copie.png"} boxSize='180px' objectFit='cover' maxWidth="100%" height="auto"/>
                      <Text fontWeight="bold">HD #?</Text>
                      <Text fontWeight="bold">Faction: ?</Text>
                      <Text fontWeight="bold">Name: ?</Text>
                      <Text fontWeight="bold">Level: ?</Text>
                    </>
                  } 
                </Flex>
                :
                <></>
              }
              {nftIdsStr[1] ?
                <Flex
                border="1px solid black"
                borderRadius={11}
                direction="column"
                justifyContent="center"
                alignItems="center" margin="15px 15px">
                <Button
                  width="100%"
                  justifyContent="center"
                  alignItems="center"
                  background="#00FFAE" 
                  onClick={() => {reveal(1)}}>
                  Reveal NFT !
                </Button>
                  {canReveal[1] ?
                    <>
                      <Image src={images[1]} boxSize='180px' objectFit='cover'/>
                      <Text fontWeight="bold">HD #{nftIdsStr[1]}</Text>
                      <Text fontWeight="bold">Faction: {factions[1]}</Text>
                      <Text fontWeight="bold">Name: {names[1]}</Text>
                      <Text fontWeight="bold">Level: {levels[1]}</Text>
                    </>
                    :
                    <>
                      <Image src={"https://bafybeih5caje36xssio7l2eqifbqimybzm33tiui4gkcvlyzkdumlhj7bu.ipfs.nftstorage.link/Logo%20HD%20%20300dpi%20v22%20copie.png"} boxSize='180px' objectFit='cover' maxWidth="100%" height="auto"/>
                      <Text fontWeight="bold">HD #?</Text>
                      <Text fontWeight="bold">Faction: ?</Text>
                      <Text fontWeight="bold">Name: ?</Text>
                      <Text fontWeight="bold">Level: ?</Text>
                    </>
                  }
                </Flex>
                :
                <></>
              }
              {nftIdsStr[2] ?
                <Flex
                border="1px solid black"
                borderRadius={11}
                direction="column"
                justifyContent="center"
                alignItems="center" margin="15px 15px">
                <Button
                  width="100%"
                  justifyContent="center"
                  alignItems="center"
                  background="#00FFAE" 
                  onClick={() => {reveal(2)}}>
                  Reveal NFT !
                </Button>
                  {canReveal[2] ?
                    <>
                      <Image src={images[2]} boxSize='180px' objectFit='cover'/>
                      <Text fontWeight="bold">HD #{nftIdsStr[2]}</Text>
                      <Text fontWeight="bold">Faction: {factions[2]}</Text>
                      <Text fontWeight="bold">Name: {names[2]}</Text>
                      <Text fontWeight="bold">Level: {levels[2]}</Text>
                    </>
                    :
                    <>
                      <Image src={"https://bafybeih5caje36xssio7l2eqifbqimybzm33tiui4gkcvlyzkdumlhj7bu.ipfs.nftstorage.link/Logo%20HD%20%20300dpi%20v22%20copie.png"} boxSize='180px' objectFit='cover' maxWidth="100%" height="auto"/>
                      <Text fontWeight="bold">HD #?</Text>
                      <Text fontWeight="bold">Faction: ?</Text>
                      <Text fontWeight="bold">Name: ?</Text>
                      <Text fontWeight="bold">Level: ?</Text>
                    </>
                  }
                </Flex>
                :
                <></>
              }
              {nftIdsStr[3] ?
                <Flex
                border="1px solid black"
                borderRadius={11}
                direction="column"
                justifyContent="center"
                alignItems="center" margin="15px 15px">
                <Button
                  width="100%"
                  justifyContent="center"
                  alignItems="center"
                  background="#00FFAE" 
                  onClick={() => {reveal(3)}}>
                  Reveal NFT !
                </Button>
                  {canReveal[2] ?
                    <>
                      <Image src={images[3]} boxSize='180px' objectFit='cover'/>
                      <Text fontWeight="bold">HD #{nftIdsStr[3]}</Text>
                      <Text fontWeight="bold">Faction: {factions[3]}</Text>
                      <Text fontWeight="bold">Name: {names[3]}</Text>
                      <Text fontWeight="bold">Level: {levels[3]}</Text>
                    </>
                    :
                    <>
                      <Image src={"https://bafybeih5caje36xssio7l2eqifbqimybzm33tiui4gkcvlyzkdumlhj7bu.ipfs.nftstorage.link/Logo%20HD%20%20300dpi%20v22%20copie.png"} boxSize='180px' objectFit='cover' maxWidth="100%" height="auto"/>
                      <Text fontWeight="bold">HD #?</Text>
                      <Text fontWeight="bold">Faction: ?</Text>
                      <Text fontWeight="bold">Name: ?</Text>
                      <Text fontWeight="bold">Level: ?</Text>
                    </>
                  }
                </Flex>
                :
                <></>
              }
              {nftIdsStr[4] ?
                <Flex
                border="1px solid black"
                borderRadius={11}
                direction="column"
                justifyContent="center"
                alignItems="center" margin="15px 15px">
                <Button
                  width="100%"
                  justifyContent="center"
                  alignItems="center"
                  background="#00FFAE" 
                  onClick={() => {reveal(4)}}>
                  Reveal NFT !
                </Button>
                  {canReveal[4] ?
                    <>
                      <Image src={images[4]} boxSize='180px' objectFit='cover'/>
                      <Text fontWeight="bold">HD #{nftIdsStr[4]}</Text>
                      <Text fontWeight="bold">Faction: {factions[4]}</Text>
                      <Text fontWeight="bold">Name: {names[4]}</Text>
                      <Text fontWeight="bold">Level: {levels[4]}</Text>
                    </>
                    :
                    <>
                      <Image src={"https://bafybeih5caje36xssio7l2eqifbqimybzm33tiui4gkcvlyzkdumlhj7bu.ipfs.nftstorage.link/Logo%20HD%20%20300dpi%20v22%20copie.png"} boxSize='180px' objectFit='cover' maxWidth="100%" height="auto"/>
                      <Text fontWeight="bold">HD #?</Text>
                      <Text fontWeight="bold">Faction: ?</Text>
                      <Text fontWeight="bold">Name: ?</Text>
                      <Text fontWeight="bold">Level: ?</Text>
                    </>
                  }
                </Flex>
                :
                <></>
              }
              {nftIdsStr[5] ?
                <Flex
                border="1px solid black"
                borderRadius={11}
                direction="column"
                justifyContent="center"
                alignItems="center" margin="15px 15px">
                <Button
                  width="100%"
                  justifyContent="center"
                  alignItems="center"
                  background="#00FFAE" 
                  onClick={() => {reveal(5)}}>
                  Reveal NFT !
                </Button>
                  {canReveal[2] ?
                    <>
                      <Image src={images[5]} boxSize='180px' objectFit='cover'/>
                      <Text fontWeight="bold">HD #{nftIdsStr[5]}</Text>
                      <Text fontWeight="bold">Faction: {factions[5]}</Text>
                      <Text fontWeight="bold">Name: {names[5]}</Text>
                      <Text fontWeight="bold">Level: {levels[5]}</Text>
                    </>
                    :
                    <>
                      <Image src={"https://bafybeih5caje36xssio7l2eqifbqimybzm33tiui4gkcvlyzkdumlhj7bu.ipfs.nftstorage.link/Logo%20HD%20%20300dpi%20v22%20copie.png"} boxSize='180px' objectFit='cover' maxWidth="100%" height="auto"/>
                      <Text fontWeight="bold">HD #?</Text>
                      <Text fontWeight="bold">Name: ?</Text>
                      <Text fontWeight="bold">Faction: ?</Text>
                      <Text fontWeight="bold">Level: ?</Text>
                    </>
                  }
                </Flex>
                :
                <></>
              }
              {nftIdsStr[6] ?
                <Flex
                border="1px solid black"
                borderRadius={11}
                direction="column"
                justifyContent="center"
                alignItems="center" margin="15px 15px">
                <Button
                  width="100%"
                  justifyContent="center"
                  alignItems="center"
                  background="#00FFAE" 
                  onClick={() => {reveal(6)}}>
                  Reveal NFT !
                </Button>
                  {canReveal[2] ?
                    <>
                      <Image src={images[6]} boxSize='180px' objectFit='cover'/>
                      <Text fontWeight="bold">HD #{nftIdsStr[6]}</Text>
                      <Text fontWeight="bold">Faction: {factions[6]}</Text>
                      <Text fontWeight="bold">Name: {names[6]}</Text>
                      <Text fontWeight="bold">Level: {levels[6]}</Text>
                    </>
                    :
                    <>
                      <Image src={"https://bafybeih5caje36xssio7l2eqifbqimybzm33tiui4gkcvlyzkdumlhj7bu.ipfs.nftstorage.link/Logo%20HD%20%20300dpi%20v22%20copie.png"} boxSize='180px' objectFit='cover' maxWidth="100%" height="auto"/>
                      <Text fontWeight="bold">HD #?</Text>
                      <Text fontWeight="bold">Faction: ?</Text>
                      <Text fontWeight="bold">Name: ?</Text>
                      <Text fontWeight="bold">Level: ?</Text>
                    </>
                  }
                </Flex>
                :
                <></>
              }
              
            </Flex>
            
            </>
              :
              <Flex height="100%" width="100%" alignItems="center" justifyContent="center">
              <Alert status='warning' width="250px" borderRadius={11}>
                <AlertIcon />
                <Flex direction="column">
                  <Text as='span'>Please connect your wallet</Text>
                </Flex>
              </Alert>
            </Flex>
        }
    
      </Flex >
    
    )
}