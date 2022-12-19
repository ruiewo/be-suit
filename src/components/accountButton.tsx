import { useSession } from 'next-auth/react';
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

  const mainButton = { title: 'account', iconName: 'user', link: page.myPage };

  const avatarUrl = session?.user?.image;
  const userName = session?.user?.name;

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div className={styles.parentButton} onClick={() => setActive(!isActive)}>
        <Link href={mainButton.link}>
          {isNullOrWhiteSpace(avatarUrl) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={createIconImage(userName)} alt={mainButton.title} style={{ width: 40, height: 40, borderRadius: '50%' }} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt={mainButton.title} style={{ width: 40, height: 40, borderRadius: '50%' }} />
          )}
        </Link>
      </div>
    </div>
  );
}

function createIconImage(userName: string | null | undefined) {
  const defaultIcon = '/images/account.svg';

  if (isNullOrWhiteSpace(userName)) {
    return defaultIcon;
  }

  let twoLetters = '';
  const strArr = userName.split(' ');
  if (strArr.length === 1) {
    twoLetters = strArr[0].substring(0, 2);
  } else {
    twoLetters = strArr[0].substring(0, 1) + strArr[1].substring(0, 1);
  }

  twoLetters = twoLetters.toUpperCase();

  const svg = `<svg width="512" height="512" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><circle fill="#dbf0f3" cx="50" cy="50" r="50"></circle><text x="50%" y="50%" font-family="Verdana" font-size="42" fill="#6d9291" text-anchor="middle" dominant-baseline="central">${twoLetters}</text></svg>`;

  return 'data:image/svg+xml;utf-8,' + encodeURIComponent(svg);
}
