import Consultation, { IConsultation, IConsultationMessage } from '../models/Consultation';
import AppError from '../utils/appError';

interface CreateConsultationPayload {
  userId?: string;
  name: string;
  email: string;
  topic: string;
  message: string;
}

class ConsultationService {
  create(payload: CreateConsultationPayload): Promise<IConsultation> {
    return Consultation.create({
      user: payload.userId,
      name: payload.name,
      email: payload.email,
      topic: payload.topic,
      messages: [
        {
          sender: 'user',
          content: payload.message,
          createdAt: new Date()
        }
      ]
    });
  }

  listAll(): Promise<IConsultation[]> {
    return Consultation.find().populate('user', 'name email').sort({ updatedAt: -1 }).exec();
  }

  listByUser(userId: string): Promise<IConsultation[]> {
    return Consultation.find({ user: userId }).sort({ updatedAt: -1 }).exec();
  }

  async getById(id: string): Promise<IConsultation | null> {
    return Consultation.findById(id).populate('user', 'name email').exec();
  }

  private async addMessage(
    id: string,
    sender: IConsultationMessage['sender'],
    content: string
  ): Promise<IConsultation> {
    const consultation = await Consultation.findById(id);
    if (!consultation) {
      throw new AppError('Consultation not found', 404);
    }
    consultation.messages.push({ sender, content, createdAt: new Date() });
    await consultation.save();
    return consultation;
  }

  userMessage(id: string, content: string): Promise<IConsultation> {
    return this.addMessage(id, 'user', content);
  }

  adminMessage(id: string, content: string): Promise<IConsultation> {
    return this.addMessage(id, 'admin', content);
  }

  async closeConsultation(id: string): Promise<IConsultation> {
    const consultation = await Consultation.findByIdAndUpdate(
      id,
      { status: 'closed' },
      { new: true }
    );
    if (!consultation) {
      throw new AppError('Consultation not found', 404);
    }
    return consultation;
  }
}

export default new ConsultationService();
