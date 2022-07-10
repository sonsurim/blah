import { Avatar, Box, Button, Divider, Flex, Text, Textarea } from '@chakra-ui/react';
import ResizeTextarea from 'react-textarea-autosize';
import { ChangeEventHandler, MouseEventHandler, useState } from 'react';
import axios from 'axios';
import { InMessage } from '@/models/message/in_message';
import convertDateToString from '@/utils/convert_date_to_string';

interface Props {
  uid: string;
  displayName: string;
  photoURL: string;
  isOwner: boolean;
  item: InMessage;
  onSendComplete: () => void;
}

const MessageItem = function ({ uid, displayName, photoURL, isOwner, item, onSendComplete }: Props) {
  const [reply, setReply] = useState('');
  const haveReply = item.reply !== undefined;

  const handleChangeReply: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setReply(e.currentTarget.value);
  };

  const handleSubmitReply: MouseEventHandler<HTMLButtonElement> = async () => {
    const response = await axios.post('/api/messages.add.reply', { uid, messageId: item.id, reply });

    if (response.status < 300) {
      onSendComplete();
    }

    console.log(response);
  };

  return (
    <Box borderRadius="md" width="full" bg="white" boxShadow="md">
      <Box>
        <Flex pl="2" pt="2" alignItems="center">
          <Avatar
            size="xs"
            src={item.author ? item.author.photoURL ?? 'https://bit.ly/broken-link' : 'https://bit.ly/broken-link'}
          />
          <Text fontSize="xx-small" ml="1">
            {item.author ? item.author.displayName : 'anonymous'}
          </Text>
          <Text whiteSpace="pre-line" fontSize="xx-small" color="gray.500" ml="1">
            {convertDateToString(item.createAt)}
          </Text>
        </Flex>
      </Box>
      <Box p="2">
        <Box borderRadius="md" borderWidth="1px" p="2">
          <Text whiteSpace="pre-line" fontSize="sm">
            {item.message}
          </Text>
        </Box>
        {haveReply && (
          <Box pt="2">
            <Divider />
            <Box display="flex" mt="2">
              <Box pt="2">
                <Avatar size="xs" src={photoURL} mr="2" />
              </Box>
              <Box borderRadius="md" p="2" width="full" bg="gray.100">
                <Flex alignItems="center">
                  <Text fontSize="xs">{displayName}</Text>
                  <Text whiteSpace="pre-line" fontSize="xs" color="gray">
                    {convertDateToString(item.replyAt!)}
                  </Text>
                </Flex>
                <Text whiteSpace="pre-line" fontSize="xs">
                  {item.reply}
                </Text>
              </Box>
            </Box>
          </Box>
        )}
        {!haveReply && isOwner && (
          <Box pt="2">
            <Divider />
            <Box display="flex" mt="2">
              <Box pt="1">
                <Avatar size="xs" src={photoURL} mr="2" />
              </Box>
              <Box borderRadius="md" width="full" bg="gray.100" mr="2">
                <Textarea
                  border="none"
                  boxShadow="none !important"
                  resize="none"
                  minH="unset"
                  overflow="hidden"
                  fontSize="xs"
                  placeholder="댓글을 입력하세요..."
                  as={ResizeTextarea}
                  value={reply}
                  onChange={handleChangeReply}
                />
              </Box>
              <Button
                disabled={!reply.length}
                colorScheme="pink"
                bgColor="#FF75B5"
                variant="solid"
                size="sm"
                onClick={handleSubmitReply}
              >
                등록
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MessageItem;
