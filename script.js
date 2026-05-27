// ===== Global Variables =====
let userData = {};
let healthData = {};
let analysisResults = {};

// ===== Event Listeners =====
document.addEventListener('DOMContentLoaded', function() {
    // Generate Report Button
    document.getElementById('generateReport').addEventListener('click', generateReport);
    
    // Print Report Button
    document.getElementById('printReport').addEventListener('click', printReport);
    
    // New Assessment Button
    document.getElementById('newAssessment').addEventListener('click', newAssessment);
});

// ===== Main Functions =====

/**
 * Generate comprehensive health report
 */
function generateReport() {
    // Collect and validate data
    if (!collectUserData()) {
        return;
    }
    
    if (!collectHealthData()) {
        return;
    }
    
    // Calculate BMI
    healthData.bmi = calculateBMI(healthData.weight, healthData.height);
    
    // Analyze all parameters
    analyzeAllParameters();
    
    // Calculate overall health score
    const healthScore = calculateHealthScore();
    
    // Generate report sections
    displayHealthScore(healthScore);
    displayQuickStatus();
    displayParameterAnalysis();
    displayRiskWarnings();
    displayFitnessRecommendations();
    displayDietSuggestions();
    displayLifestyleTips();
    
    // Show report section and hide input section
    document.getElementById('inputSection').style.display = 'none';
    document.getElementById('reportSection').style.display = 'block';
    
    // Set report date
    document.getElementById('reportDate').textContent = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Collect user personal data
 */
function collectUserData() {
    const name = document.getElementById('name').value.trim();
    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    
    if (!name || !age || !gender) {
        alert('Please fill in all personal information fields.');
        return false;
    }
    
    if (age < 1 || age > 120) {
        alert('Please enter a valid age between 1 and 120.');
        return false;
    }
    
    userData = { name, age, gender };
    return true;
}

/**
 * Collect health parameters data
 */
function collectHealthData() {
    const bloodSugar = parseFloat(document.getElementById('bloodSugar').value);
    const heartRate = parseInt(document.getElementById('heartRate').value);
    const systolic = parseInt(document.getElementById('systolic').value);
    const diastolic = parseInt(document.getElementById('diastolic').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const sleep = parseFloat(document.getElementById('sleep').value);
    const water = parseFloat(document.getElementById('water').value);
    const exercise = parseInt(document.getElementById('exercise').value);
    
    // Validate all fields
    if (isNaN(bloodSugar) || isNaN(heartRate) || isNaN(systolic) || isNaN(diastolic) ||
        isNaN(weight) || isNaN(height) || isNaN(sleep) || isNaN(water) || isNaN(exercise)) {
        alert('Please fill in all health parameter fields with valid numbers.');
        return false;
    }
    
    // Validate ranges
    if (bloodSugar < 0 || bloodSugar > 500) {
        alert('Blood sugar must be between 0 and 500 mg/dL.');
        return false;
    }
    
    if (heartRate < 0 || heartRate > 300) {
        alert('Heart rate must be between 0 and 300 bpm.');
        return false;
    }
    
    if (systolic < 0 || systolic > 300 || diastolic < 0 || diastolic > 200) {
        alert('Blood pressure values are out of valid range.');
        return false;
    }
    
    if (weight <= 0 || height <= 0) {
        alert('Weight and height must be positive values.');
        return false;
    }
    
    if (sleep < 0 || sleep > 24) {
        alert('Sleep hours must be between 0 and 24.');
        return false;
    }
    
    if (water < 0 || water > 20) {
        alert('Water intake must be between 0 and 20 liters.');
        return false;
    }
    
    if (exercise < 0 || exercise > 1440) {
        alert('Exercise duration must be between 0 and 1440 minutes.');
        return false;
    }
    
    healthData = {
        bloodSugar,
        heartRate,
        systolic,
        diastolic,
        weight,
        height,
        sleep,
        water,
        exercise
    };
    
    return true;
}

/**
 * Calculate BMI
 */
function calculateBMI(weight, height) {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
}

/**
 * Analyze all health parameters
 */
function analyzeAllParameters() {
    analysisResults = {
        bloodSugar: analyzeBloodSugar(healthData.bloodSugar),
        heartRate: analyzeHeartRate(healthData.heartRate, userData.age, userData.gender),
        bloodPressure: analyzeBloodPressure(healthData.systolic, healthData.diastolic),
        bmi: analyzeBMI(healthData.bmi),
        sleep: analyzeSleep(healthData.sleep),
        hydration: analyzeHydration(healthData.water, healthData.weight),
        exercise: analyzeExercise(healthData.exercise, userData.age)
    };
}

/**
 * Analyze Blood Sugar
 */
function analyzeBloodSugar(value) {
    let status, statusClass, message, recommendation;
    
    if (value < 70) {
        status = 'Low';
        statusClass = 'warning';
        message = 'Your blood sugar is below normal range. This could indicate hypoglycemia.';
        recommendation = 'Consume quick-acting carbohydrates and consult your doctor if this persists.';
    } else if (value >= 70 && value <= 100) {
        status = 'Optimal';
        statusClass = 'optimal';
        message = 'Your fasting blood sugar is in the optimal range.';
        recommendation = 'Maintain your current diet and lifestyle to keep blood sugar stable.';
    } else if (value > 100 && value <= 125) {
        status = 'Pre-diabetic';
        statusClass = 'warning';
        message = 'Your blood sugar indicates pre-diabetes. This is a warning sign.';
        recommendation = 'Reduce sugar intake, increase physical activity, and consult a healthcare provider.';
    } else {
        status = 'High (Diabetic Range)';
        statusClass = 'critical';
        message = 'Your blood sugar is in the diabetic range. Immediate medical attention recommended.';
        recommendation = 'Consult an endocrinologist immediately for proper diabetes management.';
    }
    
    return { value, status, statusClass, message, recommendation, unit: 'mg/dL', icon: '💉' };
}

/**
 * Analyze Heart Rate
 */
function analyzeHeartRate(value, age, gender) {
    let status, statusClass, message, recommendation;
    
    if (value < 40) {
        status = 'Very Low';
        statusClass = 'critical';
        message = 'Your heart rate is dangerously low (bradycardia).';
        recommendation = 'Seek immediate medical attention if you experience dizziness or fatigue.';
    } else if (value >= 40 && value < 60) {
        status = 'Low (Athletic)';
        statusClass = 'optimal';
        message = 'Your heart rate is low, which is common in athletes and very fit individuals.';
        recommendation = 'This is generally healthy if you are physically active and feel well.';
    } else if (value >= 60 && value <= 100) {
        status = 'Normal';
        statusClass = 'optimal';
        message = 'Your resting heart rate is in the normal healthy range.';
        recommendation = 'Maintain regular cardiovascular exercise to keep your heart healthy.';
    } else if (value > 100 && value <= 120) {
        status = 'Elevated';
        statusClass = 'warning';
        message = 'Your heart rate is slightly elevated (tachycardia).';
        recommendation = 'Reduce stress, limit caffeine, and practice relaxation techniques.';
    } else {
        status = 'High';
        statusClass = 'critical';
        message = 'Your heart rate is significantly elevated. This requires medical evaluation.';
        recommendation = 'Consult a cardiologist to rule out underlying heart conditions.';
    }
    
    return { value, status, statusClass, message, recommendation, unit: 'bpm', icon: '❤️' };
}

/**
 * Analyze Blood Pressure
 */
function analyzeBloodPressure(systolic, diastolic) {
    let status, statusClass, message, recommendation;
    const value = `${systolic}/${diastolic}`;
    
    if (systolic < 90 || diastolic < 60) {
        status = 'Low';
        statusClass = 'warning';
        message = 'Your blood pressure is lower than normal (hypotension).';
        recommendation = 'Stay hydrated, avoid sudden position changes, and consult a doctor if symptomatic.';
    } else if (systolic < 120 && diastolic < 80) {
        status = 'Optimal';
        statusClass = 'optimal';
        message = 'Your blood pressure is in the optimal healthy range.';
        recommendation = 'Maintain a healthy diet low in sodium and continue regular exercise.';
    } else if (systolic >= 120 && systolic < 130 && diastolic < 80) {
        status = 'Elevated';
        statusClass = 'normal';
        message = 'Your blood pressure is slightly elevated.';
        recommendation = 'Adopt heart-healthy lifestyle changes to prevent progression to hypertension.';
    } else if ((systolic >= 130 && systolic < 140) || (diastolic >= 80 && diastolic < 90)) {
        status = 'High (Stage 1)';
        statusClass = 'warning';
        message = 'You have Stage 1 hypertension.';
        recommendation = 'Reduce sodium intake, exercise regularly, and consult your doctor about treatment.';
    } else if (systolic >= 140 || diastolic >= 90) {
        status = 'High (Stage 2)';
        statusClass = 'critical';
        message = 'You have Stage 2 hypertension. Medical intervention is necessary.';
        recommendation = 'Consult a doctor immediately for blood pressure medication and lifestyle modifications.';
    }
    
    if (systolic >= 180 || diastolic >= 120) {
        status = 'Hypertensive Crisis';
        statusClass = 'critical';
        message = 'EMERGENCY: You are experiencing a hypertensive crisis!';
        recommendation = 'Seek emergency medical care immediately. Call emergency services.';
    }
    
    return { value, status, statusClass, message, recommendation, unit: 'mmHg', icon: '🩺' };
}

/**
 * Analyze BMI
 */
function analyzeBMI(bmi) {
    let status, statusClass, message, recommendation;
    const value = bmi.toFixed(1);
    
    if (bmi < 16) {
        status = 'Severely Underweight';
        statusClass = 'critical';
        message = 'Your BMI indicates severe underweight. This poses serious health risks.';
        recommendation = 'Consult a nutritionist and doctor immediately for a weight gain plan.';
    } else if (bmi >= 16 && bmi < 18.5) {
        status = 'Underweight';
        statusClass = 'warning';
        message = 'Your BMI indicates you are underweight.';
        recommendation = 'Increase caloric intake with nutrient-dense foods and consult a nutritionist.';
    } else if (bmi >= 18.5 && bmi < 25) {
        status = 'Normal';
        statusClass = 'optimal';
        message = 'Your BMI is in the healthy normal range.';
        recommendation = 'Maintain your current weight through balanced diet and regular exercise.';
    } else if (bmi >= 25 && bmi < 30) {
        status = 'Overweight';
        statusClass = 'warning';
        message = 'Your BMI indicates you are overweight.';
        recommendation = 'Adopt a calorie-controlled diet and increase physical activity to reach healthy weight.';
    } else if (bmi >= 30 && bmi < 35) {
        status = 'Obese (Class I)';
        statusClass = 'critical';
        message = 'Your BMI indicates Class I obesity.';
        recommendation = 'Consult a doctor and nutritionist for a comprehensive weight loss program.';
    } else if (bmi >= 35 && bmi < 40) {
        status = 'Obese (Class II)';
        statusClass = 'critical';
        message = 'Your BMI indicates Class II obesity with significant health risks.';
        recommendation = 'Seek medical supervision for weight loss. Consider medical interventions.';
    } else {
        status = 'Obese (Class III)';
        statusClass = 'critical';
        message = 'Your BMI indicates Class III (severe) obesity.';
        recommendation = 'Immediate medical intervention required. Discuss surgical options with your doctor.';
    }
    
    return { value, status, statusClass, message, recommendation, unit: 'kg/m²', icon: '⚖️' };
}

/**
 * Analyze Sleep
 */
function analyzeSleep(hours) {
    let status, statusClass, message, recommendation;
    const value = hours.toFixed(1);
    
    if (hours < 4) {
        status = 'Severely Insufficient';
        statusClass = 'critical';
        message = 'You are getting dangerously little sleep.';
        recommendation = 'Prioritize sleep immediately. Chronic sleep deprivation has serious health consequences.';
    } else if (hours >= 4 && hours < 6) {
        status = 'Insufficient';
        statusClass = 'warning';
        message = 'You are not getting enough sleep for optimal health.';
        recommendation = 'Aim for 7-9 hours. Establish a consistent bedtime routine.';
    } else if (hours >= 6 && hours < 7) {
        status = 'Below Optimal';
        statusClass = 'normal';
        message = 'Your sleep duration is slightly below the recommended range.';
        recommendation = 'Try to add 1-2 more hours of sleep for better health and energy.';
    } else if (hours >= 7 && hours <= 9) {
        status = 'Optimal';
        statusClass = 'optimal';
        message = 'You are getting the recommended amount of sleep.';
        recommendation = 'Maintain your sleep schedule and ensure good sleep quality.';
    } else if (hours > 9 && hours <= 10) {
        status = 'Above Optimal';
        statusClass = 'normal';
        message = 'You are sleeping more than the typical recommendation.';
        recommendation = 'This may be fine if you feel rested. Consult a doctor if you feel excessively tired.';
    } else {
        status = 'Excessive';
        statusClass = 'warning';
        message = 'You are sleeping excessively, which may indicate underlying health issues.';
        recommendation = 'Consult a doctor to rule out conditions like depression or sleep disorders.';
    }
    
    return { value, status, statusClass, message, recommendation, unit: 'hours', icon: '😴' };
}

/**
 * Analyze Hydration
 */
function analyzeHydration(liters, weight) {
    let status, statusClass, message, recommendation;
    const value = liters.toFixed(1);
    
    // Recommended: 30-35 ml per kg of body weight
    const recommendedMin = (weight * 30) / 1000;
    const recommendedMax = (weight * 35) / 1000;
    
    if (liters < recommendedMin * 0.5) {
        status = 'Severely Dehydrated';
        statusClass = 'critical';
        message = 'You are drinking far too little water. This is dangerous.';
        recommendation = `Increase water intake immediately. Aim for at least ${recommendedMin.toFixed(1)} liters daily.`;
    } else if (liters < recommendedMin) {
        status = 'Insufficient';
        statusClass = 'warning';
        message = 'You are not drinking enough water for your body weight.';
        recommendation = `Increase water intake to ${recommendedMin.toFixed(1)}-${recommendedMax.toFixed(1)} liters per day.`;
    } else if (liters >= recommendedMin && liters <= recommendedMax) {
        status = 'Optimal';
        statusClass = 'optimal';
        message = 'Your water intake is appropriate for your body weight.';
        recommendation = 'Maintain your hydration level. Drink more during exercise or hot weather.';
    } else if (liters > recommendedMax && liters <= recommendedMax * 1.5) {
        status = 'Above Optimal';
        statusClass = 'normal';
        message = 'You are drinking more water than typically recommended.';
        recommendation = 'This is generally fine if you are very active. Listen to your body.';
    } else {
        status = 'Excessive';
        statusClass = 'warning';
        message = 'You are drinking excessive amounts of water.';
        recommendation = 'Very high water intake can be harmful. Consult a doctor if this is habitual.';
    }
    
    return { value, status, statusClass, message, recommendation, unit: 'liters', icon: '💧' };
}

/**
 * Analyze Exercise
 */
function analyzeExercise(minutes, age) {
    let status, statusClass, message, recommendation;
    const value = minutes;
    
    if (minutes === 0) {
        status = 'Sedentary';
        statusClass = 'critical';
        message = 'You are not getting any physical activity.';
        recommendation = 'Start with 10-15 minutes of light activity daily and gradually increase.';
    } else if (minutes > 0 && minutes < 30) {
        status = 'Insufficient';
        statusClass = 'warning';
        message = 'You are getting some activity but below the recommended minimum.';
        recommendation = 'Aim for at least 30 minutes of moderate activity daily.';
    } else if (minutes >= 30 && minutes < 60) {
        status = 'Good';
        statusClass = 'normal';
        message = 'You are meeting the minimum recommended physical activity.';
        recommendation = 'Great start! Consider increasing to 45-60 minutes for optimal health benefits.';
    } else if (minutes >= 60 && minutes <= 90) {
        status = 'Excellent';
        statusClass = 'optimal';
        message = 'You are getting excellent physical activity levels.';
        recommendation = 'Maintain this level. Ensure proper rest and recovery between workouts.';
    } else if (minutes > 90 && minutes <= 120) {
        status = 'Very Active';
        statusClass = 'optimal';
        message = 'You are very physically active.';
        recommendation = 'Excellent! Ensure adequate nutrition and rest to support your activity level.';
    } else {
        status = 'Extremely Active';
        statusClass = 'normal';
        message = 'You are exercising at very high levels.';
        recommendation = 'Ensure proper recovery, nutrition, and watch for signs of overtraining.';
    }
    
    return { value, status, statusClass, message, recommendation, unit: 'min/day', icon: '🏃' };
}

/**
 * Calculate overall health score (0-100)
 */
function calculateHealthScore() {
    let totalScore = 0;
    let weights = {
        bloodSugar: 15,
        heartRate: 15,
        bloodPressure: 15,
        bmi: 15,
        sleep: 10,
        hydration: 10,
        exercise: 20
    };
    
    // Score each parameter
    const scores = {
        bloodSugar: scoreParameter(analysisResults.bloodSugar.statusClass),
        heartRate: scoreParameter(analysisResults.heartRate.statusClass),
        bloodPressure: scoreParameter(analysisResults.bloodPressure.statusClass),
        bmi: scoreParameter(analysisResults.bmi.statusClass),
        sleep: scoreParameter(analysisResults.sleep.statusClass),
        hydration: scoreParameter(analysisResults.hydration.statusClass),
        exercise: scoreParameter(analysisResults.exercise.statusClass)
    };
    
    // Calculate weighted score
    for (let param in scores) {
        totalScore += scores[param] * weights[param];
    }
    
    return Math.round(totalScore);
}

/**
 * Score individual parameter based on status
 */
function scoreParameter(statusClass) {
    switch(statusClass) {
        case 'optimal': return 1.0;
        case 'normal': return 0.8;
        case 'warning': return 0.5;
        case 'critical': return 0.2;
        default: return 0.5;
    }
}

/**
 * Display overall health score
 */
function displayHealthScore(score) {
    const scoreCircle = document.getElementById('scoreCircle');
    const scoreValue = document.getElementById('scoreValue');
    const scoreStatus = document.getElementById('scoreStatus');
    const scoreDescription = document.getElementById('scoreDescription');
    
    scoreValue.textContent = score;
    
    let statusText, statusClass, description, color;
    
    if (score >= 85) {
        statusText = 'Excellent Health';
        statusClass = 'score-excellent';
        description = 'Your health parameters are in excellent condition. Keep up the great work!';
        color = 'linear-gradient(135deg, #7ED321 0%, #5FB810 100%)';
    } else if (score >= 70) {
        statusText = 'Good Health';
        statusClass = 'score-good';
        description = 'Your health is generally good, but there\'s room for improvement in some areas.';
        color = 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)';
    } else if (score >= 50) {
        statusText = 'Fair Health';
        statusClass = 'score-fair';
        description = 'Several health parameters need attention. Follow the recommendations below.';
        color = 'linear-gradient(135deg, #F5A623 0%, #E89B1A 100%)';
    } else {
        statusText = 'Poor Health';
        statusClass = 'score-poor';
        description = 'Multiple health concerns detected. Please consult healthcare professionals.';
        color = 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)';
    }
    
    scoreCircle.style.background = color;
    scoreCircle.className = 'score-circle ' + statusClass;
    scoreStatus.textContent = statusText;
    scoreStatus.className = 'score-status ' + statusClass;
    scoreDescription.textContent = description;
}

