import { NextApiRequest, NextApiResponse } from 'next';
import MessageModel from '@/models/message/message.model';
import BadRequestError from './error/bad_request_error';

async function post(req: NextApiRequest, res: NextApiResponse) {
  const { uid, message, author } = req.body;

  if (!uid) {
    throw new BadRequestError('uid가 누락되었습니다!');
  }

  if (!message) {
    throw new BadRequestError('message가 누락되었습니다!');
  }

  await MessageModel.post({ uid, message, author });
  return res.status(201).end();
}

const MessageControl = {
  post,
};

export default MessageControl;
