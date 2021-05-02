import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import IShoppingCart from '../interfaces/shopping_cart';
let Int32 = require('mongoose-int32');


const ShoppingCartSchema: Schema = new Schema({
    name: { 
        type: String,
        required: [true, 'Please enter a unique List name'],
        unique: true,
    },
    user_id: { 
        type: Schema.Types.ObjectId, 
        required: true
    },
    items: [{
        item_name: {
            type: String,
            required: true
        },
        item_quantity: {
            type: Int32,
            required: true,
            min: 0
        }
    }]
},
{
    timestamps: true
});

ShoppingCartSchema.plugin(uniqueValidator);

export default mongoose.model<IShoppingCart>('ShoppingCart', ShoppingCartSchema);