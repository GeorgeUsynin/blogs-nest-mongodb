import { Prop } from '@nestjs/mongoose';

export abstract class Likeable {
  @Prop({
    type: {
      dislikesCount: Number,
      likesCount: Number,
    },
    default: { dislikesCount: 0, likesCount: 0 }, // Set default object
    _id: false,
  })
  likesInfo: {
    dislikesCount: number;
    likesCount: number;
  };
}
