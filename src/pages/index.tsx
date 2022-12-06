import { useSession } from 'next-auth/react';

import { Loading } from '../components/loading';
import MainMenuCard from '../components/mainMenuCard';
import { page } from '../models/const/path';
import styles from '../styles/home.module.css';
import { NextPageWithLayout } from './_app';

const cards = [
  { title: '機器管理', src: '/images/computer.svg', description: 'PC一覧を表示します', path: page.equipment },
  { title: 'Monitor', src: '/images/monitor.svg', description: 'モニタ一覧を表示します。', path: `${page.equipment}/mo/d` },
  { title: '貸出', src: '/images/rental.svg', description: 'not implemented yet.', path: '' },
  { title: 'ユーザ管理', src: '/images/user.svg', description: 'not implemented yet.', path: page.user },
  { title: 'マスタ管理', src: '/images/master.svg', description: 'not implemented yet.', path: '' },
  {
    title: 'メンテナンス',
    src: '/images/maintenance.svg',
    description: 'maintenance',
    path: '',
  },
  { title: 'QR Code', src: '/images/dev.svg', description: '開発用', path: page.qrCode },
  { title: 'Category', src: '/images/dev.svg', description: '開発用', path: `${page.category}` },
  { title: 'signIn', src: '/images/dev.svg', description: '開発用', path: page.signIn },
];

const Home: NextPageWithLayout = () => {
  const { status } = useSession({ required: true });

  if (status === 'loading') {
    return <Loading />;
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
