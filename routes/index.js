var express = require('express');
var router = express.Router();

const GameController = require('../controllers/gameController');
const GameInstanceController = require('../controllers/gameinstanceController');
const PlatformController = require('../controllers/platformController');
const FabricantController = require('../controllers/fabricantController');
const { Router } = require('express');


/* GET home page. */
router.get('/', GameController.index);
/// GAME ROUTES ///
router.get('/games/create',  GameController.game_create_get);
router.post('/games/create', GameController.game_create_post);
router.get('/games/:id/delete', GameController.game_delete_get);
router.post('/games/:id/delete', GameController.game_delete_post);
router.get('/games/:id/update', GameController.game_update_get);
router.post('/games/:id/update', GameController.game_update_post);
router.get('/games/:id', GameController.game_detail);
router.get('/games', GameController.game_list);
/// GAME INSTANCE ROUTES ///
router.get('/copies/:id/create', GameInstanceController.gameinstance_create_get);
router.post('/copies/:id/create', GameInstanceController.gameinstance_create_post);
router.get('/copies/:id/delete', GameInstanceController.gameinstance_delete_get);
router.post('/copies/:id/delete', GameInstanceController.gameinstance_delete_post);
router.get('/copies/:id/update', GameInstanceController.gameinstance_update_get);
router.post('/copies/:id/update', GameInstanceController.gameinstance_update_post);
/// PLATFORM ROUTES ///
router.get('/platforms/create', PlatformController.platform_create_get);
router.post('/platforms/create', PlatformController.platform_create_post);
router.get('/platforms/:id/update', PlatformController.platform_update_get);
router.post('/platforms/:id/update', PlatformController.platform_update_post);
router.get('/platforms/:id/delete', PlatformController.platform_delete_get);
router.post('/platforms/:id/delete', PlatformController.platform_delete_post);
router.get('/platforms/:id', PlatformController.platform_detail);
router.get('/platforms', PlatformController.platform_list);
/// FABRICANT ROUTES ///
router.get('/fabricants/create', FabricantController.fabricant_create_get);
router.post('/fabricants/create', FabricantController.fabricant_create_post);
router.get('/fabricants/:id/update', FabricantController.fabricant_update_get);
router.post('/fabricants/:id/update', FabricantController.fabricant_update_post);
router.get('/fabricants/:id/delete', FabricantController.fabricant_delete_get);
router.post('/fabricants/:id/delete', FabricantController.fabricant_delete_post);
router.get('/fabricants/:id', FabricantController.fabricant_detail);
router.get('/fabricants', FabricantController.fabricant_list);


module.exports = router;


