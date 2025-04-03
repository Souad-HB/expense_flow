import { useState } from "react";
import "react-date-range/dist/styles.css"; // Main CSS file
import "react-date-range/dist/theme/default.css"; // Theme CSS file
import { DateRangePicker, RangeKeyDict } from "react-date-range";
import { addDays } from "date-fns";
import { Modal, Box, Button } from "@mui/material";

interface DateRangePickerProps {
  onDateChange: (startDate: string, endDate: string) => void;
}

const DateRangePickerComponent = ({ onDateChange }: DateRangePickerProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  // Handle changes in date picker
  const handleChange = (ranges: RangeKeyDict) => {
    const selection = ranges.selection;
    const startDate = selection.startDate?.toISOString().split("T")[0] || "";
    const endDate = selection.endDate?.toISOString().split("T")[0] || "";

    setDateRange([
      {
        startDate: selection.startDate || new Date(),
        endDate: selection.endDate || addDays(new Date(), 7),
        key: "selection",
      },
    ]);

    if (startDate && endDate) {
      onDateChange(startDate, endDate);
      setIsModalOpen(false); // Close modal after selection
    }
  };

  return (
    <>
      {/* Button to open modal */}
      <Button
        variant="contained"
        onClick={() => setIsModalOpen(true)}
        sx={{
          backgroundColor: "#f44336",
          color: "white",
          "&:hover": { backgroundColor: "#d32f2f" },
        }}
      >
        Select Date Range
      </Button>

      {/* Modal for Date Picker */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <DateRangePicker
            onChange={handleChange}
            moveRangeOnFirstSelection={false}
            months={1}
            ranges={dateRange}
            direction="horizontal"
            preventSnapRefocus={true}
            calendarFocus="backwards"
          />
          <Button
            onClick={() => setIsModalOpen(false)}
            sx={{
              display: "block",
              margin: "auto",
              mt: 2,
              backgroundColor: "#f44336",
              color: "white",
              "&:hover": { backgroundColor: "#d32f2f" },
            }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default DateRangePickerComponent;
