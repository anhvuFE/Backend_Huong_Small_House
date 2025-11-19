import Feedback, { IFeedback } from '../models/Feedback';
import AppError from '../utils/appError';

interface FeedbackPayload {
  userId?: string;
  name?: string;
  email: string;
  orderId?: number;
  productId?: number;
  message: string;
}

class FeedbackService {
  create(payload: FeedbackPayload): Promise<IFeedback> {
    return Feedback.create({
      user: payload.userId,
      name: payload.name,
      email: payload.email,
      orderId: payload.orderId,
      productId: payload.productId,
      message: payload.message
    });
  }

  listAll(): Promise<IFeedback[]> {
    return Feedback.find().populate('user', 'name email').sort({ createdAt: -1 }).exec();
  }

  listByUser(userId: string): Promise<IFeedback[]> {
    return Feedback.find({ user: userId }).sort({ createdAt: -1 }).exec();
  }

  async getById(id: string): Promise<IFeedback | null> {
    return Feedback.findById(id).populate('user', 'name email').exec();
  }

  async updateStatus(id: string, status: IFeedback['status']): Promise<IFeedback> {
    const feedback = await Feedback.findByIdAndUpdate(id, { status }, { new: true });
    if (!feedback) {
      throw new AppError('Feedback not found', 404);
    }
    return feedback;
  }

  async respond(id: string, response: string): Promise<IFeedback> {
    const feedback = await Feedback.findByIdAndUpdate(
      id,
      { response, status: 'resolved' },
      { new: true }
    );
    if (!feedback) {
      throw new AppError('Feedback not found', 404);
    }
    return feedback;
  }
}

export default new FeedbackService();
