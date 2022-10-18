import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { equipmentBaseColumn, EquipmentWithUser, getEquipmentCode } from '../models/equipment';
import { pcColumn } from '../models/equipmentDetails/pc';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function CustomizedTables({ equipments }: { equipments: EquipmentWithUser[] }) {
  // todo merge detail definitions.
  const definitions = [...equipmentBaseColumn, ...pcColumn];

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            {definitions.map(def => (
              <StyledTableCell align="center" key={def.key}>
                {def.label}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {equipments.map(equipment => (
            <StyledTableRow key={getEquipmentCode(equipment)}>
              {definitions.map(def => (
                <StyledTableCell align="center" key={`${equipment.id}_${def.key}`}>
                  {def.convert(equipment, def.key)}
                </StyledTableCell>
              ))}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
