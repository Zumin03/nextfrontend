// You provided a great structure! Here's a polished and clean version of your `TodosPage.tsx`
// All features are kept: filtering, sorting, editing, creating, deleting
// Layout, readability, and spacing have been improved

'use client';

import { useEffect, useState } from 'react';

export default function TodosPage() {
    type User = { id: number; name: string; email: string };
    type Todo = {
        id: number;
        title: string;
        dueDate: string;
        completed: boolean;
        user?: User;
    };

    const [todos, setTodos] = useState<Todo[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const [newDueDate, setNewDueDate] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDueDate, setEditDueDate] = useState('');

    const [sortBy, setSortBy] = useState<'id' | 'dueDate'>('id');
    const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
    const [userFilter, setUserFilter] = useState<'all' | number>('all');

    useEffect(() => {
        fetch('http://localhost:4000/users')
            .then((res) => res.json())
            .then(setUsers)
            .catch((err) => console.error('Failed to fetch users:', err));
    }, []);

    useEffect(() => {
        fetch('http://localhost:4000/todos')
            .then((res) => res.json())
            .then((data) => {
                setTodos(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to fetch todos:', err);
                setLoading(false);
            });
    }, []);

    const filteredAndSortedTodos = todos
        .filter((todo) => {
            if (filter === 'completed' && !todo.completed) return false;
            if (filter === 'pending' && todo.completed) return false;
            if (userFilter !== 'all' && todo.user?.id !== userFilter) return false;
            return true;
        })
        .sort((a, b) => {
            if (sortBy === 'id') return a.id - b.id;
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });

    const handleCreateTodo = async () => {
        if (!newUserName || !newUserEmail || !newTodoTitle || !newDueDate) {
            alert('Please fill in all fields.');
            return;
        }

        setIsSubmitting(true);
        try {
            const userRes = await fetch('http://localhost:4000/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newUserName, email: newUserEmail }),
            });
            const user = await userRes.json();

            await fetch('http://localhost:4000/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newTodoTitle,
                    dueDate: newDueDate,
                    userId: user.id,
                }),
            });

            window.location.reload();
        } catch (err) {
            console.error('Error creating todo and user:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this todo?')) return;

        try {
            await fetch(`http://localhost:4000/todos/${id}`, {
                method: 'DELETE',
            });
            setTodos((prev) => prev.filter((t) => t.id !== id));
        } catch (err) {
            console.error('Failed to delete todo:', err);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">📝 Todos</h1>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'id' | 'dueDate')}
                    className="px-3 py-1 rounded border dark:bg-gray-700"
                >
                    <option value="id">Sort by ID</option>
                    <option value="dueDate">Sort by Due Date</option>
                </select>

                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as 'all' | 'completed' | 'pending')}
                    className="px-3 py-1 rounded border dark:bg-gray-700"
                >
                    <option value="all">All</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                </select>

                <select
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                    className="px-3 py-1 rounded border dark:bg-gray-700"
                >
                    <option value="all">All Users</option>
                    {users.map((u) => (
                        <option key={u.id} value={u.id}>{u.email}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <p>Loading todos...</p>
            ) : (
                <ul className="space-y-4">
                    {filteredAndSortedTodos.map((todo) => (
                        <li key={todo.id} className="p-4 bg-white dark:bg-gray-800 rounded shadow">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-semibold">{todo.title}</h2>
                                    <p className="text-sm text-gray-500">Due: {new Date(todo.dueDate).toLocaleDateString()}</p>
                                </div>
                                <div className="flex gap-2">
                                    <select
                                        value={todo.completed ? 'completed' : 'pending'}
                                        onChange={async (e) => {
                                            const newStatus = e.target.value === 'completed';
                                            await fetch(`http://localhost:4000/todos/${todo.id}`, {
                                                method: 'PATCH',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ completed: newStatus }),
                                            });
                                            setTodos((prev) =>
                                                prev.map((t) =>
                                                    t.id === todo.id ? { ...t, completed: newStatus } : t
                                                )
                                            );
                                        }}
                                        className="px-2 py-1 rounded border dark:bg-gray-700"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="completed">Completed</option>
                                    </select>

                                    <button
                                        onClick={() => {
                                            setEditingId(todo.id);
                                            setEditTitle(todo.title);
                                            setEditDueDate(todo.dueDate.split('T')[0]);
                                        }}
                                        className="px-2 py-1 bg-yellow-500 text-white rounded cursor-pointer"
                                    >Edit</button>

                                    <button
                                        onClick={() => handleDelete(todo.id)}
                                        className="px-2 py-1 bg-red-600 text-white rounded cursor-pointer"
                                    >Delete</button>
                                </div>
                            </div>

                            {editingId === todo.id && (
                                <div className="mt-4 space-y-2">
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className="w-full p-2 rounded border dark:bg-gray-700"
                                        placeholder="Edit title"
                                    />
                                    <input
                                        type="date"
                                        value={editDueDate}
                                        onChange={(e) => setEditDueDate(e.target.value)}
                                        className="w-full p-2 rounded border dark:bg-gray-700"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={async () => {
                                                await fetch(`http://localhost:4000/todos/${todo.id}`, {
                                                    method: 'PATCH',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ title: editTitle, dueDate: editDueDate }),
                                                });
                                                setTodos((prev) =>
                                                    prev.map((t) =>
                                                        t.id === todo.id ? { ...t, title: editTitle, dueDate: editDueDate } : t
                                                    )
                                                );
                                                setEditingId(null);
                                            }}
                                            className="bg-green-600 text-white px-4 py-1 rounded cursor-pointer"
                                        >Save</button>
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="bg-gray-500 text-white px-4 py-1 rounded cursor-pointer"
                                        >Cancel</button>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            <button
                onClick={() => setShowForm(!showForm)}
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
            >
                ➕ New Todo
            </button>

            {showForm && (
                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded space-y-4">
                    <input
                        type="text"
                        placeholder="User Name"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        className="w-full p-2 rounded border dark:bg-gray-700"
                    />
                    <input
                        type="email"
                        placeholder="User Email"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        className="w-full p-2 rounded border dark:bg-gray-700"
                    />
                    <input
                        type="text"
                        placeholder="Todo Title"
                        value={newTodoTitle}
                        onChange={(e) => setNewTodoTitle(e.target.value)}
                        className="w-full p-2 rounded border dark:bg-gray-700"
                    />
                    <input
                        type="date"
                        value={newDueDate}
                        onChange={(e) => setNewDueDate(e.target.value)}
                        className="w-full p-2 rounded border dark:bg-gray-700"
                    />
                    <button
                        onClick={handleCreateTodo}
                        disabled={isSubmitting}
                        className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
                    >
                        {isSubmitting ? 'Creating...' : 'Create'}
                    </button>
                </div>
            )}
        </div>
    );
}