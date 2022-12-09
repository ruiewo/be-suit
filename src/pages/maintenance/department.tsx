import type { NextPage } from 'next';
import { ChangeEvent, useEffect, useState } from 'react';

import { Box, Button, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';

import { DeleteButton } from '../../components/deleteButton';
import { ErrorDialog } from '../../components/dialog/errorDialog';
import { Loading } from '../../components/loading';
import { CommonSelect, CommonSelectItem } from '../../components/select/CommonSelect';
import { useDepartments } from '../../hooks/useDepartments';
import { client } from '../../models/apiClient';
import { DepartmentModel } from '../../models/department';

const DepartmentPage: NextPage = () => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const { departments: baseDepartments } = useDepartments(x => setDepartments(x));

  const [departments, setDepartments] = useState<DepartmentModel[]>(baseDepartments ?? []);

  const [leaders, setLeaders] = useState<CommonSelectItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function load() {
      setIsLoading(true);

      try {
        const { users } = await client.api.user.search.$post({ body: { roles: ['admin'] } });
        setLeaders(users.map(x => ({ value: x.id, label: x.name ?? '' })));
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, []);

  const onDepartmentChange = (event: ChangeEvent, index?: number) => {
    if (index == null) {
      return;
    }

    const target = event.target as HTMLInputElement;

    const newDepartments = [...departments];
    const newDepartment = { ...newDepartments[index] };

    switch (target.name) {
      case 'id':
        // newDepartment.id = target.value;
        break;
      case 'label':
        newDepartment.label = target.value;
        break;
      case 'enable':
        newDepartment.enable = target.checked;
        break;
      case 'leader':
        newDepartment.leaderId = target.value;
        break;
      default:
        return;
    }

    newDepartments.splice(index, 1, newDepartment);

    setDepartments(newDepartments);
  };

  const addDepartment = () => {
    // todo id is NOT 0
    setDepartments([...departments, { id: 0, label: '', enable: true, leader: '', leaderId: '' }]);
  };

  const removeDepartment = (index: number) => {
    const newDepartments = [...departments];
    newDepartments.splice(index, 1);
    setDepartments(newDepartments);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const update = async () => {
    const newDepartments: DepartmentModel[] = [...departments];
    const { error } = await client.api.department.update.$post({ body: { departments: newDepartments } });
    if (error) {
      const message = error.errors.reduce((prev, current) => prev + '\n' + current.message, '');
      setErrorMessage(message);
    }
  };

  if (isError || errorMessage) return <ErrorDialog message={errorMessage} />;

  if (isLoading) return <Loading />;

  if (departments == null) return <div>Departments not found.</div>;

  return (
    <Box>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <Typography component="h1" variant="h4" sx={{ textAlign: 'center' }}>
          Department
        </Typography>

        <hr />

        {departments.map((department, index) => (
          <DepartmentInput
            key={index}
            leaders={leaders}
            index={index}
            department={department}
            onChange={onDepartmentChange}
            remove={removeDepartment}
          ></DepartmentInput>
        ))}
        <Box sx={{ textAlign: 'center' }}>
          <Button type="button" onClick={addDepartment}>
            ADD
          </Button>
        </Box>

        <hr />
        <Box sx={{ textAlign: 'center' }}>
          <Button
            disabled={false}
            variant="contained"
            color="secondary"
            sx={{ width: 200 }}
            onClick={() => {
              // onClose();
            }}
          >
            キャンセル
          </Button>
          <Button disabled={false} variant="contained" color="primary" sx={{ width: 200 }} onClick={update}>
            確定
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default DepartmentPage;

type Props = {
  leaders: CommonSelectItem[];
  index: number;
  department: DepartmentModel;
  onChange: (event: ChangeEvent, index?: number) => void;
  remove?: (index: number) => void;
};

const style = { width: '18%', ml: '2%', mr: '2%', mt: 2, mb: 1 };
const buttonStyle = { width: '15%', ml: '2%', mr: '2%' };

const DepartmentInput = ({ leaders, index, department: department, onChange, remove }: Props) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <TextField margin="normal" sx={{ ...style, width: '8%' }} label="id" name="id" value={department.id} onChange={e => onChange(e, index)} />
      <TextField
        margin="normal"
        sx={{ ...style, width: '35%' }}
        label="label"
        name="label"
        value={department.label}
        onChange={e => onChange(e, index)}
      />
      <CommonSelect
        sx={{ ...style, width: '25%' }}
        label="leader"
        name="leader"
        value={department.leaderId ?? ''}
        onChange={e => onChange(e as ChangeEvent, index)}
        items={leaders}
      />
      <FormControlLabel
        sx={buttonStyle}
        control={<Checkbox name="enable" checked={department.enable} onChange={e => onChange(e, index)} />}
        label="Enable"
      />
      {remove != null ? <DeleteButton onClick={() => remove(index)}></DeleteButton> : null}
    </Box>
  );
};
