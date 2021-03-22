var mongoose = require('mongoose');

const parametrosAlgoritmoSchema = new mongoose.Schema({
	setup_name:[],
	symbol_name:[],
	b2_mode_1:[]
});

module.exports = mongoose.model('parametros_algoritmo', parametrosAlgoritmoSchema,'parametros_algoritmo');