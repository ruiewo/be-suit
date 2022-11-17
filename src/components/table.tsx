import * as React from 'react';
import { useState } from 'react';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';

import { ColumnDefinition, Details, EquipmentWithUser, convertToDisplay, equipmentBaseColumn } from '../models/equipment';
import EquipmentDialog from './equipmentDialog';
import { PageTop } from './pageTop';

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

type Props = {
  equipments: EquipmentWithUser[];
  columns: ColumnDefinition<Details>[];
};

export default function EquipmentsTable({ equipments, columns }: Props) {
  const baseColumn = [...equipmentBaseColumn];
  const optionColumn = [...columns];

  const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number } | null>(null);
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const tr = (e.target as HTMLElement).closest<HTMLElement>('.equipmentItem');
    if (tr == null) {
      setContextMenu(null);
      return;
    }

    setContextMenu(contextMenu === null ? { mouseX: e.clientX + 2, mouseY: e.clientY - 6 } : null);
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  // for dialog
  const [open, setOpen] = useState(false);
  const [equipment, setEquipment] = useState<EquipmentWithUser | null | undefined>(null);
  const handleDialogOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    const tr = (e.target as HTMLElement).closest<HTMLElement>('.equipmentItem');

    if (tr == null) {
      setContextMenu(null);
      return;
    }
    const targetId = parseInt(tr.dataset.id!);
    const equipment = equipments.find(x => x.id === targetId);

    setOpen(true);
    setEquipment(equipment);
  };

  const handleDialogClose = () => {
    setOpen(false);
    // setEquipment(null);
  };

  return (
    <TableContainer component={Paper} onContextMenu={handleContextMenu} sx={{ minHeight: 600 }} onDoubleClick={handleDialogOpen}>
      <Table sx={{ minWidth: 700, maxHeight: '100vh' }} aria-label="customized table">
        <TableHead>
          <TableRow>
            {[...baseColumn, ...optionColumn].map(col => (
              <StyledTableCell align="center" key={col.key} sx={{ minWidth: col.width }}>
                {col.label}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {equipments.map(equipment => (
            <StyledTableRow key={equipment.id} className="equipmentItem" data-id={equipment.id}>
              {baseColumn.map(col => (
                <StyledTableCell align="left" key={`${equipment.id}_${col.key}`}>
                  {convertToDisplay(equipment, col.key, col.type)}
                </StyledTableCell>
              ))}
              {optionColumn.map(col => (
                <StyledTableCell align="left" key={`${equipment.id}_${col.key}`}>
                  {convertToDisplay(equipment.details, col.key, col.type)}
                </StyledTableCell>
              ))}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
      >
        <MenuItem onClick={handleClose}>EDIT</MenuItem>
        <MenuItem onClick={handleClose}>DELETE</MenuItem>
        <MenuItem onClick={handleClose}>RENTAL</MenuItem>
        <MenuItem onClick={handleClose}>RETURN</MenuItem>
      </Menu>
      <PageTop />
      <EquipmentDialog open={open} onClose={handleDialogClose} equipment={equipment} optionColumn={optionColumn} />
    </TableContainer>
  );
}
