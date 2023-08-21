import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import Alert from "react-bootstrap/Alert";
import { Todo } from "../types";
import AddNewTodoForm from "../components/AddNewTodoForm";
import * as TodosAPI from "../services/TodosAPI";

const CreateTodoPage = () => {
  const [success, setSuccess] = useState<boolean | null>(null);
  const navigate = useNavigate();

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
      <h1 className="mb-3">Create a new Todo</h1>

      <AddNewTodoForm onAddTodo={addTodo} />

      {success === true && (
        <Alert variant="success" className="mt-3">
          Todo created!
        </Alert>
      )}

      {success === false && (
        <Alert variant="warning" className="mt-3">
          Todo could not be created 😔
        </Alert>
      )}
    </>
  );
};

export default CreateTodoPage;
