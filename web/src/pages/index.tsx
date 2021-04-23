import {GetStaticProps} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import {format, parseISO} from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';
import {api} from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

import {usePlayer} from '../hooks/usePlayer';

import styles from '../styles/pages/home.module.scss';

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
  url: string;
};

type HomeProps = {
    episodes: Episode[];
  
};

export default function Home({episodes}: HomeProps) {

  const { playList} = usePlayer();


  
  const lastedEpisodes = episodes.slice(0, 2);
  const AllEpisodes = episodes.slice(2, episodes.length);

  return (
   <div className={styles.homePage}>
     <Head>
       <title>Home | Podcastr</title>
     </Head>
     <section className={styles.latestEpisodes}>
      <h2>Ultimos lançamentos</h2>
      <ul>
        {
          lastedEpisodes.map((episode, index) => {
            return (
              <li key={episode.id}>
                <Image
                  width={192}
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit="cover"
                />

                <div className={styles.episodesDeatails}>
                  <Link href={`/episode/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button" onClick={() => playList(episodes, index)} >
                  <img src="/play-green.svg" alt="tocar episódio"/>
                </button>
              </li>
            )
          })
        }
      </ul>
     </section>
     <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>

        <table cellSpacing="0">
          <thead>
            <th></th>
            <th>Podcast</th>
            <th>Integrantes</th>
            <th>Data</th>
            <th>Duração</th>
            <th></th>
          </thead>
          <tbody>
            {
              AllEpisodes.map((episode, index) => {
                return (
                  <tr key={episode.id}>
                    <td style={{width: 72}}>
                      <Image
                        width={120}
                        height={120}
                        src={episode.thumbnail}
                        alt={episode.title}
                        objectFit="cover"
                      />
                    </td>
                    <td>
                      <Link href={`/episode/${episode.id}`}>
                        <a>{episode.title}</a>
                      </Link>
                    </td>
                    <td>{episode.members}</td>
                    <td style={{width: 100}}>{episode.publishedAt}</td>
                    <td>{episode.durationAsString}</td>
                    <td>
                      <button type="button" onClick={() => playList(episodes , index + lastedEpisodes.length)} >
                        <img src="/play-green.svg" alt="tocar episódio"/>
                      </button>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>

        </table>
     </section>
   </div>
  )
}
export const getStaticProps : GetStaticProps = async () => {

  // const response = await api.get('/episodes?_limit=12&_sort=published_at&_order=desc');

  const {data} = await api.get("/episodes", {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  });

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBr }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url,
    };
  });

  // const latestEpisodes = episodes.slice(0, 2);
  // const allEpisodes = episodes.slice(2, episodes.lenght);

  return {
    props : {
      episodes
    },
    revalidate: 60 * 60 * 8
  }
}
