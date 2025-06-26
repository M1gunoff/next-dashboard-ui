import { FieldError, UseFormRegister } from "react-hook-form";

type InputFieldProps = {
  label: string;
  type?: string;
  register: UseFormRegister<any>;
  name: string;
  defaultValue?: string;
  error?: FieldError;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  hidden?: boolean;
  options?: Array<{ value: string | number; label: string }>;
};

const InputField = ({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  error,
  inputProps,
  hidden,
  options,
}: InputFieldProps) => {
  return (
    <div className={`flex flex-col gap-2 w-full md:w-1/4 ${hidden ? 'hidden' : ''}`}>
      <label className="text-xs text-gray-500">{label}</label>
      {type === "select" ? (
        <select
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          {...register(name)}
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          {...register(name)}
        />
      ) : (
        <input
          type={type}
          {...register(name)}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          {...inputProps}
        />
      )}
      {error?.message && (
        <p className="text-xs text-red-400">{error.message.toString()}</p>
      )}
    </div>
  );
};

export default InputField;
