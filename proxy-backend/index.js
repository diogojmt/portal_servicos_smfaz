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

app.listen(PORT, () => {
  console.log(`Proxy backend rodando na porta ${PORT}`);
});
