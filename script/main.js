let studentData = []
let isEditing = false
let editingStudent = null

let form = document.getElementById("student-form")
let formContainer = document.querySelector(".form-container")
let openBtn = document.getElementById("create-student")
let searchInput = document.getElementById("search-input")
let tbody = document.querySelector(".disple-user tbody")
let select = document.getElementById("sort")

select.addEventListener("change", (e) => {
  displayStudent(searchInput.value)
})
// Show form on "Create" button click
openBtn.addEventListener("click", () => {
  isEditing = false
  editingStudent = null
  form.reset()
  formContainer.classList.add("show")
})

// Hide form on overlay click
formContainer.addEventListener("click", (e) => {
  if (e.target === formContainer) {
    formContainer.classList.remove("show")
  }
})

// Handle create/edit form submission
form.addEventListener("submit", (e) => {
  e.preventDefault()

  const name = form.studentName.value.trim()
  const batch = form.batch.value.trim()
  const age = form.age.value.trim()
  const score = form.score.value.trim()

  if (score < 0 || score > 100) {
    alert("Score must be between 0 and 100")
    return
  }

  if (isEditing && editingStudent) {
    editingStudent.name = name
    editingStudent.batch = batch
    editingStudent.age = age
    editingStudent.score = score
  } else {
    const studentInfo = {
      id: Date.now(),
      name,
      batch,
      age,
      score
    }
    studentData.push(studentInfo)
  }

  isEditing = false
  editingStudent = null
  form.reset()
  formContainer.classList.remove("show")
  displayStudent(searchInput.value)
})

// Handle search input
searchInput.addEventListener("input", (e) => {
  displayStudent(e.target.value)
})

// Display student list (filtered by name if search is provided)
function displayStudent(filterText = "") {
  tbody.innerHTML = ""

  let filteredData = studentData.filter(student =>
    student.name.toLowerCase().includes(filterText.toLowerCase())
  )

  const sortValue = document.getElementById("sort").value
  if (sortValue === "age") {
    filteredData.sort((a, b) => +a.age - +b.age)
  } else if (sortValue === "score") {
    filteredData.sort((a, b) => +b.score - +a.score)
  }

  // Update stats
  document.getElementById("total-count").textContent = filteredData.length
  const avg = filteredData.reduce((acc, curr) => acc + +curr.score, 0) / (filteredData.length || 1)
  document.getElementById("avg-score").textContent = avg.toFixed(2)

  //  Create rows
  filteredData.forEach(student => {
    const tr = document.createElement("tr")

    tr.innerHTML = `
      <td>${student.name}</td>
      <td>${student.age}</td>
      <td>${student.batch}</td>
      <td>${student.score}</td>
      <td class="action-cell">
        <button class="action-btn edit-btn">Edit</button>
        <button class="action-btn delete-btn">Delete</button>
      </td>
    `

    // Highlight score > 80
    if (student.score > 80) {
      tr.style.backgroundColor = "#e6ffed"
    }

    tr.querySelector(".delete-btn").addEventListener("click", () => {
      studentData = studentData.filter(s => s.id !== student.id)
      displayStudent(searchInput.value)
    })

    tr.querySelector(".edit-btn").addEventListener("click", () => {
      form.studentName.value = student.name
      form.age.value = student.age
      form.batch.value = student.batch
      form.score.value = student.score

      isEditing = true
      editingStudent = student
      formContainer.classList.add("show")
    })

    tbody.appendChild(tr)
  })
}



// Initial display
displayStudent()
