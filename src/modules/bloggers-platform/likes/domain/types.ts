export enum LikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

export enum ParentType {
  Comment = 'comment',
  Post = 'post',
}

export type NonNoneLikeStatus = Exclude<LikeStatus, LikeStatus.None>;
