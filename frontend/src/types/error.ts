const error = {
  message: [
    {
      field: "password",
      message: "password must be longer than or equal to 6 characters",
    },
  ],
  error: "Bad Request",
  statusCode: 400,
};

type ErrorFormSubmit = {
  message: { field: string; message: string }[];
  error: string;
  statusCode: number;
};
