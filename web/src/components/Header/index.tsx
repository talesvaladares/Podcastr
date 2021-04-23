import Link from 'next/link';
import styles from "./styles.module.scss";
import format from 'date-fns/format';
import ptBR from "date-fns/locale/pt-BR";

export function Header(){
  
  const dateCurrent = format(new Date(), 'EEEEEE, d MMM', {locale: ptBR})

  return (
    <header className={styles.headerContainer}>
      {/* <Link href="/"> */}
        {/* <a> */}
          <img src="logo.svg" alt="Podcastr"/>
        {/* </a> */}
      {/* </Link> */}

      <p>O melhor para você ouvir, sempre</p>

      <span>{dateCurrent}</span>
    </header>
  );
}