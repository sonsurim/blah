import { NextApiRequest, NextApiResponse } from 'next';
import FirebaseAdmin from '@/models/firebase_admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { uid, email, displayName, photoURL } = req.body;

  if (!uid) {
    return res.status(400).json({ result: false, message: 'uid가 누락되었습니다!' });
  }

  if (!email) {
    return res.status(400).json({ result: false, message: 'email이 누락되었습니다!' });
  }

  try {
    const screenName = (email as string).replace('@gmail.com', '');
    const addResult = await FirebaseAdmin.getInstance().Firebase.runTransaction(async (transaction) => {
      const memberRef = FirebaseAdmin.getInstance().Firebase.collection('members').doc(uid);
      const screenNameRef = FirebaseAdmin.getInstance().Firebase.collection('screen_names').doc(screenName);

      const memberDoc = await transaction.get(memberRef);
      if (memberDoc.exists) {
        return false;
      }

      const addData = {
        uid,
        email,
        displayName: displayName ?? '',
        photoURL: photoURL ?? '',
      };

      await transaction.set(memberRef, addData);
      await transaction.set(screenNameRef, addData);
      return true;
    });
    if (!addResult) {
      return res.status(201).json({ result: true, id: uid });
    }

    return res.status(200).json({ result: true, id: uid });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ result: false });
  }
}
