import { DevTool } from "@hookform/devtools";
import { useEffect } from "react";
import { FieldErrors, useFieldArray, useForm } from "react-hook-form";

let renderCount = 0;
type FormValues = {
  username: string;
  email: string;
  channel: string;
  social: {
    twitter: string;
    instagram: string;
  };
  phoneNumber: string[];
  phNumbers: { number: string }[];
  age: number;
  dob: Date;
};
export default function BasicForm() {
  renderCount++;

  /**
   * Setting defaultValues untuk state, buat useForm menerima args obj dgn defaultValues
   */

  const {
    register,
    control,
    handleSubmit,
    formState,
    watch,
    getValues,
    setValue,
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      username: "",
      email: "",
      channel: "",
      social: { twitter: "", instagram: "" },
      phoneNumber: ["", ""],
      // Dynamic Form
      phNumbers: [{ number: "" }],
      age: 0,
      dob: new Date(),
    },
  });

  /**
   * Untuk mengakses error message destructure dari formState dari useForm
   */

  const { errors, isDirty, isValid, isSubmitting, isSubmitSuccessful } =
    formState;

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  /**
   * onError ini akan menjadi argumen kedua dalam function bawaan RHF handleSubmit yang dimana kegunaannya untuk dapat mengcustom error message atau untuk mengirim reports ke logging server
   */

  const onError = (errors: FieldErrors<FormValues>) => {
    console.log("Form errors:", errors);
  };

  /**
   * Dynamic form menggunakan useFieldArray, append => tambah field , remove => hapus berdasarkan index
   */
  const { remove, append, fields } = useFieldArray({
    name: "phNumbers",
    control,
  });

  /**
   * Mantau value menggunakan method watch
   */

  // useEffect(() => {
  //   const subs = watch((value) => {
  //     console.log(value.username);
  //   });
  //   return () => subs.unsubscribe();
  // }, [watch]);

  /**
   * Method getValues jika tidak dikasi argument maka akan return semua value form
   */

  const handleGetValues = () => {
    console.log("Get Values:", getValues("social.twitter"));
  };

  /**
   * Method setValue untuk men-set value secara programatik
   */
  const handleSetValues = () => {
    setValue("username", "", {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };
  /**
   * Mereset form dengan method reset secara programatik dengan state isSubmitSuccessfull
   */
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      console.log(isSubmitSuccessful);
    }
  }, [isSubmitSuccessful, reset]);
  return (
    <div onSubmit={handleSubmit(onSubmit, onError)}>
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

        {/* Conditionally disable the input form */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Twitter
          </label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            {...register("social.twitter", {
              required: { value: true, message: "Twitter is required" },

              /**
               * If Channel is empty we disable the Twitter input, this cause the value will be undefined and the validation is ignored
               */

              disabled: watch("channel") === "",
            })}
          />
          <p className="text-red-800">{errors.social?.twitter?.message}</p>
        </div>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Instagram
          </label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            {...register("social.instagram")}
          />
          <p className="text-red-800">{errors.social?.instagram?.message}</p>
        </div>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Primary phone number
          </label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            {...register("phoneNumber.0", {
              required: {
                value: true,
                message: "Primary phone number is required",
              },
            })}
          />
          <p className="text-red-800">{errors.phoneNumber?.[0]?.message}</p>
        </div>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Secondary phone number
          </label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            {...register("phoneNumber.1")}
          />
        </div>

        {/* Dynamic Form */}
        {fields.map((field, index) => {
          return (
            <div className="flex flex-col mb-5" key={field.id}>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Phone {index + 1}
              </label>
              <input
                type="text"
                {...register(`phNumbers.${index}.number`)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Remove
                </button>
              )}
            </div>
          );
        })}

        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Age
          </label>
          <input
            type="number"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            {...register("age", {
              valueAsNumber: true,
              required: { value: true, message: "Age is required" },
            })}
          />
          <p className="text-red-800">{errors.age?.message}</p>
        </div>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Date of birth
          </label>
          <input
            type="date"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            {...register("dob", {
              valueAsDate: true,
              required: { value: true, message: "Date of Birth is required" },
            })}
          />
          <p className="text-red-800">{errors.dob?.message}</p>
        </div>
        <div className="flex flex-wrap gap-5">
          <button
            type="button"
            onClick={() => append({ number: "" })}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Add Phone
          </button>
          <button
            type="submit"
            /**
             * Disabling button if form is not modified / valid value / form is being submitting to prevent multiple submit
             */
            disabled={!isDirty || isSubmitting}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-red-600 disabled:hover:bg-red-800"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={handleGetValues}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Get Values
          </button>
          <button
            type="button"
            onClick={handleSetValues}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Set Values
          </button>
          <button
            type="button"
            onClick={() => reset()}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Reset
          </button>
        </div>
      </form>
      <DevTool control={control} />
    </div>
  );
}
/**
 * Touched => apakah user telah berinteraksi dengan field ?
 * Dirty => apakah user telah modify value dari field ?
 * isDirty => method yang mereturn boolean jika value telah termodify ( Berguna untuk membuat fitur tombol submit form enabled jika user telah memodifikasi value )
 */
