const newTaskInput = document.querySelector("#task-input");
const categorySelect = document.querySelector("#category-select");
const categoryInput = document.querySelector("#category-input");
const tasksDiv = document.querySelector("#tasks");
const taskFilterSelect = document.querySelector("#task-filter");
let updateNote = "";

const createCategory = (categoryName) => {
  localStorage.setItem(`categories_${categoryName}`, JSON.stringify([]));
};

const getAllTasks = () => {
  const allTasks = [];
  for (let key in localStorage) {
    if (key.startsWith("categories_")) {
      const tasks = JSON.parse(localStorage.getItem(key));
      allTasks.push(...tasks);
    }
  }
  return allTasks;
};

const getTasksForCategory = (categoryName) => {
  if (categoryName === "All Categories") {
    return getAllTasks();
  } else {
    const tasksKey = `categories_${categoryName}`;
    return JSON.parse(localStorage.getItem(tasksKey)) || [];
  }
};

const updateTasksForCategory = (categoryName, tasks) => {
  const tasksKey = `categories_${categoryName}`;
  localStorage.setItem(tasksKey, JSON.stringify(tasks));
};

const updateCategorySelect = () => {
  categorySelect.innerHTML = "";
  categorySelect.innerHTML += `<option value="All Categories">All Categories</option>`;
  const categories = [];
  for (let key in localStorage) {
    if (key.startsWith("categories_")) {
      const categoryName = key.replace("categories_", "");
      categories.push(categoryName);
    }
  }
  categories.forEach((category) => {
    categorySelect.innerHTML += `<option value="${category}">${category}</option>`;
  });
};

const displayTasks = () => {
  tasksDiv.innerHTML = "";

  const selectedCategory = categorySelect.value;
  const tasks = getTasksForCategory(selectedCategory);

  const categoryHeading = document.createElement("h2");
  categoryHeading.textContent = `${selectedCategory}`;
  tasksDiv.appendChild(categoryHeading);

  for (let taskData of tasks) {
    const taskName = taskData.name;
    const isCompleted = taskData.completed;
    const category = taskData.category;

    if (
      (taskFilterSelect.value === "completed" && !isCompleted) ||
      (taskFilterSelect.value === "uncompleted" && isCompleted)
    ) {
      continue;
    }

    const taskInnerDiv = document.createElement("div");
    taskInnerDiv.classList.add("task");
    taskInnerDiv.innerHTML = `
      <div class="task-info">
        <button class="complete">
          ${
            isCompleted
              ? '<i class="fa-regular fa-square-check"></i>'
              : '<i class="fa-regular fa-square"></i>'
          }
        </button>
        <span id="taskname">${taskName}</span>
      </div>
      <span class="category">${category}</span>
    `;

    const editButton = document.createElement("button");
    editButton.classList.add("edit");
    editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
    if (!isCompleted) {
      editButton.style.visibility = "visible";
    } else {
      editButton.style.visibility = "hidden";
      taskInnerDiv.classList.add("completed");
    }

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete");
    deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;
    if (isCompleted) {
      deleteButton.style.marginLeft = "auto";
    }

    taskInnerDiv.appendChild(editButton);
    taskInnerDiv.appendChild(deleteButton);
    tasksDiv.appendChild(taskInnerDiv);

    const completeButton = taskInnerDiv.querySelector(".complete");
    completeButton.onclick = () => {
      const tasksForCategory = getTasksForCategory(category);
      const index = tasksForCategory.findIndex(
        (task) => task.name === taskName
      );
      tasksForCategory[index].completed = !isCompleted;
      updateTasksForCategory(category, tasksForCategory);
      displayTasks();
    };

    editButton.addEventListener("click", (e) => {
      e.stopPropagation();
      disableButtons(true);
      newTaskInput.value = taskName;
      categorySelect.value = category;
      updateNote = taskName;
      displayTasks();
    });

    deleteButton.addEventListener("click", (e) => {
      e.stopPropagation();
      const tasksForCategory = getTasksForCategory(category);
      const index = tasksForCategory.findIndex(
        (task) => task.name === taskName
      );
      tasksForCategory.splice(index, 1);
      updateTasksForCategory(category, tasksForCategory);
      displayTasks();
    });
  }
};

const disableButtons = (bool) => {
  const editButtons = document.getElementsByClassName("edit");
  Array.from(editButtons).forEach((element) => {
    element.disabled = bool;
  });
};

categorySelect.addEventListener("change", () => {
  displayTasks();
});

document.querySelector("#add-category").addEventListener("click", () => {
  const newCategoryName = categoryInput.value.trim();
  if (newCategoryName !== "") {
    createCategory(newCategoryName);
    categoryInput.value = "";
    updateCategorySelect();
    displayTasks();
  }
});

document.querySelector("#push").addEventListener("click", () => {
  disableButtons(false);
  if (newTaskInput.value.length == 0) {
    alert("Please Enter A Task");
  } else {
    const selectedCategory = categorySelect.value;
    const tasksForCategory = getTasksForCategory(selectedCategory);
    if (updateNote == "") {
      tasksForCategory.push({
        name: newTaskInput.value,
        completed: false,
        category: selectedCategory,
      });
    } else {
      const index = tasksForCategory.findIndex(
        (task) => task.name === updateNote
      );
      tasksForCategory[index].name = newTaskInput.value;
      updateNote = "";
    }
    updateTasksForCategory(selectedCategory, tasksForCategory);
    newTaskInput.value = "";
    displayTasks();
  }
});

taskFilterSelect.addEventListener("change", () => {
  displayTasks();
});

const clearLocalStorageButton = document.querySelector("#clear-local-storage");

clearLocalStorageButton.addEventListener("click", () => {
  localStorage.clear();
  updateCategorySelect();
  displayTasks();
});

window.onload = () => {
  updateCategorySelect();
  displayTasks();
};
