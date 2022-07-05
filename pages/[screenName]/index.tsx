import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import { NextPage } from 'next';
import React from 'react';
import { ServiceLayout } from '@/components/service_layout';

const userInfo = {
  uid: 'test',
  email: 'thstnfla014@gmail.com',
  displayName: '손수림',
  photoURL: 'https://lh3.googleusercontent.com/a-/AOh14GjfZxc1QOf_J22PnUxoToNxT3_b2YNjCMENde7MvA=s96-c',
};

const UserHomePage: NextPage = function () {
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
      </Box>
    </ServiceLayout>
  );
};

export default UserHomePage;
