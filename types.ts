export type Story = {
  id: number;
  media_url: string;
  media_type: 'image' | 'video';
  created_at: string;
  seen: boolean;
};

export type User = {
  user_id: number; // always number
  username: string;
  profile_pic: string;
  all_seen: boolean;
  stories: Story[];
};
