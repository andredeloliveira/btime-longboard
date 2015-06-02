'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Marca = mongoose.model('Marca'),
	_ = require('lodash');

/**
 * Create a Marca
 */
exports.create = function(req, res) {
	var marca = new Marca(req.body);
	marca.user = req.user;

	marca.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(marca);
		}
	});
};

/**
 * Show the current Marca
 */
exports.read = function(req, res) {
	res.jsonp(req.marca);
};

/**
 * Update a Marca
 */
exports.update = function(req, res) {
	var marca = req.marca ;

	marca = _.extend(marca , req.body);

	marca.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(marca);
		}
	});
};

/**
 * Delete an Marca
 */
exports.delete = function(req, res) {
	var marca = req.marca ;

	marca.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(marca);
		}
	});
};

/**
 * List of Marcas
 */
exports.list = function(req, res) { 
	Marca.find().sort('-created').populate('user', 'displayName').exec(function(err, marcas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(marcas);
		}
	});
};

/**
 * Marca middleware
 */
exports.marcaByID = function(req, res, next, id) { 
	Marca.findById(id).populate('user', 'displayName').exec(function(err, marca) {
		if (err) return next(err);
		if (! marca) return next(new Error('Failed to load Marca ' + id));
		req.marca = marca ;
		next();
	});
};

/**
 * Marca authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.marca.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
