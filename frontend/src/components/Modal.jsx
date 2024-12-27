/* eslint-disable react/prop-types */
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import TextField from "@mui/material/TextField";

function Modal({
  editodo,
  edit,
  toggleModal,
  handleAdd,
  handleStart_time,
  handleEnd_time,
  modal,
  todoName,
  setTodoName,
  start_time,
  end_time,
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full sm:w-96 shadow-lg">
            <h2 className="text-center text-xl font-semibold mb-4">Todo</h2>
            <div className="mb-4">
              <TextField
                autoFocus
                required
                id="outlined-basic"
                className="w-full"
                label="Todo Name"
                variant="outlined"
                value={todoName}
                onChange={(event) => setTodoName(event.target.value)}
              />
            </div>
            <div className="mb-4">
              <TimePicker
                label="Start Time"
                id="start_time"
                className="w-full"
                value={start_time}
                onChange={handleStart_time}
              />
            </div>
            <div className="mb-4">
              <TimePicker
                label="End Time"
                id="end_time"
                className="w-full"
                value={end_time}
                onChange={handleEnd_time}
              />
            </div>
            <div className="flex justify-between items-center">
              {todoName && (
                <button
                  type="submit"
                  className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                  onClick={edit ? editodo : handleAdd}
                >
                  {edit ? "Edit" : "Add"}
                </button>
              )}
              <button
                className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
                onClick={toggleModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </LocalizationProvider>
  );
}

export default Modal;
