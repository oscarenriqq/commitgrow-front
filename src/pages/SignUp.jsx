import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Box, VStack, Heading, Text } from "@chakra-ui/layout";
import { Button, FormControl, FormErrorMessage, FormLabel, Input, Link, useToast } from "@chakra-ui/react";
import axios from "axios"

function SignUp() {

  const toast = useToast()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm();

  function toastError() {
    return toast({
      title: 'No se pudo crear la cuenta',
      description: "Revisa los datos proporcionados.",
      status: 'error',
      duration: 4000,
      position: 'top',
      isClosable: true,
    })
  }

  function toastSuccess() {
    return toast({
      title: 'Cuenta creada',
      description: "Creaste tu cuenta existoasamente. Inicia sesión para continuar.",
      status: 'success',
      duration: 2000,
      position: 'top',
      isClosable: true,
    })
  }

  function onSubmit(data) {

    const info = {
      name: data.name,
      email: data.email,
      password: data.password
    }

    axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, info)
    .then((res) => {
      reset()

      const response = res.data
      console.log(response)

      toastSuccess()

      setTimeout(() => {
        navigate("/")
      }, 2000)
    })
    .catch((err) => {
      console.log(err.response)
      toastError()
    })
  }

  return (
    <Box
      w={["full", "md"]}
      p={[8, 10]}
      mt={[20, "10vh"]}
      mx="auto"
      border={["none", "1px"]}
      borderColor={["", "gray.300"]}
      borderRadius={10}
    >
      <VStack spacing={4} align="flex-start" w="full">
        <VStack spacing={1} align={["center"]} w={"full"}>
          <Heading>CommitGrow.</Heading>
          <Text>Regístrate en CommitGrow.</Text>
        </VStack>

        <form className="form-login" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <FormControl>
            <FormLabel>Nombre</FormLabel>
            <Input
              rounded={"none"}
              variant={"filled"}
              {...register("name", {
                required: "Este campo es requerido",
              })}
            ></Input>
          </FormControl>
          <FormControl isInvalid={errors.email}>
            <FormLabel>Correo electrónico</FormLabel>
            <Input
              rounded={"none"}
              variant={"filled"}
              {...register("email", {
                required: "Este campo es requerido",
                validate: {
                  matchPattern: (v) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                    "El correo electrónico no es válido",
                },
              })}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.password}>
            <FormLabel>Contraseña</FormLabel>
            <Input
              rounded={"none"}
              variant={"filled"}
              type="password"
              autoComplete="off"
              {...register("password", {
                required: "Este campo es requerido",
                minLength: {
                  value: 6,
                  message: "La contraseña debe tener al menos 6 caracteres",
                },
              })}
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>

          <Button
            rounded={"none"}
            variant={"solid"}
            colorScheme={"teal"}
            w={"full"}
            mt={4}
            isLoading={isSubmitting}
            type="submit"
          >
            Crear cuenta
          </Button>
        </form>
        <Text>
          ¿Ya estás registrado? {" "}
          <Link 
            as={RouterLink}
            to="/"
            color={"teal.500"}
          >
          Inicia Sesión.
          </Link>
        </Text>
      </VStack>
    </Box>
  )
}

export default SignUp