import { Container, Box, Flex, Link, Text, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, List, ListItem, ListIcon, useDisclosure, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { colors } from './utils/config'
import { InfoIcon } from '@chakra-ui/icons'

function Layout() {

  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure()

  function handleLogout () {
    localStorage.removeItem('token');
    navigate('/');
  }

  return (
    <>
      <Box w={"100%"} p={3} bg={colors.first} color={colors.fourth}>
        <Container>
          <Flex align={"center"} justify={"space-between"}>
            <Text fontWeight={600}>CommitGrow.</Text>
            <Flex gap={4}>
              <Button        
                bg={colors.third} 
                color={colors.fourth} 
                size={'xs'}
                onClick={onOpen}
              >¿Cómo funciona?</Button>
              <Text fontSize={"sm"}>
                <Link onClick={handleLogout}>Cerrar sesión</Link>
              </Text>
            </Flex>
          </Flex>
        </Container>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading size={'md'}>
              ¿Cómo funciona CommitGrow?
            </Heading>
            </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize={'sm'}>
              CommitGrow es una plataforma que te ayuda a cumplir tus objetivos. En CommitGrow puedes crear contratos digitales
              que te comprometen a cumplir una tarea específica. De lo contrario, deberás cumplir una penalización.
            </Text>
            <Heading size={'sm'} my={4}>¿Cómo creo mis contratos digitales?</Heading>
            <List spacing={4} fontSize={'sm'}>
              <ListItem>
                <ListIcon as={InfoIcon} color={colors.third}/>
                CommitGrow se conecta con tu cuenta de Todoist. Los contratos digitales se basan en tareas creadas en Todoist.
              </ListItem>
              <ListItem>
                <ListIcon as={InfoIcon} color={colors.third} />
                Para poder asociar una tarea con un contrato digital, debe asignarle una etiqueta llamada <strong>commitgrow</strong>.
              </ListItem>
              <ListItem>
                <ListIcon as={InfoIcon} color={colors.third} />
                Configura la tarea de forma recurrente los días que dura el contrato.
              </ListItem>
              <ListItem>
                <ListIcon as={InfoIcon} color={colors.third} />
                Tu supervisor es muy importante. Esta persona será la encargada de verificar que cumplas con tus tareas. Recibirá notificaciones por
                cada día que incumplas con el contrato, hasta la fecha de finalización. Busca a alguien que te ayude a cumplir tus objetivos.
              </ListItem>
            </List>
          </ModalBody>

          <ModalFooter>
            <Button bgColor={colors.third} color={colors.fourth} mr={3} onClick={onClose}>
              Entendido
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Layout;
