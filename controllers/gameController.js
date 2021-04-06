const Game = require('../models/game');
const GameInstance = require('../models/gameInstance');
const Fabricant =   require('../models/fabricant');
const Platform = require('../models/platform');
const mongoose = require('mongoose');
const async = require('async');
const {body, validationResult} = require('express-validator');
const adminPassword = process.env.ADMIN_PASSWORD;


exports.index = function(req, res, next){
    async.parallel({
        game_count: function(callback){
            Game.countDocuments({}, callback);
        },
        gameinstance_count: function(callback){
            GameInstance.countDocuments({}, callback);
        },
        fabricant_count: function(callback){
            Fabricant.countDocuments({}, callback);
        },
        platform_count: function(callback){
            Platform.countDocuments({}, callback);
        }
    }, function(err, results){
        if(err) {return next(err);}
        res.render('index', { title: 'SH Inventory', data:results });
    })
}


exports.game_list = function(req, res, next){
    Game.find()
    .populate('fabricant')
    .populate('platform')
    .exec(function(err, list_games){
        if(err) {return next(err)}
        res.render(
            'game_list', 
            {
                title: 'SH Inventory | Game List', 
                game_list: list_games,
                h1: 'All games'
            }
        );
    });
}

exports.game_detail = function(req, res, next){
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        let err = new Error("Invalid ObjectID");
        err.status = 404;
        return next(err);
    }
    async.parallel({
        game: function(callback){
            Game.findById(req.params.id)
            .populate('fabricant')
            .populate('platform')
            .exec(callback);
        },
        game_instance: function(callback){
            GameInstance.find({'game': req.params.id})
            .exec(callback);
        }

    }, function(err, results){
        if(err) {return next(err)}
        if(results.game == null){
            const err = new Error('Game not Found');
            err.status = 404;
            return next(err);
        }
        res.render('game_detail',
            {
                title: "SH Inventory | "+results.game.name,
                game: results.game,
                fabricant: results.game.fabricant,
                platform: results.game.platform,
                game_instances: results.game_instance
            }
        )
    });
}

exports.game_create_get = function(req, res, next) {
    async.parallel({
        fabricants: function(callback){
            Fabricant.find(callback);
        },
        platforms: function(callback){
            Platform.find(callback);
        }
    }, function(err, results){
        if(err) { return next(err)}
        res.render('game_form', {title: 'SH Inventory  | Add Game',h1: 'Add a new Game', fabricants: results.fabricants, platforms: results.platforms})
    });
    
};

// Handle book create on POST.
exports.game_create_post = [
    body('name', 'Title must be not empty.').trim().isLength({min:1, max:100}).escape(),
    body('price', 'Price must be between $0 and $9999').isFloat({min:0, max:9999}),
    body('image', 'Image must be an valid url').trim().isURL(),
    body('description', 'Description must be not empty').trim().isLength({min:1, max:5000}),
    body('fabricants', 'Fabricants must be not empty').trim().escape(),
    body('platforms', 'Platforms must be not empty').trim().escape(),
    body('password', 'You need the admin password').trim().custom(val => {
        if(val === adminPassword) return true;
        return false;
    }),

    (req, res, next) => {
        const errors = validationResult(req);

        const game = new Game(
            {
                name: req.body.name,
                price: req.body.price,
                image: req.body.image,
                description: req.body.description,
                fabricant: req.body.fabricants,
                platform: req.body.platforms
            }
        );

        if(!errors.isEmpty()){
            async.parallel({
                fabricants: function(callback){
                    Fabricant.find(callback);
                },
                platforms: function(callback){
                    Platform.find(callback);
                }
            }, function(err, results){
                if(err) { return next(err)}
                res.render('game_form', {title: 'SH Inventory  | Add Game',h1: 'Add a new Game', fabricants: results.fabricants, platforms: results.platforms, game: game, errors: errors.array()});
            });
            return;
        }
        else{
            game.save(function(err) {
                if(err) { return next(err)}
                res.redirect('/games/'+game._id)
            });
        }
    }
]
    


