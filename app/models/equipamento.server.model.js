'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Equipamento Schema
 */
var RodaSchema = new Schema({
	dureza: {
		type: String,
		default: '',
		trim: true
	},
	//tamanho is fact is diameter (need to put this on the view!)
	tamanho: {
		type: String,
		default: '',
		trim: true
	},
	tipo_bordas: {
		type:String,
		default: '',
		trim: true
	},
	largura: {
		type:String,
		default: '',
		trim: true
	}

});

var ShapeSchema = new Schema({
	tamanho: {
		type: String,
		default: '',
		trim: true
	},
	material: {
		type: String,
		default: '',
		trim: true
	}
});

var TruckSchema = new Schema({
	tamanho: {
		type: String,
		default: '',
		trim: true
	},
	inclinacao: {
		type: String,
		default: '',
		trim: true
	},
	tipo: {
		type: String,
		default: '',
		trim: true
	}
});

var RolamentoSchema = new Schema({
	tipo: {
		type: String,
		default: '',
		trim: true
	}
});

var EquipamentoSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Por favor, preencha o nome do equipamento',
		trim: true
	},
	marca: {
		type: Schema.ObjectId,
		ref: 'Marca'
	},
	roda: [RodaSchema],
	shape: [ShapeSchema],
	rolamento: [RolamentoSchema],
	truck: [TruckSchema],

	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Equipamento', EquipamentoSchema);