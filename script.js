// To-Do list - tasks are saved in localStorage so they stay after refresh

var input = document.getElementById("taskInput");
var addBtn = document.getElementById("addBtn");
var list = document.getElementById("taskList");
var errorText = document.getElementById("error");
var countText = document.getElementById("count");
var clearBtn = document.getElementById("clearDone");
var filterButtons = document.querySelectorAll(".filter");

var tasks = [];
var currentFilter = "all";

// load old tasks
try {
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];
} catch (e) {
  tasks = [];
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  var text = input.value.trim();
  if (text === "") {
    errorText.textContent = "Please write a task first.";
    return;
  }
  errorText.textContent = "";
  tasks.push({ id: Date.now(), text: text, done: false });
  input.value = "";
  saveTasks();
  showTasks();
}

function toggleTask(id) {
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) tasks[i].done = !tasks[i].done;
  }
  saveTasks();
  showTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(function (t) { return t.id !== id; });
  saveTasks();
  showTasks();
}

function showTasks() {
  list.innerHTML = "";

  var visible = tasks.filter(function (t) {
    if (currentFilter === "active") return !t.done;
    if (currentFilter === "done") return t.done;
    return true;
  });

  if (visible.length === 0) {
    var empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = tasks.length === 0 ? "No tasks yet. Add your first one above." : "Nothing here in this filter.";
    list.appendChild(empty);
  }

  visible.forEach(function (t) {
    var li = document.createElement("li");
    if (t.done) li.className = "done";

    var check = document.createElement("input");
    check.type = "checkbox";
    check.checked = t.done;
    check.addEventListener("change", function () { toggleTask(t.id); });

    var span = document.createElement("span");
    span.className = "text";
    span.textContent = t.text;

    var del = document.createElement("button");
    del.className = "delete-btn";
    del.textContent = "Delete";
    del.addEventListener("click", function () { deleteTask(t.id); });

    li.appendChild(check);
    li.appendChild(span);
    li.appendChild(del);
    list.appendChild(li);
  });

  var pending = tasks.filter(function (t) { return !t.done; }).length;
  countText.textContent = pending + (pending === 1 ? " task left" : " tasks left");
}

addBtn.addEventListener("click", addTask);
input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") addTask();
});

clearBtn.addEventListener("click", function () {
  tasks = tasks.filter(function (t) { return !t.done; });
  saveTasks();
  showTasks();
});

filterButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    filterButtons.forEach(function (b) { b.classList.remove("active"); });
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    showTasks();
  });
});

showTasks();
