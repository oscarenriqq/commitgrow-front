import React, { useState } from 'react'
import Layout from '../../components/Layout'
import ButtonTodoist from '../../components/ButtonTodoist'
import { Container, HStack, Text, Alert, VStack, AlertIcon } from '@chakra-ui/react'
import DeactivateIntegration from '../../components/DeactivateIntegration'
import Contracts from '../../components/Contracts'
import AddContractButton from '../../components/AddContractButton'
import useFetchContracts from '../../components/utils/useFetchContracts'
import { colors } from '../../components/utils/config'

function Profile() {

  const [isConnected, setIsConnected] = useState()
  const [contracts, setContracts] = useState([]);

  return (
    <>
      <Layout />
      <Container p={4} height={'calc(100vh - 48px)'}>
        <VStack h={'100%'} align={'left'} alignContent={'space-between'}>
          <HStack>
            <ButtonTodoist isConnected={isConnected} setIsConnected={setIsConnected} />
            {isConnected && <DeactivateIntegration setIsConnected={setIsConnected} />}
          </HStack>
          {isConnected && 
            <VStack height={'100%'} alignItems={'flex-start'} justifyContent={'space-between'}>
              <Contracts contracts={contracts} setContracts={setContracts} />
              <AddContractButton useFetchContracts={useFetchContracts} setContracts={setContracts} />
            </VStack>
          }
          {!isConnected && <Alert mt={4} status={'error'} borderRadius={4}> <AlertIcon /> Para poder utilizar CommitGrow, necesitas conectar tu cuenta de Todoist.</Alert>}
        </VStack>
      </Container>
    </>
  )
}

export default Profile