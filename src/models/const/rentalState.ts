import { RentalState } from '@prisma/client';

export const rentalState = {
  rentRequested: 'rentRequested',
  rentApproved: 'rentApproved',
  lending: 'lending',
  returnRequested: 'returnRequested',
  returnApproved: 'returnApproved',
  completed: 'completed',
} as const;

export const rentalStateList = Object.values(rentalState);

export const roleList: { state: RentalState; label: string }[] = [
  { state: rentalState.rentRequested, label: '貸出申請中' },
  { state: rentalState.rentApproved, label: '貸出申請受付' },
  { state: rentalState.lending, label: '貸出中' },
  { state: rentalState.returnRequested, label: '返却申請中' },
  { state: rentalState.returnApproved, label: '返却申請受付' },
  { state: rentalState.completed, label: '返却済' },
];
