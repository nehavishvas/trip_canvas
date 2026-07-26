// Client-side API wrappers

const BASE_URL = ''; // Same domain

async function request(url: string, options: RequestInit = {}) {
  // Try to get token from localStorage on the client side
  let token = '';
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token') || '';
  }

  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    data = { error: 'Failed to parse JSON response' };
  }

  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }
  return data;
}

export const api = {
  // Auth
  async login(credentials: { email: string; password?: string }) {
    const data = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  async logout() {
    await request('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem('token');
  },

  async getMe() {
    return request('/api/auth/me');
  },

  // Blogs
  async getBlogs(filters: {
    category?: string;
    tag?: string;
    author?: string;
    search?: string;
    status?: string;
  } = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val) params.set(key, val);
    });
    const queryString = params.toString();
    return request(`/api/blogs${queryString ? `?${queryString}` : ''}`);
  },

  async getBlog(slugOrId: string) {
    return request(`/api/blogs/${slugOrId}`);
  },

  async createBlog(blogData: {
    title: string;
    content: string;
    category_id: number;
    tags?: number[];
    status?: 'draft' | 'published';
    media?: { file_url: string; file_type: 'image' | 'video'; file_name: string }[];
  }) {
    return request('/api/blogs', {
      method: 'POST',
      body: JSON.stringify(blogData),
    });
  },

  async updateBlog(
    id: number,
    blogData: {
      title?: string;
      content?: string;
      category_id?: number;
      tags?: number[];
      status?: 'draft' | 'published';
      media?: { file_url: string; file_type: 'image' | 'video'; file_name: string }[];
    }
  ) {
    return request(`/api/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(blogData),
    });
  },

  async deleteBlog(id: number) {
    return request(`/api/blogs/${id}`, {
      method: 'DELETE',
    });
  },

  // Media
  async uploadMedia(files: File[]) {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return request('/api/media/upload', {
      method: 'POST',
      body: formData,
    });
  },

  async getMedia(blogId: number) {
    return request(`/api/media/${blogId}`);
  },
};
