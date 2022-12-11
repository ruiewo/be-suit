import { rentalState } from '../../models/equipmentModel';
import styles from './rentButton.module.css';

export function RentButton() {
  return (
    <button type="button" className={styles.button} data-rent-state="rent">
      借りる
    </button>
  );
}
export function ReturnButton() {
  return (
    <button type="button" className={styles.button} data-rent-state="return">
      返却
    </button>
  );
}
export function LendingButton() {
  return (
    <button type="button" className={styles.button} data-rent-state="lending">
      貸出中
    </button>
  );
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
