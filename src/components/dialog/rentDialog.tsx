import { Dispatch, SetStateAction, useState } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, SelectChangeEvent, Typography } from '@mui/material';

import { useSharedState } from '../../hooks/useStaticSwr';
import { client } from '../../models/apiClient';
import { DepartmentModel } from '../../models/departmentModel';
import { EquipmentModel } from '../../models/equipmentModel';
import { LocationModel } from '../../models/locationModel';
import { RentalApplicationModel } from '../../models/rentalApplicationModel';
import { isNullOrWhiteSpace } from '../../modules/util';
import { CommonSelect } from '../select/CommonSelect';

type Props = {
  equipment: EquipmentModel | null;
  setEquipment: Dispatch<SetStateAction<EquipmentModel | null>>;
};

const style = { width: '90%', ml: 1, mr: 1, mt: 2, mb: 1 };

const blankRequest: RentalApplicationModel = { equipmentId: null, departmentId: null };

export const RentDialog = ({ equipment, setEquipment }: Props) => {
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
            await client.api.rentalApplication.create.$post({ body: { rentalApplication: { ...rentRequest, equipmentId: equipment!.id } } });
            setEquipment(null);
            setRentRequest({ ...rentRequest });
          }}
        >
          申請する
        </Button>
      </DialogActions>
    </Dialog>
  );
};
