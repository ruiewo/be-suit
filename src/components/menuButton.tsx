import styles from '../styles/menuButton.module.css';

type Props = {
  isOpen: boolean;
  toggleOpen: () => void;
};

export const MenuButton = ({ isOpen, toggleOpen }: Props) => {
  return (
    <div className={`${styles.menuButton} ${isOpen ? '' : styles.closeButton}`} onClick={toggleOpen}>
      <span></span>
      <span></span>
      <span></span>
      <p className={styles.menuLabel}>{!isOpen ? 'Close' : 'Menu'}</p>
    </div>
  );
};
