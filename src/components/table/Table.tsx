import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Customer } from "@/static";
import PushPinIcon from "@mui/icons-material/PushPin";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Menu, MenuItem, TextField } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "@/api";

const BasicTable: React.FC<{ data: Customer[], type: string }> = ({ data, type }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [id, setId] = React.useState<null | string>(null);
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);
  const [paymentAmount, setPaymentAmount] = React.useState<string>("");
  const [openDialog, setOpenDialog] = React.useState(false);
  const queryClient = useQueryClient();
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>, _id: string) => {
    setAnchorEl(event.currentTarget);
    setId(_id);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePayment = (customer: Customer) => {
    setSelectedCustomer(customer);
    setPaymentAmount("");
    setOpenDialog(true);
    handleClose();
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedCustomer(null);
  };

  const paymentMutation = useMutation({
    mutationFn: ({ id, amount, isPaidToday }: { id: string; amount: number; isPaidToday: boolean }) =>
      request.post(`/create/payment/${type}/${id}`, { amount, isPaidToday }).then((res) => res),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${type}`] });
      setOpenDialog(false);
    },
  });

  const handleSubmit = () => {
    if (selectedCustomer && paymentAmount) {
      paymentMutation.mutate({
        id: selectedCustomer._id,
        amount: parseInt(paymentAmount),
        isPaidToday: true,
      });
    }
  };

  const pinMutation = useMutation({
    mutationFn: ({ id, pin }: { id: string; pin: boolean }) =>
      request.patch(`/update/${type}/${id}`, { pin: !pin }).then((res) => res),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${type}`] });
    },
    onError: (error) => {
      console.error("Error in payment mutation:", error);
    },
  });

  const handlePin = (id: string, pin: boolean) => {
    pinMutation.mutate({ id, pin });
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>First name</TableCell>
            <TableCell align="right">Last name</TableCell>
            <TableCell align="right">Phone</TableCell>
            <TableCell align="right">Budget</TableCell>
            <TableCell align="right">Address</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row) => (
            <TableRow key={row._id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell component="th" scope="row">
                {row.pin && <PushPinIcon fontSize="small" className="text-[#333] rotate-45" />}
                {row.fname}
              </TableCell>
              <TableCell align="right">{row.lname}</TableCell>
              <TableCell align="right">{row.phone_primary}</TableCell>
              <TableCell align="right">{row.budget}</TableCell>
              <TableCell align="right">{row.address}</TableCell>
              <TableCell align="right">
                {row.isPaidToday ? (
                  <CheckCircleIcon style={{ color: "green" }} /> 
                ) : (
                )}
              </TableCell>
              <TableCell align="right">
                <Button sx={{ color: "#333" }} onClick={(e) => handleClick(e, row._id)}>
                  <MoreHorizIcon />
                </Button>
                {row._id === id && (
                  <Menu
                    id="demo-positioned-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    <MenuItem onClick={() => handlePin(row._id, row.pin)}>{row.pin ? "Unpin" : "Pin"}</MenuItem>
                    <MenuItem onClick={() => handlePayment(row)}>Payment</MenuItem>
                  </Menu>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Payment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedCustomer?.fname} {selectedCustomer?.lname}.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Payment Amount"
            type="number"
            fullWidth
            variant="standard"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!paymentAmount || paymentMutation.isPending}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default BasicTable;