/**
 * Display quick status overview
 */
function displayQuickStatus() {
    const statusGrid = document.getElementById('statusGrid');
    statusGrid.innerHTML = '';
    
    const parameters = [
        { name: 'Blood Sugar', result: analysisResults.bloodSugar },
        { name: 'Heart Rate', result: analysisResults.heartRate },
        { name: 'Blood Pressure', result: analysisResults.bloodPressure },
        { name: 'BMI', result: analysisResults.bmi },
        { name: 'Sleep', result: analysisResults.sleep },
        { name: 'Hydration', result: analysisResults.hydration },
        { name: 'Exercise', result: analysisResults.exercise }
    ];
    
    parameters.forEach(param => {
        const statusItem = document.createElement('div');
        statusItem.className = `status-item status-${param.result.statusClass}`;
        statusItem.innerHTML = `
            <div class="status-item-icon">${param.result.icon}</div>
            <div class="status-item-label">${param.name}</div>
            <div class="status-item-value">${param.result.status}</div>
        `;
        statusGrid.appendChild(statusItem);
    });
}

/**
 * Display detailed parameter analysis
 */
function displayParameterAnalysis() {
    const container = document.getElementById('parameterAnalysis');
    container.innerHTML = '';
    
    const parameters = [
        { name: 'Blood Sugar', result: analysisResults.bloodSugar },
        { name: 'Heart Rate', result: analysisResults.heartRate },
        { name: 'Blood Pressure', result: analysisResults.bloodPressure },
        { name: 'BMI (Body Mass Index)', result: analysisResults.bmi },
        { name: 'Sleep Quality', result: analysisResults.sleep },
        { name: 'Hydration Level', result: analysisResults.hydration },
        { name: 'Physical Activity', result: analysisResults.exercise }
    ];
    
    parameters.forEach(param => {
        const paramDiv = document.createElement('div');
        paramDiv.className = 'parameter-item';
        
        paramDiv.innerHTML = `
            <div class="parameter-header">
                <div class="parameter-title">
                    <span>${param.result.icon}</span>
                    <span>${param.name}</span>
                </div>
                <span class="parameter-badge status-${param.result.statusClass}">${param.result.status}</span>
            </div>
            <div class="parameter-value">
                ${param.result.value} ${param.result.unit}
            </div>
            <div class="parameter-chart">
                <canvas id="chart-${param.name.replace(/\s+/g, '-').toLowerCase()}" width="400" height="100"></canvas>
            </div>
            <p>${param.result.message}</p>
            <div class="parameter-recommendation">
                <h4>💡 Recommendation</h4>
                <p>${param.result.recommendation}</p>
            </div>
        `;
        
        container.appendChild(paramDiv);
        
        // Draw chart for this parameter
        setTimeout(() => {
            drawParameterChart(`chart-${param.name.replace(/\s+/g, '-').toLowerCase()}`, param.result);
        }, 100);
    });
}

