import Link from 'next/link';

import { page } from '../models/const/path';
import styles from '../styles/menu.module.css';

type Props = {
  isMenuOpen: boolean;
};
export function Menu({ isMenuOpen }: Props) {
  const category = [
    { title: 'Computer', description: '', path: `${page.equipment}/pc/n`, iconName: 'computer' },
    { title: 'Monitor', description: '', path: `${page.equipment}/mo/d`, iconName: 'monitor' },
    { title: 'Storage', description: '', path: `${page.equipment}`, iconName: 'dev' },
    { title: 'Network', description: '', path: `${page.equipment}`, iconName: 'dev' },
    { title: 'Output', description: '', path: `${page.equipment}`, iconName: 'dev' },
    { title: 'Camera', description: '', path: `${page.equipment}`, iconName: 'dev' },
  ];

  const menu = [
    { title: 'My Page', description: '借りている機器の一覧を表示', path: page.myPage, iconName: 'user' },
    { title: '貸出', description: 'not implemented yet.', path: '', iconName: 'rental' },
  ];

  const admin = [
    { title: 'Users', description: 'ユーザ管理', path: page.user, iconName: 'users' },
    { title: 'Master', description: 'マスタ管理', path: page.maintenance, iconName: 'master' },
    { title: 'QR Code', description: 'QRコード生成・印刷', path: page.qrCode, iconName: 'dev' },
    { title: 'Add Equipment', description: '機器を登録', path: page.register, iconName: 'dev' },
    { title: 'Add Category', description: 'カテゴリーを登録', path: page.category, iconName: 'dev' },
  ];

  return (
    <div className={`${styles.menuOverlay} ${isMenuOpen ? '' : styles.menuOverlayClose}`}>
      <div className={styles.leftBlock}>
        <MenuArea header="カテゴリ" menuList={category}></MenuArea>
      </div>
      <div className={styles.rightBlock}>
        <MenuArea header="機能" menuList={menu}></MenuArea>
        <MenuArea header="管理者用" menuList={admin}></MenuArea>
      </div>
    </div>
  );
}

type MenuAreaProps = {
  header: string;
  menuList: MenuItem[];
};
export function MenuArea({ header, menuList }: MenuAreaProps) {
  return (
    <div className={styles.area}>
      <span className={styles.header}>{header}</span>
      <ul>
        {menuList.map(menu => (
          <MenuItem key={menu.title} {...menu}></MenuItem>
        ))}
      </ul>
    </div>
  );
}

type MenuItem = {
  title: string;
  description: string;
  path: string;
  iconName: string;
};
function MenuItem({ title, description, path, iconName }: MenuItem) {
  return (
    <Link href={path}>
      <li key={title}>
        <span className={`icon-${iconName}`} />
        <span className={styles.title}>{title}</span>
        <span className={styles.description}>{description}</span>
      </li>
    </Link>
  );
}
