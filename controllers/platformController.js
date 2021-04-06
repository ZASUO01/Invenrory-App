const Game = require('../models/game');
const GameInstance = require('../models/gameInstance');
const Fabricant =   require('../models/fabricant');
const Platform = require('../models/platform');
const mongoose = require('mongoose');
const async = require('async');
const {body, validationResult} = require('express-validator');
const adminPassword = 'shinventoryapi'


exports.platform_list = function(req, res, next){
    Platform.find()
    .exec(function(err, platforms){
        if(err) { return next(err)}
        res.render('platform_list', {title: 'SH Inventory | Platforms', platforms: platforms})
    });
}

exports.platform_detail = function(req, res, next){
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        let err = new Error("Invalid ObjectID");
        err.status = 404;
        return next(err);
    }
    async.parallel({
        platform: function(callback){
            Platform.findById(req.params.id)
            .exec(callback);
        },
        games: function(callback){
            Game.find({platform: req.params.id})
            .populate('fabricant')
            .populate('platform')
            .exec(callback);
        }
    }, function(err, results){
        if(err) { return next(err);}
        if(results.platform == null){
            const err = new Error('Platform not found.');
            err.status= 404;
            return next(err);
        }
        res.render(
            'game_list', 
            {
                title: 'SH Inventory | '+results.platform.name, 
                game_list: results.games, 
                h1: results.platform.name+' games',
            }
        );
    });
}

exports.platform_create_get = function(req, res, next){
    res.render(
        'platform_form', 
        {
            title: 'SH Inventory | Add Platform',
            h1: 'Add a platform'
        }
    );
}

exports.platform_create_post = [
    body('password', 'You need the admin password').trim().custom(val => {
        if(val === adminPassword) return true;
        return false;
    }),

    (req, res, next) => {
        const errors = validationResult(req);
        const platform = new Platform(
            {
                name: req.body.name
            }
        )
        if(!errors.isEmpty()){
            res.render(
                'platform_form', 
                {
                    title: 'SH Inventory | Add Platform',
                    h1: 'Add a platform',
                    errors: errors.array()
                }
            ); 
        }
        else{
            platform.save(function(err){
                if(err) {return next(err);}
                res.redirect('/platforms');
            })
        }
    }
]

exports.platform_update_get = function(req, res, next){
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        let err = new Error("Invalid ObjectID");
        err.status = 404;
        return next(err);
    }
    Platform.findById(req.params.id)
    .exec(function(err, platform){
        if(err) {return next(err);}
        res.render(
            'platform_form', 
            {
                title: 'SH Inventory | Edit Platform',
                h1: 'Edit '+platform.name,
                edit:true,
                platform: platform
            }
        );
    });
}

exports.platform_update_post = [
    body('password', 'You need the admin password').trim().custom(val => {
        if(val === adminPassword) return true;
        return false;
    }),
    
    (req, res, next) => {
        const errors = validationResult(req);
        const platform = new Platform(
            {
                name: req.body.name,
                _id: req.params.id
            }
        )
        if(!errors.isEmpty()){
            Platform.findById(req.params.id)
            .exec(function(err, platform){
                if(err) {return next(err);}
                res.render(
                    'platform_form', 
                    {
                        title: 'SH Inventory | Edit Platform',
                        h1: 'Edit '+platform.name,
                        edit:true,
                        platform: platform,
                        errors: errors.array()
                    }
                );
            });
        }
        else{
            Platform.findByIdAndUpdate(req.params.id, platform, {}, function(err, theplatform){
                if(err){return next(err);}
                res.redirect('/platforms')
            })
        }
    }
]


exports.platform_delete_get = function(req, res, next){
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        let err = new Error("Invalid ObjectID");
        err.status = 404;
        return next(err);
    }
    Platform.findById(req.params.id)
    .exec(function(err, platform){
        if(err) {return next(err)}
        res.render(
            'platform_delete', 
            {
                title: 'SH Inventory | Delete Platform',
                platform: platform
            }
        );
    })
}

exports.platform_delete_post = [
    body('password', 'You need the admin password').trim().custom(val => {
        if(val === adminPassword) return true;
        return false;
    }),

    (req, res, next) => {
        const errors = validationResult(req);
        async.parallel({
            platform: function(callback){
                Platform.findById(req.params.id)
                .exec(callback);
            },
            platform_games: function(callback){
                Game.find({platform: req.params.id})
                .exec(callback)
            }
        }, function(err, results){
            if(err){return next(err);}
            if(results.platform_games.length > 0){
                const error= new Error('This platform has games. You cant delete it.');
                const lengthErrs = [error];
                res.render(
                    'platform_delete',
                    {
                        title: 'SH Inventory | Delete Platform',
                        platform: results.platform,
                        errors: lengthErrs,
                        lError:true
                    }
                );
                return;
            }
            else{
                if(!errors.isEmpty()){
                    res.render(
                        'platform_delete',
                    {
                        title: 'SH Inventory | Delete Platform',
                        platform: results.platform,
                        errors: errors.array()
                    }
                    );
                return;
                }else{
                    Platform.findByIdAndRemove(req.params.id, function deletePlatform(err){
                        if(err) {return next(err)}
                        res.redirect('/platforms');
                    });
                }
            }
        })
    }
]