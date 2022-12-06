import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { page } from '../models/const/path';
import { isNullOrWhiteSpace } from '../modules/util';
import styles from '../styles/accountButton.module.css';

export function AccountButton() {
  const { data: session } = useSession({ required: true });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isActive, setActive] = useState<boolean>(false);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as HTMLElement)) {
        setActive(false);
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  });

  const mainButton = { title: 'account', imageUrl: '/images/account.svg' };
  const subButtons = [
    { title: 'notice', imageUrl: '/images/notice.svg', link: page.myPage },
    { title: 'signOut', imageUrl: '/images/signOut.svg', link: page.signIn },
  ];

  const avatarUrl = session?.user?.image;

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div className={styles.parentButton} onClick={() => setActive(!isActive)}>
        {isNullOrWhiteSpace(avatarUrl) ? (
          <Image src={mainButton.imageUrl} alt={mainButton.title} width={30} height={30} />
        ) : (
          <img src={avatarUrl} alt="" style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid var(--color1)' }} />
        )}
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