/**
 * Draw parameter chart (simple bar visualization)
 */
function drawParameterChart(canvasId, result) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Determine percentage based on status
    let percentage;
    switch(result.statusClass) {
        case 'optimal': percentage = 0.9; break;
        case 'normal': percentage = 0.75; break;
        case 'warning': percentage = 0.5; break;
        case 'critical': percentage = 0.3; break;
        default: percentage = 0.5;
    }
    
    // Draw background bar
    ctx.fillStyle = '#E0E0E0';
    ctx.fillRect(0, height/2 - 15, width, 30);
    
    // Draw status bar
    let gradient;
    switch(result.statusClass) {
        case 'optimal':
            gradient = ctx.createLinearGradient(0, 0, width * percentage, 0);
            gradient.addColorStop(0, '#7ED321');
            gradient.addColorStop(1, '#5FB810');
            break;
        case 'normal':
            gradient = ctx.createLinearGradient(0, 0, width * percentage, 0);
            gradient.addColorStop(0, '#4A90E2');
            gradient.addColorStop(1, '#357ABD');
            break;
        case 'warning':
            gradient = ctx.createLinearGradient(0, 0, width * percentage, 0);
            gradient.addColorStop(0, '#F5A623');
            gradient.addColorStop(1, '#E89B1A');
            break;
        case 'critical':
            gradient = ctx.createLinearGradient(0, 0, width * percentage, 0);
            gradient.addColorStop(0, '#E74C3C');
            gradient.addColorStop(1, '#C0392B');
            break;
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, height/2 - 15, width * percentage, 30);
    
    // Draw border
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, height/2 - 15, width, 30);
}

