import Image from 'next/image';
import Link from 'next/link';

import { page } from '../models/const/path';
import styles from '../styles/sideMenu.module.css';
import { AccountButton } from './accountButton';
import { QrCodeButton } from './button/qrCodeButton';
import { MenuButton } from './menuButton';

export function SideMenu() {
  return (
    <div className={styles.sideMenu}>
      <Logo />
      <MenuButton />
      <AccountButton />
      <QrCodeButton />
      <SignOutButton />
    </div>
  );
}

export function Logo() {
  return (
    <Link href={page.home}>
      <h1 className={styles.logo}>
        <Image src="/images/app-logo.svg" alt="Topへ戻る" width={50} height={50} />
      </h1>
    </Link>
  );
}

function SignOutButton() {
  const mainButton = { title: 'signOut', iconName: 'signOut', link: page.signIn };
  return (
    <div className={styles.signOut}>
      <Link href={mainButton.link}>
        <span className={`icon-${mainButton.iconName}`}></span>
      </Link>
    </div>
  );
}
