"use client";

import TextEditor from "@/editor";
import { useForm } from "react-hook-form";


type FormValues = {
  content: string;
};

const FormComponent = () => {
  const { handleSubmit, register, setValue } = useForm<FormValues>({
    defaultValues: { content: "" },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Enviando para o backend:", data);
    // Aqui você pode fazer o fetch para enviar os dados
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <TextEditor onChange={(content) => setValue("content", content)} />
      <input type="hidden" {...register("content")} />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Enviar
      </button>
    </form>
  );
};

export default FormComponent;
