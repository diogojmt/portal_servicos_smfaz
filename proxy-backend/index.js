import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Proxy endpoint para a API externa
app.post("/api/apwsretornopertences", async (req, res) => {
  try {
    const response = await axios.post(
      "https://homologacao.abaco.com.br/arapiraca_proj_hml_eagata/servlet/apwsretornopertences",
      req.body,
      {
        headers: req.headers, // repassa headers recebidos
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: "Erro ao conectar ao serviço externo." });
    }
  }
});

// Proxy endpoint para a API de débitos
app.get("/api/apapidebito", async (req, res) => {
  try {
    // Preparar headers para a API externa
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Se existe o header DadosAPI, repassar
    if (req.headers['dadosapi']) {
      headers['DadosAPI'] = req.headers['dadosapi'];
    }

    console.log('Fazendo requisição para API de débitos...');
    console.log('Headers:', headers);
    console.log('Query params:', req.query);

    const response = await axios.get(
      "https://homologacao.abaco.com.br/arapiraca_proj_hml_eagata/servlet/apapidebito",
      {
        headers,
        params: req.query,
      }
    );
    
    console.log('Resposta recebida:', response.status);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Erro na API de débitos:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: "Erro ao conectar ao serviço de débitos." });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Proxy backend rodando na porta ${PORT}`);
});
