import { rentalState } from '../../models/equipmentModel';
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

export function RentStateButton({ state }: { state: string }) {
  switch (state) {
    case rentalState.canRent:
      return <RentButton />;
    case rentalState.canReturn:
      return <ReturnButton />;
    case rentalState.lending:
      return <LendingButton />;
    default:
      return <></>;
  }
}
