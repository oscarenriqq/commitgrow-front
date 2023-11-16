import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Box, VStack, Heading, Text } from "@chakra-ui/layout";
import { Button, FormControl, FormErrorMessage, FormLabel, Input, Link, useToast } from "@chakra-ui/react";
import axios from "axios"
import qs from 'qs'

import { useAuth } from "../context/AuthContext";

function Login() {

  const { login } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  function toastError(title, description) {
    return toast({
      title: title,
      description: description,
      status: 'error',
      duration: 4000,
      position: 'top',
      isClosable: true,
    })
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  function onSubmit(data) {

    const info = qs.stringify({
      username: data.email,
      password: data.password
    })

    axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, info)
    .then((res) => {
      const token = res.data.access_token
      const user_id = res.data.user_id

      localStorage.setItem('token', token);
      localStorage.setItem('user_id', user_id);

      login(token, user_id)
      navigate("/profile")
    })
    .catch((err) => {
      toastError("Ha ocurrio un error", err.message)
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
          <Text> Inicia sesión para continuar.</Text>
        </VStack>

        <form className="form-login" onSubmit={handleSubmit(onSubmit)}>
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
            Iniciar sesión
          </Button>
        </form>
        <Text>
          ¿No tienes cuenta? {" "}
          <Link 
            as={RouterLink}
            to="/signup"
            color={"teal.500"}
          >
          Regístrate.
          </Link>
        </Text>
      </VStack>
    </Box>
  );
}

export default Login;
