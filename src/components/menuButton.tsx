import { ReactElement } from 'react';

import styles from '../styles/menuButton.module.css';

type Props = {
  children: ReactElement;
  isOpen: boolean;
  toggleOpen: () => void;
};

export const MenuButton = ({ children, isOpen, toggleOpen }: Props) => {
  return (
    <div className={`${styles.menuButton} ${isOpen ? styles.closeButton : ''}`} onClick={toggleOpen}>
      <span className={styles.bar}></span>
      <span className={styles.bar}></span>
      <span className={styles.bar}></span>
      <p className={styles.menuLabel}>{!isOpen ? 'Menu' : 'Close'}</p>
      {children}
    </div>
  );
};
