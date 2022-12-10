import { useState } from 'react';

import styles from '../styles/menuButton.module.css';
import { Menu } from './menu';

export const MenuButton = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleOpen = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={`${styles.menuButton} ${isMenuOpen ? styles.closeButton : ''}`} onClick={toggleOpen}>
      <span className={styles.bar}></span>
      <span className={styles.bar}></span>
      <span className={styles.bar}></span>
      <p className={styles.menuLabel}>{!isMenuOpen ? 'Menu' : 'Close'}</p>
      <Menu isMenuOpen={isMenuOpen}></Menu>
    </div>
  );
};
