#! /usr/bin/env node
console.log('This script populates some test games, fabricants, platforms and copies to your database.');

var userArgs = process.argv.slice(2);

var async = require('async')
var Fabricant = require('./models/fabricant')
var Game = require('./models/game')
var GameInstance = require('./models/gameInstance')
var Platform = require('./models/platform')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var fabricants = []
var games = []
var gameInstances = []
var platforms = []

function fabricantCreate(name, country, cb) {
  var fabricant = new Fabricant({name: name, country: country});
       
  fabricant.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Fabricant: ' + fabricant);
    fabricants.push(fabricant);
    cb(null, fabricant);
  }  );
}

function platformCreate(name, cb) {
  var platform = new Platform({ name: name });
       
  platform.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New platform: ' + platform);
    platforms.push(platform)
    cb(null, platform);
  }   );
}

function gameCreate(name, price, image, description, fabricant, platform, cb) {
  gamedetail = { 
    name: name,
    price: price,
    image: image,
    description: description,
    fabricant: fabricant,
    platform: platform
  }
  
  var game = new Game(gamedetail);    
  game.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Game: ' + game);
    games.push(game)
    cb(null, game)
  }  );
}


function gameInstanceCreate(game, media, status, cb) {
  gameinstancedetail = { 
    game: game,
    media: media,
    status: status
  }    
    
  var gameinstance = new GameInstance(gameinstancedetail);    
  gameinstance.save(function (err) {
    if (err) {
      console.log('ERROR CREATING GameInstance: ' + gameinstance);
      cb(err, null)
      return
    }
    console.log('New GameInstance: ' + gameinstance);
    gameInstances.push(gameinstance)
    cb(null, game)
  }  );
}


function createPlatformFabricants(cb) {
    async.series([
        function(callback) {
          fabricantCreate('Capcom','Japan',callback);
        },
        function(callback) {
          fabricantCreate('Konami', 'Japan', callback);
        },
        function(callback) {
          fabricantCreate('Koei Tecmo', 'Japan', callback);
        },
        function(callback) {
          platformCreate('Play Station', callback);
        },
        function(callback) {
          platformCreate('Play Station 2', callback);
        },
        function(callback) {
          platformCreate('Game Cube', callback);
        },
        function(callback) {
          platformCreate('Play Station 3', callback);
        },
        function(callback) {
          platformCreate('Play Station 4', callback);
        },
        ],
        // optional callback
        cb);
}


