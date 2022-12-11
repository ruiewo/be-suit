import Image from 'next/image';
import Link from 'next/link';

import { page } from '../models/const/path';
import styles from '../styles/sideMenu.module.css';
import { AccountButton } from './accountButton';
import { MenuButton } from './menuButton';

export default function SideMenu() {
  return (
    <div className={styles.sideMenu}>
      <Logo />
      <MenuButton />
      <AccountButton />
    </div>
  );
}

function Logo() {
  return (
    <Link href={page.home}>
      <h1 className={styles.logo}>
        <Image src="/images/app-logo.svg" alt="Topへ戻る" width={50} height={50} />
      </h1>
    </Link>
  );
}
