// SELECT ELEMENTS
const balanceEl = document.querySelector(".balance .value");
const incomeTotalEl = document.querySelector(".income-total");
const outcomeTotalEl = document.querySelector(".expenses-total"); // Updated
const incomeEl = document.querySelector("#income");
const expenseEl = document.querySelector("#expense");
const allEl = document.querySelector("#all");
const incomeList = document.querySelector("#income .list");
const expenseList = document.querySelector("#expense .list");
const allList = document.querySelector("#all .list");

// SELECT BTNS
const expenseBtn = document.querySelector(".tab1");
const incomeBtn = document.querySelector(".tab2");
const allBtn = document.querySelector(".tab3");

// INPUT BTNS
const addExpense = document.querySelector(".add-expense");
const expenseTitle = document.getElementById("expense-title-input");
const expenseAmount = document.getElementById("expense-amount-input");

const addIncome = document.querySelector(".add-income");
const incomeTitle = document.getElementById("income-title-input");
const incomeAmount = document.getElementById("income-amount-input");

// VARIABLES
let ENTRY_LIST;
let balance = 0, income = 0, outcome = 0;
const DELETE = "delete", EDIT = "edit";

// LOOK IF THERE IS SAVED DATA IN LOCALSTORAGE
ENTRY_LIST = JSON.parse(localStorage.getItem("entry_list")) || [];
updateUI();

// EVENT LISTENERS
expenseBtn.addEventListener("click", function () {
    show(expenseEl);
    hide([incomeEl, allEl]);
    active(expenseBtn);
    inactive([incomeBtn, allBtn]);
});
incomeBtn.addEventListener("click", function () {
    show(incomeEl);
    hide([expenseEl, allEl]);
    active(incomeBtn);
    inactive([expenseBtn, allBtn]);
});
allBtn.addEventListener("click", function () {
    show(allEl);
    hide([incomeEl, expenseEl]);
    active(allBtn);
    inactive([incomeBtn, expenseBtn]);
});

addExpense.addEventListener("click", function () {
    let amount = parseFloat(expenseAmount.value.trim());

    // Ensure valid title and amount input (amount > 0)
    if (!expenseTitle.value.trim() || isNaN(amount) || amount <= 0) {
        alert("Please enter a valid title and a positive number for the amount.");
        return;
    }

    let expense = {
        type: "expense",
        title: expenseTitle.value.trim(),
        amount: parseFloat(amount.toFixed(2)), // Use parseFloat and ensure proper decimal handling
        date: new Date().toLocaleDateString()
    };

    ENTRY_LIST.push(expense);  // Add to the entry list

    updateUI();
    clearInput([expenseTitle, expenseAmount]);
});

addIncome.addEventListener("click", function () {
    let amount = parseFloat(incomeAmount.value.trim());

    // Ensure valid title and amount input (amount > 0)
    if (!incomeTitle.value.trim() || isNaN(amount) || amount <= 0) {
        alert("Please enter a valid title and a positive number for the amount.");
        return;
    }

    let income = {
        type: "income",
        title: incomeTitle.value.trim(),
        amount: parseFloat(amount.toFixed(2)), // Use parseFloat for proper decimal input
        date: new Date().toLocaleDateString()
    };

    ENTRY_LIST.push(income);
    updateUI();
    clearInput([incomeTitle, incomeAmount]);
});

incomeList.addEventListener("click", deleteOrEdit);
expenseList.addEventListener("click", deleteOrEdit);
allList.addEventListener("click", deleteOrEdit);

// HELPERS

function deleteOrEdit(event) {
    const targetBtn = event.target;
    const entry = targetBtn.parentNode;

    if (targetBtn.id == DELETE) {
        deleteEntry(entry);
    } else if (targetBtn.id == EDIT) {
        editEntry(entry);
    }
}

function deleteEntry(entry) {
    ENTRY_LIST.splice(entry.id, 1);
    updateUI();
}

function editEntry(entry) {
    let ENTRY = ENTRY_LIST[entry.id];

    if (ENTRY.type == "income") {
        incomeAmount.value = ENTRY.amount;
        incomeTitle.value = ENTRY.title;
    } else if (ENTRY.type == "expense") {
        expenseAmount.value = ENTRY.amount;
        expenseTitle.value = ENTRY.title;
    }

    deleteEntry(entry);
}

function updateUI() {
    income = calculateTotal("income", ENTRY_LIST);
    outcome = calculateTotal("expense", ENTRY_LIST);
    balance = calculateBalance(income, outcome);

    let sign = (income >= outcome) ? "$" : "-$";
    balanceEl.innerHTML = `<small>${sign}</small>${balance.toFixed(2)}`;  // Display with two decimal places
    outcomeTotalEl.innerHTML = `<small>$</small>${outcome.toFixed(2)}`;  // Display with two decimal places
    incomeTotalEl.innerHTML = `<small>$</small>${income.toFixed(2)}`;  // Display with two decimal places

    clearElement([expenseList, incomeList, allList]);

    ENTRY_LIST.forEach((entry, index) => {
        if (entry.type == "expense") {
            showEntry(expenseList, entry.type, entry.title, entry.amount, entry.date, index)
        } else if (entry.type == "income") {
            showEntry(incomeList, entry.type, entry.title, entry.amount, entry.date, index)
        }
        showEntry(allList, entry.type, entry.title, entry.amount, entry.date, index)
    });

    updateChart(income, outcome);
    localStorage.setItem("entry_list", JSON.stringify(ENTRY_LIST));
}

function showEntry(list, type, title, amount, date, id) {
    const entryTypeLabel = (type === "income") ? "Income" : "Expense";
    const entryColor = (type === "income") ? "green" : "red"; // Use colors for distinction

    const entry = `<li id="${id}" class="${type}">
                    <div class="entry" style="color: ${entryColor};">
                        <strong>${entryTypeLabel}</strong> - ${title}: $${amount} <small>(${date})</small>
                    </div>
                    <div id="edit"></div>
                    <div id="delete"></div>
                  </li>`;
    const position = "afterbegin";
    list.insertAdjacentHTML(position, entry);
}

function clearElement(elements) {
    elements.forEach(element => {
        element.innerHTML = "";
    });
}

function calculateTotal(type, list) {
    let sum = 0;
    list.forEach(entry => {
        if (entry.type == type) {
            sum += parseFloat(entry.amount);  // Ensure the amount is parsed as float
        }
    });
    return sum;
}

function calculateBalance(income, outcome) {
    return income - outcome;
}

function clearInput(inputs) {
    inputs.forEach(input => {
        input.value = "";
    });
}

function show(element) {
    element.classList.remove("hide");
}

function hide(elements) {
    elements.forEach(element => {
        element.classList.add("hide");
    });
}

function active(element) {
    element.classList.add("active");
}

function inactive(elements) {
    elements.forEach(element => {
        element.classList.remove("active");
    });
}
