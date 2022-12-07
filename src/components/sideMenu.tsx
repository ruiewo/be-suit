import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { page } from '../models/const/path';
import styles from '../styles/sideMenu.module.css';
import { AccountButton } from './accountButton';
import { MenuButton } from './menuButton';

export default function SideMenu() {
  return (
    <div className={styles.sideMenu}>
      <Logo />
      <Menu />
      <AccountButton />
    </div>
  );
}

function Logo() {
  return (
    <h1 className={styles.logo}>
      <Link key="Homeへ戻る" href={page.home}>
        <div>
          <Image src="/images/app-logo.svg" alt="Topへ戻る" width={50} height={50} />
        </div>
      </Link>
    </h1>
  );
}
function Menu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenuPanel = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menu = [
    { title: '機器管理', src: '/images/computer.svg', description: 'PC一覧を表示します', path: page.equipment },
    { title: 'Monitor', src: '/images/monitor.svg', description: 'モニタ一覧を表示します', path: `${page.equipment}/mo/d` },
    { title: '貸出', src: '/images/rental.svg', description: 'not implemented yet.', path: '' },
    { title: 'ユーザ管理', src: '/images/user.svg', description: 'ユーザ一覧を表示します', path: page.user },
    { title: 'マスタ管理', src: '/images/master.svg', description: 'not implemented yet.', path: '' },
    {
      title: 'メンテナンス',
      src: '/images/maintenance.svg',
      description: 'maintenance',
      path: '',
    },
    { title: 'QR Code', src: '/images/dev.svg', description: '開発用', path: page.qrCode },
    { title: 'Category', src: '/images/dev.svg', description: 'カテゴリ一覧を表示します', path: page.category },
    { title: 'MyPage', src: '/images/dev.svg', description: '開発用', path: page.myPage },
  ];

  return (
    <MenuButton isOpen={isMenuOpen} toggleOpen={toggleMenuPanel}>
      <div className={`${styles.menuOverlay} ${isMenuOpen ? styles.menuOverlayOpen : styles.menuOverlayClose}`}>
        <ul className={styles.menuOverlayGridContainer}>
          {menu.map(menu => (
            <li className={styles.menu} key={menu.title}>
              <Link href={menu.path}>{menu.title}</Link>
              <Link href={menu.path}>
                <span className={styles.menuDescription}>{menu.description}</span>
              </Link>
              <Image className={styles.menuSvg} src={menu.src} alt={menu.title} width={50} height={50} />
            </li>
          ))}
        </ul>
      </div>
    </MenuButton>
  );
}
