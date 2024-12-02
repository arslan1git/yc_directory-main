"use client";

import React, { useState, useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MDEditor from "@uiw/react-md-editor"; // Markdown editor for pitch
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createPitch } from "@/lib/actions";

// Define form field configuration
const formFields = [
  {
    id: 'title',
    label: 'Title',
    type: 'input',
    placeholder: 'Project Title',
  },
  {
    id: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Project Description',
  },
  {
    id: 'category',
    label: 'Category',
    type: 'input',
    placeholder: 'Project Category (Tech, Health, Education...)',
  },
  {
    id: 'link',
    label: 'Image URL',
    type: 'input',
    placeholder: 'Project Image URL',
  },
] as const;

// Form field component
const FormField = ({
  field,
  error
}: { 
  field: typeof formFields[number],
  error?: string 
}) => (
  <div className="mb-6">
    <label htmlFor={field.id} className="block text-sm font-medium text-white mb-2">
      {field.label}
    </label>
    {field.type === 'input' ? (
      <Input
        id={field.id}
        name={field.id}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        required
        placeholder={field.placeholder}
      />
    ) : (
      <Textarea
        id={field.id}
        name={field.id}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px]"
        required
        placeholder={field.placeholder}
      />
    )}
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

const StartupForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        image: formData.get("link") as string,
        pitch,
      };

      await formSchema.parseAsync(formValues);

      const result = await createPitch(prevState, formData, pitch);

      if (result.status === "SUCCESS") {
        toast({
          title: "Success",
          description: "Your project has been created successfully",
        });

        router.push(`/startup/${result._id}`);
      }

      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        const formattedErrors = Object.fromEntries(
          Object.entries(fieldErrors).map(([key, value]) => [key, value?.[0] || ''])
        );
        setErrors(formattedErrors);

        toast({
          title: "Error",
          description: "Please check your inputs and try again",
          variant: "destructive",
        });

        return { ...prevState, error: "Validation failed", status: "ERROR" };
      }

      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });

      return { ...prevState, error: "An unexpected error occurred", status: "ERROR" };
    }
  };

  const [state, formAction] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
  });

  return (
    <form 
      action={formAction} 
      className="max-w-3xl mx-auto p-6 space-y-8 rounded-xl shadow-lg"
      style={{
        background: 'linear-gradient(135deg, #1e1e1e, #2d3e50, #343a40, #4c5c68)',
      }}
    >
      {/* Loop through form fields */}
      {formFields.map((field) => (
        <FormField 
          key={field.id} 
          field={field} 
          error={errors[field.id]} 
        />
      ))}

      {/* Pitch Section - Markdown Editor */}
      <div className="mb-6">
        <label htmlFor="pitch" className="block text-sm font-medium text-white mb-2">
          Pitch (Markdown)
        </label>

        <MDEditor
          value={pitch}
          onChange={(value) => setPitch(value as string)}
          id="pitch"
          preview="edit"
          height={300}
          style={{ borderRadius: 20, overflow: "hidden", color:"black" }}
          textareaProps={{
            placeholder:
              "Briefly describe your idea using Markdown syntax.",
          }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
        />

        {errors.pitch && <p className="mt-1 text-sm text-red-600">{errors.pitch}</p>}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors flex items-center justify-center"
        disabled={state.status === "PENDING"}
      >
        {state.status === "PENDING" ? "Submitting..." : "Submit Your Project"}
        <Send className="w-5 h-5 ml-2" />
      </Button>
    </form>
  );
};

export default StartupForm;