/**
 * Display risk warnings
 */
function displayRiskWarnings() {
    const warningsCard = document.getElementById('riskWarnings');
    const warningsList = document.getElementById('warningsList');
    warningsList.innerHTML = '';
    
    const warnings = [];
    
    // Check each parameter for critical status
    if (analysisResults.bloodSugar.statusClass === 'critical') {
        warnings.push({
            title: 'Critical Blood Sugar Level',
            message: analysisResults.bloodSugar.message,
            action: 'Consult an endocrinologist immediately.'
        });
    }
    
    if (analysisResults.heartRate.statusClass === 'critical') {
        warnings.push({
            title: 'Critical Heart Rate',
            message: analysisResults.heartRate.message,
            action: 'Seek immediate medical attention.'
        });
    }
    
    if (analysisResults.bloodPressure.statusClass === 'critical') {
        warnings.push({
            title: 'Critical Blood Pressure',
            message: analysisResults.bloodPressure.message,
            action: 'Emergency medical care may be required.'
        });
    }
    
    if (analysisResults.bmi.statusClass === 'critical') {
        warnings.push({
            title: 'Critical BMI Level',
            message: analysisResults.bmi.message,
            action: 'Consult healthcare professionals for weight management.'
        });
    }
    
    if (analysisResults.sleep.statusClass === 'critical') {
        warnings.push({
            title: 'Severe Sleep Deprivation',
            message: analysisResults.sleep.message,
            action: 'Prioritize sleep immediately for your health.'
        });
    }
    
    if (analysisResults.hydration.statusClass === 'critical') {
        warnings.push({
            title: 'Severe Dehydration',
            message: analysisResults.hydration.message,
            action: 'Increase water intake immediately.'
        });
    }
    
    if (analysisResults.exercise.statusClass === 'critical') {
        warnings.push({
            title: 'Sedentary Lifestyle',
            message: analysisResults.exercise.message,
            action: 'Start incorporating physical activity into your daily routine.'
        });
    }
    
    if (warnings.length > 0) {
        warningsCard.style.display = 'block';
        warnings.forEach(warning => {
            const warningDiv = document.createElement('div');
            warningDiv.className = 'warning-item';
            warningDiv.innerHTML = `
                <h4><strong>${warning.title}</strong></h4>
                <p>${warning.message}</p>
                <p><strong>Action Required:</strong> ${warning.action}</p>
            `;
            warningsList.appendChild(warningDiv);
        });
    } else {
        warningsCard.style.display = 'none';
    }
}

