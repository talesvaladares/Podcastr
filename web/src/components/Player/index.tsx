import Image from 'next/image'
import { useRef, useEffect, useState } from 'react';
import styles from "./styles.module.scss";
import {usePlayer} from '../../hooks/usePlayer';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player(){

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    togglePlay,
    playOrPauseWithKeyboard,
    nextEpisode,
    previousEpisode,
    isLooping,
    toggleLoop,
    isShuffling,
    toggleShuffle,
    clearPlayerState
  } = usePlayer();
  const episode = episodeList[currentEpisodeIndex];
  const audioRef = useRef<HTMLAudioElement>(null);

  const [progress, setProgress] = useState(0);

  function setupProgressListener(){
    //sempre que um novo audio é carregado, volta o tempo dele para zero 
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    })
  }

  function handleSeek(amount: number){
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  function handleEpisodeEndend(){
    if(episodeList.length === 1 ){
      clearPlayerState();
    }else{
      nextEpisode();
    }
  }


  //pausa ou da play no audio que está sendo tocado
  useEffect(()=>{
    if(!audioRef.current){
      return;
    }
    if(isPlaying){
      audioRef.current.play();
    }
    else{
      audioRef.current.pause();
    }
    
  },[isPlaying]);

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="tocando agora"/>
        <strong>Tocando agora</strong>
      </header>
      
      {
        episode ? (
          <div className={styles.currentEpisode}>
           <Image
              width={592}
              height={592}
              src={episode.thumbnail}
              objectFit="cover" 
            />
            <strong>{episode.title}</strong>
            <span>{episode.members}</span>
          </div>

        ) : (
          <div className={styles.emptyPlayer}>
            <strong>Selecione um podcast para ouvir</strong>
          </div>
        )
      }

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
           {
             episode ? (
               <Slider
                trackStyle={{backgroundColor: '#04d361'}}
                railStyle={{backgroundColor: '#9f75ff'}}
                handleStyle={{borderColor: '#04d361', borderWidth: 4}}
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
               />
             ):(
              <div className={styles.emptySlider}/>
             )
           }
          </div>
          <span>{episode ? convertDurationToTimeString(episode.duration) : '00:00'}</span>
        </div>

        {episode && (
          <audio
            src={episode.url}
            loop={isLooping}
            ref={audioRef}
            autoPlay
            onEnded={handleEpisodeEndend}
            onPlay={() => playOrPauseWithKeyboard(true)}
            onPause={() => playOrPauseWithKeyboard(false)}
            onLoadedMetadata={setupProgressListener}
          />
        )}

        <div className={styles.buttons}>
          <button
            type="button"
            disabled={!episode || episodeList.length === 1}
            className={isShuffling ? styles.isActive : ''}
            onClick={toggleShuffle}
          >
            <img src="/shuffle.svg" alt="embaralhar"/>
          </button>
          <button type="button" disabled={!episode} onClick={previousEpisode}>
            <img src="/play-previous.svg" alt="tocar anterior"/>
          </button>
          <button 
            type="button" 
            className={styles.playButton} 
            disabled={!episode} 
            onClick={togglePlay}
            onPlay={() => playOrPauseWithKeyboard(true)}
            onPause={() => playOrPauseWithKeyboard(false)}
          >
            {
              isPlaying 
              ? (<img src="/pause.svg" alt="tocar"/>)
              : (<img src="/play.svg" alt="tocar"/>)
            }
          </button>
          <button type="button" disabled={!episode} onClick={nextEpisode}>
            <img src="/play-next.svg" alt="tocar proxima"/>
          </button>
          <button type="button" disabled={!episode} className={isLooping ? styles.isActive : ''}>
            <img
              src="/repeat.svg"
              alt="repetir"
              onClick={toggleLoop}
              
            />
          </button>
        </div>
        

      </footer>
    </div>
  );
}