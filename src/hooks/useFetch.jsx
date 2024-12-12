import { useState, useEffect } from "react";

export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [config, setConfig] = useState(null);
  const [method, setMethod] = useState(null);
  const [callFetch, setCallFetch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [itemId, setItemId] = useState(null); // Corrigido de 'nul' para 'null'

  const httpConfig = (data, method) => {
    if (method === "POST") {
      setConfig({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      setMethod("POST");
      setCallFetch(true);
    } else if (method === "DELETE") {
      setConfig({
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setMethod("DELETE");
      setItemId(data);
      setCallFetch(true);
    }
  };

  // Fetch inicial (GET)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(url);
        const json = await res.json();
        setData(json);
      } catch (error) {
        setError("Erro ao buscar dados:");
      }
    };
    fetchData();
  }, [url]);

  // Executa requisições POST e DELETE
  useEffect(() => {
    const httpRequest = async () => {
      let json;
      if (callFetch) {
        try {
          setLoading(true);

          if (method === "POST" && config) {
            const res = await fetch(url, config);
            json = await res.json();
            setData((prevData) => [...prevData, json]);
          } else if (method === "DELETE" && itemId) {
            const deleteUrl = `${url}/${itemId}`;
            const res = await fetch(deleteUrl, config);
            json = await res.json();
            // Atualiza a lista removendo o item excluído
            setData((prevData) => prevData.filter((item) => item.id !== itemId));
          }
        } catch (error) {
          console.error("Erro na requisição HTTP:", error);
        } finally {
          setLoading(false);
          setCallFetch(false); // Resetando a flag de chamada
        }
      }
    };
    httpRequest();
  }, [config, method, itemId, callFetch, url]); // Adicionando dependências adequadas

  return { data, setData, httpConfig, loading, error };
};
