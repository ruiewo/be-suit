import MainMenuCard from '../components/mainMenuCard';
import styles from '../styles/Home.module.css';
import { NextPageWithLayout } from './_app';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { isClientSide } from '../modules/util';
import { page } from '../models/path';

const Home: NextPageWithLayout = () => {
  const cards = [
    { title: 'Monitor', src: '/images/monitor.svg', description: 'モニタ一覧を表示します。', path: '' },
    { title: '貸出', src: '/images/rental.svg', description: 'not implemented yet.', path: '' },
    { title: '機器管理', src: '/images/computer.svg', description: 'PC一覧を表示します', path: page.equipment },
    { title: 'ユーザ登録', src: '/images/user.svg', description: 'not implemented yet.', path: '' },
    { title: 'マスタ管理', src: '/images/master.svg', description: 'not implemented yet.', path: '' },
    {
      title: 'メンテナンス',
      src: '/images/maintenance.svg',
      description: 'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica',
      path: '',
    },
    { title: 'QR Code', src: '/images/dev.svg', description: '開発用', path: page.qrCode },
    { title: 'equipment', src: '/images/dev.svg', description: '開発用', path: page.equipment },
    { title: 'signIn', src: '/images/dev.svg', description: '開発用', path: page.signIn },
    { title: 'login', src: '/images/dev.svg', description: '開発用', path: page.login },
  ];

  const { data: session, status } = useSession();
  if (status === 'unauthenticated') {
    if (isClientSide()) {
      const router = useRouter();
      router.push(page.signIn);
    }
  }

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
