class WealthCharts {
    constructor() {
        this.forecastChart = null;
        this.allocationChart = null;
    }

    initForecastChart(canvasId, labels, dataPoints) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        if (this.forecastChart) this.forecastChart.destroy();

        const goldGradient = ctx.createLinearGradient(0, 0, 0, 300);
        goldGradient.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
        goldGradient.addColorStop(1, 'rgba(255, 215, 0, 0.0)');

        this.forecastChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Compounding Net Value ($)',
                    data: dataPoints,
                    borderColor: '#ffd700',
                    borderWidth: 3,
                    backgroundColor: goldGradient,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#ffd700',
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255,255,255,0.03)' },
                        ticks: { color: '#71717a', font: { family: 'Outfit' } }
                    },
                    y: {
                        grid: { color: 'rgba(255,255,255,0.03)' },
                        ticks: { color: '#71717a', font: { family: 'Outfit' } }
                    }
                }
            }
        });
    }

    initAllocationChart(canvasId, labels, dataPoints) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        if (this.allocationChart) this.allocationChart.destroy();

        this.allocationChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: dataPoints,
                    backgroundColor: [
                        '#ffd700', // Business
                        '#10b981', // Emergencies
                        '#f59e0b', // Commodities
                        '#3b82f6', // Long term
                        '#8b5cf6'  // AI & Edu
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#a1a1aa',
                            font: { family: 'Outfit', size: 11 },
                            padding: 12
                        }
                    }
                },
                cutout: '75%'
            }
        });
    }
}
window.WealthCharts = new WealthCharts();
