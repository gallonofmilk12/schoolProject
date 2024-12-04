const graphData = {
    forest: {
        labels: ["Forest Cover Lost (hectares)", "Remaining Forest Cover (hectares)"],
        data: [8194, 41806],
        colors: ["#8BC34A", "#CDDC39"],
        title: "Forest Cover Impact in Kodagu District"
    },
    emissions: {
        labels: ["Cars", "Planes", "Trains"],
        data: [171, 133, 41],
        colors: ["#FF6384", "#36A2EB", "#4CAF50"],
        color: "#000000",
        title: "Reduction in Greenhouse Gas Emissions"
    }
}

function initializeApplication() {
    initializeCharts();
}

document.addEventListener('DOMContentLoaded', initializeApplication);

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

function createChart(ctx, endpoint, chartType, customOptions) {
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
                tension: 0.1,
                borderWidth: 2,
                hoverBorderWidth: 4,
                hoverBackgroundColor: '#FF6384',
                animation: {
                    duration: 1500,
                    easing: 'easeOutBounce'
                }
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                animateScale: true,
                animateRotate: true
            },
            plugins: {
                tooltip: {
                    enabled: true,
                    backgroundColor: '#2c3e50',
                    titleColor: '#ecf0f1',
                    bodyColor: '#ecf0f1',
                    borderColor: '#2980b9',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed !== null) {
                                label += context.parsed;
                            }
                            return label;
                        }
                    }
                },
                legend: {
                    display: true,
                    labels: {
                        color: '#2c3e50',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                title: {
                    display: true,
                    text: data.title || 'Chart Title',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    color: '#2c3e50'
                }
            },
            ...customOptions
        }
    };
    
    return new Chart(ctx, chartConfig);
}

function initializeCharts() {
    const charts = [
        { id: 'forestChart', type: 'pie', endpoint: 'forest', options: {
            plugins: {
                title: {
                    display: true,
                    text: graphData.forest.title
                }
            }
        }},
        { id: 'emissionsReductionChart', type: 'bar', endpoint: 'emissions', options: {
            plugins: {
                title: {
                    display: true,
                    text: graphData.emissions.title
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Transportation Modes"
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "CO₂ Emissions (grams per passenger-kilometer)"
                    },
                    beginAtZero: true
                }
            }
        }},
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

function checkQuiz() {
    const quizForm = document.getElementById('quizForm');
    const quizResult = document.getElementById('quizResult');
    const explanationsDiv = document.getElementById('explanations');
    let score = 0;

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

    const formData = new FormData(quizForm);
    explanationsDiv.innerHTML = '';
    for (let [question, userAnswer] of formData.entries()) {
        if (userAnswer === answers[question].answer) {
            score++;
        }
        if (userAnswer) {
            const explanationDiv = document.createElement('div');
            explanationDiv.className = 'explanation';
            explanationDiv.innerHTML = `<strong>Question ${question.slice(1)} Explanation:</strong> ${answers[question].explanation}`;
            explanationsDiv.appendChild(explanationDiv);
        }
    }

    quizResult.textContent = `You scored ${score} out of 3.`;
}
