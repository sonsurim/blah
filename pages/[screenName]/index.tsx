import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Switch,
  Text,
  Textarea,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import React, { ChangeEventHandler, useState } from 'react';
import ResizeTextArea from 'react-textarea-autosize';
import axios, { AxiosResponse } from 'axios';
import { ServiceLayout } from '@/components/service_layout';
import { useAuth } from '@/contexts/auth_user.context';
import { InAuthUser } from '@/models/in_auth_user';
import MessageItem from '@/components/message_item';

interface Props {
  userInfo: InAuthUser | null;
}

interface Author {
  displayName: string;
  photoURL?: string;
}

interface postRequest {
  uid: string;
  message: string;
  author?: Author;
}

async function postMessage({ uid, message, author }: postRequest) {
  if (message.length <= 0) {
    return {
      result: false,
      message: '메시지를 입력해주세요!',
    };
  }

  try {
    await axios.post('/api/messages.add/', { uid, message, author });
    return {
      result: true,
    };
  } catch (e) {
    console.error(e);
    return {
      result: false,
      message: '메시지 등록 실패',
    };
  }
}

const UserHomePage: NextPage<Props> = function ({ userInfo }) {
  const [message, setMessage] = useState('');
  const [isAnonymous, setAnonymous] = useState(true);
  const toast = useToast();
  const { authUser } = useAuth();

  const handleTextArea: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    const lineCount = e.currentTarget.value.match(/[^\n]*\n[^\n]*/gi)?.length ?? 1;

    if (lineCount + 1 > 7) {
      toast({
        status: 'error',
        title: '최대 7줄까지만 입력이 가능합니다!',
        position: 'top-right',
      });
      return;
    }

    setMessage(e.currentTarget.value);
  };

  const handleSwitch = () => {
    if (!authUser) {
      toast({ title: '로그인이 필요합니다!', position: 'top-right' });
      return;
    }
    setAnonymous((prev) => !prev);
  };

  if (!userInfo) {
    return <p>사용자를 찾을 수 없습니다!</p>;
  }

  const handleSubmit = async () => {
    const { uid } = userInfo;
    const postData: postRequest = {
      uid,
      message,
    };

    if (!isAnonymous) {
      postData.author = {
        photoURL: authUser?.photoURL ?? 'https://bit.ly/broken-link',
        displayName: authUser?.displayName ?? 'anonymous',
      };
    }

    const messageResponse = await postMessage(postData);

    if (!messageResponse.result) {
      toast({ title: '메시지 등록 실패', position: 'top-right' });
    }

    setMessage('');
  };

  return (
    // <ServiceLayout title="user home" minH="100vh" backgroundColor="gray.50">
    <ServiceLayout title={`${userInfo.displayName}의 Home`}>
      <Box maxW="md" mx="auto" pt="6">
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" mb="2" bg="white">
          <Flex p="6">
            <Avatar size="lg" src={userInfo.photoURL ?? 'https://bit.ly/broken-link'} mr="2" />
            <Flex direction="column" justify="center">
              <Text fontSize="md">{userInfo.displayName}</Text>
              <Text fontSize="xs">{userInfo.email}</Text>
            </Flex>
          </Flex>
        </Box>
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" mb="2" bg="white">
          <Flex align="center" p="2">
            <Avatar
              size="xs"
              src={isAnonymous ? 'https://bit.ly/broken-link' : authUser?.photoURL ?? 'https://bit.ly/broken-link'}
              mr="2"
            />
            <Textarea
              bg="gray.100"
              border="none"
              placeholder="무엇이 궁금하신가요?"
              resize="none"
              minH="unset"
              overflow="hidden"
              fontSize="xs"
              mr="2"
              maxRows={7}
              as={ResizeTextArea}
              value={message}
              onChange={(e) => handleTextArea(e)}
            />
            <Button
              disabled={!message}
              bgColor="#FFBB86C"
              color="white"
              colorScheme="yellow"
              variant="solid"
              size="sm"
              onClick={handleSubmit}
            >
              등록
            </Button>
          </Flex>
          <FormControl display="flex" alignItems="center" mt="1" mx="2" pb="2">
            <Switch
              size="sm"
              colorScheme="orange"
              id="anonymous"
              mr="1"
              isChecked={isAnonymous}
              onChange={handleSwitch}
            />
            <FormLabel htmlFor="anonymous" mb="0" fontSize="xx-small">
              Anonymous
            </FormLabel>
          </FormControl>
        </Box>
        <VStack spacing="12px" mt="6">
          <MessageItem
            uid="asd"
            photoURL={authUser?.photoURL ?? ''}
            displayName="test"
            isOwner={false}
            item={{
              id: 'test',
              message: '테스트용',
              createAt: '2022-03-15T20:15:55+09:00',
              reply: '댓글입니당',
              replyAt: '2022-05-15T20:15:55+09:00',
            }}
          />
          {/* <MessageItem /> */}
        </VStack>
      </Box>
    </ServiceLayout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const { screenName } = query;
  const defaultResponse = {
    props: {
      userInfo: null,
    },
  };

  if (!screenName) {
    return defaultResponse;
  }

  try {
    const PROTOCOL = process.env.PROTOCOL || 'http';
    const HOST = process.env.HOST || 'localhost';
    const PORT = process.env.PORT || '3000';
    const BASE_URL = `${PROTOCOL}://${HOST}:${PORT}`;
    const userInfoResponse: AxiosResponse<InAuthUser> = await axios(`${BASE_URL}/api/user.info/${screenName}`);

    console.info(userInfoResponse.data);
    return {
      props: {
        userInfo: userInfoResponse.data ?? null,
      },
    };
  } catch (e) {
    console.error(e);
    return defaultResponse;
  }
};

export default UserHomePage;
