import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { page } from '../models/const/path';
import styles from '../styles/accountButton.module.css';

export function AccountButton() {
  const [isActive, setActive] = useState<boolean>(false);

  const mainButton = { title: 'account', imageUrl: '/images/account.svg' };
  const subButtons = [
    { title: 'notice', imageUrl: '/images/notice.svg', link: page.user },
    { title: 'signOut', imageUrl: '/images/signOut.svg', link: page.signIn },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.parentButton} onClick={() => setActive(!isActive)}>
        <Image src={mainButton.imageUrl} alt={mainButton.title} width={30} height={30} />
      </div>
      {subButtons.map(x => (
        <ChildButton key={x.title} isActive={isActive} {...x} />
      ))}
    </div>
  );
}

type ChildButtonProps = {
  isActive: boolean;
  title: string;
  imageUrl: string;
  link: string;
};

function ChildButton({ isActive, imageUrl, title, link }: ChildButtonProps) {
  return (
    <Link href={link}>
      <div className={`${styles.childButton} ${isActive ? '' : styles.hidden}`}>
        <Image className={styles.content} src={imageUrl} alt={title} width={20} height={20} />
      </div>
    </Link>
  );
}
