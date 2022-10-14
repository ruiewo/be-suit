import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Equipment } from '@prisma/client';
import { EquipmentWithUser, getEquipmentCode } from '../models/equipment';

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
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">管理番号</StyledTableCell>
            <StyledTableCell align="center">管理者&nbsp;</StyledTableCell>
            <StyledTableCell align="center">使用者&nbsp;</StyledTableCell>
            <StyledTableCell align="center">使用・保管場所&nbsp;</StyledTableCell>
            <StyledTableCell align="center">貸出日&nbsp;</StyledTableCell>
            <StyledTableCell align="center">返却日&nbsp;</StyledTableCell>
            <StyledTableCell align="center">備考&nbsp;</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {equipments.map(row => (
            <StyledTableRow key={getEquipmentCode(row)}>
              <StyledTableCell align="center">{getEquipmentCode(row)}</StyledTableCell>
              <StyledTableCell align="center">{row.group}</StyledTableCell>
              <StyledTableCell align="center">USER</StyledTableCell>
              <StyledTableCell align="center">{row.place}</StyledTableCell>
              <StyledTableCell align="center">{row.checkOutDate?.toLocaleDateString()}</StyledTableCell>
              <StyledTableCell align="center">{row.returnDate?.toLocaleDateString()}</StyledTableCell>
              <StyledTableCell align="center">{row.note}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
