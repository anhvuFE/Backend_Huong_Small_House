import { Schema, model, Document } from 'mongoose';

export interface IGuest extends Document {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const guestSchema = new Schema<IGuest>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true }
  },
  { timestamps: true }
);

const Guest = model<IGuest>('Guest', guestSchema);

export default Guest;
