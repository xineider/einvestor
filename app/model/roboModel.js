var mongoose = require('mongoose');

const roboSchema = new mongoose.Schema({
	_id:mongoose.Types.ObjectId,
	valor:Number,
	nome:String,
	preco:Number,
	multiplicador:Number,
	valor_minimo:Number,
	link_pagamento:String,
	link_update:String
});

module.exports = mongoose.model('robo', roboSchema,'robo'); 