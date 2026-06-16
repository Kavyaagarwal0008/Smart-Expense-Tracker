let editId = null;
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


    document.getElementById(
            "budgetAmount"
        ).textContent =
        budget.toLocaleString("en-IN");

    updateBudget();
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

    if (editId) {

        expenses = expenses.map(exp =>
            exp.id === editId ? expense : exp
        );

        editId = null;

        showToast("Expense Updated");
    } else {

        expenses.push(expense);

        showToast("Expense Added");
    }

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

        updateDashboard();

        return;
    }

    let totalAmount = 0;

    data.forEach(expense => {

        totalAmount += expense.amount;
        let color;

        switch (expense.category) {

            case "Food":
                color = "#22c55e";
                break;

            case "Travel":
                color = "#3b82f6";
                break;

            case "Shopping":
                color = "#a855f7";
                break;

            case "Medical":
                color = "#ef4444";
                break;

            default:
                color = "#64748b";
        }
        const div = document.createElement("div");

        div.classList.add("expense-item");

        //         div.innerHTML = `
        //             <span>
        //     <strong>${expense.title}</strong>
        //     <br>
        //     ${expense.category}
        //     <br>
        //     ${new Date(expense.date).toLocaleDateString("en-IN")}
        // </span>

        //             <span>
        //                 ₹${expense.amount.toLocaleString("en-IN")}

        //                 <button class="edit-btn" onclick="editExpense(${expense.id})">
        //                     Edit
        //                 </button>

        //                 <button onclick="deleteExpense(${expense.id})">
        //                     Delete
        //                 </button>
        //             </span>
        //         `;



        div.innerHTML = `
<div class="expense-info">

    <div class="expense-title">
        ${expense.title}
    </div>

    <div class="expense-category">
        ${expense.category}
    </div>

    <div class="expense-date">
        ${new Date(expense.date)
            .toLocaleDateString("en-IN")}
    </div>

</div>

<div class="expense-actions">

    <div class="expense-amount">
        ₹${expense.amount.toLocaleString("en-IN")}
    </div>

    <div class="expense-buttons">

        <button
            class="edit-btn"
            onclick="editExpense(${expense.id})">
            Edit
        </button>

        <button
            class="delete-btn"
            onclick="deleteExpense(${expense.id})">
            Delete
        </button>

    </div>

</div>
`;
        div.style.borderLeft =
            `6px solid ${color}`;

        expenseList.appendChild(div);
    });

    updateDashboard();
}



// Recent Transactions


function renderRecent() {

    const recent = [...expenses]
        .reverse()
        .slice(0, 5);

    const recentList =
        document.getElementById(
            "recentList"
        );

    recentList.innerHTML = "";

    recent.forEach(expense => {

        recentList.innerHTML += `
            <div class="recent-item">

                ${expense.title}
                -
                ₹${expense.amount}

            </div>
        `;
    });
}



function editExpense(id) {

    const expense =
        expenses.find(exp => exp.id === id);

    title.value = expense.title;
    amount.value = expense.amount;
    category.value = expense.category;
    date.value = expense.date;

    editId = id;
}


function showToast(message) {

    const toast =
        document.getElementById("toast");

    toast.textContent = message;

    toast.style.opacity = "1";

    setTimeout(() => {
        toast.style.opacity = "0";
    }, 2000);
}
// Delete Expense
function deleteExpense(id) {

    expenses =
        expenses.filter(exp =>
            exp.id !== id
        );

    saveToLocalStorage();

    applyFilters();

    showToast("Expense Deleted");
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

const themeBtn =
    document.getElementById("themeToggle");

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle(
        "light-mode"
    );

    localStorage.setItem(
        "theme",
        document.body.classList.contains(
            "light-mode"
        )
    );
});

const savedTheme =
    localStorage.getItem("theme");

if (savedTheme === "true") {
    document.body.classList.add(
        "light-mode"
    );
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
function updateDashboard() {

    const overallTotal =
        expenses.reduce(
            (sum, expense) =>
            sum + expense.amount,
            0
        );

    total.textContent =
        overallTotal.toLocaleString("en-IN");

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

    // NEW
    document.getElementById("incomeTotal")
        .textContent =
        income.toLocaleString("en-IN");

    document.getElementById("savings")
        .textContent =
        (income - overallTotal)
        .toLocaleString("en-IN");

    renderAnalytics();
    updateBudget();
    renderRecent();
}


function renderAnalytics() {

    const analytics =
        document.getElementById(
            "analytics"
        );

    analytics.innerHTML = "";

    const categoryTotals =
        expenses.reduce((acc, expense) => {

            acc[expense.category] =
                (acc[expense.category] || 0) +
                expense.amount;

            return acc;

        }, {});

    for (let category in categoryTotals) {

        analytics.innerHTML += `
        <div class="analytics-item">

            ${category}

            <span>
                ₹${categoryTotals[
                    category
                ]}
            </span>

        </div>
        `;
    }
}



document
    .getElementById("sortDate")
    .addEventListener("click", () => {

        expenses.sort((a, b) =>
            new Date(b.date) -
            new Date(a.date)
        );

        renderExpenses(expenses);
    });


document
    .getElementById("sortAmount")
    .addEventListener("click", () => {

        expenses.sort((a, b) =>
            b.amount - a.amount
        );

        renderExpenses(expenses);
    });

document
    .getElementById("sortCategory")
    .addEventListener("click", () => {

        expenses.sort((a, b) =>
            a.category
            .localeCompare(
                b.category
            )
        );

        renderExpenses(expenses);
    });


// Set income
let income = Number(
    localStorage.getItem(
        "income"
    )
) || 0;


document
    .getElementById(
        "addIncomeBtn"
    )
    .addEventListener(
        "click",
        () => {

            const value =
                Number(
                    document
                    .getElementById(
                        "incomeInput"
                    ).value
                );

            income += value;

            localStorage.setItem(
                "income",
                income
            );

            updateDashboard();
        }
    );

// Set Budget
let budget =
    Number(
        localStorage.getItem("budget")
    ) || 0;


const budgetInput =
    document.getElementById("budgetInput");

const setBudgetBtn =
    document.getElementById("setBudgetBtn");

setBudgetBtn.addEventListener(
    "click",
    () => {

        budget =
            Number(
                budgetInput.value
            );

        localStorage.setItem(
            "budget",
            budget
        );

        document.getElementById(
                "budgetAmount"
            ).textContent =
            budget.toLocaleString("en-IN");

        updateBudget();

        budgetInput.value = "";
    }
);


function updateBudget() {

    const totalExpense =
        expenses.reduce(
            (sum, expense) =>
            sum + expense.amount,
            0
        );

    const progress =
        budget > 0 ?
        (totalExpense / budget) * 100 :
        0;

    document.getElementById(
            "budgetProgress"
        ).style.width =
        Math.min(progress, 100) + "%";

    const status =
        document.getElementById(
            "budgetStatus"
        );

    if (totalExpense > budget &&
        budget > 0) {

        status.textContent =
            "⚠ Budget Exceeded";

        status.style.color =
            "#ef4444";

    } else {

        status.textContent =
            `${Math.round(progress)}% Used`;

        status.style.color =
            "#22c55e";
    }
}