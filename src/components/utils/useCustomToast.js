import { useToast } from '@chakra-ui/react'
import { useState } from 'react'

export default function useCustomToast() {
  const toast = useToast()

  const showToast = (title, description, status='success', duration=3000) => {
    toast({
      title: title,
      description: description,
      status: status,
      duration: duration,
      isClosable: true,
    })
  }

  return showToast
}