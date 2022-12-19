import Image from 'next/image';
import Link from 'next/link';

import { page } from '../models/const/path';
import styles from '../styles/sideMenu.module.css';
import { AccountButton } from './accountButton';
import { MenuButton } from './menuButton';
import { Logo } from './sideMenu';

export function SideMenu2() {
  return (
    <div className={styles.sideMenu}>
      <Logo />
      <MenuButton />
      {menu.map(x => (
        <ShortcutButton key={x.title} src={x.src} href={x.path}></ShortcutButton>
      ))}
      <AccountButton />
    </div>
  );
}

const ShortcutButton = ({ src, href }: { src: string; href: string }) => (
  <Link href={href}>
    <Image src={src} alt="" width={30} height={30}></Image>
  </Link>
);
const menu = [
  { title: 'QR Code', path: page.qrCode, src: '/images/qrCode.svg' },
  { title: '機器管理', path: page.equipment, src: '/images/computer.svg' },
  { title: '貸出', path: '', src: '/images/rental.svg' },
  { title: 'ユーザ管理', path: page.user, src: '/images/user.svg' },
  { title: 'マスタ管理', path: page.maintenance, src: '/images/master.svg' },
  { title: '機器登録', path: page.register, src: '/images/dev.svg' },
];
