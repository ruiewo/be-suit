import Link from 'next/link';

import { page } from '../models/const/path';
import styles from '../styles/sideMenu.module.css';

type Props = {
  isMenuOpen: boolean;
};
export function Menu({ isMenuOpen }: Props) {
  const menu = [
    { title: 'My Page', description: '借りている機器の一覧を表示', path: page.myPage, iconName: 'user' },
    { title: '貸出', description: 'not implemented yet.', path: '', iconName: 'rental' },
  ];
  const category = [
    { title: 'Computer', description: '', path: `${page.equipment}/pc/n`, iconName: 'computer' },
    { title: 'Monitor', description: '', path: `${page.equipment}/mo/d`, iconName: 'monitor' },
    { title: 'Storage', description: '', path: `${page.equipment}`, iconName: 'dev' },
    { title: 'Network', description: '', path: `${page.equipment}`, iconName: 'dev' },
    { title: 'Output', description: '', path: `${page.equipment}`, iconName: 'dev' },
    { title: 'Camera', description: '', path: `${page.equipment}`, iconName: 'dev' },
  ];
  const admin = [
    { title: 'Users', description: 'ユーザ管理', path: page.user, iconName: 'users' },
    { title: 'Master', description: 'マスタ管理', path: page.maintenance, iconName: 'master' },
    { title: 'QR Code', description: 'QRコード生成・印刷', path: page.qrCode, iconName: 'dev' },
    { title: 'Add Equipment', description: '機器を登録', path: page.register, iconName: 'dev' },
    { title: 'Add Category', description: 'カテゴリーを登録', path: page.category, iconName: 'dev' },
  ];

  return (
    <div className={`${styles.menuOverlay} ${isMenuOpen ? styles.menuOverlayOpen : styles.menuOverlayClose}`}>
      <div className={styles.leftBlock}>
        <span className={styles.menuCategory}>カテゴリ</span>
        <ul>
          {category.map(menu => (
            <MenuItem key={menu.title} {...menu}></MenuItem>
          ))}
        </ul>
      </div>
      <div className={styles.rightBlock}>
        <span className={styles.menuCategory}>機能</span>
        <ul>
          {menu.map(menu => (
            <MenuItem key={menu.title} {...menu}></MenuItem>
          ))}
        </ul>
        <div className={styles.admin}>
          <span className={styles.menuCategory}>管理者用</span>
          <ul>
            {admin.map(menu => (
              <MenuItem key={menu.title} {...menu}></MenuItem>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

type MenuItemProps = {
  title: string;
  description: string;
  path: string;
  iconName: string;
};

export function MenuItem({ title, description, path, iconName }: MenuItemProps) {
  return (
    <Link href={path}>
      <li key={title}>
        <span className={`icon-${iconName}`} />
        <span className={styles.menuTitle}>{title}</span>
        <span className={styles.menuDescription}>{description}</span>
      </li>
    </Link>
  );
}
