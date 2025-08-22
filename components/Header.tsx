import React from 'react';
import { User } from '../types';
import HeaderBar from './HeaderBar';
import StoriesList from './StoriesList';

export type StartProgressBarFn = (
  selectedUser: any,
  progressBars: React.MutableRefObject<any[]>,
  userStoryIndex: number,
  isPaused: boolean,
  handleTap: (event: any) => void,
) => void;

type HeaderProps = {
  data: User[];
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
  setUserStoryIndex: (index: number) => void;
  setIsStoryModalVisible: (visible: boolean) => void;
  progressBars: React.MutableRefObject<any[]>;
  startProgressBar: StartProgressBarFn;
};

export default function Header({
  data,
  setSelectedUser,
  setUserStoryIndex,
  setIsStoryModalVisible,
  progressBars,
  startProgressBar,
}: HeaderProps) {
  return (
    <>
      <HeaderBar />
      <StoriesList
        data={data}
        setSelectedUser={setSelectedUser}
        setUserStoryIndex={setUserStoryIndex}
        setIsStoryModalVisible={setIsStoryModalVisible}
        progressBars={progressBars}
        startProgressBar={startProgressBar}
      />
    </>
  );
}
