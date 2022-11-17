import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { page } from '../models/const/path';
import styles from '../styles/SideMenu.module.css';

export function Account() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const menus = [
    {
      title: 'Account',
      content: [
        { title: 'signOut', backgroundImageUrl: '/images/signOut.svg', url: page.signIn },
        { title: 'notice', backgroundImageUrl: '/images/notice.svg', url: page.signIn },
      ],
    },
  ];

  const handleClick = (index: number) => {
    if (activeIndex === index) return setActiveIndex(null);

    setActiveIndex(index);
  };

  return (
    <ul className={styles.account}>
      {menus.map((menu, index) => (
        <li key={index} className={styles.account}>
          <button onClick={() => handleClick(index)} className={styles.accountButton}>
            <Image src="/images/account.svg" alt="アカウント" width={30} height={30} />
          </button>
          <Link key="Sign Out" href={menu.content[0].url}>
            <div className={activeIndex === index ? styles[`signOut`] : styles[`hide`]}>
              <Image className={styles.content} src={menu.content[0].backgroundImageUrl} alt={menu.content[0].title} width={20} height={20} />
            </div>
          </Link>
          <Link key="Setting" href={menu.content[1].url}>
            <div className={activeIndex === index ? styles[`profile`] : styles[`hide`]}>
              <Image className={styles.content} src={menu.content[1].backgroundImageUrl} alt={menu.content[1].title} width={20} height={20} />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
