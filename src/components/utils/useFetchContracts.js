import { useNavigate } from "react-router-dom";
import verifyToken from "./verifyToken";

export default function useFetchContracts (token, setContracts) {
    fetch(`${import.meta.env.VITE_API_URL}/contracts`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          'Access-Control-Allow-Origin': 'http://localhost',
        },
      })
        .then((response) => {
          const isValid = verifyToken(response)
          if (!isValid) {
            navigate('/')
          }
          
          return response.json()
        })
        .then((data) => {
          setContracts(data);
        });
}

