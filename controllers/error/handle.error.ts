import { NextApiResponse } from 'next';
import CustomServerError from './custom_server_error';

const handleError = (error: unknown, res: NextApiResponse) => {
  let unknownError = error;

  if (!(error instanceof CustomServerError)) {
    unknownError = new CustomServerError({ statusCode: 500, message: 'UnKnown Error!' });
  }

  const customError = unknownError as CustomServerError;
  res
    .status(customError.statusCode)
    .setHeader('location', customError.location ?? '')
    .send(customError.serializeErrors()); // 에러 응답에 body 전달
};

export default handleError;
