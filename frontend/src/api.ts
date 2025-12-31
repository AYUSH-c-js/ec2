import axios from 'axios';

const API_URL = 'http://localhost:3000/todos';

export interface Todo {
    id: number;
    title: string;
    is_completed: boolean;
    created_at: string;
}

export const getTodos = async (): Promise<Todo[]> => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createTodo = async (title: string): Promise<Todo> => {
    const response = await axios.post(API_URL, { title });
    return response.data;
};

export const updateTodo = async (id: number, updates: Partial<{ title: string; is_completed: boolean }>): Promise<Todo> => {
    const response = await axios.patch(`${API_URL}/${id}`, updates);
    return response.data;
};

export const deleteTodo = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};
