export default function useFetchContracts (token, setContracts) {
    fetch(`${import.meta.env.VITE_API_URL}/contracts`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          'Access-Control-Allow-Origin': 'http://localhost',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setContracts(data);
        });
}

