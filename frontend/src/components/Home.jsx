import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import xss from "xss";
import {
  fetchTodo,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../functions/Todo";
function Home() {
  dayjs.extend(utc);
  const [todo, setTodo] = useState([]);
  const [modal, setModal] = useState(false);
  const [todoName, setTodoName] = useState("");
  const [start_time, setStart_time] = useState(dayjs());
  const [end_time, setEnd_time] = useState(dayjs());
  const [edit, setEdit] = useState(false);
  const [index, setIndex] = useState(0);
  const [points, setPoints] = useState(0);
  const navigate = useNavigate();

  const point = () => setPoints(points + 10);

  const completeTodo = async (id) => {
    const response = await deleteTodo(id);
    setTodo(response);
    point();
  };

  const toggleModal = () => {
    setModal(!modal);
    setTodoName("");
    setStart_time(dayjs.utc().local());
    setEnd_time(dayjs.utc().local());
  };

  const handleAdd = async () => {
    const data = {
      name: xss(todoName),
      start_time: start_time.utc().format(),
      end_time: end_time.utc().format(),
    };

    const response = await createTodo(data);
    setTodo(response);
    toggleModal();
  };

  const handleStart_time = (newValue) => {
    if (newValue) {
      setStart_time(newValue); // newValue is already a dayjs object
    }
  };

  const handleEnd_time = (newValue) => {
    if (newValue) {
      setEnd_time(newValue); // newValue is already a dayjs object
    }
  };

  const openEdit = (id) => {
    setEdit(true);
    const idx = todo.findIndex((item) => item.id === id);
    setIndex(idx);
    toggleModal();
    setTodoName(todo[idx].name);
    setStart_time(dayjs.utc(todo[idx].start_time, "HH:mm:ss").local());
    setEnd_time(dayjs.utc(todo[idx].end_time, "HH:mm:ss").local());
  };

  const editTodo = async () => {
    const updatedData = {
      ...todo[index],
      name: todoName,
      start_time: start_time.utc().format(),
      end_time: end_time.utc().format(),
    };

    const response = await updateTodo(updatedData);

    // const newTodo = [...todo];
    // newTodo[index] = updatedTodo;

    setTodo(response);
    setEdit(false);
    toggleModal();
  };

  const todoData = todo.map((el) => (
    <div className="w-6/12 mx-auto p-4" key={el.id}>
      <div className="bg-cyan-100 shadow-md rounded-lg p-4">
        <p className="text-center mb-3 font-semibold">{xss(el.name)}</p>
        <div className="flex justify-between mb-3">
          <p>
            Start Time:{" "}
            {dayjs.utc(el.start_time, "HH:mm:ss").local().format("hh:mm A")}
          </p>
          <p>
            End Time:{" "}
            {dayjs.utc(el.end_time, "HH:mm:ss").local().format("hh:mm A")}
          </p>
        </div>
        <div className="flex justify-between">
          <p
            className="text-green-500 cursor-pointer"
            onClick={() => completeTodo(el.id)}
          >
            ✔️
          </p>
          <FontAwesomeIcon
            className="text-blue-500 cursor-pointer"
            icon={faPen}
            onClick={() => openEdit(el.id)}
          />
        </div>
      </div>
    </div>
  ));

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
      return;
    }

    const fetchTodos = async () => {
      const response = await fetchTodo();
      setTodo(response);
    };
    fetchTodos();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center items-start mb-6">
        <p className="text-xl font-bold">Points: {points}</p>
      </div>

      <div className="flex justify-center flex-col items-center">
        <button
          className="w-48 btn btn-warning mt-4 bg-yellow-500 px-6 py-2 rounded"
          onClick={toggleModal}
        >
          Add Todo
        </button>

        <Modal
          editodo={editTodo}
          edit={edit}
          toggleModal={toggleModal}
          handleAdd={handleAdd}
          handleStart_time={handleStart_time}
          handleEnd_time={handleEnd_time}
          modal={modal}
          todoName={todoName}
          setTodoName={setTodoName}
          start_time={start_time}
          end_time={end_time}
        />

        <div className="w-full grid grid-cols-1 gap-4 mt-6">{todoData}</div>
      </div>
    </div>
  );
}

export default Home;
