import { Schema, model, Document, Types } from 'mongoose';

export interface IConsultationMessage {
  sender: 'user' | 'admin';
  content: string;
  createdAt: Date;
}

export interface IConsultation extends Document {
  user?: Types.ObjectId;
  name: string;
  email: string;
  topic: string;
  status: 'open' | 'closed';
  messages: IConsultationMessage[];
}

const consultationSchema = new Schema<IConsultation>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    email: { type: String, required: true },
    topic: { type: String, required: true },
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    messages: [
      {
        sender: { type: String, enum: ['user', 'admin'], required: true },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

const Consultation = model<IConsultation>('Consultation', consultationSchema);

export default Consultation;
