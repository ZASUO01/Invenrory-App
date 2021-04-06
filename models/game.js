const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = new Schema(
    {
        name: {type: String, required:true, maxlength:100},
        price: {type: Number, required:true},
        image: {type: String, required: true},
        description: {type: String, required: true, maxlength:5000},
        fabricant: {type: Schema.Types.ObjectId, ref: 'Fabricant', required: true},
        platform: {type: Schema.Types.ObjectId, ref: 'Platform',  required: true},
    }
)

GameSchema.virtual('url').get(function(){
    return 'games/'+this._id;
});

module.exports = mongoose.model('Game', GameSchema);