// Display book delete form on GET.
exports.game_delete_get = function(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        let err = new Error("Invalid ObjectID");
        err.status = 404;
        return next(err);
    }
    Game.findById(req.params.id)
    .populate('fabricant')
    .populate('platform').
    exec(function(err, game) {
        if(err) {return next(err);}
        if(game == null){
            const err = new Error('Game not found.')
            err.status = 404;
            return next(err)
        }
        res.render('game_delete', {title:'SH Inventory | Delete: '+game.name, game:game})
    });
};

// Handle book delete on POST.
exports.game_delete_post = [
    body('password', 'You need the admin password').trim().custom(val => {
        if(val === adminPassword) return true;
        return false;
    }),

    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            Game.findById(req.params.id)
            .populate('fabricant')
            .populate('platform').
            exec(function(err, game) {
                if(err) {return next(err);}
                if(game == null){
                const err = new Error('Game not found.')
                err.status = 404;
                return next(err)
            }
            res.render('game_delete', {title:'SH Inventory | Delete: '+game.name, game:game, errors: errors.array()})
        });
        }else{
            Game.findByIdAndRemove(req.params.id, function deleteGame(err){
                if(err) {return next(err)}
                res.redirect('/games');
            })
        }
    }
];

// Display book update form on GET.
exports.game_update_get = function(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        let err = new Error("Invalid ObjectID");
        err.status = 404;
        return next(err);
    }
    async.parallel({
        game: function(callback){
            Game.findById(req.params.id)
            .populate('fabricant')
            .populate('platform')
            .exec(callback)
        },
        fabricants: function(callback){
            Fabricant.find(callback);
        },
        platforms: function(callback){
            Platform.find(callback);
        }
    }, function(err, results){
        if(err) {return next(err)}
        if(results.game == null){
            const err = new Error('Book not found.');
            err.status = 404;
            return next(err);
        }
        res.render(
            'game_form', 
            {
                title: 'SH inventory | Edit Game', 
                h1: 'Edit: '+results.game.name, 
                game:results.game, 
                fabricants: results.fabricants,
                platforms:results.platforms,
                edit:true
            });
    })
}

// Handle book update on POST.
exports.game_update_post = [
    body('name', 'Title must be not empty.').trim().isLength({min:1, max:100}).escape(),
    body('price', 'Price must be between $0 and $9999').isFloat({min:0, max:9999}),
    body('image', 'Image must be an valid url').trim().isURL(),
    body('description', 'Description must be not empty').trim().isLength({min:1, max:5000}),
    body('fabricants', 'Fabricants must be not empty').trim().escape(),
    body('platforms', 'Platforms must be not empty').trim().escape(),
    body('password', 'You need the admin password').trim().custom(val => {
        if(val === adminPassword) return true;
        return false;
    }),

    (req, res, next) => {
        const errors = validationResult(req);
        const game = new Game(
            {
                name: req.body.name,
                price: req.body.price,
                image: req.body.image,
                description: req.body.description,
                fabricant: req.body.fabricant,
                platform: req.body.platform,
                _id:req.params.id
            }
        )
        if(!errors.isEmpty()){
            async.parallel({
                fabricants: function(callback){
                    Fabricant.find(callback);
                },
                platforms: function(callback){
                    Platform.find(callback);
                }
            }, function(err, results){
                if(err) {return next(err)}
                res.render(
                    'game_form',
                    {
                        title: 'SH Inventory | Edit Game',
                        h1: 'Edit: '+game.name, 
                        game: game, 
                        fabricants: results.fabricants,
                        platforms:results.platforms,
                        edit:true,
                        errors: errors.array()
                    }
                )
            })
            return;
        }
        else{
            Game.findByIdAndUpdate(req.params.id, game, {}, function(err, thegame){
                if(err) {return next(err)}
                res.redirect('/games/'+thegame._id);
            }); 
        }
    }
];


