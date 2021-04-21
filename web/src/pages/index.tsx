import {GetStaticProps} from 'next';
export default function Home() {
  return (
    <p>Index</p>
  )
}

export const getStaticProps : GetStaticProps = async () => {

  const response = await fetch('http:localhost:3333');
  const data = await response.json();

  return {
    props: {
      episodes: data
    },
    relavidate: 60 * 60 * 8 // a cada 8 horas
  }
}
