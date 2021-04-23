import { GetStaticPaths, GetStaticProps } from "next";
import Head from 'next/head';
import Image from 'next/image'
import Link from 'next/link';
import { format, parseISO } from "date-fns";
import ptBr from 'date-fns/locale/pt-BR';
import { api } from "../../services/api";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";
import styles from '../../styles/pages/episode.module.scss';
import { usePlayer } from "../../hooks/usePlayer";


type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
  url: string;
  description: string;
};

interface EpisodeProps{
  episode: Episode;
}

export default function Episode({episode}: EpisodeProps){

  const {play} = usePlayer();

  return (
    <div className={styles.episode}>
      <Head>
        <title>{episode.title}</title>
      </Head>
      
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="voltar" />
          </button>
        </Link>
        <Image
          width={700}
          height={160}
          src={episode.thumbnail}
          alt={episode.title}
          objectFit="cover" 
        />
        <button type="button" onClick={() => play(episode)}>
          <img  src="/play.svg" alt="voltar" />
        </button>
      </div>
      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div className={styles.description} dangerouslySetInnerHTML={{__html: episode.description}} />
      
    </div>
  );
}
export const getStaticPaths : GetStaticPaths = async () => {

  const {data} = await api.get('/episodes', {
    params: {
      _limit: 2,
      _sort: 'published_at',
      _order: 'desc'
    }
  });

  const paths = data.map(episode => {
    return {
      params: {
        slug: episode.id
      }
    }
  })

  return {
    paths: paths,
    fallback: 'blocking'
  }
};

export const getStaticProps : GetStaticProps = async ({params}) => {

  const {slug} = params;

  const {data} = await api.get(`/episodes/${slug}`);


  const episode = {
    
      id: data.id,
      title: data.title,
      thumbnail: data.thumbnail,
      members: data.members,
      publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBr }),
      duration: Number(data.file.duration),
      durationAsString: convertDurationToTimeString(Number(data.file.duration)),
      description: data.description,
      url: data.file.url,
    
  }

  return {
    props: {
      episode
    },
    revalidate: 60 * 60 * 24 //1 dia
  }
}