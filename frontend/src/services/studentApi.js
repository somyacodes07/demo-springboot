const BASE_URL = '/api/students';

export const studentApi = {
  async getAll(params = {}) {
    const url = new URL(BASE_URL, window.location.origin);
    if (params.course) url.searchParams.append('course', params.course);
    if (params.name) url.searchParams.append('name', params.name);

    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to fetch students' }));
      throw new Error(err.message || 'Failed to fetch students');
    }
    return res.json();
  },

  async getById(id) {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Student not found' }));
      throw new Error(err.message || 'Student not found');
    }
    return res.json();
  },

  async create(student) {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: 'Failed to create student' }));
      const error = new Error(errorData.message || 'Failed to create student');
      error.validationErrors = errorData.validationErrors;
      throw error;
    }
    return res.json();
  },

  async update(id, student) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: 'Failed to update student' }));
      const error = new Error(errorData.message || 'Failed to update student');
      error.validationErrors = errorData.validationErrors;
      throw error;
    }
    return res.json();
  },

  async delete(id) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to delete student' }));
      throw new Error(err.message || 'Failed to delete student');
    }
    return res.json();
  }
};
