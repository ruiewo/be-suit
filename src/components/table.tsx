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

import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useCallback, useState } from 'react';
import EquipmentDialog from './equipmentDialog';

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

export default function EquipmentsTable({ equipments }: { equipments: EquipmentWithUser[] }) {
  // todo merge detail definitions.
  const definitions = [...equipmentBaseColumn, ...pcColumn];

  const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number } | null>(null);
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const tr = (e.target as HTMLElement).closest<HTMLElement>('.equipmentItem');
    console.log(tr);

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
    <TableContainer component={Paper} onContextMenu={handleContextMenu} sx={{ maxHeight: 800 }} onDoubleClick={handleDialogOpen}>
      <Table sx={{ minWidth: 700, maxHeight: '100vh' }} aria-label="customized table">
        <TableHead>
          <TableRow>
            {definitions.map(def => (
              <StyledTableCell align="center" key={def.key} sx={{ minWidth: def.width }}>
                {def.label}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {equipments.map(equipment => (
            <StyledTableRow key={equipment.id} className="equipmentItem" data-id={equipment.id}>
              {definitions.map(def => (
                <StyledTableCell align="left" key={`${equipment.id}_${def.key}`}>
                  {def.convert(equipment, def.key)}
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
      <EquipmentDialog open={open} onClose={handleDialogClose} equipment={equipment} />
    </TableContainer>
  );
}
