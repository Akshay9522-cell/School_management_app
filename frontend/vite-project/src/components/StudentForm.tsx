import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { Student } from "../types/student";

type Props = {
  initialData?: Partial<Student>;
  onSubmit: (data: Partial<Student>) => void;
  onClose: () => void;
};

type FormValues = {
  name: string;
  email: string;
  rollNo: string;
  class: string;
  section?: string;
};

const StudentForm: React.FC<Props> = ({ initialData, onSubmit, onClose }) => {
  const { register, handleSubmit } = useForm<FormValues>({ defaultValues: initialData });

  const submitHandler: SubmitHandler<FormValues> = (data) => {
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="bg-white p-6 rounded shadow w-96 flex flex-col gap-4"
      >
        <h2 className="text-xl font-bold">{initialData ? "Edit Student" : "Add Student"}</h2>

        <input {...register("rollNo")} placeholder="Roll No" className="border p-2 rounded" required />
        <input {...register("name")} placeholder="Name" className="border p-2 rounded" required />
        <input {...register("email")} placeholder="Email" type="email" className="border p-2 rounded" required />
        <input {...register("class")} placeholder="Class" className="border p-2 rounded" required />
        <input {...register("section")} placeholder="Section" className="border p-2 rounded" />

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
