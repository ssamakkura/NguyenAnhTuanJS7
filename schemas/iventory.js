let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let inventorySchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: "product"
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    reserved: {
        type: Number,
        required: true,
        default: 0
    },
    soldcount: {
        type: Number,
        required: true,
        default: 0
    },

});

module.exports = mongoose.model("Inventory", inventorySchema);