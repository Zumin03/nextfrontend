'use client';

import { useEffect, useState } from 'react';

type User = {
    id: number;
    name: string;
    email: string;
};

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Replace with your actual backend URL
        fetch('http://localhost:4000/users')
            .then((res) => res.json())
            .then((data) => {
                setUsers(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to fetch users:', err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">👥 Users</h1>

            {loading ? (
                <p>Loading users...</p>
            ) : users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <ul className="space-y-4">
                    {users.map((user) => (
                        <li
                            key={user.id}
                            className="p-4 bg-white dark:bg-gray-800 rounded shadow"
                        >
                            <p className="text-xl font-semibold">{user.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}