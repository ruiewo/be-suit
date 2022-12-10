import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { ChangeEvent, useState } from 'react';

import { Box, Button, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';

import { SubmitButtons } from '../../components/button/submitButtons';
import { DeleteButton } from '../../components/deleteButton';
import { ErrorDialog } from '../../components/dialog/errorDialog';
import { Loading } from '../../components/loading';
import { useLocations } from '../../hooks/userLocations';
import { client } from '../../models/apiClient';
import { page } from '../../models/const/path';
import { LocationModel } from '../../models/locationModel';

const LocationPage: NextPage = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const { locations: baseLocations, isLoading, isError } = useLocations(x => setLocations(x));

  const [locations, setLocations] = useState<LocationModel[]>(baseLocations ?? []);

  const onLocationChange = (event: ChangeEvent, index?: number) => {
    if (index == null) {
      return;
    }

    const target = event.target as HTMLInputElement;

    const newLocations = [...locations];
    const newLocation = { ...newLocations[index] };

    switch (target.name) {
      case 'id':
        // newDepartment.id = target.value;
        break;
      case 'label':
        newLocation.label = target.value;
        break;
      case 'enable':
        newLocation.enable = target.checked;
        break;
      default:
        return;
    }

    newLocations.splice(index, 1, newLocation);

    setLocations(newLocations);
  };

  const addLocation = () => {
    // todo id is NOT 0
    setLocations([...locations, { id: 0, label: '', enable: true }]);
  };

  const removeLocation = (index: number) => {
    const newLocations = [...locations];
    newLocations.splice(index, 1);
    setLocations(newLocations);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const update = async () => {
    const newLocations = [...locations];
    const { error } = await client.api.location.update.$post({ body: { locations: newLocations } });
    if (error) {
      const message = error.errors.reduce((prev, current) => prev + '\n' + current.message, '');
      setErrorMessage(message);
    }
  };

  if (isError || errorMessage) return <ErrorDialog message={errorMessage} />;

  if (isLoading) return <Loading />;

  if (locations == null) return <div>Locations not found.</div>;

  return (
    <Box>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <Typography component="h1" variant="h4" sx={{ textAlign: 'center' }}>
          Location
        </Typography>

        <hr />

        {locations.map((location, index) => (
          <LocationInput key={index} index={index} location={location} onChange={onLocationChange} remove={removeLocation}></LocationInput>
        ))}
        <Box sx={{ textAlign: 'center' }}>
          <Button type="button" onClick={addLocation}>
            ADD
          </Button>
        </Box>

        <hr />
        <SubmitButtons onSubmit={update} onCancel={() => router.push(page.maintenance)}></SubmitButtons>
      </Box>
    </Box>
  );
};

export default LocationPage;

type Props = {
  index: number;
  location: LocationModel;
  onChange: (event: ChangeEvent, index?: number) => void;
  remove?: (index: number) => void;
};

const style = { width: '18%', ml: '2%', mr: '2%', mt: 2, mb: 1 };
const buttonStyle = { width: '15%', ml: '2%', mr: '2%' };

const LocationInput = ({ index, location, onChange, remove }: Props) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <TextField margin="normal" sx={{ ...style, width: '8%' }} label="id" name="id" value={location.id} onChange={e => onChange(e, index)} />
      <TextField
        margin="normal"
        sx={{ ...style, width: '35%' }}
        label="label"
        name="label"
        value={location.label}
        onChange={e => onChange(e, index)}
      />
      <FormControlLabel
        sx={buttonStyle}
        control={<Checkbox name="enable" checked={location.enable} onChange={e => onChange(e, index)} />}
        label="Enable"
      />
      {remove != null ? <DeleteButton onClick={() => remove(index)}></DeleteButton> : null}
    </Box>
  );
};
