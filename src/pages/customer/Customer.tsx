import { request } from "@/api";
import CreateCS from "@/components/create-cs/CreateCS";
import Table from "@/components/table/Table";
import { Box, Button, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const Customer = () => {
  const [open, setOpen] = useState<null | string>(null);
  const { data } = useQuery({ queryKey: ['customer'], queryFn: () => {
    return request.get("/get/customers").then(response => response.data);
  } })
  console.log(data);
  
  
  return (
    <div>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", mb: "20px" }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Customer
        </Typography>
        <Button onClick={() => setOpen("customer")}>Create</Button>
      </Box>
      <Table data={data?.innerData}/>
      <CreateCS open={open} close={() => setOpen(null)} />
    </div>
  );
};

export default Customer;
