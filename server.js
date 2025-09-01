import express from "express";
import dotenv from "dotenv";

import dados from "./src/data/dados.js";

const { bruxos } = dados;
const { varinhas } = dados;
const { pocoes } = dados;
const { animais } = dados;

const app = express();
app.use(express.json());

dotenv.config();
const serverPort = process.env.PORT || 3001;

app.get("/", (req, res) => {
    res.send("🚀 Servidor funcionando...");
})

app.get('/bruxos', (req, res) => {
    const { casa, ano, especialidade, nome } = req.query;
    let resultado = bruxos;
  
    if (casa) {
      resultado = resultado.filter(b => b.casa.toLowerCase() === casa.toLowerCase());
    }
  
    if (ano) {
      resultado = resultado.filter(b => b.ano == ano);
    }
  
    if (especialidade) {
      resultado = resultado.filter(b => b.especialidade.toLowerCase().includes(especialidade.toLowerCase()));
    }
  
    if (nome) {
      resultado = resultado.filter(b => b.nome.toLowerCase().includes(nome.toLowerCase()));
    }
  
    res.status(200).json({
      total: resultado.length,
      data: resultado
    });
});

app.post('/bruxos', (req, res) => {
    const { nome, casa, ano, varinha, mascote, patrono, especialidade, vivo } = req.body;
    
    console.log('Dados recebidos:', req.body);
    
    if (!nome || !casa) {
        return res.status(400).json({
            success: false,
            message: "Nome e casa são obrigatórios para um bruxo!"
        });
    }

    const novoBruxo = {
        id: bruxos.length + 1,
        nome,
        casa: casa,
        ano: parseInt(ano),
        varinha: varinha,
        mascote: mascote,
        patrono: patrono,
        especialidade: especialidade || "Em desenvolvimento",
        vivo: vivo
    };

    bruxos.push(novoBruxo);
    
    res.status(201).json({
        success: true,
        message: "Novo bruxo adicionado a Hogwarts!",
        data: novoBruxo
    });
});


app.get('/varinhas', (req, res) => {
    const { material, nucleo } = req.query;
    let resultado = varinhas;
  
    if (material) {
      resultado = resultado.filter(v => v.material.toLowerCase() === material.toLowerCase());
    }
    if (nucleo) {
      resultado = resultado.filter(v => v.nucleo.toLowerCase() === nucleo.toLowerCase());
    }
  
    res.status(200).json({
      total: resultado.length,
      data: resultado
    });
});

app.post('/varinhas', (req, res) => {
  const { material, nucleo, comprimento } = req.body;
  
  console.log('Dados recebidos:', req.body);
  
  if (!material || !nucleo) {
      return res.status(400).json({
          success: false,
          message: "Material e Nucleo são obrigatórios para obter uma varinha!"
      });
  }

  const novaVarinha = {
      id: varinhas.length + 1,
      comprimento: parseInt(comprimento),
      material: material,
      nucleo: nucleo
  };

  varinhas.push(novaVarinha);
  
  res.status(201).json({
      success: true,
      message: "Nova varinha adicionada a Hogwarts!",
      data: novaVarinha
  });
});


app.get('/pocoes', (req, res) => {
    const { nome, efeito } = req.query;
    let resultado = pocoes;
  
    if (nome) {
      resultado = resultado.filter(p => p.nome.toLowerCase() === nome.toLowerCase());
    }
    if (efeito) {
      resultado = resultado.filter(p => p.efeito.toLowerCase() === efeito.toLowerCase());
    }
  
    res.status(200).json({
      total: resultado.length,
      data: resultado
    });
});

app.get('/animais', (req, res) => {
    const { tipo, nome } = req.query;
    let resultado = animais;
  
    if (nome) {
      resultado = resultado.filter(p => p.nome.toLowerCase() === nome.toLowerCase());
    }
    if (tipo) {
      resultado = resultado.filter(p => p.tipo.toLowerCase() === tipo.toLowerCase());
    }
  
    res.status(200).json({
      total: resultado.length,
      data: resultado
    });
});

app.get("/stats", (req, res) => {
  const {casa} = req.query
  let resultado = bruxos;
  if (casa) {
      resultado = resultado.filter((b) => b.casa.toLowerCase().includes(casa.toLowerCase()));
      
      res.status(200).json({
      bruxos: `${casa} = ${resultado.length}`
  })
  }
 const contagemMateriais = {};
  for (let i = 0; i < varinhas.length; i++) {
      const varinha = varinhas[i];
      const material = varinha.material;
      if (contagemMateriais[material]) {
          contagemMateriais[material]++;
      } else {
          contagemMateriais[material] = 1;
      }
  }
  let materialMaisComum;
  let maxContagem = 0;

  for (const material in contagemMateriais) {
      if (contagemMateriais[material] > maxContagem) {
          maxContagem = contagemMateriais[material];
          materialMaisComum = material;
      }
  }

  if(contagemMateriais) {
      res.status(200).json({
          resultado: `O material mais usado é ${materialMaisComum}`
      })
  }

});
app.listen(serverPort, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${serverPort} 🚀`);
});