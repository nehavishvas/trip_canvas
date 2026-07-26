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

  async register(credentials: { name: string; email: string; password?: string }) {
    const data = await request('/api/auth/register', {
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
    try {
      // 1. Check if direct upload is supported by getting a signature
      const sigData = await request('/api/media/signature').catch((err) => {
        console.error('Failed to fetch upload signature:', err);
        return null;
      });
      if (sigData && sigData.signature) {
        const uploadedFiles = [];
        for (const file of files) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('api_key', sigData.apiKey);
          formData.append('timestamp', String(sigData.timestamp));
          formData.append('signature', sigData.signature);
          if (sigData.folder) {
            formData.append('folder', sigData.folder);
          }
          
          const resourceType = file.type.startsWith('video/') ? 'video' : 'auto';
          const uploadUrl = `https://api.cloudinary.com/v1_1/${sigData.cloudName}/${resourceType}/upload`;
          
          const res = await fetch(uploadUrl, {
            method: 'POST',
            body: formData,
          });
          const result = await res.json();
          if (!res.ok) throw new Error(result.error?.message || 'Upload failed');
          
          uploadedFiles.push({
            file_url: result.secure_url,
            file_type: result.resource_type === 'video' ? 'video' : 'image',
            file_name: file.name
          });
        }
        return { message: 'Files uploaded successfully', files: uploadedFiles };
      }
    } catch (e) {
      console.warn('Direct upload failed or not configured, falling back to local upload API', e);
    }

    // Fallback to original behavior if signature fails or Cloudinary isn't configured
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
