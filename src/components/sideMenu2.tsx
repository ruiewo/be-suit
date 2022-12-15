import Image from 'next/image';
import Link from 'next/link';

import { page } from '../models/const/path';
import styles from '../styles/sideMenu.module.css';
import { AccountButton } from './accountButton';
import { QrCodeButton } from './button/qrCodeButton';
import { MenuButton } from './menuButton';
import { Logo } from './sideMenu';

export function SideMenu2() {
  return (
    <div className={styles.sideMenu}>
      <Logo />
      <MenuButton />
      <QrCodeButton />
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
  { title: '機器管理', description: 'PC一覧を表示します', path: page.equipment, src: '/images/computer.svg' },
  { title: 'Monitor', description: 'モニタ一覧を表示します', path: `${page.equipment}/mo/d`, src: '/images/monitor.svg' },
  { title: '貸出', description: 'not implemented yet.', path: '', src: '/images/rental.svg' },
  { title: 'ユーザ管理', description: 'ユーザ一覧を表示します', path: page.user, src: '/images/user.svg' },
  { title: 'マスタ管理', description: 'マスタ管理画面を表示します', path: page.maintenance, src: '/images/master.svg' },
  { title: 'QR Code', description: '開発用', path: page.qrCodePrint, src: '/images/dev.svg' },
  { title: '機器登録', description: '機器登録を行います', path: page.register, src: '/images/dev.svg' },
];
