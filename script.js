const examData = {
    'jee-main': {
        name: 'JEE Main',
        status: 'Results Live',
        resultDate: '2024-05-12'
    },
    'jee-advanced': {
        name: 'JEE Advanced',
        status: 'Results Awaited',
        resultDate: 'TBA'
    },
    'bitsat': {
        name: 'BITSAT',
        status: 'Results Live',
        resultDate: '2024-05-15'
    },
    'neet': {
        name: 'NEET',
        status: 'Results Live',
        resultDate: '2024-05-10'
    },
    'gate': {
        name: 'GATE',
        status: 'Results Declared',
        resultDate: '2024-03-16'
    },
    'cat': {
        name: 'CAT',
        status: 'Upcoming',
        resultDate: 'November 2024'
    },
    'mhtcet': {
        name: 'MHT CET',
        status: 'Results Live',
        resultDate: '2024-05-20'
    },
    'kcet': {
        name: 'KCET',
        status: 'Results Live',
        resultDate: '2024-05-18'
    },
    'manipal': {
        name: 'Manipal Entrance Test',
        status: 'Results Live',
        resultDate: '2024-05-22'
    },
    'vit': {
        name: 'VITEEE',
        status: 'Results Live',
        resultDate: '2024-05-25'
    },
    'vellore': {
        name: 'VIT Vellore',
        status: 'Results Live',
        resultDate: '2024-05-25'
    },
    'uget': {
        name: 'UGET',
        status: 'Results Live',
        resultDate: '2024-05-24'
    },
    'comedk': {
        name: 'COMEDK',
        status: 'Results Live',
        resultDate: '2024-05-16'
    },
    'wbjee': {
        name: 'WBJEE',
        status: 'Results Live',
        resultDate: '2024-05-14'
    },
    'ts-eamcet': {
        name: 'TS EAMCET',
        status: 'Results Live',
        resultDate: '2024-05-19'
    },
    'ap-eamcet': {
        name: 'AP EAMCET',
        status: 'Results Live',
        resultDate: '2024-05-17'
    },
    'keam': {
        name: 'KEAM',
        status: 'Results Live',
        resultDate: '2024-05-21'
    }
};

const sampleResults = {
    'jee-main': {
        'roll1234': {
            name: 'Rahul Sharma',
            score: 285,
            percentile: 99.2,
            rank: 1250,
            category: 'General',
            categoryRank: 1250,
            physics: 95,
            chemistry: 92,
            mathematics: 98
        }
    },
    'neet': {
        'roll5678': {
            name: 'Priya Patel',
            score: 680,
            percentile: 99.8,
            rank: 450,
            category: 'General',
            categoryRank: 450,
            physics: 178,
            chemistry: 175,
            biology: 327
        }
    },
    'mhtcet': {
        'mht2024001': {
            name: 'Amit Deshmukh',
            score: 165,
            percentile: 95.6,
            rank: 2890,
            category: 'OBC',
            categoryRank: 1120,
            physics: 55,
            chemistry: 52,
            mathematics: 58
        }
    },
    'kcet': {
        'kcet2024567': {
            name: 'Karthik Reddy',
            score: 148,
            percentile: 92.3,
            rank: 4560,
            category: 'General',
            categoryRank: 4560,
            physics: 51,
            chemistry: 49,
            mathematics: 48
        }
    },
    'manipal': {
        'man2024890': {
            name: 'Sneha Agarwal',
            score: 285,
            percentile: 96.8,
            rank: 1890,
            category: 'General',
            categoryRank: 1890,
            physics: 92,
            chemistry: 95,
            mathematics: 98
        }
    },
    'vit': {
        'vit2024123': {
            name: 'Arjun Kumar',
            score: 155,
            percentile: 94.2,
            rank: 3450,
            category: 'General',
            categoryRank: 3450,
            physics: 52,
            chemistry: 51,
            mathematics: 52
        }
    },
    'comedk': {
        'com2024345': {
            name: 'Divya Nair',
            score: 142,
            percentile: 91.5,
            rank: 5670,
            category: 'General',
            categoryRank: 5670,
            physics: 48,
            chemistry: 47,
            mathematics: 47
        }
    },
    'ts-eamcet': {
        'ts2024678': {
            name: 'Sai Krishna',
            score: 138,
            percentile: 89.7,
            rank: 6780,
            category: 'BC-B',
            categoryRank: 2340,
            physics: 46,
            chemistry: 45,
            mathematics: 47
        }
    }
};

