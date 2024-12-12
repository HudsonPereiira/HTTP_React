import "./App.css";
import { useState } from "react";
import { useFetch } from "./hooks/useFetch";

// URL do endpoint
const url = "http://localhost:3000/products";

function App() {
  const [products, setProducts] = useState([]);
  const {
    data: items,
    setData: setItems,
    httpConfig,
    loading,
    error,
  } = useFetch(url);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  // Função de envio do formulário (adicionar produto)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const product = { name, price };

    // Chamada da função httpConfig para adicionar o produto (POST)
    httpConfig(product, "POST");

    // Limpar os campos após o envio
    setName("");
    setPrice("");
  };

  // Função para remover o produto
  const handleRemove = async (id) => {
    // Chamada da função httpConfig para remover o produto (DELETE)
    httpConfig(id, "DELETE");

    // Remover o item da lista de produtos local
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <div className="App">
      <h1>Lista de Produtos</h1>
      {loading && <p>Carregando dados...</p>}
      {error && <p>{error}</p>}
      <ul>
        {items &&
          items.map((product) => (
            <li key={product.id}>
              {product.name} - R$: {product.price}
              <div class = "button-group">
              <button onClick={() => handleRemove(product.id)}>Excluir</button>
              </div>
              
            </li>
          ))}
      </ul>

      <div className="add-product">
        <form onSubmit={handleSubmit}>
          <label>
            Nome:
            <input
              type="text"
              value={name}
              name="name"
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label>
            Preço:
            <input
              type="number"
              value={price}
              name="price"
              onChange={(e) => setPrice(e.target.value)}
            />
          </label>

          {!loading && <input type="submit" value="Criar" />}
        </form>
      </div>
    </div>
  );
}

export default App;
