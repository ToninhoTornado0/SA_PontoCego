

const express = require("express")
const app = express()

// Permite que a API receba JSON no corpo da requisição
app.use(express.json()) 

// Classe para representar um ponto dentro da rota
class Ponto {
    constructor(localizacao, estado) {
        this.localizacao = localizacao
        this.estado = estado // pode ser "passou", "chegando", "longe"
    }
}

// Classe que representa uma rota (nome + lista de pontos)
class Rota {
    constructor(arrayPontos, nome) {
        this.arrayPontos = arrayPontos
        this.nome = nome
    }
}

// Banco de dados fake em memória
let rotas = [
    new Rota(
        [
            new Ponto("Rua x", "longe"),
            new Ponto("Rua y", "longe"),
            new Ponto("Rua z", "longe"),
        ],
        "Ariri"
    ),
]

// Função para criar rota
function createRota(nome) {
    const rota = new Rota([], nome)
    rotas.push(rota)
    return rota
}

// Função para adicionar ponto em uma rota existente
function addPontoToRota(idRota, localizacao) {
    if (!rotas[idRota]) throw new Error("Rota não encontrada")
    const ponto = new Ponto(localizacao, "longe")
    rotas[idRota].arrayPontos.push(ponto)
    return ponto
}

// Função para atualizar o estado de um ponto em uma rota
function updatePonto(idRota, idPonto, estado) {
    if (!rotas[idRota]) throw new Error("Rota não encontrada")
    if (!rotas[idRota].arrayPontos[idPonto]) throw new Error("Ponto não encontrado")
    rotas[idRota].arrayPontos[idPonto].estado = estado
    return rotas[idRota].arrayPontos[idPonto]
}

// --- Rotas da API ---

// Listar rotas
app.get("/rotas", (req, res) => {
    res.json(rotas)
})

// Criar rota
app.post("/rotas", (req, res) => {
    const { nome } = req.body
    const rota = createRota(nome)
    res.status(201).json(rota)
})

// Adicionar ponto em uma rota
app.post("/rotas/:idRota/pontos", (req, res) => {
    try {
        const { localizacao } = req.body
        const { idRota } = req.params
        const ponto = addPontoToRota(idRota, localizacao)
        res.status(201).json(ponto)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

// Atualizar estado de um ponto
app.put("/rotas/:idRota/pontos/:idPonto", (req, res) => {
    try {
        const { estado } = req.body
        const { idRota, idPonto } = req.params
        const ponto = updatePonto(idRota, idPonto, estado)
        res.json(ponto)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

// Subir servidor na porta 3000
const PORT = 3000
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})