function createGames(cb) {
    async.parallel([
        function(callback){
          gameCreate('Haunting ground', 32, 'https://www.mobygames.com/images/covers/l/94589-haunting-ground-playstation-2-front-cover.jpg', 'Fiona Belli is an 18-year-old girl who recently moved to college. While visiting her parents, she is involved in a car accident, and awakens in a cage in the dungeon of a castle. Her memories of the incident are hazy. Noting that the cage that keeps her prisoner has been left unlocked, she steps out and begins searching for answers and a way out of the castle. Soon after, she befriends a White Shepherd named Hewie.', fabricants[0], platforms[1], callback);
        },
        function(callback){
          gameCreate('Dino Crisis', 10, 'https://www.mobygames.com/images/covers/l/34867-dino-crisis-playstation-front-cover.jpg', 'Dino Crisis takes place on a fictional location known as Ibis Island in the year 2009. The Secret Operation Raid Team (SORT) has sent an agent, Tom, to investigate a research facility. During the recon mission, he learns that Dr. Edward Kirk, a world-renowned scientist who was reported dead three years ago, is leading a secret weapons project within the facility. SORT sends four agents (Regina, Gail, Rick, and Cooper) to acquire Kirk and return him to custody.', fabricants[0], platforms[0], callback);
        },
        function(callback){
          gameCreate('Dino Crisis 2', 10, 'https://www.covercentury.com/covers/psx/d/Dino-Crisis-2-NTSC-PSX-FRONT.jpg', 'After the events of the previous game, unsafe research into time-distorting Third Energy has resulted in an entire research base, military institution, and fictional metropolis of Edward City to be transported to another time; along with all of its inhabitants. Secret Operations Raid Team operative Regina returns as one of the main playable characters, sent along as an adviser to the rescue team that travels through time to find survivors of the time displacement and recover data on the Third Energy experiments.', fabricants[0], platforms[0], callback);
        },
        function(callback){
          gameCreate('Sillent Hill', 15, 'https://jogoveio.com.br/wp-content/uploads/2019/07/sh-cover-jogoveio.jpg', 'The first installment in the series follows Harry Mason as he searches for his missing adopted daughter in the mysterious town of Silent Hill. Stumbling upon a cult conducting a ritual to revive a deity it worships, Harry discovers his daughter\'s true origin. Multiple game endings are possible, depending on in-game actions taken by the player.', fabricants[1], platforms[0], callback);
        },
        function(callback){
          gameCreate('Sillent Hill 2', 35, 'https://evilhazard.com.br/wp-content/uploads/2019/05/silent-hill-2-playstation-2-front-cover.jpg', 'The second installment in the series follows James Sunderland searching for his deceased wife in Silent Hill after having received a letter from her informing him that she is waiting for him there. After searching in and exploring the mysterious town, he ultimately realizes her death\'s true nature.', fabricants[1], platforms[1],callback);
        },
        function(callback){
          gameCreate('Sillent Hill 3', 35, 'http://4.bp.blogspot.com/-WIAYCHjqrsc/TwteD4hDRjI/AAAAAAAAAOM/aJOOnbYFM_E/s1600/Silent_Hill_3_Dvd_ntsc-%255Btheps2games.com%255D.jpg', 'Silent Hill 3 takes place in the fictional universe of the Silent Hill series. It opens with Heather\'s (Heather Morris) nightmare of being trapped in a derelict amusement park and killed by the roller coaster. She awakens in a burger restaurant, but before she can leave the shopping mall and return home to her father, private detective Douglas Cartland (Richard Grosse) confronts her, claiming to have information about her birth.', fabricants[1], platforms[1], callback);
        },  
        function(callback) {
          gameCreate('Resident Evil 0',20, 'https://bdjogos.com.br/capas/04122017174532-resident-evil-0-gamecube-cover.jpg' , 'On July 23, 1998, a train owned by the pharmaceutical company Umbrella, the Ecliptic Express, comes under attack from a swarm of leeches. As the passengers and crew are attacked, a mysterious young man watches over the resulting chaos from a hillside. Two hours later, the Bravo Team of the Special Tactics And Rescue Service (S.T.A.R.S.) police force is sent to investigate a series of cannibalistic murders in the Arklay Mountains outside of Raccoon City.',fabricants[0], platforms[2], callback);
        },
        function(callback) {
          gameCreate('Resident Evil', 20, 'https://upload.wikimedia.org/wikipedia/pt/9/93/Resident_Evil_Remake-_North-american_cover.jpg.jpg' ,'On July 24, 1998, a series of bizarre murders occur on the outskirts of the Midwestern town of Raccoon City. The Raccoon City Police Department\'s Special Tactics And Rescue Service (STARS) are assigned to investigate. After contact with Bravo Team is lost, Alpha Team is sent to investigate their disappearance. Alpha Team locates Bravo Team\'s crashed helicopter and land at the site, where they are attacked by a pack of monstrous dogs, killing one of the team', fabricants[0], platforms[2], callback);
        },
        function(callback) {
          gameCreate('Resident Evil 2', 100,'https://www.riosgames.com.br/image/cache/catalog/Capas-ps4-new/resident-evil-2-ps4-cover-793x1000.jpg', 'On September 29, 1998, two months after the events of the first Resident Evil, most citizens of the Midwestern American mountain community Raccoon City have been transformed into zombies by the T-virus, a biological weapon secretly developed by the pharmaceutical company Umbrella. Leon S. Kennedy, a police officer on his first day of duty, and Claire Redfield, a college student looking for her brother Chris, make their way to the Raccoon Police Department.', fabricants[0], platforms[4], callback);
        },
        function(callback) {
          gameCreate('Resident Evil 3', 100,'https://rootjogos.com/wp-content/uploads/2020/01/RE3ps4cover.jpg' , 'On September 28, 1998, 24 hours prior to the events of Resident Evil 2, former Special Tactics And Rescue Service (S.T.A.R.S.) member Jill Valentine attempts to escape from Raccoon City. Most of the population has been transformed into zombies by an outbreak of the T-virus, a new type of biological weapon secretly developed by the pharmaceutical company Umbrella', fabricants[0], platforms[4], callback);
        },
        function(callback) {
          gameCreate('Resident Evil Code: Veronica', 35, 'https://http2.mlstatic.com/resident-evil-code-veronica-x-ps2-dvd-D_NQ_NP_772099-MLB27824001213_072018-F.webp' , 'In December 1998, three months after escaping from Raccoon City (seen in Resident Evil 2) prior to its eventual destruction (seen in Resident Evil 3: Nemesis),[7] Claire Redfield raids an Umbrella Corporation facility in Paris in search of her brother, Chris Redfield. Discovered by Umbrella\'s security forces and eventually captured, Claire is imprisoned on Rockfort Island, a prison complex owned by the corporation, situated in the Southern Ocean', fabricants[0], platforms[1], callback);
        },
        function(callback) {
          gameCreate('Resident Evil 4', 39, 'https://www.mobygames.com/images/covers/l/71525-resident-evil-4-playstation-2-front-cover.jpg', 'U.S. government agent Leon S. Kennedy (Paul Mercier) is on a mission to rescue Ashley Graham (Carolyn Lawrence), the U.S. President\'s daughter, who has been kidnapped by a mysterious cult.[10] He travels to a nameless rural village in Spain,[11] where he encounters a group of hostile villagers who pledge their lives to Los Iluminados, the cult that kidnapped Ashley. The villagers were once simple farmers until becoming infected by a mind-controlling parasite known as Las Plagas.',  fabricants[0], platforms[1], callback);
        },
        function(callback){
          gameCreate('Resident Evil 5', 70, 'https://images-na.ssl-images-amazon.com/images/I/91iHBLGTsIL._AC_SL1500_.jpg', 'In 2009, five years after the events of Resident Evil 4, Chris Redfield, now an agent of the Bioterrorism Security Assessment Alliance (BSAA), is dispatched to Kijuju in Africa. He and his new partner Sheva Alomar are tasked with apprehending Ricardo Irving before he can sell a bio-organic weapon (BOW) on the black market. When they arrive, they discover that the locals have been infected by the parasites Las Plagas (those infected are called "Majini") and the BSAA Alpha Team have been killed. Chris and Sheva are rescued by BSAA\'s Delta Team, which includes Sheva\'s mentor Captain Josh Stone.', fabricants[0], platforms[3], callback);
        },
        function(callback){
          gameCreate('Fatal Frame', 32, 'https://m.media-amazon.com/images/M/MV5BMjE5OTk2NDk3NF5BMl5BanBnXkFtZTcwNzQ0NzAzOA@@._V1_.jpg', 'The story, set in the year 1986, focuses on Miku and Mafuyu Hinasaki, siblings with the ability to see supernatural events. When Mafuyu disappears in the haunted Himuro Mansion searching for his tutor Junsei Takamine and his assistants, Miku goes to Himuro Mansion. As she explores the mansion, Miku discovers signs that Takamine\'s party were killed by the mansion\'s ghosts, and finds rope burns appearing on her wrists and ankles.', fabricants[2], platforms[1], callback);
        },
        function(callback){
          gameCreate('Fatal Frame 2', 32, 'https://images-na.ssl-images-amazon.com/images/I/51F8MKPQF8L._AC_.jpg', 'Fatal Frame II is set in the fictional Minakami (皆神) region of Japan. The region is home to Minakami Village (lit. "All God\'s Village"), an abandoned town where the majority of the game takes place. The player learns that Minakami Village was host to the "Crimson Sacrifice Ritual", the failure of which caused the settlement to vanish—thus earning it the name "The Lost Village".', fabricants[2], platforms[1], callback);
        },
        function(callback){
          gameCreate('Fatal Frame 3', 32, 'https://static.wikia.nocookie.net/fatalframe/images/9/99/FF3_Cover.jpg/revision/latest?cb=20150403181433&path-prefix=pt-br', '23-year-old freelance photographer Rei Kurosawa has been mourning the death of her fiancé, Yuu Asou, after a car accident caused by Rei\'s reckless driving. About two months after his death, while on assignment for the derelict Kuze mansion, Rei discovers her image on one of the photos she had taken. Shortly after, she begins having recurring nightmares of an old Japanese manor house—the "Manor of Sleep" during a heavy snowfall, where she is touched by a tattooed ghost', fabricants[2], platforms[1], callback);
        }
        
        ],
        // optional callback
        cb);
}


function createGameInstances(cb) {
    async.parallel([
        function(callback) {
          gameInstanceCreate(games[0], 'DVD', 'Used', callback);
        },
        function(callback) {
          gameInstanceCreate(games[1], 'DVD', 'Used', callback);
        },
        function(callback) {
          gameInstanceCreate(games[2], 'CD', 'Used', callback);
        },
        function(callback) {
          gameInstanceCreate(games[2], 'CD', 'New', callback);
        },
        function(callback) {
          gameInstanceCreate(games[3], 'CD', 'Used', callback);
        },
        function(callback) {
          gameInstanceCreate(games[4], 'DVD', 'New',callback);
        },
        function(callback) {
          gameInstanceCreate(games[4], 'DVD', 'New',callback);
        },
        function(callback) {
          gameInstanceCreate(games[4], 'DVD', 'Used',callback);
        },
        function(callback) {
          gameInstanceCreate(games[5], 'DVD', 'Used',callback);
        },
        ],
        // Optional callback
        cb);
}



async.series([
    createPlatformFabricants,
    createGames,
    createGameInstances
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('GAMEInstances: '+gameInstances);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});




