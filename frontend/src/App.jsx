import React, { useState, useEffect, useMemo } from 'react';
import { studentApi } from './services/studentApi';

export default function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', course: '', marks: '' });
  const [errors, setErrors] = useState({});

  // Delete modal states
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await studentApi.getAll();
      setStudents(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Stats
  const stats = useMemo(() => {
    if (!students || students.length === 0) {
      return { total: 0, avg: 0, top: 0, courses: 0 };
    }
    const total = students.length;
    const totalMarks = students.reduce((sum, s) => sum + (Number(s.marks) || 0), 0);
    const avg = (totalMarks / total).toFixed(1);
    const top = Math.max(...students.map(s => Number(s.marks) || 0));
    const courses = new Set(students.map(s => s.course)).size;
    return { total, avg, top, courses };
  }, [students]);

  // Unique courses for filter
  const courseOptions = useMemo(() => {
    return [...new Set(students.map(s => s.course))].filter(Boolean).sort();
  }, [students]);

  // Filtered list
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.email && s.email.toLowerCase().includes(q));
      const matchCourse = !selectedCourse || s.course === selectedCourse;
      return matchSearch && matchCourse;
    });
  }, [students, searchQuery, selectedCourse]);

  // Open Add modal
  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormData({ name: '', email: '', course: '', marks: '' });
    setErrors({});
    setIsModalOpen(true);
  };

  // Open Edit modal
  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      course: student.course,
      marks: student.marks
    });
    setErrors({});
    setIsModalOpen(true);
  };

  // Close form modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
    setErrors({});
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      course: formData.course.trim(),
      marks: parseInt(formData.marks, 10)
    };

    try {
      if (editingStudent) {
        await studentApi.update(editingStudent.id, payload);
        showToast('Student updated successfully!', 'success');
      } else {
        await studentApi.create(payload);
        showToast('Student added successfully!', 'success');
      }
      handleCloseModal();
      fetchStudents();
    } catch (err) {
      if (err.validationErrors) {
        setErrors(err.validationErrors);
      } else {
        showToast(err.message, 'error');
      }
    }
  };

  // Delete student
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await studentApi.delete(deleteTarget.id);
      showToast('Student deleted successfully', 'success');
      setDeleteTarget(null);
      fetchStudents();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Seed sample data
  const handleSeedData = async () => {
    const sample = [
      { name: "Sophia Martinez", email: "sophia.m@example.com", course: "Computer Science", marks: 95 },
      { name: "Liam Chen", email: "liam.chen@example.com", course: "Data Science", marks: 88 },
      { name: "Emma Watson", email: "emma.w@example.com", course: "Mathematics", marks: 78 },
      { name: "Noah Patel", email: "noah.p@example.com", course: "Computer Science", marks: 91 },
      { name: "Olivia Davis", email: "olivia.d@example.com", course: "Artificial Intelligence", marks: 84 }
    ];

    for (const s of sample) {
      try {
        await studentApi.create(s);
      } catch (e) {
        // ignore duplicates if already seeded
      }
    }
    showToast('Sample students populated into MySQL!', 'success');
    fetchStudents();
  };

  return (
    <div>
      {/* Top Navigation */}
      <header className="app-header">
        <div className="header-container">
          <div className="brand-section">
            <div className="brand-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
              </svg>
            </div>
            <div>
              <div className="brand-title">Student Management System</div>
              <div className="brand-subtitle">React 18 Frontend • Spring Boot 4 REST API • MySQL 8.4</div>
            </div>
          </div>
          <div className="system-status">
            <div className="pulse"></div>
            <span>Backend Connected (:8080)</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="main-content">
        {/* Stats Row */}
        <div className="stats-row">
          <div className="stat-box">
            <div>
              <div className="stat-label">Total Enrolled</div>
              <div className="stat-value">{stats.total}</div>
            </div>
            <div className="stat-badge indigo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
          </div>

          <div className="stat-box">
            <div>
              <div className="stat-label">Average Marks</div>
              <div className="stat-value">{stats.avg}</div>
            </div>
            <div className="stat-badge emerald">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
          </div>

          <div className="stat-box">
            <div>
              <div className="stat-label">Highest Score</div>
              <div className="stat-value">{stats.top}</div>
            </div>
            <div className="stat-badge amber">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="7"></circle>
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
              </svg>
            </div>
          </div>

          <div className="stat-box">
            <div>
              <div className="stat-label">Active Courses</div>
              <div className="stat-value">{stats.courses}</div>
            </div>
            <div className="stat-badge cyan">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Content Table Card */}
        <div className="dashboard-card">
          <div className="card-toolbar">
            <div className="filters-group">
              <div className="search-field">
                <svg className="search-icon" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search by student name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                className="filter-select"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option value="">All Courses</option>
                {courseOptions.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="actions-group">
              <button className="btn btn-secondary btn-sm" onClick={handleSeedData}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
                Seed Sample Data
              </button>
              <button className="btn btn-primary" onClick={handleOpenAdd}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Student
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Marks</th>
                  <th>Grade</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => {
                  const initials = student.name ? student.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'S';
                  
                  let grade = 'A';
                  let gradeClass = 'grade-a';
                  let barColor = '#10b981';
                  if (student.marks < 60) {
                    grade = 'D'; gradeClass = 'grade-d'; barColor = '#ef4444';
                  } else if (student.marks < 75) {
                    grade = 'C'; gradeClass = 'grade-c'; barColor = '#f59e0b';
                  } else if (student.marks < 90) {
                    grade = 'B'; gradeClass = 'grade-b'; barColor = '#6366f1';
                  }

                  return (
                    <tr key={student.id}>
                      <td style={{ color: '#64748b', fontWeight: 600 }}>#{student.id}</td>
                      <td>
                        <div className="user-identity">
                          <div className="student-avatar">{initials}</div>
                          <span className="user-name">{student.name}</span>
                        </div>
                      </td>
                      <td><span style={{ color: '#475569' }}>{student.email}</span></td>
                      <td><span className="course-chip">{student.course}</span></td>
                      <td>
                        <div className="marks-container">
                          <span className="marks-val">{student.marks}</span>
                          <div className="progress-track">
                            <div className="progress-fill" style={{ width: `${student.marks}%`, background: barColor }} />
                          </div>
                        </div>
                      </td>
                      <td><span className={`grade-badge ${gradeClass}`}>{grade}</span></td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit(student)}>
                            Edit
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(student)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Empty state */}
            {!loading && filteredStudents.length === 0 && (
              <div className="empty-view">
                <div className="empty-graphic">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <h3>No Students Found</h3>
                <p>There are no students matching your filter criteria or the database is currently empty.</p>
                <button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>
                  Add First Student
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-window">
            <div className="modal-head">
              <h3>{editingStudent ? 'Edit Student Details' : 'Add New Student'}</h3>
              <button className="modal-close" onClick={handleCloseModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-content">
                <div className="input-block">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  {errors.name && <div className="field-error">{errors.name}</div>}
                </div>

                <div className="input-block">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. jane@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  {errors.email && <div className="field-error">{errors.email}</div>}
                </div>

                <div className="input-block">
                  <label>Course *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Computer Science, Mathematics"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  />
                  {errors.course && <div className="field-error">{errors.course}</div>}
                </div>

                <div className="input-block">
                  <label>Marks (0 to 100) *</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    placeholder="e.g. 85"
                    value={formData.marks}
                    onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                  />
                  {errors.marks && <div className="field-error">{errors.marks}</div>}
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingStudent ? 'Save Changes' : 'Create Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="modal-backdrop">
          <div className="modal-window" style={{ maxWidth: 420 }}>
            <div className="modal-head">
              <h3>Delete Student</h3>
              <button className="modal-close" onClick={() => setDeleteTarget(null)}>&times;</button>
            </div>
            <div className="modal-content">
              <p>Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This student will be permanently removed from MySQL.</p>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleConfirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="toast-shelf">
        {toasts.map(t => (
          <div key={t.id} className={`toast-item ${t.type}`}>
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}
