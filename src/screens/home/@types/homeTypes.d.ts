//This code defines the types that are being used inside the home screen.
interface TFeedPostObject {
  userName: string;
  userImage: string;
  media: {type: string; uri: string}[];
  likes?: [];
  caption: string;
  numberOfComments: [];
  createdAt: number;
  rating: number;
  id: string;
  createdBy: string;
  comments?: [];
  userDetails?: TUserDetails;
}
interface ICustomFeedPostComponent {
  feedPostObject: TFeedPostObject;
}
interface TCommentComponentProps {
  item: {
    id: string;
    comment: string;
    createdAt: number;
    uid: string;
    numberOfReplies: number;
    likes: number;
  };
  replyTo: {
    profileName: string;
    repliedUser: string;
    commentId: string;
  } | null;
  setReplyTo: Dispatch<
    SetStateAction<{
      profileName: string;
      repliedUser: string;
      commentId: string;
    } | null>
  >;
  author: string;
  feedPostString: string;
}
interface TReplyComponentProps {
  item: {
    id: string | null;
    comment: string;
    createdAt: number;
    uid: string;
    numberOfReplies: number;
    profileName: string;
    likes: number;
  };
  replyTo: {
    profileName: string;
    repliedUser: string;
    commentId: string;
  } | null;
  setReplyTo: Dispatch<
    SetStateAction<{
      profileName: string;
      repliedUser: string;
      commentId: string;
    } | null>
  >;
  author: string;
  commentId: string;
}
