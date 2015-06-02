'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Equipamento = mongoose.model('Equipamento'),
	_ = require('lodash');

/**
 * Create a Equipamento
 */
exports.create = function(req, res) {
	var equipamento = new Equipamento(req.body);
	equipamento.user = req.user;

	equipamento.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(equipamento);
		}
	});
};

/**
 * Show the current Equipamento
 */
exports.read = function(req, res) {
	res.jsonp(req.equipamento);
};

/**
 * Update a Equipamento
 */
exports.update = function(req, res) {
	var equipamento = req.equipamento ;

	equipamento = _.extend(equipamento , req.body);

	equipamento.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(equipamento);
		}
	});
};

/**
 * Delete an Equipamento
 */
exports.delete = function(req, res) {
	var equipamento = req.equipamento ;

	equipamento.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(equipamento);
		}
	});
};

/**
 * List of Equipamentos
 */
exports.list = function(req, res) { 
	Equipamento.find().sort('-created').populate('user', 'displayName').exec(function(err, equipamentos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(equipamentos);
		}
	});
};

/**
 * Equipamento middleware
 */
exports.equipamentoByID = function(req, res, next, id) { 
	Equipamento.findById(id).populate('user', 'displayName').exec(function(err, equipamento) {
		if (err) return next(err);
		if (! equipamento) return next(new Error('Failed to load Equipamento ' + id));
		req.equipamento = equipamento ;
		next();
	});
};

/**
 * Equipamento authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.equipamento.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
