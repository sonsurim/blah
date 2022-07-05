import { Avatar, Box, Button, Flex, Text, Textarea, useToast } from '@chakra-ui/react';
import { NextPage } from 'next';
import React, { ChangeEventHandler, useState } from 'react';
import ResizeTextArea from 'react-textarea-autosize';
import { ServiceLayout } from '@/components/service_layout';

const userInfo = {
  uid: 'test',
  email: 'thstnfla014@gmail.com',
  displayName: '손수림',
  photoURL: 'https://lh3.googleusercontent.com/a-/AOh14GjfZxc1QOf_J22PnUxoToNxT3_b2YNjCMENde7MvA=s96-c',
};

const UserHomePage: NextPage = function () {
  const [message, setMessage] = useState('');
  const toast = useToast();

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
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

  return (
    <ServiceLayout title="user home" minH="100vh" backgroundColor="gray.50">
      <Box maxW="md" mx="auto" pt="6">
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" mb="2" bg="white">
          <Flex p="6">
            <Avatar size="lg" src={userInfo.photoURL} mr="2" />
            <Flex direction="column" justify="center">
              <Text fontSize="md">{userInfo.displayName}</Text>
              <Text fontSize="xs">{userInfo.email}</Text>
            </Flex>
          </Flex>
        </Box>
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" mb="2" bg="white">
          <Flex align="center" p="2">
            <Avatar size="xs" src="https://bit.ly/broken-link" mr="2" />
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
              onChange={(e) => handleChange(e)}
            />
            <Button disabled={!message} bgColor="#FFBB86C" color="white" colorScheme="yellow" variant="solid" size="sm">
              등록
            </Button>
          </Flex>
        </Box>
      </Box>
    </ServiceLayout>
  );
};

export default UserHomePage;
