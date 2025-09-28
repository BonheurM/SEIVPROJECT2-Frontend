// Mock data for testing when backend is not available
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' || false;

export const mockCourses = {
  CS: [
    {
      id: 1,
      department: "CS",
      number: "101",
      title: "Introduction to Computer Science",
      credits: 3,
      instructor: "Dr. Smith",
      instructorEmail: "smith@university.edu",
      description: "An introduction to computer science and programming fundamentals.",
      schedule: {
        days: "MWF",
        time: "10:00-11:00",
        location: "Room 101"
      },
      enrollment: {
        current: 25,
        capacity: 30
      },
      prerequisites: []
    },
    {
      id: 2,
      department: "CS",
      number: "201",
      title: "Data Structures",
      credits: 4,
      instructor: "Dr. Johnson",
      instructorEmail: "johnson@university.edu",
      description: "Study of fundamental data structures and algorithms.",
      schedule: {
        days: "TTH",
        time: "14:00-15:30",
        location: "Lab 203"
      },
      enrollment: {
        current: 28,
        capacity: 30
      },
      prerequisites: ["CS 101"]
    },
    {
      id: 3,
      department: "CS",
      number: "301",
      title: "Database Systems",
      credits: 3,
      instructor: "Dr. Chen",
      instructorEmail: "chen@university.edu",
      description: "Design and implementation of database systems.",
      schedule: {
        days: "MW",
        time: "16:00-17:30",
        location: "Room 305"
      },
      enrollment: {
        current: 20,
        capacity: 25
      },
      prerequisites: ["CS 201"]
    }
  ],
  MATH: [
    {
      id: 4,
      department: "MATH",
      number: "110",
      title: "Calculus I",
      credits: 4,
      instructor: "Dr. Williams",
      instructorEmail: "williams@university.edu",
      description: "Introduction to differential and integral calculus.",
      schedule: {
        days: "MTWTH",
        time: "09:00-10:00",
        location: "Math Building 101"
      },
      enrollment: {
        current: 45,
        capacity: 50
      },
      prerequisites: []
    },
    {
      id: 5,
      department: "MATH",
      number: "210",
      title: "Calculus II",
      credits: 4,
      instructor: "Dr. Brown",
      instructorEmail: "brown@university.edu",
      description: "Continuation of Calculus I, integration techniques and series.",
      schedule: {
        days: "MTWTH",
        time: "11:00-12:00",
        location: "Math Building 102"
      },
      enrollment: {
        current: 38,
        capacity: 40
      },
      prerequisites: ["MATH 110"]
    }
  ],
  ENG: [
    {
      id: 6,
      department: "ENG",
      number: "101",
      title: "English Composition I",
      credits: 3,
      instructor: "Prof. Davis",
      instructorEmail: "davis@university.edu",
      description: "Development of critical reading and writing skills.",
      schedule: {
        days: "TTH",
        time: "10:00-11:30",
        location: "Liberal Arts 201"
      },
      enrollment: {
        current: 22,
        capacity: 25
      },
      prerequisites: []
    }
  ]
};

// Helper to simulate API delay
export const simulateDelay = (ms = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));