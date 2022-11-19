import Image from 'next/image';
import Link from 'next/link';

import { page } from '../models/const/path';
import styles from '../styles/home.module.css';

export function PageTop(props: any) {
  const menu = [
    {
      name: '機器追加',
      buttonClassName: 'addEquipment',
      href: page.equipment + '/register',
      backgroundImageUrl: '/images/add.svg',
      style: { margin: '5px' },
    },
    {
      name: 'Topへ戻る',
      buttonClassName: 'pageTop',
      href: '#',
      backgroundImageUrl: '/images/top.svg',
      style: { margin: '5px' },
    },
  ];
  return (
    <div className={styles.pageTop}>
      {menu.map(item => (
        <Link key={item.name} href={item.href}>
          <button style={item.style}>
            <Image src={item.backgroundImageUrl} alt={item.buttonClassName} width={30} height={30} />
          </button>
        </Link>
      ))}
    </div>
  );
}
