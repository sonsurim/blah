import FirebaseAdmin from '../firebase_admin';
import { InAuthUser } from '../in_auth_user';

const MEMBER_COLLECTION = 'members';
const SCREEN_NAME_COLLECTION = 'screen_names';

type AddResult = { result: true; id: string } | { result: false; message: string };

async function add({ uid, displayName, email, photoURL }: InAuthUser): Promise<AddResult> {
  try {
    const screenName = (email as string).replace('@gmail.com', '');
    const addResult = await FirebaseAdmin.getInstance().Firebase.runTransaction(async (transaction) => {
      const memberRef = FirebaseAdmin.getInstance().Firebase.collection(MEMBER_COLLECTION).doc(uid);
      const screenNameRef = FirebaseAdmin.getInstance().Firebase.collection(SCREEN_NAME_COLLECTION).doc(screenName);

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
      return { result: true, id: uid };
    }

    return { result: true, id: uid };
  } catch (e) {
    console.error(e);
    return { result: false, message: '서버 에러!' };
  }
}

async function findByScreenName(screenName: string): Promise<InAuthUser | null> {
  const memberRef = FirebaseAdmin.getInstance().Firebase.collection(SCREEN_NAME_COLLECTION).doc(screenName);

  const memberDoc = await memberRef.get();

  if (!memberDoc.exists) {
    return null;
  }

  const data = memberDoc.data() as InAuthUser;
  return data;
}

const MemberModel = {
  add,
  findByScreenName,
};

export default MemberModel;
