import { firestore } from 'firebase-admin';
import CustomServerError from '@/controllers/error/custom_server_error';
import FirebaseAdmin from '../firebase_admin';

const MEMBER_COLLECTION = 'members';
const MESSAGE_COLLECTION = 'messages';
const SCREEN_NAME_COLLECTION = 'screen_names';

const { FireStore } = FirebaseAdmin.getInstance();

interface Author {
  displayName: string;
  photoURL?: string;
}

interface postRequest {
  uid: string;
  message: string;
  author?: Author;
}

interface MessageBody {
  message: string;
  createAt: firestore.FieldValue;
  author?: Author;
}

async function post({ uid, message, author }: postRequest) {
  const memberRef = FireStore.collection(MEMBER_COLLECTION).doc(uid);
  await FireStore.runTransaction(async (transaction) => {
    const memberDoc = await transaction.get(memberRef);

    if (!memberDoc) {
      throw new CustomServerError({ statusCode: 400, message: '존재하지 않는 사용자 입니다!' });
    }

    const newMessageRef = memberRef.collection(MESSAGE_COLLECTION).doc();
    const newMessageBody: MessageBody = {
      message,
      createAt: firestore.FieldValue.serverTimestamp(),
    };

    if (author !== undefined) {
      newMessageBody.author = author;
    }

    await transaction.set(newMessageRef, newMessageBody);
  });
}

const MessageModel = {
  post,
};

export default MessageModel;
