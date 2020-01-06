class ToDoItem {
    constructor(content, status) {
        this.content = content;
        this.status = status;
    }

    render(showItems) {

        let newItemMarkup = document.createElement('div');
        newItemMarkup.setAttribute('id', this.content);
        let newItemMarkupCheckBox = document.createElement('input');
        newItemMarkupCheckBox.setAttribute('type', 'checkbox');
        newItemMarkupCheckBox.addEventListener('change', tickComleted)
        newItemMarkup.appendChild(newItemMarkupCheckBox);
        let newItemMarkupInput = document.createElement('input');
        newItemMarkupInput.addEventListener("change", changeItemContent)
        newItemMarkupInput.setAttribute('value', this.content);
        if (this.status === "COMPLETED") {
            newItemMarkupCheckBox.checked = true;
            newItemMarkupInput.setAttribute('class', "completed");
        }
        newItemMarkup.appendChild(newItemMarkupInput);
        let newItemMarkupXBtn = document.createElement('button');
        newItemMarkupXBtn.setAttribute('class', 'x-btn');
        newItemMarkupXBtn.innerHTML = 'X';
        newItemMarkupXBtn.addEventListener('click', removeItem)
        newItemMarkup.appendChild(newItemMarkupXBtn);
        if (showItems !== "ALL" && showItems !== this.status)
            newItemMarkup.setAttribute('hidden', true);
        return newItemMarkup;
    }
}
class ToDoList {
    constructor() {
        let todoListJson = localStorage.getItem('todosList') ? JSON.parse(localStorage.getItem('todosList')) : [];
        this.list = [];
        for (let i = 0; i < todoListJson.length; i++) {
            this.list.push(new ToDoItem(todoListJson[i].content, todoListJson[i].status));
        }

    }
    addNewItem(content, status) {
        let newItem = new ToDoItem(event.target.value, "ACTIVE")
        todoList.list.push(newItem);
        localStorage.setItem('todosList', JSON.stringify(this.list));
        return newItem.render(showItems);
    }
    tickComletedItem(itemID) {
        var itemToUpdate = todoList.list.find(i => i.content === itemID);
        itemToUpdate.status === "ACTIVE" ? itemToUpdate.status = "COMPLETED" : itemToUpdate.status = "ACTIVE";
        localStorage.setItem('todosList', JSON.stringify(this.list));      
    }
    removeItem(itemID) {
        todoList.list = todoList.list.filter(i => i.content !== itemID);
        localStorage.setItem('todosList', JSON.stringify(this.list));
    }
    removeCompletedItem() {
        this.list = this.list.filter(i => i.status !== "COMPLETED");
        localStorage.setItem('todosList', JSON.stringify(this.list));
    }
    checkedAllItemCompleted(newStatus) {
        for (let i = 0; i < todoList.list.length; i++) {
            newStatus ? todoList.list[i].status = "COMPLETED" : todoList.list[i].status = "ACTIVE";
            console.log(todoList.list[i]);
        }
        localStorage.setItem('todosList', JSON.stringify(this.list));
    }
}
let todoList = new ToDoList();
let completedAllItems;
let newItemInput;
let toDoListDiv;
let amountItemLbl;
let allBtn;
let activeBtn;
let completedBtn;
let clearCompletedBtn;
let showItems = localStorage.getItem('showItems') ? JSON.parse(localStorage.getItem('showItems')) : "ALL";


document.addEventListener("DOMContentLoaded", function () {
    completedAllItems = document.getElementById("completed-all-items");
    newItemInput = document.getElementById("new-todo-item");
    toDoListDiv = document.getElementById("todos-list");
    amountItemLbl = document.getElementById("amount-list-items");
    allBtn = document.getElementById("all");
    activeBtn = document.getElementById("active");
    completedBtn = document.getElementById("completed");
    clearCompletedBtn = document.getElementById("clear-completed");

    completedAllItems.addEventListener('change', checkedAllItemCompleted)
    newItemInput.addEventListener("keypress", addNewItem);
    allBtn.addEventListener("click", function () { setShowItems("ALL") });
    activeBtn.addEventListener("click", function () { setShowItems("ACTIVE") });
    completedBtn.addEventListener("click", function () { setShowItems("COMPLETED") });
    clearCompletedBtn.addEventListener('click', removeCompletedItem);
    renderTodoItems();
    render();
});

