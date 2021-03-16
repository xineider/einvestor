var mongoose = require('mongoose');

const regrasAlgoritimoSchema = new mongoose.Schema({
	lucro:Number,
	meses:Number,
	media_ano:Number,
	volatilidade:Number,
	meses_positivos:Number,
	meses_negativos:Number,
	melhor_mes:Number,
	pior_mes:Number,
	data_cadastro:Date,
	deletado:Boolean
});

module.exports = mongoose.model('regras_algoritimo', regrasAlgoritimoSchema,'regras_algoritimo'); 