const Game = require('../models/game');
const GameInstance = require('../models/gameInstance');
const Fabricant =   require('../models/fabricant');
const Platform = require('../models/platform');
const mongoose = require('mongoose');
const async = require('async');
const {body, validationResult} = require('express-validator');
const adminPassword = 'shinventoryapi'

exports.gameinstance_create_get = function(req, res, next){
    Game.findById(req.params.id)
    .populate('fabricant')
    .populate('platform')
    .exec(function(err, game){
        if(err) {return next(err)}
        res.render(
            'gameinstance_form', 
            {
                title: 'SH Inventory | Add copy', 
                h1: 'Add new copy of '+game.name,
                game: game
            }
        );
    });
}

exports.gameinstance_create_post = [
    body('password', 'You need the Admin Password').trim().custom(val => {
        if(val === adminPassword) return true;
        return false;
    }),

    (req, res, next) => {
        const errors = validationResult(req);
        const gameInstance = new GameInstance(
            {
                game: req.body.name,
                media: req.body.media,
                status: req.body.status
            }
        )
        
        if(!errors.isEmpty()){
            Game.findById(req.params.id)
            .populate('fabricant')
            .populate('platform')
            .exec(function(err, game){
                if(err) {return next(err)}
                res.render(
                    'gameinstance_form', 
                    {
                        title: 'SH Inventory | Add copy', 
                        h1: 'Add new copy of '+game.name,
                        game: game, 
                        errors: errors.array()
                    }
                );
            });
            return
        }
        else{
            gameInstance.save(function(err){
                if(err) {return next(err)}
                res.redirect('/games/'+gameInstance.game._id);
            })
        }
    }
]


exports.gameinstance_delete_get = function(req, res, next){
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        let err = new Error("Invalid ObjectID");
        err.status = 404;
        return next(err);
    }
    GameInstance.findById(req.params.id)
    .populate('game')
    .exec(function(err, copy){
        if(err) {return next(err)}
        if(copy == null){
            const err = new Error('Copy not found');
            err.status = 404;
            return next(err);
        }
        res.render(
            'gameinstance_delete', 
            {
                title: 'SH Inventory | Delete copy', 
                game: copy.game
            }
        );
    });
    
}

exports.gameinstance_delete_post = [
    body('password', 'You need the admin password').trim().custom(val => {
        if(val === adminPassword) return true;
        return false;
    }),
    
    (req, res, next) => {
        const errors = validationResult(req);
        GameInstance.findById(req.params.id)
        .populate('game')
        .exec(function(err, copy){
            if(err) {return next(err)}
            if(copy == null){
                const err = new Error('Copy not found.');
                err.status=404;
                return next(err);
            }
            if(!errors.isEmpty()){
                res.render(
                    'gameinstance_delete', 
                    {
                        title: 'SH Inventory | Delete copy', 
                        game: copy.game,
                        errors: errors.array()     
                    }
                );
                return
            }
            else{
                GameInstance.findByIdAndRemove(req.params.id, function deleteCopy(err){
                    if(err) {return next(err);}
                    res.redirect('/games/'+copy.game._id);
                });
            }
        });
    }
];


exports.gameinstance_update_get = function(req, res, next){
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        let err = new Error("Invalid ObjectID");
        err.status = 404;
        return next(err);
    }
    GameInstance.findById(req.params.id)
    .populate('game')
    .exec(function(err, copy){
        if(err) {return next(err)}
        if(copy == null){
            const err = new Error('Copy not found.');
            err.status=404;
            return next(err);
        }
        res.render(
            'gameinstance_form', 
            {
                title: 'SH Inventory | Edit Copy', 
                h1: `Edit this ${copy.game.name} copy`,
                copy: copy, 
                game:copy.game,
                edit:true
            }
        );
    })
    
}

exports.gameinstance_update_post = [
    body('password', 'You need the Admin Password').trim().custom(val => {
        if(val === adminPassword) return true;
        return false;
    }),

    (req, res, next) => {
        const errors = validationResult(req);
        const gameInstance = new GameInstance(
            {
                game: req.body.name,
                media: req.body.media,
                status: req.body.status,
                _id: req.params.id
            }
        )
        
        if(!errors.isEmpty()){
            GameInstance.findById(req.params.id)
            .populate('game')
            .exec(function(err, copy){
                if(err) {return next(err)}
                if(copy == null){
                    const err = new Error('Copy not found.');
                    err.status=404;
                    return next(err);
                }
                res.render(
                    'gameinstance_form', 
                    {
                        title: 'SH Inventory | Edit Copy', 
                        h1: `Edit this ${copy.game.name} copy`,
                        copy: copy, 
                        game:copy.game,
                        edit:true,
                        errors: errors.array()
                    }
                );
            });
        }
        else{
            GameInstance.findByIdAndUpdate(req.params.id, gameInstance, {}, function(err, thecopy){
                if(err) {return next(err);}
                res.redirect('/games/'+gameInstance.game._id);
            });
        }
    }
]