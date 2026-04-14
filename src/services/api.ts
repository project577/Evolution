export interface User {
  id: number;
  name: string;
  email: string;
  role: 'patient' | 'student';
}

export interface Video {
  id: number;
  title: string;
  description: string;
  url: string;
  category: string;
}

export interface Booking {
  id: number;
  user_id: number;
  type: string;
  date: string;
}

export interface Message {
  id: number;
  user_id: number;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export const api = {
  async login(email: string, password: string): Promise<User> {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Login fehlgeschlagen');
    }
    return res.json();
  },

  async register(name: string, email: string, password: string): Promise<User> {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Registrierung fehlgeschlagen');
    }
    return res.json();
  },

  async getVideos(): Promise<Video[]> {
    const res = await fetch('/api/videos');
    return res.json();
  },

  async getBookings(userId: number): Promise<Booking[]> {
    const res = await fetch(`/api/bookings/${userId}`);
    return res.json();
  },

  async createBooking(userId: number, type: string, date: string): Promise<{ id: number }> {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, type, date }),
    });
    return res.json();
  },

  async getChatHistory(userId: number): Promise<Message[]> {
    const res = await fetch(`/api/chat/${userId}`);
    return res.json();
  },

  async saveMessage(userId: number, role: string, content: string): Promise<void> {
    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role, content }),
    });
  },

  async resetPassword(email: string): Promise<void> {
    const res = await fetch('/api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Passwort-Reset fehlgeschlagen');
    }
  },
};
