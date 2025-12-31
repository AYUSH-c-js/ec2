import React, { useState, useEffect } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo, type Todo } from './api';
import { Trash2, CheckCircle, Circle, Plus } from 'lucide-react';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const data = await getTodos();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;
    try {
      const newTodo = await createTodo(newTodoTitle);
      setTodos([newTodo, ...todos]);
      setNewTodoTitle('');
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const toggleComplete = async (todo: Todo) => {
    try {
      const updated = await updateTodo(todo.id, { is_completed: !todo.is_completed });
      setTodos(todos.map((t) => (t.id === todo.id ? updated : t)));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-10 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 p-6">
          <h1 className="text-3xl font-bold text-white text-center">My Tasks</h1>
          <p className="text-indigo-200 text-center mt-2">Get things done properly.</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleAddTodo} className="flex gap-2 mb-6">
            <input
              type="text"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg transition duration-200 flex items-center justify-center"
            >
              <Plus size={24} />
            </button>
          </form>

          {loading ? (
            <div className="text-center text-gray-500 mt-10">Loading tasks...</div>
          ) : todos.length === 0 ? (
            <div className="text-center text-gray-400 mt-10 flex flex-col items-center">
              <p>No tasks yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition duration-200 ${todo.is_completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-100 shadow-sm hover:shadow-md'
                    }`}
                >
                  <div className="flex items-center gap-3 flex-1 overflow-hidden">
                    <button
                      onClick={() => toggleComplete(todo)}
                      className={`flex-shrink-0 focus:outline-none transition ${todo.is_completed ? 'text-green-500' : 'text-gray-400 hover:text-indigo-500'}`}
                    >
                      {todo.is_completed ? <CheckCircle size={22} className="fill-current" /> : <Circle size={22} />}
                    </button>
                    <span className={`text-lg truncate ${todo.is_completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                      {todo.title}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="text-gray-400 hover:text-red-500 transition duration-200 p-2 rounded-full hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
