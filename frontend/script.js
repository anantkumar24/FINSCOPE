// =============================================
// FinScopeAI - Extracted Client-Side Application Script
// =============================================

// Data Storage (LocalStorage)
const STORAGE_KEYS = {
    USER: 'finscope_user',
    PROFILE: 'finscope_profile',
    GOALS: 'finscope_goals',
    TRANSACTIONS: 'finscope_transactions'
};

// Demo Data
const DEMO_DATA = {
    profile: {
        monthlyIncome: 50000,
        fixedExpenses: 25000,
        variableExpenses: 10000,
        currentSavings: 525000,
        age: 28,
        familySize: 3,
        riskTolerance: 'medium'
    },
    goals: [
        {
            id: '1',
            title: 'Buy a Car',
            targetAmount: 500000,
            currentAmount: 150000,
            timeline: 24,
            category: 'car',
            priority: 'high',
            progress: 30
        },
        {
            id: '2',
            title: 'Emergency Fund',
            targetAmount: 200000,
            currentAmount: 75000,
            timeline: 36,
            category: 'emergency',
            priority: 'medium',
            progress: 38
        }
    ],
    transactions: [
        { id: '1', description: 'Salary Credit', amount: 50000, category: 'income', type: 'income' },
        { id: '2', description: 'Rent Payment', amount: 15000, category: 'housing', type: 'expense' },
        { id: '3', description: 'Groceries', amount: 8000, category: 'food', type: 'expense' },
        { id: '4', description: 'Mutual Fund SIP', amount: 10000, category: 'investment', type: 'expense' }
    ]
};

// Initialize Application
function initApp() {
    console.log('🚀 Initializing FinScopeAI...');
    
    // Initialize demo data if first time
    if (!localStorage.getItem(STORAGE_KEYS.PROFILE)) {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEMO_DATA.profile));
        localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(DEMO_DATA.goals));
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(DEMO_DATA.transactions));
    }
    
    // Check if user is logged in
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    if (user) {
        showApp();
        loadDashboardData();
    }
    
    // Initialize charts
    initCharts();
}

// Authentication Functions
function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const loginBtn = document.getElementById('loginBtn');

    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    // Simple validation
    if (email === 'demo@finscope.ai' && password === 'demo123') {
        const user = {
            email: email,
            firstName: 'Demo',
            lastName: 'User'
        };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        showNotification('Login successful!', 'success');
        showApp();
        loadDashboardData();
    } else {
        showNotification('Invalid credentials. Use demo@finscope.ai / demo123', 'error');
    }
}

function register() {
    const firstName = document.getElementById('registerFirstName').value;
    const lastName = document.getElementById('registerLastName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    if (!firstName || !lastName || !email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    const user = {
        email: email,
        firstName: firstName,
        lastName: lastName
    };
    
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    showNotification('Registration successful!', 'success');
    showApp();
    showAuthTab('login');
}

function logout() {
    localStorage.removeItem(STORAGE_KEYS.USER);
    document.getElementById('appSection').classList.add('hidden');
    document.getElementById('authSection').classList.remove('hidden');
    showNotification('Logged out successfully', 'success');
}

// UI Navigation
function showAuthTab(tab) {
    document.getElementById('loginForm').classList.toggle('hidden', tab !== 'login');
    document.getElementById('registerForm').classList.toggle('hidden', tab !== 'register');
    
    document.querySelectorAll('.auth-tab').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.toLowerCase().includes(tab));
    });
}

function showApp() {
    document.getElementById('authSection').classList.add('hidden');
    document.getElementById('appSection').classList.remove('hidden');
    
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');
    if (user) {
        document.getElementById('userName').textContent = user.firstName || user.email;
        document.getElementById('userAvatar').textContent = (user.firstName?.[0] || user.email[0]).toUpperCase();
        document.getElementById('profileEmail').value = user.email;
        document.getElementById('profileFirstName').value = user.firstName || '';
        document.getElementById('profileLastName').value = user.lastName || '';
    }
}

function showSection(sectionName) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.getElementById(sectionName).classList.add('active');
    event.target.classList.add('active');

    // Load section data
    if (sectionName === 'dashboard') {
        loadDashboardData();
    } else if (sectionName === 'profile') {
        loadProfileData();
    } else if (sectionName === 'goals') {
        loadGoalsData();
    }
}

// Data Management
function loadDashboardData() {
    const profile = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILE) || '{}');
    const transactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]');
    
    // Update metrics
    if (profile.monthlyIncome) {
        const savings = profile.monthlyIncome - (profile.fixedExpenses + profile.variableExpenses);
        const savingsRate = ((savings / profile.monthlyIncome) * 100).toFixed(1);
        
        document.getElementById('metricIncome').textContent = `₹${profile.monthlyIncome.toLocaleString()}`;
        document.getElementById('metricExpenses').textContent = `₹${(profile.fixedExpenses + profile.variableExpenses).toLocaleString()}`;
        document.getElementById('metricSavingsRate').textContent = `${savingsRate}%`;
        document.getElementById('metricNetWorth').textContent = `₹${profile.currentSavings.toLocaleString()}`;
    }
    
    updateCharts();
}

function loadProfileData() {
    const profile = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILE) || '{}');
    
    document.getElementById('profileIncome').value = profile.monthlyIncome || '';
    document.getElementById('profileFixedExpenses').value = profile.fixedExpenses || '';
    document.getElementById('profileVariableExpenses').value = profile.variableExpenses || '';
    document.getElementById('profileSavings').value = profile.currentSavings || '';
    document.getElementById('profileAge').value = profile.age || '';
    document.getElementById('profileFamilySize').value = profile.familySize || '';
    document.getElementById('profileRiskTolerance').value = profile.riskTolerance || 'medium';
}

