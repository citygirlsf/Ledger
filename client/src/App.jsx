import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:5001/api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [justCompleted, setJustCompleted] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch todos');
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 1, title, priority }),
      });
      if (!res.ok) throw new Error('Failed to create todo');
      const newTodo = await res.json();
      setTodos([newTodo, ...todos]);
      setTitle('');
      setPriority('medium');
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleComplete = async (id, currentStatus) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_complete: !currentStatus }),
      });
      const updated = await res.json();
      setTodos(todos.map((t) => (t.id === id ? updated : t)));
      if (!currentStatus) {
        setJustCompleted(id);
        setTimeout(() => setJustCompleted(null), 1500);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete todo');
      setTodos(todos.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  if (loading) return <p className="ledger">Loading ledger...</p>;
  if (error) return <p className="ledger">Error: {error}</p>;

  const openCount = todos.filter((t) => !t.is_complete).length;

  return (
    <div className="ledger">
      <div className="ledger-header">
        <h1 className="ledger-title">The Ledger</h1>
        <span className="ledger-date">{todayLabel}</span>
      </div>
      <p className="ledger-count">
        {openCount} open &nbsp;·&nbsp; {todos.length - openCount} closed &nbsp;·&nbsp; {todos.length} total
      </p>

      <form onSubmit={handleSubmit} className="entry-form">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a new line item..."
          className="entry-input"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="entry-select"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button type="submit" className="entry-submit">
          Log It
        </button>
      </form>

      {todos.length === 0 ? (
        <p className="empty-state">The ledger is empty. Nothing to account for yet.</p>
      ) : (
        <ul className="ledger-rows">
          {todos.map((todo, i) => (
            <li key={todo.id} className="ledger-row">
              <span className="row-index">{String(i + 1).padStart(2, '0')}</span>
              <input
                type="checkbox"
                className="row-checkbox"
                checked={todo.is_complete}
                onChange={() => toggleComplete(todo.id, todo.is_complete)}
              />
              <span className={`row-title ${todo.is_complete ? 'done' : ''}`}>{todo.title}</span>
              <span className={`row-priority ${todo.priority}`}>{todo.priority}</span>
              <button onClick={() => deleteTodo(todo.id)} className="row-delete">
                ✕
              </button>
              {justCompleted === todo.id && <span className="done-stamp">✓ DONE</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;