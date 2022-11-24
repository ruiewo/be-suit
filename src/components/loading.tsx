import styles from '../styles/loading.module.css';

export const Loading = () => {
  return (
    <div className={styles.loadingWrapper}>
      <div className={styles.loadingIcon}></div>
      <div className={styles.effectIcon}></div>
    </div>
  );
};
