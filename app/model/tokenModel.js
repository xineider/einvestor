var mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
	token:String,
	data_inicio:Date,
	data_fim:Date,
	data_cadastro:Date,
	deletado:Boolean
});

module.exports = mongoose.model('token', tokenSchema,'token');