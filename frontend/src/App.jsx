import React, { useState, useEffect } from 'react';
import { studentApi } from './services/studentApi';

export default function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', course: '', marks: '' });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [alert, setAlert] = useState(null);

  const showAlert = (text, type = 'success') => {
    setAlert({ text, type });
    setTimeout(() => setAlert(null), 3500);
  };

  const loadStudents = async () => {
    try {
      const data = await studentApi.getAll();
      setStudents(data);
    } catch (err) {
      showAlert(err.message, 'error');
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      course: formData.course.trim(),
      marks: parseInt(formData.marks, 10)
    };

    try {
      if (editingId) {
        await studentApi.update(editingId, payload);
        showAlert('Student updated successfully!');
      } else {
        await studentApi.create(payload);
        showAlert('Student added successfully!');
      }
      setFormData({ name: '', email: '', course: '', marks: '' });
      setEditingId(null);
      loadStudents();
    } catch (err) {
      if (err.validationErrors) {
        setFieldErrors(err.validationErrors);
      } else {
        showAlert(err.message, 'error');
      }
    }
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setFormData({
      name: student.name,
      email: student.email,
      course: student.course,
      marks: student.marks
    });
    setFieldErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', course: '', marks: '' });
    setFieldErrors({});
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await studentApi.delete(id);
      showAlert('Student deleted successfully!');
      loadStudents();
    } catch (err) {
      showAlert(err.message, 'error');
    }
  };

  const filtered = students.filter(s => {
    const q = searchTerm.toLowerCase();
    return !q ||
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.email && s.email.toLowerCase().includes(q)) ||
      (s.course && s.course.toLowerCase().includes(q));
  });

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1>Student Management</h1>
        <p>Spring Boot backend with MySQL and React frontend</p>
      </div>

      {/* Alert Banner */}
      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.text}
        </div>
      )}

      {/* Student Form Card */}
      <div className="card">
        <h2>{editingId ? 'Edit Student' : 'Add New Student'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />
              {fieldErrors.name && <span className="error-text">{fieldErrors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
              />
              {fieldErrors.email && <span className="error-text">{fieldErrors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="course">Course</label>
              <input
                id="course"
                name="course"
                type="text"
                required
                placeholder="Course Name"
                value={formData.course}
                onChange={handleChange}
              />
              {fieldErrors.course && <span className="error-text">{fieldErrors.course}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="marks">Marks (0-100)</label>
              <input
                id="marks"
                name="marks"
                type="number"
                min="0"
                max="100"
                required
                placeholder="e.g. 85"
                value={formData.marks}
                onChange={handleChange}
              />
              {fieldErrors.marks && <span className="error-text">{fieldErrors.marks}</span>}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update Student' : 'Add Student'}
              </button>
              {editingId && (
                <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Student List Card */}
      <div className="card">
        <h2>Students List ({filtered.length})</h2>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name, email, or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Course</th>
                <th>Marks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(student => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td><strong>{student.name}</strong></td>
                  <td>{student.email}</td>
                  <td>{student.course}</td>
                  <td>{student.marks}</td>
                  <td className="actions-cell">
                    <button className="btn btn-edit" onClick={() => handleEdit(student)}>
                      Edit
                    </button>
                    <button className="btn btn-delete" onClick={() => handleDelete(student.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-text">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
