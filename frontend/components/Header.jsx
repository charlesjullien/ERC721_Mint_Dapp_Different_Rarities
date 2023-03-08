import Head from 'next/head'
import Link from 'next/link'
import { Flex, Text } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit';

export const Header = ({}) => {
    return (
        <>
            <Head>
                <title>Human Divergence</title>
                <meta name="description" content="Human Divergence Mint" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Flex 
                h="10vh" 
                p="2rem" 
                justifyContent="space-between" 
                alignItems="center">
                    <ConnectButton />
                    <Text 
                        fontWeight={"bold"} 
                        fontSize={19}>
                        Human Divergence Mint
                    </Text>
            </Flex>
        </>
    )
}