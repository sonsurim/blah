import { firestore } from 'firebase-admin';
import CustomServerError from '@/controllers/error/custom_server_error';
import FirebaseAdmin from '../firebase_admin';
import { InMessage, InMessageServer } from './in_message';

const MEMBER_COLLECTION = 'members';
const MESSAGE_COLLECTION = 'messages';

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

interface Get {
  uid: string;
  messageId: string;
}

interface PostReply {
  uid: string;
  messageId: string;
  reply: string;
}

async function post({ uid, message, author }: postRequest) {
  const memberRef = FireStore.collection(MEMBER_COLLECTION).doc(uid);
  await FireStore.runTransaction(async (transaction) => {
    const memberDoc = await transaction.get(memberRef);

    if (!memberDoc.exists) {
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

async function list({ uid }: { uid: string }) {
  const memberRef = FireStore.collection(MEMBER_COLLECTION).doc(uid);
  const listData = await FireStore.runTransaction(async (transaction) => {
    const memberDoc = await transaction.get(memberRef);

    if (!memberDoc.exists) {
      throw new CustomServerError({ statusCode: 400, message: '존재하지 않는 사용자 입니다!' });
    }

    const messageCollection = memberRef.collection(MESSAGE_COLLECTION);
    const messageCollectionDoc = await transaction.get(messageCollection);
    const data = messageCollectionDoc.docs.map((mapValue) => {
      const docData = mapValue.data() as Omit<InMessageServer, 'id'>;
      const returnData = {
        ...docData,
        id: mapValue.id,
        createAt: docData.createAt.toDate().toISOString(),
        replyAt: docData.replyAt ? docData.replyAt.toDate().toISOString() : undefined,
      } as InMessage;

      return returnData;
    });

    return data;
  });

  return listData;
}

async function get({ uid, messageId }: Get) {
  const memberRef = FireStore.collection(MEMBER_COLLECTION).doc(uid);
  const messageRef = FireStore.collection(MEMBER_COLLECTION).doc(uid).collection(MESSAGE_COLLECTION).doc(messageId);
  const data = await FireStore.runTransaction(async (transaction) => {
    const memberDoc = await transaction.get(memberRef);
    const messageDoc = await transaction.get(messageRef);

    if (!memberDoc.exists) {
      throw new CustomServerError({ statusCode: 400, message: '존재하지 않는 사용자입니다!' });
    }

    if (!messageDoc.exists) {
      throw new CustomServerError({ statusCode: 400, message: '존재하지 않는 문서입니다!' });
    }

    const messageData = messageDoc.data() as InMessageServer;
    return {
      ...messageData,
      id: messageId,
      createAt: messageData.createAt.toDate().toISOString(),
      replyAt: messageData.replyAt ? messageData.replyAt.toDate().toISOString() : undefined,
    };
  });

  return data;
}

async function postReply({ uid, messageId, reply }: PostReply) {
  const memberRef = FireStore.collection(MEMBER_COLLECTION).doc(uid);
  const messageRef = FireStore.collection(MEMBER_COLLECTION).doc(uid).collection(MESSAGE_COLLECTION).doc(messageId);
  await FireStore.runTransaction(async (transaction) => {
    const memberDoc = await transaction.get(memberRef);
    const messageDoc = await transaction.get(messageRef);

    if (!memberDoc.exists) {
      throw new CustomServerError({ statusCode: 400, message: '존재하지 않는 사용자입니다!' });
    }

    if (!messageDoc.exists) {
      throw new CustomServerError({ statusCode: 400, message: '존재하지 않는 문서입니다!' });
    }

    const messageData = messageDoc.data() as InMessageServer;

    if (messageData.reply) {
      throw new CustomServerError({ statusCode: 400, message: '이미 답변을 등록했습니다 ☠️' });
    }

    await transaction.update(messageRef, { reply, replyAt: firestore.FieldValue.serverTimestamp() });
  });
}

const MessageModel = {
  post,
  list,
  get,
  postReply,
};

export default MessageModel;
