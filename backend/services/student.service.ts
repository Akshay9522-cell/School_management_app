import Student from "../models/Student";

export const addStudentService = async (data: any) => {
  const student = await Student.create(data);
  return student;
};

export const getStudentsService = async () => {
  return await Student.find();
};


export const getStudentByIdService=async(id:string)=>{
    return await Student.findById(id)
}

export const updateStudentService=async(id:string,data:any)=>{
    return await Student.findByIdAndUpdate(id,data,{new:true})
}