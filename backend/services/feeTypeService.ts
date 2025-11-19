import FeeType, { IFeeType } from "../models/Feetype";

export const createFeeTypeService = async (data: IFeeType) => {
  return await FeeType.create(data);
};

export const getFeeTypesService = async () => {
  return await FeeType.find().sort({ createdAt: -1 });
};

export const getFeeTypeByIdService = async (id: string) => {
  return await FeeType.findById(id);
};

export const updateFeeTypeService = async (id: string, data: Partial<IFeeType>) => {
  return await FeeType.findByIdAndUpdate(id, data, { new: true });
};

export const deleteFeeTypeService = async (id: string) => {
  return await FeeType.findByIdAndDelete(id);
};
