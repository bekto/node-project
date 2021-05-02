import { Document } from 'mongoose';

export default interface IItem extends Document {
    name: string;
    quantity: number; 
}