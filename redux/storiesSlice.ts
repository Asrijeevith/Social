import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Story {
  id: number;
  media_url: string;
  media_type: string;
  seen: boolean;
}

export interface User {
  user_id: number;
  username: string;
  profile_pic: string;
  stories: Story[];
  all_seen: boolean;
}

export interface StoriesState {
  data: User[];
  loading: boolean;
  error: string | null;
}

const initialState: StoriesState = {
  data: [],
  loading: true,
  error: null,
};

const storiesSlice = createSlice({
  name: 'stories',
  initialState,
  reducers: {
    fetchStoriesRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchStoriesSuccess(state, action: PayloadAction<User[]>) {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
    fetchStoriesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchStoriesRequest, fetchStoriesSuccess, fetchStoriesFailure } = storiesSlice.actions;
export default storiesSlice.reducer;