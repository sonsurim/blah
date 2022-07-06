export interface InMessage {
  id: string;
  message: string;
  reply?: string;
  createAt: string;
  replyAt?: string;
  author?: {
    displayName: string;
    photoURL?: string;
  };
}
