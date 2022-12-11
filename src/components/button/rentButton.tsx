import styles from './rentButton.module.css';

export function RentButton() {
  return <button className={`${styles.button} ${styles.rent}`}>借りる</button>;
}
export function ReturnButton() {
  return <button className={`${styles.button} ${styles.return}`}>返却</button>;
}
export function LendingButton() {
  return <button className={`${styles.button} ${styles.lending}`}>貸出中</button>;
}
