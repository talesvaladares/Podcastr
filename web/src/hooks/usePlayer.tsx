import {createContext, ReactNode, useContext, useState} from 'react';

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
  url: string;
}

interface PlayerContextData{
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  clearPlayerState():void;
  loadEpisodeList(episodes: Episode[]): void;
  play(episode: Episode):void;
  playOrPauseWithKeyboard(event: boolean);
  togglePlay(): void;
  playList(list: Episode[], index: number):void;
  nextEpisode():void;
  previousEpisode():void;
  toggleLoop():void;
  toggleShuffle():void;
}

interface PlayerContextProviderProps {
  children: ReactNode;
}

const PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvider({children} : PlayerContextProviderProps) {

  const [episodeList, setEpisodeList] = useState<Episode[]>([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState<number>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  
  function togglePlay(){
    setIsPlaying(!isPlaying);
  }

  function toggleLoop(){
    setIsLooping(!isLooping);
  }

  function toggleShuffle(){
    setIsShuffling(!isShuffling);
  }

  function play(episode: Episode){
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true);
  }

  function playList(list: Episode[], index : number){
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function loadEpisodeList(episodes: Episode[]){
    setEpisodeList(episodes);
  }

  function playOrPauseWithKeyboard(event: boolean){
    setIsPlaying(event);
  }

  function nextEpisode(){
    const nextEpisodeIndex = currentEpisodeIndex +1;

    if(isShuffling){
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
      setCurrentEpisodeIndex(nextEpisodeIndex);
      return ;
    }

    if(nextEpisodeIndex >= episodeList.length){
      setCurrentEpisodeIndex(0);
      return;
    }
     

    setCurrentEpisodeIndex(currentEpisodeIndex +1);
  }

  function previousEpisode(){
    const previousEpisodeIndex = currentEpisodeIndex - 1;

    if(previousEpisodeIndex <= 0){
      setCurrentEpisodeIndex(0);
      return;
    }

    setCurrentEpisodeIndex(currentEpisodeIndex -1);
  }

  function clearPlayerState(){
    setCurrentEpisodeIndex(0);
    setEpisodeList([]);
  }

  return (
   <PlayerContext.Provider
    value={{
      currentEpisodeIndex,
      episodeList,
      loadEpisodeList,
      play,
      isPlaying,
      togglePlay,
      playOrPauseWithKeyboard,
      playList,
      nextEpisode,
      previousEpisode,
      toggleLoop,
      isLooping,
      toggleShuffle,
      isShuffling,
      clearPlayerState
    }}
   >
     {children}
   </PlayerContext.Provider>
  )
}

export function usePlayer() : PlayerContextData {

  const context = useContext(PlayerContext);

  return context;
}