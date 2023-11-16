import { useState, useEffect } from "react";
import { List, ListItem, Box, Text, Badge, VStack } from "@chakra-ui/react";
import { CheckCircleIcon, WarningTwoIcon } from "@chakra-ui/icons";
import { useAuth } from "../context/AuthContext";
import ModalContract from "./ModalContract";
import useFetchContracts from "./utils/useFetchContracts";
import { colors } from "./utils/config";

function Contracts({ contracts, setContracts}) {
  const { token } = useAuth();
  const [contractId, setContractId] = useState(null);

  useEffect(() => {
    useFetchContracts(token, setContracts);
  }, []);

  function handleClick(contract_id) {
    setContractId(contract_id);
  }

  const infoContracts = {
    1: {
      text: "Iniciado",
      color: colors.first,
      textColor: colors.fourth
    },
    0: {
      text: "Por iniciar",
      color: colors.third,
      textColor: colors.first
    },
    2: {
      text: "Finalizado",
      color: colors.second,
      textColor: colors.fourth
    }
  }

  return (
    <>
      { contracts.length > 0 && 
        <VStack>
          <Box>
            <Text fontSize="2xl" fontWeight="bold" mt={4} color={colors.first}>
              Contratos de hábitos
            </Text>
            <List spacing={3} mt={4}>
              {contracts.map((contract) => {
                const data = infoContracts[contract.status];
                return (
                  <ListItem key={contract.id} my={4}>
                    {/* <ListIcon as={data.icon} color={data.color} /> */}
                    <Text
                      display={"inline-block"}
                      onClick={() => handleClick(contract.id)}
                      color={colors.first}
                      fontWeight={600}
                    >
                      <Badge fontSize={'xx-small'} ml={2} bg={data.color} color={data.textColor}>
                        {data.text}
                      </Badge>
                      {" "}
                      {contract.habit}
                    </Text>
                  </ListItem>
                );
              })}
            </List>
          </Box>

        </VStack>
      }
      { contracts.length === 0 && <Text fontSize="2xl" fontWeight="bold" mt={4} color={colors.first}>No tienes contratos de hábitos</Text> }

      { contractId && <ModalContract contractId={contractId} setContractId={setContractId} setContracts={setContracts} useFetchContracts={useFetchContracts} /> }
      
    </>
  );
}

export default Contracts;
