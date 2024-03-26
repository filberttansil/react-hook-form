import { DevTool } from "@hookform/devtools";
import { useForm } from "react-hook-form";

let renderCount = 0;
type FormValues = {
  username: string;
  email: string;
  channel: string;
};
export default function App() {
  renderCount++;
  // Setting defaultValues untuk state, buat useForm menerima args obj dgn defaultValues
  const { register, control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: { username: "filbert", email: "", channel: "" },
  });
  // Untuk mengakses error message destructure dari formState dari useForm
  const { errors } = formState;
  const onSubmit = (data: FormValues) => {
    console.log(data);
  };
  return (
    <div onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-bold">RenderCount : {renderCount / 2}</h1>
      <form className="max-w-sm mx-auto" noValidate>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Username
          </label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            {...register("username", {
              required: { value: true, message: "Username is required" },
            })}
          />
          <p className="text-red-800">{errors.username?.message}</p>
        </div>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Email
          </label>
          <input
            type="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            {...register("email", {
              pattern: {
                // Regex Pattern
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email format",
              },
              required: { value: true, message: "Email is required" },
              // Custom Validation (Jika tidak satisfy condition error message di || kanan)
              validate: {
                notAdmin: (fieldValue) => {
                  return (
                    fieldValue !== "admin@example.com" ||
                    "Enter a different email address"
                  );
                },
                notBlackListed: (fieldValue) => {
                  return (
                    !fieldValue.endsWith("gmail.com") ||
                    "This domain is not supported"
                  );
                },
              },
            })}
          />
          <p className="text-red-800">{errors.email?.message}</p>
        </div>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Channel
          </label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            {...register("channel", {
              required: { value: true, message: "Channel is required" },
            })}
          />
          <p className="text-red-800">{errors.channel?.message}</p>
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </form>
      <DevTool control={control} />
    </div>
  );
}
