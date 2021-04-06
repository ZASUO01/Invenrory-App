const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FabricantSchema = new Schema(
    {
        name: {type: String, maxlength: 100 , required: true},
        country: {type: String, required: true}
    }
)

FabricantSchema.virtual('url').get(function(){
    return '/fabricants/'+this._id;
});

module.exports = mongoose.model('Fabricant',  FabricantSchema);