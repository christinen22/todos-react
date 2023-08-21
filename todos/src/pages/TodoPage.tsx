import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Todo } from "../types";
import * as TodosAPI from "../services/TodosAPI";
import ConfirmationModal from "../components/ConfirmationModal";

const TodoPage = () => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const todoId = Number(id);

  const {
    data: todo,
    isError,
    isLoading,
    refetch: getTodo,
  } = useQuery(["todo", { id: todoId }], () => TodosAPI.getTodo(todoId));

  // Delete a todo in the api
  const deleteTodo = async (todo: Todo) => {
    if (!todo.id) {
      return;
    }

    // Delete todo from the api
    await TodosAPI.deleteTodo(todo.id);

    // Navigate user to `/todos` (using search params/query params)
    navigate("/todos?deleted=true", {
      replace: true,
    });
  };

  // Toggle the completed status of a todo in the api
  const toggleTodo = async (todo: Todo) => {
    if (!todo.id) {
      return;
    }

    // Update a todo in the api
    const updatedTodo = await TodosAPI.updateTodo(todo.id, {
      completed: !todo.completed,
    });

    // update todo state with the updated todo
    getTodo();
  };

  if (isError) {
    return (
      <Alert variant="warning">
        <h1>Something went wrong!</h1>

        <Button variant="primary" onClick={() => getTodo()}>
          Try again
        </Button>
      </Alert>
    );
  }

  if (isLoading || !todo) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1>{todo.title}</h1>

      <p>
        <strong>Status:</strong>{" "}
        {todo.completed ? "Completed" : "Not completed"}
      </p>

      <div className="buttons mb-3">
        <Button variant="success" onClick={() => toggleTodo(todo)}>
          Toggle
        </Button>

        <Link to={`/todos/${todoId}/edit`}>
          <Button variant="warning">Edit</Button>
        </Link>

        <Button variant="danger" onClick={() => setShowConfirmDelete(true)}>
          Delete
        </Button>
      </div>

      <ConfirmationModal
        show={showConfirmDelete}
        onCancel={() => setShowConfirmDelete(false)}
        onConfirm={() => deleteTodo(todo)}
      >
        Confirm?
      </ConfirmationModal>

      <Link to="/todos">
        <Button variant="secondary">&laquo; All todos</Button>
      </Link>
    </>
  );
};

export default TodoPage;
