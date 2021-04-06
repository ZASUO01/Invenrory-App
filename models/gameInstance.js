const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameInstanceSchema = new Schema(
    {
        game: {type: Schema.Types.ObjectId, ref: 'Game', required:true},
        media: {type: String, required:true},
        status: {type: String, required: true, enum: ['New', 'Used','Sealed'], default: 'New'}
    }
)

GameInstanceSchema.virtual('url').get(function(){
    return '/catalog/copies/'+this._id;
});

module.exports = mongoose.model('GameInstance', GameInstanceSchema);