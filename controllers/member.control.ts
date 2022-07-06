import { NextApiRequest, NextApiResponse } from 'next';
import MemberModel from '@/models/member/member.model';
import BadRequestError from './error/bad_request_error';

async function add(req: NextApiRequest, res: NextApiResponse) {
  const { uid, email, displayName, photoURL } = req.body;

  if (!uid) {
    throw new BadRequestError('uid가 누락되었습니다.');
  }

  if (!email) {
    throw new BadRequestError('email이 누락되었습니다!');
  }

  const addResult = await MemberModel.add({ uid, email, displayName, photoURL });

  if (addResult.result) {
    return res.status(200).json(addResult);
  }

  res.status(500).json(addResult);
}

async function findByScreenName(req: NextApiRequest, res: NextApiResponse) {
  const { screenName } = req.query;

  if (!screenName) {
    throw new BadRequestError('screenName이 누락되었습니다!');
  }

  const extractScreenName = Array.isArray(screenName) ? screenName[0] : screenName;
  const findResult = await MemberModel.findByScreenName(extractScreenName);

  if (!findResult) {
    return res.status(404).end();
  }

  res.status(200).json(findResult);
}

const MemberControl = {
  add,
  findByScreenName,
};

export default MemberControl;
