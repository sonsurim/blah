import { NextApiRequest, NextApiResponse } from 'next';
import MemberControl from '@/controllers/member.control';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const supportMethod = ['POST'];

  if (!method) {
    return;
  }

  try {
    if (supportMethod.indexOf(method) === -1) {
      // 에러 발생
    }

    await MemberControl.add(req, res);
  } catch (e) {
    console.error(e);
    // 에러 처리
  }
}
