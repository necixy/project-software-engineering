import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState:  {
    likes: number;
    likedBy: number;
} = {
likes:0,
likedBy:0,
};

const likeSlice = createSlice({
  initialState,
  name: 'likes',
  reducers: {
    updateLikes(
      state: any,
      action: PayloadAction<number>,
    ) {
      state.likes = action?.payload;
    },
    updateLikedBy(state, action: PayloadAction<number>) {
      state.likedBy = action?.payload;
    },
  },
});

export const {
    updateLikes,
    updateLikedBy
} = likeSlice?.actions;
export default likeSlice?.reducer;
