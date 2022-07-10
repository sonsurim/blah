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

async function list(req: NextApiRequest, res: NextApiResponse) {
  const { uid } = req.query;

  if (!uid) {
    throw new BadRequestError('uid가 누락되었습니다!');
  }

  const uidToString = Array.isArray(uid) ? uid[0] : uid;
  const listResponse = await MessageModel.list({ uid: uidToString });

  return res.status(200).json(listResponse);
}

async function get(req: NextApiRequest, res: NextApiResponse) {
  const { uid, messageId } = req.query;

  if (!uid) {
    throw new BadRequestError('uid가 누락되었습니다!');
  }

  if (!messageId) {
    throw new BadRequestError('message Id가 누락되었습니다!');
  }

  const uidToString = Array.isArray(uid) ? uid[0] : uid;
  const messageIdToString = Array.isArray(messageId) ? messageId[0] : messageId;
  const data = await MessageModel.get({ uid: uidToString, messageId: messageIdToString });
  return res.status(200).json(data);
}

async function postReply(req: NextApiRequest, res: NextApiResponse) {
  const { uid, messageId, reply } = req.body;

  if (!uid) {
    throw new BadRequestError('uid가 누락되었습니다!');
  }

  if (!messageId) {
    throw new BadRequestError('message Id가 누락되었습니다!');
  }

  if (!reply) {
    throw new BadRequestError('Reply가 누락되었습니다!');
  }

  await MessageModel.postReply({ uid, messageId, reply });
  return res.status(201).end();
}

const MessageControl = {
  post,
  list,
  get,
  postReply,
};

export default MessageControl;
