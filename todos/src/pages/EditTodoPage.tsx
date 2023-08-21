import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate, useParams } from "react-router-dom";
import { Todo } from "../types";
import * as TodosAPI from "../services/TodosAPI";

const EditTodoPage = () => {
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const todoId = Number(id);

  const {
    data: todo,
    isError,
    isLoading,
    refetch: getTodo,
  } = useQuery(["todo", { id: todoId }], () => TodosAPI.getTodo(todoId)); //the hook will fetch a todo with the specified id

  const updateTodoMutation = useMutation((updateData: Partial<Todo>) =>
    TodosAPI.updateTodo(todoId, updateData)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!todo || !todo.id) {
      return;
    }

    //mutateAsync method to update the todo title, it triggers a mutation asynchronously and await its completion
    await updateTodoMutation.mutateAsync({
      title: newTodoTitle,
    });
    // redirect user to /todos/:id
    navigate(`/todos/${todo.id}`);

    getTodo();
  };

  if (isError) {
    return (
      <Alert variant="warning">
        <h1>Something went wrong!</h1>

        {/* .mutate({}) is calling the mutate method on the updateTodoMutation instance, mutate is used to trigger the mutation operation (empy object acts as a placeholder, isnt needed in this case) */}
        <Button variant="primary" onClick={() => updateTodoMutation.mutate({})}>
          Try Again
        </Button>
      </Alert>
    );
  }

  if (isLoading || !todo) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1>Edit: {todo.title}</h1>

      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group className="mb-3" controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter the new title"
            onChange={(e) => setNewTodoTitle(e.target.value)}
            value={newTodoTitle}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Save
        </Button>
      </Form>

      <Button variant="secondary" onClick={() => navigate(-1)}>
        &laquo; Go back
      </Button>
    </>
  );
};

export default EditTodoPage;
