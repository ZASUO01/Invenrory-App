const mongoose = require('mongoose');
const Schema  = mongoose.Schema;


const PlatformSchema = new Schema(
    {
        name: {type: String, maxlength: 100, required: true},
    }
)

PlatformSchema.virtual('url').get(function(){
    return '/platforms/'+this._id;
});

module.exports = mongoose.model('Platform', PlatformSchema);