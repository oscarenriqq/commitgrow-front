import { useEffect, useState } from 'react'
import { Button, useToast } from '@chakra-ui/react'

import { useAuth } from '../context/AuthContext';
import useCustomToast from "./utils/useCustomToast.js";

import { colors } from './utils/config'
import verifyToken from './utils/verifyToken.js';
import { useNavigate } from 'react-router-dom';

function ButtonTodoist({ isConnected, setIsConnected }) {

    const [lockButton, setLockButton] = useState(false)
    const toast = useToast()
    const navigate = useNavigate()

    const showToast = useCustomToast()

    useEffect(() => {
        fetch({
            url: `${import.meta.env.VITE_API_URL}/todoist/verify-integration`,
            method: 'get',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((res) => {
            const isValid = verifyToken(res)
            if (!isValid)
                navigate('/')
        
            setIsConnected(true)
        })
        .catch((err) => {
            console.log(err.response.data)
            setIsConnected(false)
        })

    }, [])

    const { token } = useAuth()

    function redirectToTodoist() {

        setLockButton(true)

        //generate random string
        const secret_string = Math.random().toString(36);

        const data = {
            'secret_string': secret_string
        }

        fetch({
            url: `${import.meta.env.VITE_API_URL}/todoist/authorize`,
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: data
        })
        .then((res) => {

            const isValid = verifyToken(res)
            if (!isValid)
                navigate('/')

            const url_todoist = res.data.url
            window.location.href = url_todoist
        })
        .catch((err) => {
            if (err.response.status === 400) {
                showToast('Conexión Todoist', 'Ya existe una conexión con Todoist', 'warning')
            }
        })

        setLockButton(false)

    }

    const bgColor = isConnected ? colors.second : colors.third
    const text = isConnected ? 'Conectado con Todoist' : 'Conectar con Todoist'

  return (
    <Button 
        pointerEvents={lockButton ? 'none' : ''} 
        opacity={lockButton ? '0.4' : ''} 
        bg={colors.second} 
        color={colors.fourth} 
        w={'100%'} 
        onClick={redirectToTodoist}
    >
        {text}
    </Button>
  )
}

export default ButtonTodoist