import FeeStructure, { IFeeStructure } from "../models/Feestructure";

export const createFeeStructureService = async (data: IFeeStructure) => {
  return await FeeStructure.create(data);
};

export const getFeeStructuresService = async () => {
  return await FeeStructure.find()
    .populate("classId", "name")
    .populate("fees.feeTypeId", "name");
};

export const getFeeStructureByClassService = async (classId: string) => {
  return await FeeStructure.findOne({ classId })
    .populate("classId", "name")
    .populate("fees.feeTypeId", "name");
};

export const updateFeeStructureService = async (id: string, data: Partial<IFeeStructure>) => {
  return await FeeStructure.findByIdAndUpdate(id, data, { new: true });
};

export const deleteFeeStructureService = async (id: string) => {
  return await FeeStructure.findByIdAndDelete(id);
};
