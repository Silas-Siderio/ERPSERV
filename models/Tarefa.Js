const mongoose = require('mongoose')

const Person = mongoose.model('Tarefa', {
  descricao: String,
  finalizada: Boolean,
})
//
module.exports = Tarefa