import React from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker, RangeKeyDict } from "react-date-range";
import { addDays } from "date-fns";
import { useState } from "react";
import { Button, Modal } from "@mui/material";
import { Box } from "@mui/system";
import DateRangeIcon from "@mui/icons-material/DateRange";

interface dateRangeProps {
  onDateChange: (startDate: string, endDate: string) => void;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",

  bgcolor: "background.paper",
  border: "1px solid ",
  boxShadow: 24,
};
export const DateRangePickerComponent = ({ onDateChange }: dateRangeProps) => {
  // state for open and close for the modal
  const [modalOpen, setModelOpen] = useState<boolean>(false);

  // eventually we want to get the range of start and end date
  const [range, setRange] = React.useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);
  // handle open and close of the modal
  const handleOpen = () => setModelOpen(true);
  const handleClose = () => setModelOpen(false);

  // ranges is an object that takes startDate, endDate and the key which is the selection.
  const handleDateChange = (ranges: RangeKeyDict) => {
    const selection = ranges.selection;
    const startDate = selection.startDate;
    const endDate = selection.endDate;

    if (startDate && endDate) {
      setRange([
        {
          startDate: startDate,
          endDate: endDate,
          key: "selection",
        },
      ]);

      const startDateSTR = startDate.toString();
      const endDateSTR = endDate.toString();
      onDateChange(startDateSTR, endDateSTR);
    }
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleOpen}>
        <DateRangeIcon className="mr-4" />
        <div className="font-bold">
          {range[0].startDate.toDateString()} -{" "}
          {range[0].endDate.toDateString()}
        </div>
      </Button>
      <Modal open={modalOpen} onClose={handleClose}>
        <Box sx={style}>
          <DateRangePicker
            onChange={handleDateChange}
            moveRangeOnFirstSelection={false}
            months={1}
            ranges={range}
            direction="horizontal"
            preventSnapRefocus={true}
            calendarFocus="backwards"
          />
        </Box>
      </Modal>
    </div>
  );
};
