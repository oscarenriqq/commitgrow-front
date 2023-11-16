import {
  FormControl,
  FormLabel,
  Select,
  Input,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  Alert,
  AlertIcon,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text
} from "@chakra-ui/react";
import { Controller, set, useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import useCustomToast from "./utils/useCustomToast.js";
import { colors } from "./utils/config.js";

function AddContractButton({ useFetchContracts, setContracts}) {
  const [tasks, setTasks] = useState()
  const [nextDay, setNextDay] = useState()
  
  const { isOpen, onOpen, onClose } = useDisclosure()

  const showToast = useCustomToast()
  const { token } = useAuth()
  const dateNow = Date.now()

  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm()

  function handleOpenModal() {
    fetch(`${import.meta.env.VITE_API_URL}/todoist/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      if (response.status === 400) {
        setTasks([])
      }

      return response.json()
    })
    .then((data) => {
      setTasks(data)
      onOpen()
    })
  }

  function onSubmit(data) {

    const contract_start_date = new Date(data.start_date)
    const contract_end_date = new Date(data.end_date)    

    const info = {
      task_id: data.task_id,
      habit: data.habit,
      penalty: data.penalty,
      start: contract_start_date.toISOString().slice(0, 10),
      end: contract_end_date.toISOString().slice(0, 10),
      supervisor_name: data.supervisor_name,
      supervisor_email: data.supervisor_email,
    }

    if (info.end < info.start) {
      reset({
        keepValues: true,
        keepDirty: true
      })
      showToast('No se pudo crear el contrato', 'La fecha de inicio debe ser menor a la fecha de finalización.', 'error',5000)
      throw new Error("La fecha de inicio debe ser menor a la fecha de finalización.")
    }

    fetch(`${import.meta.env.VITE_API_URL}/contract`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      mode: "cors",
      body: JSON.stringify(info),
    })
    .then((response) => {
      if (response.status === 400) {
        showToast('No se pudo crear el contrato', 'Solo puede tener un máximo de 3 contratos activos.', 'error')
        throw new Error("No se pudo crear el contrato")
      }
    })
    .then(() => {
      // Actualizar contratos
      useFetchContracts(token, setContracts)

      // Reiniciar formulario
      reset()

      // Cerrar modal
      onClose()

      // Mostrar toast
      showToast('Contrato creado', 'El contrato se creó exitosamente.')
    })
  }

  return (
    <>
      <Button onClick={handleOpenModal} bg={colors.first} w={'100%'} mt={4} color={colors.fourth}>
        Agregar contrato
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>Registro de contrato</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Tarea de todoist</FormLabel>
                {tasks && (
                  <Select
                    {...register("task_id", {
                      required: "Este campo es requerido",
                    })}
                  >
                    <option value={""}>Selecciona una tarea</option>
                    {tasks.map((task) => (
                      <option key={task["task_id"]} value={task["task_id"]}>
                        {task["task_content"]}
                      </option>
                    ))}
                  </Select>
                )}
              </FormControl>
              <FormControl>
                <FormLabel> ¿Qué hábito deseas desarrollar? </FormLabel>
                <Input
                  placeholder="Ej. Leer 30 minutos al día"
                  {...register("habit", {
                    required: "Este campo es requerido",
                  })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>
                  {" "}
                  ¿Qué penalización acordaste con tu supervisor?{" "}
                </FormLabel>
                <Textarea
                  {...register("penalty", {
                    required: "Este campo es requerido",
                  })}
                  placeholder="Ej. Debo pagar $10.00"
                />
              </FormControl>
              <FormControl>
                <FormLabel> ¿Cuándo iniciará el contrato? </FormLabel>
                <Controller
                  control={control}
                  name="start_date"
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      minDate={dateNow}
                      onChange={(date) => {
                        field.onChange(date)
                        // setNextDay(new Date(date.setDate(date.getDate())))
                      }}
                    />
                  )}
                />
              </FormControl>
              <FormControl>
                <FormLabel> ¿Cuándo terminará el contrato? </FormLabel>
                <Controller
                  control={control}
                  name="end_date"
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      minDate={nextDay}
                      onChange={(date) => field.onChange(date)}
                    />
                  )}
                />
              </FormControl>
              <FormControl>
                <FormLabel> ¿Cual es el nombre de tu supervisor? </FormLabel>
                <Input
                  {...register("supervisor_name", {
                    required: "Este campo es requerido",
                  })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>
                  ¿Cuál es el correo electrónico supervisor?
                </FormLabel>
                <Input
                  {...register("supervisor_email", {
                    required: "Este campo es requerido",
                  })}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <VStack>
                <Alert status='warning'>
                  <AlertIcon />
                  <Text fontSize={'xs'}>
                    Al crear el contrato, usted se compromete a cumplir con el mismo sin excepciones hasta la fecha de finalización.
                  </Text>
                </Alert>
                <Button w={'100%'} bg={colors.first} color={colors.fourth} type="submit" isLoading={isSubmitting}>
                  Crear contrato
                </Button>
              </VStack>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddContractButton
