// Data Persistence & Management
const INITIAL_DATA = {
  students: [
    { id: '101', name: 'John Doe', rollNo: 'CS001', dept: 'Computer Science', attendance: 85, attendanceData: [
      { subject: 'General', total: 60, attended: 52, percent: 87 },
      { subject: 'Mathematics', total: 20, attended: 18, percent: 90 },
      { subject: 'Physics', total: 15, attended: 12, percent: 80 },
      { subject: 'Data Structures', total: 25, attended: 22, percent: 88 }
    ]},
    { id: '102', name: 'Jane Smith', rollNo: 'CS002', dept: 'Computer Science', attendance: 70, attendanceData: [
      { subject: 'General', total: 60, attended: 41, percent: 68 },
      { subject: 'Mathematics', total: 20, attended: 12, percent: 60 },
      { subject: 'Physics', total: 15, attended: 11, percent: 73 },
      { subject: 'Data Structures', total: 25, attended: 18, percent: 72 }
    ]},
    { id: '103', name: 'Mike Ross', rollNo: 'CS003', dept: 'Computer Science', attendance: 92, attendanceData: [
      { subject: 'General', total: 60, attended: 56, percent: 93 },
      { subject: 'Mathematics', total: 20, attended: 19, percent: 95 },
      { subject: 'Physics', total: 15, attended: 14, percent: 93 },
      { subject: 'Data Structures', total: 25, attended: 23, percent: 92 }
    ]}
  ],
  teacher: {
    name: 'Dr. Sarah Wilson'
  }
};

// Load or Initialize Data
window.appState = JSON.parse(localStorage.getItem('attendly_state')) || INITIAL_DATA;

window.saveState = function() {
  localStorage.setItem('attendly_state', JSON.stringify(window.appState));
}

// Student Management Functions
window.addStudent = function(studentData) {
  let subjectList = studentData.subjects ? studentData.subjects.split(',').map(s => s.trim()).filter(s => s) : ['Mathematics', 'Physics', 'Data Structures'];
  
  // Ensure "General" is always a subject for all students for master list attendance
  if (!subjectList.includes('General')) {
    subjectList.unshift('General');
  }

  const newStudent = {
    id: Date.now().toString(),
    ...studentData,
    attendance: 0,
    attendanceData: subjectList.map(subject => ({
      subject: subject,
      total: 0,
      attended: 0,
      percent: 0
    }))
  };
  delete newStudent.subjects; // Remove temporary subjects string
  window.appState.students.push(newStudent);
  window.saveState();
  return newStudent;
}

window.updateStudent = function(id, updatedData) {
  const index = window.appState.students.findIndex(s => s.id === id);
  if (index !== -1) {
    const student = window.appState.students[index];
    // Preserve attendanceData if not explicitly provided in updatedData
    window.appState.students[index] = { ...student, ...updatedData };
    window.saveState();
    return true;
  }
  return false;
}

// Form Validation and Submission
window.handleLogin = function(event, role) {
  event.preventDefault();
  const form = event.target;
  const identity = form.querySelector('input[type="text"]')?.value;
  const email = form.querySelector('input[type="email"]')?.value;
  const password = form.querySelector('input[type="password"]')?.value;

  if (identity && email && password) {
    if (role === 'student') {
      // Check if student exists in appState by ID or Roll No
      const student = window.appState.students.find(s => s.rollNo === identity || s.id === identity);
      if (!student) {
          alert('Access Denied: Enrollment ID not found in system.');
          return;
      }
      localStorage.setItem('userName', student.name);
      localStorage.setItem('userRollNo', student.rollNo);
    } else {
      localStorage.setItem('userName', identity);
    }
    
    localStorage.setItem('userRole', role);

    if (role === 'teacher') {
      window.location.href = 'teacher_dashboard.html';
    } else {
      window.location.href = 'student_dashboard.html';
    }
  } else {
    alert('Please fill in all fields correctly.');
  }
}

window.toggleMobileMenu = function() {
  const menu = document.getElementById('mobile-menu');
  menu?.classList.toggle('hidden');
}

// Exposure to window for direct HTML calls
window.dummyData = window.appState; // Keep alias for backward compatibility

window.updateUserDisplay = function() {
  const storedName = localStorage.getItem('userName');
  const storedRoll = localStorage.getItem('userRollNo');
  const role = localStorage.getItem('userRole');

  if (storedName) {
    const displayElements = document.querySelectorAll('.user-display-name');
    displayElements.forEach(el => {
      let text = storedName;
      if (role === 'student' && storedRoll && el.classList.contains('sidebar-user')) {
        text = `${storedName} (${storedRoll})`;
      }

      if (el.dataset.prefix) {
        el.textContent = el.dataset.prefix + text + (el.dataset.suffix || '');
      } else {
        el.textContent = text;
      }
    });
  }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  window.updateUserDisplay();
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});
