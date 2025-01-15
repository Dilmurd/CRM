import { request } from "@/api";
import CreateCS from "@/components/create-cs/CreateCS";
import Table from "@/components/table/Table";
import { Box, Button, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const Seller = () => {
  const [open, setOpen] = useState<null | string>(null);
  const { data } = useQuery({ queryKey: ['seller'], queryFn: () => {
    return request.get("/get/sellers").then(response => response.data);
  } })
  

  return (
    <div>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", mb: "20px" }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Seller
        </Typography>
        <Button onClick={() => setOpen("seller")}>Create</Button>
      </Box>
      <Table data={data?.innerData} type="seller"/>
      <CreateCS open={open} close={() => setOpen(null)} />
    </div>
  );
};

export default Seller;
