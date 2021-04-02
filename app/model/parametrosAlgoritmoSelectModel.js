var mongoose = require('mongoose');

const parametrosAlgoritmoSelectSchema = new mongoose.Schema({
	mode1:[],
	mode2:[],
	measure:[],
	direction:[],
	action:[],
	time:[],
	filter:[]
});

module.exports = mongoose.model('parametros_algoritmo_select', parametrosAlgoritmoSelectSchema,'parametros_algoritmo_select');