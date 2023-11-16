import React, { useEffect, useState } from "react";
import {
    Box,
    Alert,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Spinner,
    Text,
    AlertIcon,
    HStack,
    VStack,
    FormControl,
    Input,
    FormLabel
} from "@chakra-ui/react";
import { CalendarIcon, ArrowForwardIcon } from '@chakra-ui/icons'

import { useAuth } from "../context/AuthContext";
import { colors } from "./utils/config";

function ModalContract({ contractId, setContractId, setContracts, useFetchContracts }) {
    const [contract, setContract] = useState([]);
    const [loading, setLoading] = useState(true);
    const [streakColor, setStreakColor] = useState('green.500')
    const [compliancePercentage, setCompliancePercentage] = useState(0)
    const [btnDisabled, setBtnDisabled] = useState(true)
    const [badPerformance, setBadPerformance] = useState(false)
    const [inputDelete, setInputDelete] = useState('')
    const [habitName, setHabitName] = useState('')

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { token } = useAuth();

    useEffect(() => {
        if (inputDelete === habitName) {
            setBtnDisabled(false)
        } else {
            setBtnDisabled(true)
        }
    }, [inputDelete])

    useEffect(() => {
        if (contractId) {

            fetch(`${import.meta.env.VITE_API_URL}/contract/${contractId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => response.json())
            .then((data) => {
                setContract(data);
                setLoading(false)

                setHabitName(data.habit)
                setBtnDisabled(true)

            });

        onOpen()
        }
    }, [contractId]);

    function handleDeleteContract() {
        fetch(`${import.meta.env.VITE_API_URL}/contract/${contractId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => response.json())
        .then((data) => {
            useFetchContracts(token, setContracts)
            handleClose()
        });
    }

    function handleClose() {
        setContractId(null)
        setContract([])
        setLoading(true)
        onClose()
    }

    function handleInputDelete(value) {
        const newLetter = value.target.value
        setInputDelete(newLetter)
    }

  return (
    <>
        <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
           { loading &&  <Spinner mt={4} mx={'auto'} /> }
           { !loading && 
            <React.Fragment>
                <ModalHeader>Contrato del hábito { contract.habit }</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <HStack alignItems={'flex-end'} justifyContent={'center'}>
                        <Text fontSize={'4xl'} fontWeight={700}>{ contract.days_left }</Text>
                        <Text mb={2}> Días restantes </Text>
                    </HStack>
                    <VStack>
                        <HStack fontSize={'xs'} alignItems={'center'} justifyContent={'center'}>
                            <CalendarIcon />
                            <Text> { contract.start } </Text>
                            <ArrowForwardIcon />
                            <Text> { contract.end } </Text>
                        </HStack>   
                        { contract.status === 0 && <Text fontSize={'small'} fontWeight={700}>No ha iniciado.</Text> }
                        { contract.status === 2 && <Text fontSize={'small'} fontWeight={700}>Contrato finalizado.</Text> }
                    </VStack>

                    <Alert fontSize={'sm'} borderRadius={4} mt={6} status="error">
                        <AlertIcon />
                        <Box>
                            <Text>
                                <strong>Recuerda: </strong>
                                De no cumplir con el contrato, declaraste cumplir con esta multa:
                            </Text> 
                            <Text mt={2}>
                                { contract.penalty }
                            </Text>
                        </Box>
                    </Alert>

                    {/* <VStack mt={4} alignItems={'flex-start'}>
                        <HStack>
                            <Text>Rendimiento</Text>
                            <HStack gap={0} fontWeight={700}>
                                <Text color={streakColor}>{ contract.streaks.length }</Text>
                                <Text>/{ contract.days_passed } días</Text>
                            </HStack>
                        </HStack>
                        <HStack>
                            <Text>Porcentaje de cumplimiento</Text>
                            <HStack fontWeight={700}>
                                <Text color={streakColor}>{ compliancePercentage }%</Text>
                            </HStack>
                        </HStack>
                        <VStack>
                            {
                                contract.is_completed == 0 && 
                                <Alert fontSize={'sm'} borderRadius={4} status={ badPerformance ? "error" : "success" }>
                                    <AlertIcon />
                                    <Box>
                                        {
                                            badPerformance ? 
                                            <Text>
                                                <strong>Recuerda: </strong>
                                                De no cumplir con el contrato, declaraste cumplir con esta multa:
                                            </Text> :
                                            <Text>
                                            <strong>¡Felicidades! </strong>
                                                De cumplir con el contrato, no tendrás que pagar la siguiente multa:
                                            </Text>
                                        }
                                        <Text mt={2}>
                                            { contract.penalty }
                                        </Text>
                                    </Box>
                                </Alert>
                            }
                        </VStack>
                    </VStack> */}

                </ModalBody>
                <ModalFooter justifyContent={'space-around'} alignItems={'flex-end'} mt={4} gap={2}>
                        <FormControl>
                            <FormLabel fontSize={'sm'}>¿Quieres eliminar este contrato? <Text mt={2} fontWeight={'normal'}>Escribe <i>{habitName}</i> para continuar</Text> </FormLabel>
                            <Input name="delete" value={inputDelete} onInput={handleInputDelete} placeholder={`Escribe ${habitName}`} />
                        </FormControl>
                        <Button isDisabled={btnDisabled} bg={colors.second} color={colors.fourth} onClick={handleDeleteContract}>
                            Eliminar
                        </Button>
                </ModalFooter>
            </React.Fragment> 
           }
        </ModalContent>
        </Modal>
    
    </>
  );
}

export default ModalContract;
