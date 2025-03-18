interface createChannelType {
  lastMessage?: null;
  admins: string[];
  channelInfo: {
    name: string;
    picture?: string;
    type: 'chat' | 'group';
    createdBy: string;
  };
  attributes?: any;
  isActive: boolean;
  dateUpdated?: any;
  createdAt: any;
  participants: {
    [key: string]: boolean;
  };
}
interface channelItemType {
  image: string;
  name: string;
  id: string;
}
interface channelsType {
  [key: string]: channelUserItem;
}

interface MessagePayload {
  id: string;
  createdAt: any;
  text: string;
  author: string;
  delivered: stringKeyBooleanValue;
  readBy: stringKeyBooleanValue;
}