function showExamDetails(examId) {
    const exam = examData[examId];
    if (exam) {
        document.getElementById('examSelect').value = examId;
        document.getElementById('rollNumber').focus();
    }
}

function searchResult() {
    const examId = document.getElementById('examSelect').value;
    const rollNumber = document.getElementById('rollNumber').value;
    const year = document.getElementById('year').value;

    if (!examId || !rollNumber || !year) {
        alert('Please fill all fields to search for results.');
        return;
    }

    const resultSection = document.getElementById('resultSection');
    const resultContent = document.getElementById('resultContent');

    if (sampleResults[examId] && sampleResults[examId][rollNumber]) {
        displayResult(sampleResults[examId][rollNumber], examId);
    } else {
        displayNoResult(examId, rollNumber);
    }

    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth' });
}

function displayResult(result, examId) {
    const examName = examData[examId].name;
    const resultContent = document.getElementById('resultContent');
    
    let subjectScores = '';
    
    if (examId === 'jee-main' || examId === 'mhtcet' || examId === 'kcet' || examId === 'manipal' || examId === 'vit' || examId === 'comedk' || examId === 'ts-eamcet') {
        subjectScores = `
            <div class="detail-item">
                <span class="detail-label">Physics:</span>
                <span class="detail-value">${result.physics}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Chemistry:</span>
                <span class="detail-value">${result.chemistry}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Mathematics:</span>
                <span class="detail-value">${result.mathematics}</span>
            </div>
        `;
    } else if (examId === 'neet') {
        subjectScores = `
            <div class="detail-item">
                <span class="detail-label">Physics:</span>
                <span class="detail-value">${result.physics}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Chemistry:</span>
                <span class="detail-value">${result.chemistry}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Biology:</span>
                <span class="detail-value">${result.biology}</span>
            </div>
        `;
    }
    
    resultContent.innerHTML = `
        <div class="result-card">
            <div class="result-title">${examName} Result - ${result.name}</div>
            <div class="result-details">
                <div class="detail-item">
                    <span class="detail-label">Overall Score:</span>
                    <span class="detail-value">${result.score}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Percentile:</span>
                    <span class="detail-value">${result.percentile}%</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">All India Rank:</span>
                    <span class="detail-value">${result.rank}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Category:</span>
                    <span class="detail-value">${result.category}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Category Rank:</span>
                    <span class="detail-value">${result.categoryRank}</span>
                </div>
                ${subjectScores}
            </div>
        </div>
    `;
}

function displayNoResult(examId, rollNumber) {
    const examName = examData[examId].name;
    const resultContent = document.getElementById('resultContent');
    
    const demoData = [
        'JEE Main: roll1234',
        'NEET: roll5678',
        'MHT CET: mht2024001',
        'KCET: kcet2024567',
        'Manipal: man2024890',
        'VIT: vit2024123',
        'COMEDK: com2024345',
        'TS EAMCET: ts2024678'
    ];
    
    resultContent.innerHTML = `
        <div class="no-results">
            <h3>No Result Found</h3>
            <p>We couldn't find results for Roll Number: <strong>${rollNumber}</strong> in ${examName}.</p>
            <p>Please verify your roll number and try again.</p>
            <p style="margin-top: 20px; font-size: 14px;">
                <strong>Demo Data Available:</strong><br>
                ${demoData.join('<br>')}
            </p>
        </div>
    `;
}

document.getElementById('searchForm').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        searchResult();
    }
});