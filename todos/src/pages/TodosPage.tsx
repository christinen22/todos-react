import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Todo } from "../types";
import Alert from "react-bootstrap/Alert";
import ListGroup from "react-bootstrap/ListGroup";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import AddNewTodoForm from "../components/AddNewTodoForm";
import AutoDismissingAlert from "../components/AutoDismissingAlert";
import * as TodosAPI from "../services/TodosAPI";

const TodosPage = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParams_deletedTodo = searchParams.get("deleted");
  const deletedTodo = Boolean(searchParams_deletedTodo);

  const {
    data: todos,
    isError,
    refetch: getTodos,
  } = useQuery(["todos"], TodosAPI.getTodos);

  const createTodoMutation = useMutation(
    (newTodo: Todo) => TodosAPI.createTodo(newTodo),
    {
      onSuccess: () => {
        getTodos(); // Refetch todos on success
      },
    }
  );

  //  mutation function
  const addTodo = (todo: Todo) => {
    createTodoMutation.mutate(todo);
  };

  return (
    <>
      <h1 className="mb-3">What to do...</h1>

      <AddNewTodoForm onAddTodo={addTodo} />

      {location.state?.message && (
        <Alert variant="success">{location.state.message}</Alert>
      )}

      {deletedTodo && (
        <AutoDismissingAlert variant="success" hideAfter={3}>
          Todo was successfully deleted
        </AutoDismissingAlert>
      )}

      {todos && todos.length > 0 && (
        <ListGroup className="todolist">
          {todos.map((todo) => (
            <ListGroup.Item
              action
              as={Link}
              key={todo.id}
              className={todo.completed ? "done" : ""}
              to={`/todos/${todo.id}`}
            >
              {todo.title}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      {todos && todos.length === 0 && <p>Good job, you have 0 todos to do</p>}
    </>
  );
};

export default TodosPage;
