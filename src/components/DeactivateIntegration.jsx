import { Button } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import React from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { colors } from './utils/config'
import verifyToken from "./utils/verifyToken";
import { useNavigate } from "react-router-dom";

function DeactivateIntegration({ setIsConnected }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const { token } = useAuth();

  const navigate = useNavigate()

  function deactivateIntegration() {
    axios
      .delete(
        `${import.meta.env.VITE_API_URL}/todoist/deactivate-integration`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        const isValid = verifyToken(response)

        if (!isValid)
          navigate('/')

        onClose();
        setIsConnected(false)
      })
      .catch((err) => {
        throw new Error(err);
      })
      .finally(() => {
        showToast('Integración desactivada', 'La integración con Todoist se ha desactivado correctamente')
      })
  }

  return (
    <>
      <Button bg={colors.second} onClick={onOpen}>
        <DeleteIcon color={colors.fourth}/>
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        size={"xs"}
      >
        <AlertDialogOverlay>
          <AlertDialogContent
            bg={colors.fourth}
            color={colors.first}
          >
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Desactivar integración con Todoist
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Estás seguro de que quieres desactivar la integración con
              Todoist?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} bg={colors.third} color={colors.first}>
                Cancelar
              </Button>
              <Button bg={colors.first} color={colors.fourth} onClick={deactivateIntegration} ml={3}>
                Desactivar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default DeactivateIntegration;
