const API_URL = 'http://localhost:3001/students'

// These functions communicate with the JSON Server REST API.
export async function getStudents() {
  const response = await fetch(API_URL)
  if (!response.ok) throw new Error('Could not load student records.')
  return response.json()
}

export async function createStudent(student) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student)
  })
  if (!response.ok) throw new Error('Could not add the student.')
  return response.json()
}

export async function updateStudent(id, student) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student)
  })
  if (!response.ok) throw new Error('Could not update the student.')
  return response.json()
}

export async function deleteStudent(id) {
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
  if (!response.ok) throw new Error('Could not delete the student.')
}