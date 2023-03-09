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
    { title: 'Department Page', description: '部門ごとの一覧を表示', path: page.department, iconName: 'master' },
  ];

  const admin = [
    { title: 'Add Equipment', description: '機器登録', path: page.register, iconName: 'dev' },
    { title: 'Add Category', description: 'カテゴリー登録', path: page.category, iconName: 'dev' },
    { title: 'Users', description: 'ユーザ管理', path: page.user, iconName: 'users' },
    { title: 'Department', description: '部署管理', path: page.maintenanceDepartment, iconName: 'master' },
    { title: 'Location', description: '場所管理', path: page.maintenanceLocation, iconName: 'master' },
    { title: 'QR Code', description: 'QRコード生成・印刷', path: page.qrCode, iconName: 'dev' },
    { title: 'Company Logo', description: '会社ロゴ印刷', path: page.companyLogo, iconName: 'dev' },
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
