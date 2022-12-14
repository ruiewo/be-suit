import { Dispatch, SetStateAction, useState } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, SelectChangeEvent, Typography } from '@mui/material';

import { useSharedState } from '../../hooks/useStaticSwr';
import { client } from '../../models/apiClient';
import { DepartmentModel } from '../../models/departmentModel';
import { EquipmentModel } from '../../models/equipmentModel';
import { LocationModel } from '../../models/locationModel';
import { RentalApplicationModel } from '../../models/rentalApplicationModel';
import { convertToMessage, isNullOrWhiteSpace } from '../../modules/util';
import { CommonSelect } from '../select/CommonSelect';
import { useErrorDialog } from './errorDialog';

export type RentDialogType = '' | 'rent' | 'return';
type Props = {
  type: RentDialogType;
  equipment: EquipmentModel | null;
  setEquipment: Dispatch<SetStateAction<EquipmentModel | null>>;
  reload: () => void;
};

const style = { width: '90%', ml: 1, mr: 1, mt: 2, mb: 1 };

const blankRequest: RentalApplicationModel = { equipmentId: null, departmentId: null };

export const RentDialog = ({ type, ...props }: Props) => {
  switch (type) {
    case 'rent':
      return <RentDialog2 {...props} />;
    case 'return':
      return <ReturnDialog {...props} />;

    default:
      return <></>;
  }
};

type RentDialogProps = {
  equipment: EquipmentModel | null;
  setEquipment: Dispatch<SetStateAction<EquipmentModel | null>>;
  reload: () => void;
};
export const RentDialog2 = ({ equipment, setEquipment, reload }: RentDialogProps) => {
  const showErrorDialog = useErrorDialog();

  const [departments] = useSharedState<DepartmentModel[]>('departments', []);
  const [locations] = useSharedState<LocationModel[]>('locations', []);
  const departmentItems = departments.map(x => ({ value: x.id, label: x.label }));
  const locationItems = locations.map(x => ({ value: x.id, label: x.label }));
  const [rentRequest, setRentRequest] = useState<RentalApplicationModel>({ ...blankRequest });

  const onDepartmentChange = (e: SelectChangeEvent<string>) => {
    const value = e.target.value;
    setRentRequest({ ...rentRequest, departmentId: isNullOrWhiteSpace(value) ? null : parseInt(value) });
  };

  return (
    <Dialog open={equipment != null}>
      <DialogTitle>貸出申請</DialogTitle>

      <DialogContent dividers>
        <Typography gutterBottom>{equipment?.code}の貸出申請を行いますか？</Typography>
        <Typography gutterBottom>メーカー： {equipment?.maker}</Typography>
        <Typography gutterBottom>型番：{equipment?.modelNumber}</Typography>

        <CommonSelect
          sx={style}
          name="departmentId"
          label="管理者"
          value={rentRequest.departmentId}
          items={departmentItems}
          onChange={onDepartmentChange}
        />
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="secondary"
          sx={{ width: 200 }}
          onClick={() => {
            setEquipment(null);
            setRentRequest({ ...blankRequest });
          }}
        >
          戻る
        </Button>
        <Button
          disabled={rentRequest.departmentId == null}
          variant="contained"
          color="primary"
          sx={{ width: 200 }}
          onClick={async () => {
            const result = await client.api.rentalApplication.rentRequest.$post({
              body: { rentalApplication: { ...rentRequest, equipmentId: equipment!.id } },
            });
            if (result.error) {
              showErrorDialog({ title: 'request failed', description: convertToMessage(result.error) });
              return;
            }
            setEquipment(null);
            setRentRequest({ ...rentRequest });
            reload();
          }}
        >
          申請する
        </Button>
      </DialogActions>
    </Dialog>
  );
};

type ReturnDialogProps = {
  equipment: EquipmentModel | null;
  setEquipment: Dispatch<SetStateAction<EquipmentModel | null>>;
  reload: () => void;
};

export const ReturnDialog = ({ equipment, setEquipment, reload }: ReturnDialogProps) => {
  const showErrorDialog = useErrorDialog();

  return (
    <Dialog open={equipment != null}>
      <DialogTitle>貸出申請</DialogTitle>

      <DialogContent dividers>
        <Typography gutterBottom>{equipment?.code}の返却申請を行いますか？</Typography>
        <Typography gutterBottom>メーカー： {equipment?.maker}</Typography>
        <Typography gutterBottom>型番：{equipment?.modelNumber}</Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="secondary"
          sx={{ width: 200 }}
          onClick={() => {
            setEquipment(null);
          }}
        >
          戻る
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{ width: 200 }}
          onClick={async () => {
            const result = await client.api.rentalApplication.returnRequest.$post({ body: { equipmentId: equipment!.id } });
            if (result.error) {
              showErrorDialog({ title: 'request failed', description: convertToMessage(result.error) });
              return;
            }
            setEquipment(null);
            reload();
          }}
        >
          申請する
        </Button>
      </DialogActions>
    </Dialog>
  );
};