function updateProfile() {
    const profile = {
        monthlyIncome: parseInt(document.getElementById('profileIncome').value) || 0,
        fixedExpenses: parseInt(document.getElementById('profileFixedExpenses').value) || 0,
        variableExpenses: parseInt(document.getElementById('profileVariableExpenses').value) || 0,
        currentSavings: parseInt(document.getElementById('profileSavings').value) || 0,
        age: parseInt(document.getElementById('profileAge').value) || 0,
        familySize: parseInt(document.getElementById('profileFamilySize').value) || 1,
        riskTolerance: document.getElementById('profileRiskTolerance').value
    };
    
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    showNotification('Profile updated successfully!', 'success');
    loadDashboardData();
}

function addGoal() {
    const title = document.getElementById('goalTitle').value;
    const targetAmount = parseInt(document.getElementById('goalTargetAmount').value);
    const timeline = parseInt(document.getElementById('goalTimeline').value);
    const category = document.getElementById('goalCategory').value;
    const priority = document.getElementById('goalPriority').value;

    if (!title || !targetAmount || !timeline) {
        showNotification('Please fill in all goal fields', 'error');
        return;
    }

    const goals = JSON.parse(localStorage.getItem(STORAGE_KEYS.GOALS) || '[]');
    const newGoal = {
        id: Date.now().toString(),
        title,
        targetAmount,
        currentAmount: 0,
        timeline,
        category,
        priority,
        progress: 0
    };
    
    goals.push(newGoal);
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    
    showNotification('Goal added successfully!', 'success');
    loadGoalsData();
    
    // Clear form
    document.getElementById('goalTitle').value = '';
    document.getElementById('goalTargetAmount').value = '';
    document.getElementById('goalTimeline').value = '';
}

function loadGoalsData() {
    const goals = JSON.parse(localStorage.getItem(STORAGE_KEYS.GOALS) || '[]');
    const goalsList = document.getElementById('goalsList');
    
    if (goals.length === 0) {
        goalsList.innerHTML = '<p>No goals set yet. Create your first financial goal!</p>';
        return;
    }
    
    const goalsHtml = goals.map(goal => `
        <div class="goal-card ${goal.priority}">
            <div class="goal-header">
                <div class="goal-title">${goal.title}</div>
                <div class="goal-priority priority-${goal.priority}">${goal.priority}</div>
            </div>
            <div class="goal-stats">
                <span>Target: ₹${goal.targetAmount.toLocaleString()}</span>
                <span>Saved: ₹${goal.currentAmount.toLocaleString()}</span>
            </div>
            <div class="progress-bar">
                <div class="progress" style="width: ${goal.progress}%"></div>
            </div>
            <div class="goal-stats">
                <span>${goal.timeline} months left</span>
                <span>${goal.progress}% Complete</span>
            </div>
        </div>
    `).join('');
    
    goalsList.innerHTML = goalsHtml;
}

function runForecast() {
    const investmentIncrease = parseInt(document.getElementById('investmentSlider').value);
    const extraSavings = parseInt(document.getElementById('extraSavings').value) || 0;
    document.getElementById('sliderValue').textContent = investmentIncrease + '%';
    
    showNotification('Forecast updated!', 'success');
    updateForecastChart();
}

// Chart Functions
function initCharts() {
    updateCharts();
    updateForecastChart();
    updateBudgetCharts();
}

function updateCharts() {
    const profile = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILE) || '{}');
    
    // Expense Chart
    const expenseCtx = document.getElementById('expenseChart').getContext('2d');
    new Chart(expenseCtx, {
        type: 'doughnut',
        data: {
            labels: ['Fixed Expenses', 'Variable Expenses', 'Savings'],
            datasets: [{
                data: [
                    profile.fixedExpenses || 0,
                    profile.variableExpenses || 0,
                    (profile.monthlyIncome || 0) - ((profile.fixedExpenses || 0) + (profile.variableExpenses || 0))
                ],
                backgroundColor: ['#FF6384', '#36A2EB', '#4CAF50']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Savings Chart
    const savingsCtx = document.getElementById('savingsChart').getContext('2d');
    new Chart(savingsCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Savings Growth',
                data: [450000, 465000, 480000, 495000, 510000, 525000],
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function updateForecastChart() {
    const ctx = document.getElementById('forecastChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 7', 'Year 8', 'Year 9', 'Year 10'],
            datasets: [{
                label: 'Projected Net Worth',
                data: [525000, 612000, 715000, 835000, 975000, 1138000, 1325000, 1542000, 1790000, 2072000],
                borderColor: '#2E86AB',
                backgroundColor: 'rgba(46, 134, 171, 0.1)',
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function updateBudgetCharts() {
    // Budget Chart
    const budgetCtx = document.getElementById('budgetChart').getContext('2d');
    new Chart(budgetCtx, {
        type: 'bar',
        data: {
            labels: ['Housing', 'Food', 'Transport', 'Entertainment', 'Savings'],
            datasets: [{
                label: 'Amount (₹)',
                data: [15000, 8000, 5000, 2000, 15000],
                backgroundColor: '#2E86AB'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Category Chart
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    new Chart(categoryCtx, {
        type: 'pie',
        data: {
            labels: ['Housing', 'Food', 'Transport', 'Entertainment', 'Investments'],
            datasets: [{
                data: [40, 25, 15, 10, 10],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Utility Functions
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
        ${message}
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 4000);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initApp);