// Continue in next part...

// Made with Bob

/**
 * Display fitness recommendations
 */
function displayFitnessRecommendations() {
    const container = document.getElementById('fitnessRecommendations');
    const recommendations = generateFitnessRecommendations();
    
    let html = '';
    for (let category in recommendations) {
        html += `
            <div class="recommendation-category">
                <h4>${category}</h4>
                <ul class="recommendation-list">
                    ${recommendations[category].map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

/**
 * Generate fitness recommendations based on health data
 */
function generateFitnessRecommendations() {
    const recommendations = {
        'Cardiovascular Exercise': [],
        'Strength Training': [],
        'Flexibility & Balance': [],
        'Activity Guidelines': []
    };
    
    // Cardio recommendations based on heart rate and BP
    if (analysisResults.heartRate.statusClass === 'optimal' || analysisResults.heartRate.statusClass === 'normal') {
        recommendations['Cardiovascular Exercise'].push('Continue moderate-intensity cardio 5 days a week (brisk walking, cycling, swimming)');
        recommendations['Cardiovascular Exercise'].push('Include 2-3 days of vigorous activity (running, HIIT, sports)');
    } else if (analysisResults.heartRate.statusClass === 'warning') {
        recommendations['Cardiovascular Exercise'].push('Start with low-intensity cardio (walking, gentle cycling) for 20-30 minutes');
        recommendations['Cardiovascular Exercise'].push('Gradually increase intensity as your fitness improves');
    } else {
        recommendations['Cardiovascular Exercise'].push('Consult a doctor before starting any exercise program');
        recommendations['Cardiovascular Exercise'].push('Begin with very light activities like slow walking');
    }
    
    // BP-specific recommendations
    if (analysisResults.bloodPressure.statusClass === 'warning' || analysisResults.bloodPressure.statusClass === 'critical') {
        recommendations['Cardiovascular Exercise'].push('Avoid heavy weightlifting and high-intensity exercises initially');
        recommendations['Cardiovascular Exercise'].push('Focus on moderate aerobic activities to help lower blood pressure');
    }
    
    // Strength training based on BMI and age
    if (analysisResults.bmi.statusClass === 'optimal' || analysisResults.bmi.statusClass === 'normal') {
        recommendations['Strength Training'].push('Perform resistance training 2-3 times per week');
        recommendations['Strength Training'].push('Include exercises for all major muscle groups');
        recommendations['Strength Training'].push('Use progressive overload to build strength and muscle');
    } else if (parseFloat(analysisResults.bmi.value) > 25) {
        recommendations['Strength Training'].push('Start with bodyweight exercises (squats, push-ups, planks)');
        recommendations['Strength Training'].push('Add light resistance training to preserve muscle while losing weight');
        recommendations['Strength Training'].push('Focus on compound movements for maximum calorie burn');
    } else {
        recommendations['Strength Training'].push('Prioritize strength training to build muscle mass');
        recommendations['Strength Training'].push('Consume adequate protein to support muscle growth');
        recommendations['Strength Training'].push('Consider working with a trainer for proper form');
    }
    
    // Flexibility recommendations
    if (userData.age > 50) {
        recommendations['Flexibility & Balance'].push('Practice balance exercises daily to prevent falls');
        recommendations['Flexibility & Balance'].push('Include yoga or tai chi 2-3 times per week');
    } else {
        recommendations['Flexibility & Balance'].push('Stretch major muscle groups after each workout');
        recommendations['Flexibility & Balance'].push('Consider yoga or Pilates once a week for flexibility');
    }
    
    recommendations['Flexibility & Balance'].push('Perform dynamic stretches before exercise');
    recommendations['Flexibility & Balance'].push('Hold static stretches for 30 seconds after workouts');
    
    // Activity guidelines based on current exercise level
    if (analysisResults.exercise.value < 30) {
        recommendations['Activity Guidelines'].push('Set a goal to reach 30 minutes of daily activity within 4 weeks');
        recommendations['Activity Guidelines'].push('Break activity into 10-minute sessions if needed');
        recommendations['Activity Guidelines'].push('Take the stairs, park farther away, walk during breaks');
    } else if (analysisResults.exercise.value >= 30 && analysisResults.exercise.value < 60) {
        recommendations['Activity Guidelines'].push('Aim to increase to 45-60 minutes of daily activity');
        recommendations['Activity Guidelines'].push('Add variety to prevent boredom (sports, dancing, hiking)');
        recommendations['Activity Guidelines'].push('Include both moderate and vigorous intensity activities');
    } else {
        recommendations['Activity Guidelines'].push('Maintain your excellent activity level');
        recommendations['Activity Guidelines'].push('Ensure adequate rest days for recovery');
        recommendations['Activity Guidelines'].push('Cross-train to prevent overuse injuries');
    }
    
    return recommendations;
}

/**
 * Display diet suggestions
 */
function displayDietSuggestions() {
    const container = document.getElementById('dietSuggestions');
    const suggestions = generateDietSuggestions();
    
    let html = '';
    for (let category in suggestions) {
        html += `
            <div class="recommendation-category">
                <h4>${category}</h4>
                <ul class="recommendation-list">
                    ${suggestions[category].map(sug => `<li>${sug}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

/**
 * Generate diet suggestions based on health data
 */
function generateDietSuggestions() {
    const suggestions = {
        'Blood Sugar Management': [],
        'Weight Management': [],
        'Heart Health': [],
        'Hydration & Nutrition': []
    };
    
    // Blood sugar recommendations
    if (analysisResults.bloodSugar.statusClass === 'warning' || analysisResults.bloodSugar.statusClass === 'critical') {
        suggestions['Blood Sugar Management'].push('Limit refined carbohydrates and sugary foods');
        suggestions['Blood Sugar Management'].push('Choose complex carbs: whole grains, legumes, vegetables');
        suggestions['Blood Sugar Management'].push('Eat smaller, more frequent meals to stabilize blood sugar');
        suggestions['Blood Sugar Management'].push('Include protein and healthy fats with each meal');
        suggestions['Blood Sugar Management'].push('Monitor portion sizes and avoid overeating');
    } else {
        suggestions['Blood Sugar Management'].push('Maintain balanced meals with complex carbohydrates');
        suggestions['Blood Sugar Management'].push('Continue limiting added sugars and processed foods');
        suggestions['Blood Sugar Management'].push('Include fiber-rich foods to maintain stable blood sugar');
    }
    
    // Weight management based on BMI
    if (parseFloat(analysisResults.bmi.value) < 18.5) {
        suggestions['Weight Management'].push('Increase caloric intake with nutrient-dense foods');
        suggestions['Weight Management'].push('Eat more frequently (5-6 small meals per day)');
        suggestions['Weight Management'].push('Include healthy fats: nuts, avocados, olive oil');
        suggestions['Weight Management'].push('Add protein shakes or smoothies between meals');
        suggestions['Weight Management'].push('Focus on strength training to build muscle mass');
    } else if (parseFloat(analysisResults.bmi.value) >= 25) {
        suggestions['Weight Management'].push('Create a moderate calorie deficit (500 calories/day for 1 lb/week loss)');
        suggestions['Weight Management'].push('Fill half your plate with vegetables at each meal');
        suggestions['Weight Management'].push('Choose lean proteins: chicken, fish, legumes, tofu');
        suggestions['Weight Management'].push('Limit high-calorie beverages and alcohol');
        suggestions['Weight Management'].push('Practice mindful eating and portion control');
        suggestions['Weight Management'].push('Avoid late-night snacking');
    } else {
        suggestions['Weight Management'].push('Maintain your healthy weight with balanced nutrition');
        suggestions['Weight Management'].push('Continue eating a variety of whole foods');
        suggestions['Weight Management'].push('Monitor portions to prevent gradual weight gain');
    }
    
    // Heart health recommendations
    if (analysisResults.bloodPressure.statusClass === 'warning' || analysisResults.bloodPressure.statusClass === 'critical') {
        suggestions['Heart Health'].push('Reduce sodium intake to less than 2,300 mg per day');
        suggestions['Heart Health'].push('Increase potassium-rich foods: bananas, sweet potatoes, spinach');
        suggestions['Heart Health'].push('Follow the DASH diet principles');
        suggestions['Heart Health'].push('Limit saturated and trans fats');
        suggestions['Heart Health'].push('Avoid processed and packaged foods high in sodium');
    } else {
        suggestions['Heart Health'].push('Continue heart-healthy eating patterns');
        suggestions['Heart Health'].push('Include omega-3 fatty acids: fatty fish, walnuts, flaxseeds');
        suggestions['Heart Health'].push('Eat a variety of colorful fruits and vegetables');
    }
    
    suggestions['Heart Health'].push('Choose whole grains over refined grains');
    suggestions['Heart Health'].push('Limit red meat consumption');
    
    // Hydration recommendations
    if (analysisResults.hydration.statusClass === 'warning' || analysisResults.hydration.statusClass === 'critical') {
        suggestions['Hydration & Nutrition'].push('Set reminders to drink water throughout the day');
        suggestions['Hydration & Nutrition'].push('Carry a water bottle with you at all times');
        suggestions['Hydration & Nutrition'].push('Drink a glass of water before each meal');
        suggestions['Hydration & Nutrition'].push('Include water-rich foods: cucumbers, watermelon, oranges');
    } else {
        suggestions['Hydration & Nutrition'].push('Maintain your good hydration habits');
        suggestions['Hydration & Nutrition'].push('Increase water intake during exercise and hot weather');
    }
    
    suggestions['Hydration & Nutrition'].push('Take a multivitamin if diet is not varied');
    suggestions['Hydration & Nutrition'].push('Ensure adequate vitamin D (sunlight or supplements)');
    suggestions['Hydration & Nutrition'].push('Include probiotic foods for gut health: yogurt, kefir, sauerkraut');
    suggestions['Hydration & Nutrition'].push('Limit caffeine and alcohol consumption');
    
    return suggestions;
}

/**
 * Display lifestyle tips
 */
function displayLifestyleTips() {
    const container = document.getElementById('lifestyleTips');
    const tips = generateLifestyleTips();
    
    let html = '';
    for (let category in tips) {
        html += `
            <div class="recommendation-category">
                <h4>${category}</h4>
                <ul class="recommendation-list">
                    ${tips[category].map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

/**
 * Generate lifestyle tips
 */
function generateLifestyleTips() {
    const tips = {
        'Sleep Hygiene': [],
        'Stress Management': [],
        'Daily Habits': [],
        'Preventive Care': []
    };
    
    // Sleep recommendations
    if (analysisResults.sleep.statusClass === 'warning' || analysisResults.sleep.statusClass === 'critical') {
        tips['Sleep Hygiene'].push('Establish a consistent sleep schedule (same bedtime and wake time daily)');
        tips['Sleep Hygiene'].push('Create a relaxing bedtime routine (reading, warm bath, meditation)');
        tips['Sleep Hygiene'].push('Keep your bedroom cool, dark, and quiet');
        tips['Sleep Hygiene'].push('Avoid screens (phone, TV, computer) 1 hour before bed');
        tips['Sleep Hygiene'].push('Limit caffeine after 2 PM');
        tips['Sleep Hygiene'].push('Avoid large meals close to bedtime');
    } else {
        tips['Sleep Hygiene'].push('Maintain your good sleep schedule');
        tips['Sleep Hygiene'].push('Continue practicing good sleep hygiene');
        tips['Sleep Hygiene'].push('Ensure your sleep environment remains optimal');
    }
    
    // Stress management
    tips['Stress Management'].push('Practice deep breathing exercises daily (5-10 minutes)');
    tips['Stress Management'].push('Try meditation or mindfulness apps (Headspace, Calm)');
    tips['Stress Management'].push('Engage in hobbies and activities you enjoy');
    tips['Stress Management'].push('Maintain social connections with friends and family');
    tips['Stress Management'].push('Consider yoga or tai chi for mind-body wellness');
    tips['Stress Management'].push('Limit exposure to stressful news and social media');
    tips['Stress Management'].push('Seek professional help if stress becomes overwhelming');
    
    // Daily habits
    tips['Daily Habits'].push('Start your day with a healthy breakfast');
    tips['Daily Habits'].push('Take short breaks every hour if you have a desk job');
    tips['Daily Habits'].push('Practice good posture throughout the day');
    tips['Daily Habits'].push('Spend time outdoors in natural sunlight daily');
    tips['Daily Habits'].push('Limit sitting time - stand and move every 30 minutes');
    tips['Daily Habits'].push('Keep a gratitude journal to improve mental health');
    tips['Daily Habits'].push('Maintain good hygiene and dental care');
    
    // Preventive care
    tips['Preventive Care'].push('Schedule regular check-ups with your primary care physician');
    tips['Preventive Care'].push('Get recommended health screenings for your age group');
    tips['Preventive Care'].push('Stay up to date with vaccinations');
    tips['Preventive Care'].push('Monitor your health parameters regularly at home');
    tips['Preventive Care'].push('Keep a health journal to track changes over time');
    tips['Preventive Care'].push('Don\'t ignore persistent symptoms - consult a doctor');
    tips['Preventive Care'].push('Build a relationship with healthcare providers you trust');
    
    return tips;
}

/**
 * Print report
 */
function printReport() {
    window.print();
}

/**
 * Start new assessment
 */
function newAssessment() {
    // Reset all data
    userData = {};
    healthData = {};
    analysisResults = {};
    
    // Clear forms
    document.getElementById('personalForm').reset();
    document.getElementById('healthForm').reset();
    
    // Show input section and hide report section
    document.getElementById('inputSection').style.display = 'block';
    document.getElementById('reportSection').style.display = 'none';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
