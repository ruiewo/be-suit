import { rentButtonState } from '../../models/equipmentModel';
import styles from './rentButton.module.css';

export function RentButton() {
  return (
    <button type="button" className={styles.button} data-rent-state="canRent">
      借りる
    </button>
  );
}
export function ReturnButton() {
  return (
    <button type="button" className={styles.button} data-rent-state="canReturn">
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
    case rentButtonState.canRent:
      return <RentButton />;
    case rentButtonState.canReturn:
      return <ReturnButton />;
    case rentButtonState.lending:
      return <LendingButton />;
    default:
      return <></>;
  }
}
