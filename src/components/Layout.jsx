import { Container, Box, Flex, Link, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { colors } from './utils/config'

function Layout() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  }

  return (
    <Box w={"100%"} p={3} bg={colors.first} color={colors.fourth}>
      <Container>
        <Flex align={"center"} justify={"space-between"}>
          <Text fontWeight={600}>CommitGrow.</Text>
          <Text fontSize={"sm"}>
            <Link onClick={handleLogout}>Cerrar sesión</Link>
          </Text>
        </Flex>
      </Container>
    </Box>
  );
}

export default Layout;
