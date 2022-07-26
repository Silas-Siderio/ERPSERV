//chamando a biblioteca express
const express = require('express')
const app = express()

//chamando o banco de dados
const mongoose = require('mongoose')

//Chamando o modelo/classe a ser trabalhada
const tarefa = require('./models/tarefa')

app.use(
  express.urlencoded({
    extended: true,
  }),
)

app.use(express.json())

// rotas de api/ chamada dos verbos
// inserir  tarefa no mongoose / post 
app.post('/tarefa', async (req, res) => {
  const { descricao,finalizada } = req.body

  if (!descricao){

    res.status(422).json({error: "O campo descrição é de preenchimento obrigatório!"})
  }

  const tarefa = {
    descricao,
    finalizada,
  }

  try {
    await tarefa.create(tarefa)

    res.status(201).json({ message: 'Tarefa gravada com sucesso!' })
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

// listar todas tarefas

app.get('/tarefa', async (req, res) => {
  try {
    const people = await tarefa.find()

    res.status(200).json(people)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})


// Listar tarefa pelo id dela

app.get('/tarefa/:id', async (req, res) => {
  const id = req.params.id

  try {
    const tarefa = await tarefa.findOne({ _id: id })

    if (!tarefa) {
      res.status(422).json({ message: 'Tarefa não encontrada!' })
      return
    }

    res.status(200).json(tarefa)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

app.patch('/tarefa/:id', async (req, res) => {
  const id = req.params.id

  const { descricao,  finalizada } = req.body

  const tarefa = {
    descricao,
    finalizada,
  }

  try {
    const updatedtarefa = await tarefa.updateOne({ _id: id }, tarefa)

    if (updatedtarefa.matchedCount === 0) {
      res.status(422).json({ message: 'Tarefa não encontrada!' })
      return
    }

    res.status(200).json(tarefa)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})


// deletando uma tarefa

app.delete('/tarefa/:id', async (req, res) => {
  const id = req.params.id

  const tarefa = await tarefa.findOne({ _id: id })

  if (!tarefa) {
    res.status(422).json({ message: 'Tarefa não localizada!' })
    return
  }

  try {
    await tarefa.deleteOne({ _id: id })

    res.status(200).json({ message: 'Tarefa excluída com sucesso!' })
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

//  teste de chamada de api

app.get('/', (req, res) => {
  res.json({ message: 'Oi Express!' })
})



const dbuser = 'xxx'
const dbpass = encodeURIComponent('xxx')
mongoose
  .connect(

    //string de conexão com o banco
    `mongodb+srv://${dbuser}:${dbpass}@apicluster.36mtwtf.mongodb.net/?retryWrites=true&w=majority`,
    
  )
  .then(() => {
    console.log('Conectou ao banco!')
    app.listen(3000)
  })
  .catch((err) => console.log(err))