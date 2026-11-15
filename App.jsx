import { useEffect, useMemo, useState } from 'react'
import {
  GraduationCap, LayoutDashboard, Users, BookOpen, Settings, Search,
  Plus, Bell, ChevronDown, MoreHorizontal, Pencil, Trash2, X,
  Menu, ArrowUpRight, UserRound, CheckCircle2, Clock3, AlertCircle
} from 'lucide-react'
import { getStudents, createStudent, updateStudent, deleteStudent } from './api'

const emptyForm = { name: '', email: '', department: 'Computer Science', level: '100 Level', phone: '', status: 'Active' }

function initials(name = '') {
  return name.split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase()
}

export default function App() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  async function loadStudents() {
    try {
      setError('')
      const data = await getStudents()
      setStudents(data)
    } catch {
      setError('The API could not be reached. Start the JSON Server in a second terminal using: npm run server')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadStudents() }, [])

  const filteredStudents = useMemo(() => students.filter(student => {
    const term = query.toLowerCase()
    const matchesQuery = [student.name, student.email, student.id, student.department].some(value => (value || '').toLowerCase().includes(term))
    const matchesFilter = filter === 'All' || student.status === filter
    return matchesQuery && matchesFilter
  }), [students, query, filter])

  const activeCount = students.filter(s => s.status === 'Active').length
  const departments = new Set(students.map(s => s.department)).size

  function openAdd() {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEdit(student) {
    setEditingId(student.id)
    setForm({ ...student })
    setModalOpen(true)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    try {
      if (editingId) {
        await updateStudent(editingId, form)
        setNotice('Student record updated successfully.')
      } else {
        const id = `STU${String(Date.now()).slice(-5)}`
        await createStudent({ ...form, id })
        setNotice('New student added successfully.')
      }
      setModalOpen(false)
      await loadStudents()
    } catch {
      setNotice('Something went wrong. Please check that the API server is running.')
    } finally {
      setSaving(false)
      setTimeout(() => setNotice(''), 3500)
    }
  }

  async function handleDelete(student) {
    if (!window.confirm(`Delete ${student.name}'s record? This cannot be undone.`)) return
    try {
      await deleteStudent(student.id)
      setStudents(current => current.filter(item => item.id !== student.id))
      setNotice('Student record deleted.')
    } catch {
      setNotice('Could not delete this record. Check the API server.')
    }
    setTimeout(() => setNotice(''), 3500)
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="brand"><div className="brand-mark"><GraduationCap size={23} /></div><span>Campus<span className="brand-light">Hub</span></span></div>
        <div className="workspace-label">WORKSPACE</div>
        <nav>
          <a className="nav-link active" href="#dashboard"><LayoutDashboard size={18}/> Dashboard</a>
          <a className="nav-link" href="#students"><Users size={18}/> Students <span className="nav-count">{students.length}</span></a>
          <a className="nav-link" href="#departments"><BookOpen size={18}/> Departments</a>
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card"><div className="help-icon"><GraduationCap size={18}/></div><strong>CampusHub</strong><p>A simple space to manage student information.</p></div>
          <a className="nav-link" href="#settings"><Settings size={18}/> Settings</a>
          <div className="profile"><div className="profile-avatar">AD</div><div><strong>Admin User</strong><small>Administrator</small></div><MoreHorizontal size={18} className="profile-more"/></div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu"><Menu size={20}/></button>
          <div className="breadcrumb">Workspace <span>/</span> <strong>Dashboard</strong></div>
          <div className="top-actions"><button className="icon-button notification" aria-label="Notifications"><Bell size={19}/><i/></button><div className="top-user"><div className="profile-avatar">AD</div><ChevronDown size={15}/></div></div>
        </header>

        <div className="page-wrap">
          <section className="welcome-row">
            <div><div className="eyebrow">SUNDAY, NOVEMBER 15, 2026</div><h1>Good day, Admin <span>✦</span></h1><p>Here’s what’s happening with your student records today.</p></div>
            <button className="primary-button" onClick={openAdd}><Plus size={18}/> Add new student</button>
          </section>

          {error && <div className="error-banner"><AlertCircle size={18}/><span>{error}</span></div>}
          {notice && <div className="notice-banner"><CheckCircle2 size={17}/>{notice}</div>}

          <section className="stats-grid">
            <StatCard title="Total students" value={students.length} note="Registered records" icon={<Users size={19}/>} tone="purple"/>
            <StatCard title="Active students" value={activeCount} note={`${students.length ? Math.round(activeCount / students.length * 100) : 0}% of all students`} icon={<CheckCircle2 size={19}/>} tone="green"/>
            <StatCard title="Departments" value={departments} note="With student records" icon={<BookOpen size={19}/>} tone="orange"/>
            <StatCard title="Inactive students" value={students.length - activeCount} note="Require attention" icon={<Clock3 size={19}/>} tone="blue"/>
          </section>

          <section className="table-panel" id="students">
            <div className="panel-heading"><div><h2>Student directory</h2><p>View and manage all registered students.</p></div><button className="outline-button" onClick={loadStudents}>Refresh data <ArrowUpRight size={15}/></button></div>
            <div className="toolbar"><div className="search-box"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name, ID, email or department..."/></div><div className="filter-wrap"><span>Filter:</span><select value={filter} onChange={e => setFilter(e.target.value)}><option>All</option><option>Active</option><option>Inactive</option></select></div></div>
            <div className="table-scroll">
              <table><thead><tr><th>STUDENT</th><th>STUDENT ID</th><th>DEPARTMENT</th><th>LEVEL</th><th>STATUS</th><th className="actions-heading">ACTION</th></tr></thead>
                <tbody>
                  {loading ? <tr><td colSpan="6" className="empty-state">Loading student records...</td></tr> :
                  filteredStudents.length === 0 ? <tr><td colSpan="6" className="empty-state">No students found. Try another search or add a student.</td></tr> :
                  filteredStudents.map(student => <tr key={student.id}>
                    <td><div className="student-cell"><div className="student-avatar">{initials(student.name)}</div><div><strong>{student.name}</strong><small>{student.email}</small></div></div></td>
                    <td><span className="student-id">{student.id}</span></td><td>{student.department}</td><td>{student.level}</td>
                    <td><span className={`status ${student.status.toLowerCase()}`}><i/>{student.status}</span></td>
                    <td><div className="row-actions"><button title="Edit student" onClick={() => openEdit(student)}><Pencil size={16}/></button><button title="Delete student" onClick={() => handleDelete(student)}><Trash2 size={16}/></button></div></td>
                  </tr>)}
                </tbody>
              </table>
            </div>
            <div className="table-footer"><span>Showing <strong>{filteredStudents.length}</strong> of <strong>{students.length}</strong> students</span><span className="footer-note"><UserRound size={14}/> Student information is stored through the API</span></div>
          </section>
          <footer>© 2026 CampusHub Student Management System <span>Built with React · JavaScript · REST API</span></footer>
        </div>
      </main>

      {modalOpen && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setModalOpen(false) }}>
        <form className="student-modal" onSubmit={handleSubmit}>
          <div className="modal-head"><div><div className="modal-kicker">STUDENT RECORD</div><h2>{editingId ? 'Edit student' : 'Add a new student'}</h2><p>Enter the student’s details below.</p></div><button type="button" className="icon-button" onClick={() => setModalOpen(false)}><X size={20}/></button></div>
          <div className="form-grid">
            <label className="field full">Full name<input required value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="e.g. John Smith"/></label>
            <label className="field">Email address<input required type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} placeholder="student@example.com"/></label>
            <label className="field">Phone number<input value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} placeholder="08012345678"/></label>
            <label className="field">Department<select value={form.department} onChange={e => setForm({...form, department:e.target.value})}><option>Computer Science</option><option>Information Technology</option><option>Software Engineering</option><option>Cyber Security</option><option>Mass Communication</option><option>Business Administration</option></select></label>
            <label className="field">Academic level<select value={form.level} onChange={e => setForm({...form, level:e.target.value})}><option>100 Level</option><option>200 Level</option><option>300 Level</option><option>400 Level</option><option>500 Level</option></select></label>
            <label className="field full">Student status<select value={form.status} onChange={e => setForm({...form, status:e.target.value})}><option>Active</option><option>Inactive</option></select></label>
          </div>
          <div className="modal-actions"><button type="button" className="cancel-button" onClick={() => setModalOpen(false)}>Cancel</button><button className="primary-button" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Save changes' : 'Add student'}</button></div>
        </form>
      </div>}
    </div>
  )
}

function StatCard({ title, value, note, icon, tone }) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div className="stat-title">{title}</div><div className="stat-value">{value}</div><div className="stat-note">{note}</div></div>
}