function render() {

    // if (showItems === "ALL" || showItems === item.status) {
    //     let newItemMarkup = document.createElement('div');
    //     newItemMarkup.setAttribute('id', item.content);
    //     let newItemMarkupCheckBox = document.createElement('input');
    //     newItemMarkupCheckBox.setAttribute('type', 'checkbox');
    //     newItemMarkupCheckBox.addEventListener('change', tickComleted)
    //     newItemMarkup.appendChild(newItemMarkupCheckBox);
    //     let newItemMarkupInput = document.createElement('input');
    //     newItemMarkupInput.addEventListener("change", changeItemContent)
    //     newItemMarkupInput.setAttribute('value', item.content);
    //     if (item.status === "COMPLETED") {
    //         newItemMarkupCheckBox.checked = true;
    //         newItemMarkupInput.setAttribute('class', "completed");
    //     }
    //     newItemMarkup.appendChild(newItemMarkupInput);
    //     let newItemMarkupXBtn = document.createElement('button');
    //     newItemMarkupXBtn.setAttribute('class', 'x-btn');
    //     newItemMarkupXBtn.innerHTML = 'X';
    //     newItemMarkupXBtn.addEventListener('click', removeItem)
    //     newItemMarkup.appendChild(newItemMarkupXBtn);
    //     toDoListDiv.appendChild(newItemMarkup);

    //}


    newItemInput.value = "";

    if (todoList.list.length > 0) {
        allBtn.removeAttribute('hidden');
        amountItemLbl.innerHTML = `${todoList.list.filter(i => i.status == "ACTIVE").length} items left`;
        activeBtn.removeAttribute('hidden');
        completedBtn.removeAttribute('hidden');
        amountItemLbl.removeAttribute('hidden');
    }
    else {
        allBtn.setAttribute('hidden', true);
        activeBtn.setAttribute('hidden', true);
        completedBtn.setAttribute('hidden', true);
        amountItemLbl.setAttribute('hidden', true);
    }
    if (todoList.list.find(i => i.status === "COMPLETED"))
        clearCompletedBtn.removeAttribute('hidden');
    else
        clearCompletedBtn.setAttribute('hidden', true);
    setActiveClass();

}
function renderTodoItems() {
    todoList.list.forEach(item => {
        toDoListDiv.appendChild(item.render(showItems));
    });
}

function addNewItem(event) {
    if (event.keyCode === 13 && event.target.value != "" && !todoList.list.find(i => i.content === event.target.value)) {
        toDoListDiv.appendChild(todoList.addNewItem(event.target.value, "ACTIVE"));
        render();
    }
}

function tickComleted(event) {
    todoList.tickComletedItem(event.target.parentElement.id);
    if(event.target.checked)
     document.getElementById(event.target.parentElement.id).children[1].setAttribute("class", "completed");
   else
   document.getElementById(event.target.parentElement.id).children[1].removeAttribute("class");
     render();
}

function setShowItems(newStatus) {
    toDoListDiv.innerHTML = "";
    showItems = newStatus;
    localStorage.setItem('showItems', JSON.stringify(newStatus));
    renderTodoItems();
    setActiveClass();
    render();
}

function setActiveClass() {
    allBtn.removeAttribute('class');
    activeBtn.removeAttribute('class');
    completedBtn.removeAttribute('class');
    switch (JSON.parse(localStorage.getItem('showItems'))) {
        case "ALL": allBtn.setAttribute("class", "active"); break;
        case "ACTIVE": activeBtn.setAttribute("class", "active"); break;
        case "COMPLETED": completedBtn.setAttribute("class", "active"); break;
    }
}
function removeItem(event) {
    todoList.removeItem(event.target.parentNode.id);
    document.getElementById(event.target.parentNode.id).remove();
    render();
}

function removeCompletedItem() {
    for (let i = 0; i < todoList.list.length; i++) {
        if (todoList.list[i].status === "COMPLETED") {
            document.getElementById(todoList.list[i].content).remove();
        }
    }
    todoList.removeCompletedItem();
    render();
}

function checkedAllItemCompleted(event) {
    toDoListDiv.innerHTML = "";
    todoList.checkedAllItemCompleted(event.target.checked);
    renderTodoItems();
    render();

}

function changeItemContent(event) {
    if (!todoList.list.find(i => i.content === event.target.value))
        todoList.list.find(i => i.content === event.target.value)
}
