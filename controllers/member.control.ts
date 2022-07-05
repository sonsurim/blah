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

const MemberControl = {
  add,
};

export default MemberControl;
