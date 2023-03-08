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
  
    const contractAddress = "0xd17DD2B47C5630C3cFCc8481B9F939b2B8CDfF4d";
  
    // The different useStates
    const [owner, setOwner] = useState('');
    const [userAddress, setUserAddress] = useState();
    const [status, setStatus] = useState('');
  
    const [isRegistered, setIsRegistered] = useState(false);
   
  
    const [spinner, setSpinner] = useState(false); // put a spinner while a tx is loading
    
  
    // Main useEffect to fetch events when the user is connected and load appropriate datas :
    useEffect(() => {
      if (isConnected) 
      {
        synchronize();
      }
    }, [address, isConnected])
  
  
    const synchronize = async () => {
      const contractP = new ethers.Contract(contractAddress, Contract.abi, provider); // 'provider' : to read in the BC 
      let owner = await contractP.owner();
      setOwner(owner);
    }

    // Signers functions : 

    const setBaseURI = async (newURIs) => {
      try {
        setSpinner(true);
        const contractS = new ethers.Contract(contractAddress, Contract.abi, signer);
        let tx = await contractS.setBaseURI(newUris);
        await tx.wait();
        synchronize();
        toast({
          duration: 3000,
          title: "Success",
          description: "Uris updated",
          status: "success",
          isClosable: true
        });
      }
      catch(e) {
        let start = e.toString().search("reverted with reason string") + 29
        let end = e.toString().search(`'"`)
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

    const whitelistForPreMint = async (_address) => {
      try {
        setSpinner(true);
        const contractS = new ethers.Contract(contractAddress, Contract.abi, signer);
        let tx = await contractS.whitelistForPreMint(ethers.utils.getAddress(_address));
        await tx.wait();
        synchronize();
        toast({
          duration: 3000,
          title: "Success",
          description: `User ${_address} whitelisted for pre mint`,
          status: "success",
          isClosable: true
        });
      }
      catch(e) {
        let start = e.toString().search("reverted with reason string") + 29
        let end = e.toString().search(`'"`)
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

    const whitelistForFreeMint = async (_address) => {
      try {
        setSpinner(true);
        const contractS = new ethers.Contract(contractAddress, Contract.abi, signer);
        let tx = await contractS.whitelistForPreMint(ethers.utils.getAddress(_address));
        await tx.wait();
        synchronize();
        toast({
          duration: 3000,
          title: "Success",
          description: `User ${_address} whitelisted for free mint`,
          status: "success",
          isClosable: true
        });
      }
      catch(e) {
        let start = e.toString().search("reverted with reason string") + 29
        let end = e.toString().search(`'"`)
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

    const finishPreMintListing = async () => {
      try {
        setSpinner(true);
        const contractS = new ethers.Contract(contractAddress, Contract.abi, signer);
        let tx = await contractS.finishPreMintListing();
        await tx.wait();
        synchronize();
        toast({
          duration: 3000,
          title: "Success",
          description: `Pre mint listing finished.`,
          status: "success",
          isClosable: true
        });
      }
      catch(e) {
        let start = e.toString().search("reverted with reason string") + 29
        let end = e.toString().search(`'"`)
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

    const finishFreeMintListing = async () => {
      try {
        setSpinner(true);
        const contractS = new ethers.Contract(contractAddress, Contract.abi, signer);
        let tx = await contractS.finishPreMintListing();
        await tx.wait();
        synchronize();
        toast({
          duration: 3000,
          title: "Success",
          description: `Free mint listing finished.`,
          status: "success",
          isClosable: true
        });
      }
      catch(e) {
        let start = e.toString().search("reverted with reason string") + 29
        let end = e.toString().search(`'"`)
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

    const preMintGold = async () => {
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

    // const preMintDiamond = async () => {
    //   try {
    //     setSpinner(true);
    //     let price = 5;
    //     const contractS = new ethers.Contract(contractAddress, Contract.abi, signer);
    //     console.log("Test1");
    //     let tx = await contractS.preMintDiamond({value: ethers.utils.parseEther(price.toString())});
    //     console.log("Test2");
    //     await tx.wait();
    //     console.log("Test3");
    //     synchronize();
    //     let contractP = new ethers.Contract(contractAddress, Contract.abi, provider);
    //     let id = await contractP.totalMinted();
    //     let nft = await contractP.tokenURI(id);
    //     console.log("NFT == " + nft);
    //     toast({
    //       duration: 3000,
    //       title: "Success",
    //       description: `You just minted a diamond capsule !`,
    //       status: "success",
    //       isClosable: true
    //     });
    //   }
    //   catch(e) {
    //     let start = e.toString().search("reverted with reason string") + 29
    //     let end = e.toString().search(`'"`)
    //     toast({
    //       duration: 3000,
    //       title: "Error",
    //       description: "Error... " + e.toString().slice(start, end),
    //       status: "error",
    //       isClosable: true
    //     })
    //   }
    //   setSpinner(false);
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
                width="35%" 
                direction="row"
                justifyContent="center"
                alignItems="center" margin="20px 0px"
                padding={4} 
                borderRadius={11}>
                    <Image src={"https://bafybeib3hitmx3c67gmmspls5gm77howirksput6zfuhqeqkyx6tmbvvai.ipfs.nftstorage.link/gold.png"} boxSize='150px' objectFit='cover'/>
                    <Button 
                      marginLeft="24px"
                      isLoading={spinner} 
                      background="#00FFAE" 
                      onClick={() => {preMintGold()}}>
                      Mint gold capsule
                    </Button>
            </Flex>
            <Flex
                border="1px solid black"
                width="35%" 
                direction="row"
                justifyContent="center" 
                alignItems="center" margin="20px 0px" 
                padding={4} 
                borderRadius={11}>
                    <Image src={"https://bafybeib3hitmx3c67gmmspls5gm77howirksput6zfuhqeqkyx6tmbvvai.ipfs.nftstorage.link/diamond.png"} boxSize='150px' objectFit='cover'/>
                    <Button
                      marginLeft="18px"
                      isLoading={spinner} 
                      background="#00FFAE" 
                      onClick={() => {preMintDiamond()}}>
                      Mint diamond capsule
                    </Button>
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