import { NextApiRequest, NextApiResponse } from 'next';
import handleError from '@/controllers/error/handle.error';
import checkSupportMethod from '@/controllers/error/check_support_method';
import MessageControl from '@/controllers/message.control';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  const supportMethod = ['GET'];

  if (!method) {
    return;
  }

  try {
    checkSupportMethod(supportMethod, method);
    await MessageControl.get(req, res);
  } catch (e) {
    console.error(e);
    handleError(e, res);
  }
}
