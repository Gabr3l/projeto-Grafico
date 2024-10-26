// Função para calcular o lucro
function calculateProfit(revenue, expenses) {
    return revenue - expenses;
}

// Função para obter dados da tabela
function getTableData() {
    const rows = document.querySelectorAll('#profitTable tbody tr');
    const months = [];
    const revenue = [];
    const expenses = [];
    const profit = [];

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        months.push(cells[0].textContent);
        revenue.push(parseFloat(cells[1].textContent));
        expenses.push(parseFloat(cells[2].textContent));
        profit.push(parseFloat(cells[3].textContent));
    });

    return { months, revenue, expenses, profit };
}

// Função para atualizar os gráficos
function updateCharts() {
    const data = getTableData();

    // Atualizar gráfico de barras
    barChart.data.labels = data.months;
    barChart.data.datasets[0].data = data.revenue;
    barChart.data.datasets[1].data = data.expenses;
    barChart.update();

    // Atualizar gráfico de pizza
    pieChart.data.labels = data.months;
    pieChart.data.datasets[0].data = data.profit;
    pieChart.update();
}

// Inicializar os gráficos
const ctxBar = document.getElementById('barChart').getContext('2d');
const barChart = new Chart(ctxBar, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [
            {
                label: 'Receita (R$)',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'Despesas (R$)',
                data: [],
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,  // Garante que os gráficos sejam compactos e proporcionais
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

const ctxPie = document.getElementById('pieChart').getContext('2d');
const pieChart = new Chart(ctxPie, {
    type: 'pie',
    data: {
        labels: [],
        datasets: [{
            label: 'Lucro (R$)',
            data: [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false  // Mantém o gráfico de pizza proporcional e menor
    }
});

// Adicionar nova linha à tabela
document.getElementById('addRow').addEventListener('click', function() {
    const newMonth = document.getElementById('newMonth').value;
    const newRevenue = parseFloat(document.getElementById('newRevenue').value);
    const newExpenses = parseFloat(document.getElementById('newExpenses').value);
    const newProfit = calculateProfit(newRevenue, newExpenses);

    if (newMonth && !isNaN(newRevenue) && !isNaN(newExpenses)) {
        const table = document.getElementById('profitTable').getElementsByTagName('tbody')[0];
        const newRow = table.insertRow();
        
        newRow.innerHTML = `
            <td>${newMonth}</td>
            <td>${newRevenue}</td>
            <td>${newExpenses}</td>
            <td>${newProfit}</td>
            <td><button class="deleteRow">Excluir</button></td>
        `;

        // Limpar os campos de entrada
        document.getElementById('newMonth').value = '';
        document.getElementById('newRevenue').value = '';
        document.getElementById('newExpenses').value = '';

        // Atualizar os gráficos
        updateCharts();
    }
});

// Excluir uma linha da tabela
document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('deleteRow')) {
        e.target.parentElement.parentElement.remove();
        updateCharts();
    }
});

// Inicializar os gráficos com os dados atuais da tabela
updateCharts();

