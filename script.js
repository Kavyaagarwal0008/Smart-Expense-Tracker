let expenses = [];

// Inputs
const title = document.getElementById("title");
const amount = document.getElementById("amount");
const date = document.getElementById("date");
const category = document.getElementById("category");

const addBtn = document.getElementById("addBtn");

const expenseList = document.getElementById("expenseList");
const total = document.getElementById("total");

const search = document.getElementById("search");
const filter = document.getElementById("filter");

// Load Data
window.onload = () => {

    expenses =
        JSON.parse(
            localStorage.getItem("expenses")
        ) || [];

    renderExpenses(expenses);
};

// Add Expense
addBtn.addEventListener("click", addExpense);

function addExpense() {

    if (
        title.value.trim() === "" ||
        amount.value.trim() === "" ||
        date.value === ""
    ) {
        alert("Please fill all fields");
        return;
    }

    const expense = {
        id: Date.now(),
        title: title.value,
        amount: Number(amount.value),
        category: category.value,
        date: date.value
    };

    expenses.push(expense);

    saveToLocalStorage();

    renderExpenses(expenses);

    title.value = "";
    amount.value = "";
    date.value = "";
}

// Render Expenses
function renderExpenses(data) {

    expenseList.innerHTML = "";

    if (data.length === 0) {

        expenseList.innerHTML = `
            <div class="empty">
                No Expenses Found
            </div>
        `;

        updateDashboard(0);

        return;
    }

    let totalAmount = 0;

    data.forEach(expense => {

        totalAmount += expense.amount;

        const div = document.createElement("div");

        div.classList.add("expense-item");

        div.innerHTML = `
            <span>
                <strong>${expense.title}</strong>
                <br>
                ${expense.category}
                <br>
                ${expense.date}
            </span>

            <span>
                ₹${expense.amount.toLocaleString("en-IN")}

                <button
                    onclick="deleteExpense(${expense.id})">
                    Delete
                </button>
            </span>
        `;

        expenseList.appendChild(div);
    });

    updateDashboard(totalAmount);
}

// Delete Expense
function deleteExpense(id) {

    expenses = expenses.filter(
        expense => expense.id !== id
    );

    saveToLocalStorage();

    applyFilters();
}

// Save
function saveToLocalStorage() {

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );
}

// Search + Filter Together
search.addEventListener("input", applyFilters);
filter.addEventListener("change", applyFilters);

function applyFilters() {

    const keyword =
        search.value.toLowerCase();

    const selectedCategory =
        filter.value;

    let filtered = expenses;

    if (keyword) {

        filtered = filtered.filter(expense =>
            expense.title
            .toLowerCase()
            .includes(keyword)
        );
    }

    if (selectedCategory !== "All") {

        filtered = filtered.filter(expense =>
            expense.category === selectedCategory
        );
    }

    renderExpenses(filtered);
}

// Monthly Total
function getMonthlyTotal() {

    const currentMonth =
        new Date().getMonth();

    const currentYear =
        new Date().getFullYear();

    let total = 0;

    expenses.forEach(expense => {

        const expenseDate =
            new Date(expense.date);

        if (
            expenseDate.getMonth() === currentMonth &&
            expenseDate.getFullYear() === currentYear
        ) {
            total += expense.amount;
        }
    });

    return total;
}

// Dashboard
function updateDashboard(totalAmount) {

    total.textContent =
        totalAmount.toLocaleString("en-IN");

    document.getElementById(
            "expenseCount"
        ).textContent =
        expenses.length;

    document.getElementById(
            "categoryCount"
        ).textContent =
        new Set(
            expenses.map(
                expense => expense.category
            )
        ).size;

    document.getElementById(
            "monthlyTotal"
        ).textContent =
        getMonthlyTotal()
        .toLocaleString("en-IN");
}