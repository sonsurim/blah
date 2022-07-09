import { firestore } from 'firebase-admin';

interface MessageBase {
  id: string;
  message: string;
  reply?: string;
  author?: {
    displayName: string;
    photoURL?: string;
  };
}

export interface InMessage extends MessageBase {
  createAt: string;
  replyAt?: string;
}

export interface InMessageServer {
  createAt: firestore.Timestamp;
  replyAt?: firestore.Timestamp;
}
