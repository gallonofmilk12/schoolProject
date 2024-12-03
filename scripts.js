// Static graph data
const graphData = {
    payback: {
        labels: ["Project A", "Project B", "Project C", "Project D"],
        data: [5, 50, 200, 535],
        colors: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"]
    },
    forest: {
        labels: ["Forest Cover Lost (hectares)", "Remaining Forest Cover (hectares)"],
        data: [8194, 41806],
        colors: ["#8BC34A", "#CDDC39"]
    },
    emissions: {
        labels: ["Cars", "Planes", "Trains"],
        data: [171, 133, 41],
        colors: ["#FF6384", "#36A2EB", "#4CAF50"]
    },
    accessibility: {
        labels: ["Year 0", "Year 5", "Year 10", "Year 15", "Year 20", "Year 25"],
        data: [0, 10, 20, 30, 40, 48.6],
        color: "#FF9800"
    },
    mobility: {
        labels: ["Before HSR", "After HSR"],
        data: [50, 80],
        colors: ["#9C27B0", "#3F51B5"]
    },
    property: {
        labels: ["Before Rail Project", "After Rail Project"],
        data: [100000, 108700],
        colors: ["#FFC107", "#00BCD4"]
    },
    capacity: {
        labels: ["Before", "After"],
        data: [100, 125],
        colors: ["#E91E63", "#2196F3"]
    }
};

// Check if server is running
async function checkServer() {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'serverCheck';
    loadingDiv.innerHTML = 'Checking server status...';
    document.body.prepend(loadingDiv);

    try {
        const response = await fetch('http://localhost:5000/api/graphs/payback', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            mode: 'cors'
        });
        
        if (response.ok) {
            loadingDiv.innerHTML = 'Server is running';
            setTimeout(() => loadingDiv.remove(), 2000);
            return true;
        }
    } catch (error) {
        loadingDiv.innerHTML = 'Server is not running. Please start the Python server with: <br>' +
            '<code>pip install flask flask-cors</code><br>' +
            '<code>python graphs.py</code>';
        return false;
    }
    return false;
}

// Initialize application
async function initializeApplication() {
    const serverRunning = await checkServer();
    if (!serverRunning) {
        alert('Please start the Python server by running: python graphs.py');
        return;
    }
    await initializeCharts();
}

// Start the application when page loads
document.addEventListener('DOMContentLoaded', initializeApplication);

// Tab Functionality
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName('tab-content');
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none';
        tabcontent[i].classList.remove('active');
    }
    tablinks = document.getElementsByClassName('tablink');
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove('active');
    }
    document.getElementById(tabName).style.display = 'block';
    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
}

// Helper function to create charts
function createChart(ctx, endpoint, chartType, customOptions = {}) {
    const data = graphData[endpoint];
    if (!data) {
        console.error(`No data found for ${endpoint}`);
        return;
    }

    const chartConfig = {
        type: chartType,
        data: {
            labels: data.labels,
            datasets: [{
                data: data.data,
                backgroundColor: data.colors,
                borderColor: data.color,
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            ...customOptions
        }
    };
    
    return new Chart(ctx, chartConfig);
}

// Initialize all charts
async function initializeCharts() {
    const charts = [
        { id: 'paybackChart', type: 'bar', endpoint: 'payback', options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Emission Payback Periods for Various Rail Projects'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Years' }
                }
            }
        }},
        { id: 'forestChart', type: 'pie', endpoint: 'forest', options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Forest Cover Impact in Kodagu District (hectares)'
                }
            }
        }},
        { id: 'emissionsReductionChart', type: 'bar', endpoint: 'emissions' },
        { id: 'accessibilityChart', type: 'line', endpoint: 'accessibility' },
        { id: 'mobilityChart', type: 'bar', endpoint: 'mobility' },
        { id: 'propertyValueChart', type: 'bar', endpoint: 'property' },
        { id: 'capacityChart', type: 'bar', endpoint: 'capacity' }
    ];

    for (const chart of charts) {
        const canvas = document.getElementById(chart.id);
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                try {
                    createChart(ctx, chart.endpoint, chart.type, chart.options || {});
                } catch (error) {
                    console.error(`Failed to create chart ${chart.id}:`, error);
                }
            }
        }
    }
}

// Quiz Functionality with Explanations
function checkQuiz() {
    const quizForm = document.getElementById('quizForm');
    const quizResult = document.getElementById('quizResult');
    const explanationsDiv = document.getElementById('explanations');
    let score = 0;

    // Correct Answers and Explanations
    const answers = {
        q1: {
            answer: 'b',
            explanation: 'Olugbenga (2019) states that the payback periods to offset emissions can range from 5 to 535 years.'
        },
        q2: {
            answer: 'b',
            explanation: "Monzon (2019) reports that Spain's HSR system achieved an average accessibility improvement of 48.6% over 25 years."
        },
        q3: {
            answer: 'b',
            explanation: "Zhang and Shukla found that Melbourne's Mernda Rail Extension increased property values by 8.7% after project completion."
        }
    };

    // Check Answers
    const formData = new FormData(quizForm);
    explanationsDiv.innerHTML = '';
    for (let [question, userAnswer] of formData.entries()) {
        if (userAnswer === answers[question].answer) {
            score++;
        }
        // Display Explanation
        if (userAnswer) { // Only show explanation if an answer was selected
            const explanationDiv = document.createElement('div');
            explanationDiv.className = 'explanation';
            explanationDiv.innerHTML = `<strong>Question ${question.slice(1)} Explanation:</strong> ${answers[question].explanation}`;
            explanationsDiv.appendChild(explanationDiv);
        }
    }

    // Display Result
    quizResult.textContent = `You scored ${score} out of 3.`;
}
