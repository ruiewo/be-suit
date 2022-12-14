import Image from 'next/image';
import Link from 'next/link';

import { page } from '../models/const/path';
import styles from '../styles/sideMenu.module.css';

type Props = {
  isMenuOpen: boolean;
};
export function Menu({ isMenuOpen }: Props) {
  const menu = [
    { title: '機器管理', description: 'PC一覧を表示します', path: page.equipment, src: '/images/computer.svg' },
    { title: 'Monitor', description: 'モニタ一覧を表示します', path: `${page.equipment}/mo/d`, src: '/images/monitor.svg' },
    { title: '貸出', description: 'not implemented yet.', path: '', src: '/images/rental.svg' },
    { title: 'ユーザ管理', description: 'ユーザ一覧を表示します', path: page.user, src: '/images/user.svg' },
    { title: 'マスタ管理', description: 'マスタ管理画面を表示します', path: page.maintenance, src: '/images/master.svg' },
    { title: 'QR Code', description: '開発用', path: page.qrCode, src: '/images/dev.svg' },
    { title: 'MyPage', description: '開発用', path: page.myPage, src: '/images/dev.svg' },
    { title: '機器登録', description: '機器登録を行います', path: page.register, src: '/images/dev.svg' },
  ];

  return (
    <div className={`${styles.menuOverlay} ${isMenuOpen ? styles.menuOverlayOpen : styles.menuOverlayClose}`}>
      <ul className={styles.menuOverlayGridContainer}>
        {menu.map(menu => (
          <MenuItem key={menu.title} {...menu}></MenuItem>
        ))}
      </ul>
    </div>
  );
}

type MenuItemProps = {
  title: string;
  description: string;
  path: string;
  src: string;
};

export function MenuItem({ title, description, path, src }: MenuItemProps) {
  return (
    <Link href={path}>
      <li className={styles.menu} key={title}>
        {title}
        <span className={styles.menuDescription}>{description}</span>
        <Image className={styles.menuSvg} src={src} alt={title} width={50} height={50} />
      </li>
    </Link>
  );
}
