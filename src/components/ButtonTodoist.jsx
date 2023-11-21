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
    const { token } = useAuth()

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/todoist/verify-integration`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => {
            const isValid = verifyToken(response)

            if (!isValid)
                navigate('/')
        
            setIsConnected(response.status === 200)
        })
        .catch((err) => {
            console.log(err.message)
            setIsConnected(false)
        })

    }, [])

    function redirectToTodoist() {

        setLockButton(true)

        //generate random string
        const secret_string = Math.random().toString(36);

        const data = {
            'secret_string': secret_string
        }

        fetch(`${import.meta.env.VITE_API_URL}/todoist/authorize`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data)
        })
        .then((res) => {

            const isValid = verifyToken(res)
            if (!isValid)
                navigate('/')
            return res.json()
        })
        .then((data) => {
            console.log(data)
            const url_todoist = data.url
            window.location.href = url_todoist
        })
        .catch((err) => {
            console.log(err)
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