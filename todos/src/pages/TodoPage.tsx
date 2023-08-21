import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import { Link, To, useNavigate, useParams } from "react-router-dom";
import { Todo } from "../types";
import * as TodosAPI from "../services/TodosAPI";
import ConfirmationModal from "../components/ConfirmationModal";

const TodoPage = () => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const todoId = Number(id);

  //extracted properties (data, isError, isLoading, and getTodo) allow you to handle different states of the data fetching process
  const {
    data: todo,
    isError,
    isLoading,
    refetch: getTodo,
  } = useQuery(["todo", { id: todoId }], () => TodosAPI.getTodo(todoId)); //the hook will fetch a todo (querykey) with the specified id(query parameter)

  const toggleTodoMutation = useMutation(
    (updatedTodo: Todo) =>
      TodosAPI.updateTodo(updatedTodo.id!, {
        completed: !updatedTodo.completed,
      }),
    {
      onSuccess: () => {
        // This function will be called after the mutation is successful
        getTodo();
      },
    }
  );

  const deleteTodoMutation = useMutation(() => TodosAPI.deleteTodo(todoId), {
    onSuccess: () => {
      // This function will be called after the delete is successful
      navigate("/todos?deleted=true", {
        replace: true,
      });
    },
  });

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
        <Button
          variant="success"
          onClick={() => toggleTodoMutation.mutate(todo)}
        >
          Done?
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
        onConfirm={() => deleteTodoMutation.mutate()}
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
