import { Box, Pagination, Stack } from "@mui/material";
import TableListItem from "./TableListItem";
import TableListTitle from "./TableListTitle";
import { useState } from "react";

const TableList = ({ cafes }) => {
  const [page, setPage] = useState(1);
  console.log(cafes)
  const pageSize = 7;
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, cafes.length);
  const currentPageData = cafes.slice(startIndex, endIndex);

  const handlePageChange = (e, v) => {
    setPage(v);
  };

  return (
    <Box>
      <Stack component={"ul"} gap={1}>
        <TableListTitle />
        {currentPageData.map((data, index) => (
          <TableListItem
            data={data}
            number={page * pageSize + index - pageSize + 1}
            key={Math.random()}
          />
        ))}
      </Stack>

      <Pagination
        color="secondary"
        fill="primary"
        count={Math.ceil(cafes.length / pageSize)}
        page={page}
        onChange={handlePageChange}
        shape="rounded"
        sx={{
          "& .MuiPagination-ul": {
            justifyContent: "flex-end",
          },
          "& .MuiPaginationItem-root": {
            color: "primary.main",
          },
        }}
      />
    </Box>
  );
};

export default TableList;
