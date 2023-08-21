import Container from "react-bootstrap/Container";
import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import CreateTodoPage from "./pages/CreateTodoPage";
import EditTodoPage from "./pages/EditTodoPage";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import TodoPage from "./pages/TodoPage";
import TodosPage from "./pages/TodosPage";
import "./assets/scss/App.scss";

const App = () => {
  return (
    <div id="App">
      <Navigation />

      <Container className="py-3">
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/todos">
            <Route path="" element={<TodosPage />} />
            <Route path=":id" element={<TodoPage />} />
            <Route path=":id/edit" element={<EditTodoPage />} />
            <Route path="create" element={<CreateTodoPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </div>
  );
};

export default App;
