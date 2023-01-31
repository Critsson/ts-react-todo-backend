import React from 'react';
import Todo from "./components/Todo"
import './styles/App.css';

interface TodoObject {
  tid: number,
  description: string
}

function App() {

  const [text, setText] = React.useState("")
  const [listOfTodos, setListOfTodos] = React.useState<TodoObject[]>([])
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (loading === true) {
      fetch("https://ah7fh8gql5.execute-api.us-east-1.amazonaws.com/dev/todos")
        .then(res => res.json())
        .then(data => setListOfTodos(data))
    }

    setLoading(false)
  }, [])

  const submitForm = async (e: React.FormEvent): Promise<void> => {

    e.preventDefault()

    await fetch("https://ah7fh8gql5.execute-api.us-east-1.amazonaws.com/dev/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ description: text })
    })

    await fetch("https://ah7fh8gql5.execute-api.us-east-1.amazonaws.com/dev/todos")
      .then(res => res.json())
      .then(data => setListOfTodos(data))

    setText("")
  }

  const deleteTodo = async (tid: number): Promise<void> => {
    await fetch(`https://ah7fh8gql5.execute-api.us-east-1.amazonaws.com/dev/todos/${tid}`, {
      method: "DELETE",
    })
    await fetch("https://ah7fh8gql5.execute-api.us-east-1.amazonaws.com/dev/todos")
      .then(res => res.json())
      .then(data => setListOfTodos(data))
  }

  const editTodo = async (tid: number, newDescription: string): Promise<void> => {
      await fetch(`https://ah7fh8gql5.execute-api.us-east-1.amazonaws.com/dev/todos/${tid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({description: newDescription})
      })

      await fetch("https://ah7fh8gql5.execute-api.us-east-1.amazonaws.com/dev/todos")
      .then(res => res.json())
      .then(data => setListOfTodos(data))
  }

  const updateText = (e: React.FormEvent<HTMLInputElement>): void => setText(e.currentTarget.value)

  const listOfTodoElements: JSX.Element[] = listOfTodos.map((todo) => {
    return <Todo key={todo.tid} tid={todo.tid} description={todo.description} deleteTodo={deleteTodo} editTodo={editTodo} />
  })

  return (
    <div className="container">
      <div className="title_container">
        <h1 className="title">To-Do Manager</h1>
      </div>
      <form onSubmit={(e) => submitForm(e)}>
        <input onChange={(e) => updateText(e)} className="text_input" type="text" placeholder="Task..." value={text} />
        <button className="submit_button" type="submit">Submit</button>
      </form>
      {!loading ? <div className="todos_container">
        {listOfTodoElements}
      </div> : <div>Loading...</div>}
    </div>
  );
}

export default App;
