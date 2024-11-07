import { ZodError } from "zod";
import { ValidationError } from "sequelize";

export default function format(
  error: any,
  defaultMessage = ""
): Array<{ field: string | number; message: string }> {
  let formattedErrorList: Array<{ field: string | number; message: string }> =
    [];
  if (error instanceof ZodError) {
    const { errors } = error;

    for (let e of errors) {
      formattedErrorList.push({
        field: e.path[0],
        message: e.message,
      });
    }
    return formattedErrorList;
  } else if (error instanceof ValidationError) {
    for (let e of error.errors) {
      formattedErrorList.push({
        field: e.path || "",
        message: e.message,
      });
    }

    return formattedErrorList;
  }

  console.log(error);
  return [
    {
      field: "",
      message: defaultMessage,
    },
  ];
}
