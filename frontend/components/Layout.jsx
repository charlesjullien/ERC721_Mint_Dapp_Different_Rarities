import { Flex } from '@chakra-ui/react'
import { Header } from "./Header";
import { Footer } from "./Footer";

export const Layout = ({ children }) => {
    return (
        <Flex 
            direction="column"
            minHeight="100vh"
            background="linear-gradient(90deg, rgba(252,252,252,1) 0%, rgba(230,53,119,1) 53%, rgba(250,221,221,1) 100%)">
                <Header />
                <Flex flexGrow="1" p="2rem">
                    {children}
                </Flex>
                <Footer />
        </Flex>
    )
}

