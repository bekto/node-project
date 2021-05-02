import { Document } from 'mongoose';
import IUser from '../interfaces/user';
import IItem from '../interfaces/item';

export default interface IShoppingCart extends Document {
    name: string;
    user_id: IUser['_id'];
    items: Array<IItem>;
}