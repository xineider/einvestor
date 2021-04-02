var mongoose = require('mongoose');

const usuarioParametrosAlgoritmoSchema = new mongoose.Schema({
	id_usuario:mongoose.Types.ObjectId,
	tipo:String,
	setup_name:[],
	symbol_name:[],
	symbol_hedge_name_2:[],
	magic_number:[],
	max_op_lot_size_1:[],
	max_op_lot_size_2:[],
	number_1_id:[],
	number_2_id:[],
	a1_lot_size_1:[],
	a1_lot_size_2:[],
	a2_mode_1:[],
	a2_mode_2:[],
	b1_measure_1:[],
	b1_measure_2:[],
	b2_distance_1:[],
	b2_distance_2:[],
	deletado:Boolean,
	data_cadastro:Date
});

module.exports = mongoose.model('usuario_parametros_algoritmo', usuarioParametrosAlgoritmoSchema,'usuario_parametros_algoritmo');