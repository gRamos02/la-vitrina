import { Types } from 'mongoose';
import { Category } from '../../models/Category';

export const createTestCategory = async (data = {}) => {
  return await Category.create({
    name: 'Test Category',
    description: 'Test Description',
    ...data
  });
};

export const generateMongoId = () => new Types.ObjectId().toString();