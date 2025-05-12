const errMessage = (HTTPcode, message) => {
  const error = new Error(message);
  error.statusCode = HTTPcode;
  return error;
};

export default errMessage;
