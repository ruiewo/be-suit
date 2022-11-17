import { useSession } from 'next-auth/react';

import MainMenuCard from '../components/mainMenuCard';
import { page } from '../models/const/path';
import styles from '../styles/Home.module.css';
import { NextPageWithLayout } from './_app';

const cards = [
  { title: 'Monitor', src: '/images/monitor.svg', description: 'モニタ一覧を表示します。', path: '' },
  { title: '貸出', src: '/images/rental.svg', description: 'not implemented yet.', path: '' },
  { title: '機器管理', src: '/images/computer.svg', description: 'PC一覧を表示します', path: page.equipment },
  { title: 'ユーザ管理', src: '/images/user.svg', description: 'not implemented yet.', path: '' },
  { title: 'マスタ管理', src: '/images/master.svg', description: 'not implemented yet.', path: '' },
  {
    title: 'メンテナンス',
    src: '/images/maintenance.svg',
    description: 'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica',
    path: '',
  },
  { title: 'QR Code', src: '/images/dev.svg', description: '開発用', path: page.qrCode },
  { title: 'デスクトップPC', src: '/images/dev.svg', description: '開発用', path: `${page.equipment}/pc/d` },
  { title: 'ノートPC', src: '/images/dev.svg', description: '開発用', path: `${page.equipment}/pc/n` },
  { title: 'タブレット', src: '/images/dev.svg', description: '開発用', path: `${page.equipment}/pc/t` },
  { title: 'Category-PC', src: '/images/dev.svg', description: '開発用', path: `${page.category}/pc` },
  { title: 'signIn', src: '/images/dev.svg', description: '開発用', path: page.signIn },
];

const Home: NextPageWithLayout = () => {
  const { data: session, status } = useSession({ required: true });

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.grid}>
      {cards.map(x => (
        <MainMenuCard key={x.title} {...x} />
      ))}
    </div>
  );
};

export default Home;
