const Game = require('../models/game');
const GameInstance = require('../models/gameInstance');
const Fabricant =   require('../models/fabricant');
const Platform = require('../models/platform');
const mongoose = require('mongoose');
const async = require('async');
const {body, validationResult} = require('express-validator');
const adminPassword = 'shinventoryapi'


exports.fabricant_list = function(req, res, next){
    Fabricant.find()
    .exec(function(err, fabricants){
        if(err) { return next(err)}
        res.render('fabricant_list', {title: 'SH Inventory | Developers', fabricants: fabricants})
    });
}

exports.fabricant_detail = function(req, res, next){
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        let err = new Error("Invalid ObjectID");
        err.status = 404;
        return next(err);
    }
    async.parallel({
        fabricant: function(callback){
            Fabricant.findById(req.params.id)
            .exec(callback);
        },
        games: function(callback){
            Game.find({fabricant: req.params.id})
            .populate('fabricant')
            .populate('platform')
            .exec(callback);
        }
    }, function(err, results){
        if(err) { return next(err);}
        if(results.fabricant == null){
            const err = new Error('Platform not found.');
            err.status= 404;
            return next(err);
        }
        res.render(
            'game_list', 
            {
                title: 'SH Inventory | '+results.fabricant.name, 
                game_list: results.games, 
                h1: results.fabricant.name+' games',
            }
        );
    });
}

exports.fabricant_create_get = function(req, res, next){
    res.render(
        'fabricant_form', 
        {
            title: 'SH Inventory | Add Developer',
            h1: 'Add a developer'
        }
    );
}

exports.fabricant_create_post = [
    body('password', 'You need the admin password').trim().custom(val => {
        if(val === adminPassword) return true;
        return false;
    }),

    (req, res, next) => {
        const errors = validationResult(req);
        const fabricant = new Fabricant(
            {
                name: req.body.name,
                country: req.body.country
            }
        )
        if(!errors.isEmpty()){
            res.render(
                'fabricant_form', 
                {
                    title: 'SH Inventory | Add Developer',
                    h1: 'Add a developer',
                    errors: errors.array()
                }
            ); 
        }
        else{
            fabricant.save(function(err){
                if(err) {return next(err);}
                res.redirect('/fabricants');
            })
        }
    }
]

exports.fabricant_update_get = function(req, res, next){
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        let err = new Error("Invalid ObjectID");
        err.status = 404;
        return next(err);
    }
    Fabricant.findById(req.params.id)
    .exec(function(err, fabricant){
        if(err) {return next(err);}
        res.render(
            'fabricant_form', 
            {
                title: 'SH Inventory | Edit Developer',
                h1: 'Edit '+fabricant.name,
                edit:true,
                fabricant: fabricant
            }
        );
    });
}

exports.fabricant_update_post = [
    body('password', 'You need the admin password').trim().custom(val => {
        if(val === adminPassword) return true;
        return false;
    }),
    
    (req, res, next) => {
        const errors = validationResult(req);
        const fabricant = new Platform(
            {
                name: req.body.name,
                country: req.body.country,
                _id: req.params.id
            }
        )
        if(!errors.isEmpty()){
            Fabricant.findById(req.params.id)
            .exec(function(err, fabricant){
                if(err) {return next(err);}
                res.render(
                    'fabricant_form', 
                    {
                        title: 'SH Inventory | Edit Fabricant',
                        h1: 'Edit '+fabricant.name,
                        edit:true,
                        fabricant: fabricant,
                        errors: errors.array()
                    }
                );
            });
        }
        else{
            Fabricant.findByIdAndUpdate(req.params.id, fabricant, {}, function(err, thefabricant){
                if(err){return next(err);}
                res.redirect('/fabricants')
            })
        }
    }
]

exports.fabricant_delete_get = function(req, res, next){
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        let err = new Error("Invalid ObjectID");
        err.status = 404;
        return next(err);
    }
    Fabricant.findById(req.params.id)
    .exec(function(err, fabricant){
        if(err) {return next(err)}
        res.render(
            'fabricant_delete', 
            {
                title: 'SH Inventory | Delete Developer',
                fabricant: fabricant
            }
        );
    })
}

exports.fabricant_delete_post = [
    body('password', 'You need the admin password').trim().custom(val => {
        if(val === adminPassword) return true;
        return false;
    }),

    (req, res, next) => {
        const errors = validationResult(req);
        async.parallel({
            fabricant: function(callback){
                Fabricant.findById(req.params.id)
                .exec(callback);
            },
            fabricant_games: function(callback){
                Game.find({fabricant: req.params.id})
                .exec(callback)
            }
        }, function(err, results){
            if(err){return next(err);}
            if(results.fabricant_games.length > 0){
                const error= new Error('This developer has games. You cant delete it.');
                const lengthErrs = [error];
                res.render(
                    'fabricant_delete',
                    {
                        title: 'SH Inventory | Delete Developer',
                        fabricant: results.fabricant,
                        errors: lengthErrs,
                        lError:true
                    }
                );
                return;
            }
            else{
                if(!errors.isEmpty()){
                    res.render(
                        'fabricant_delete',
                    {
                        title: 'SH Inventory | Delete Developer',
                        fabricant: results.fabricant,
                        errors: errors.array()
                    }
                    );
                return;
                }else{
                    Fabricant.findByIdAndRemove(req.params.id, function deleteFabricant(err){
                        if(err) {return next(err)}
                        res.redirect('/fabricants');
                    });
                }
            }
        })
    }
]