/* eslint-disable */
// ==========================================================================
// SMART BMI CALCULATOR & ANIMATIONS UPGRADE
// ==========================================================================

// 1. Intersection Observer for Scroll Animations
document.addEventListener('DOMContentLoaded', () => {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
  });
});

// 2. BMI Unit Toggle
window.switchBmiUnit = (unit) => {
  const ftContainer = document.getElementById('height-ft-container');
  const cmContainer = document.getElementById('height-cm-container');
  
  if (unit === 'ft') {
    ftContainer.style.display = 'block';
    cmContainer.style.display = 'none';
  } else {
    ftContainer.style.display = 'none';
    cmContainer.style.display = 'block';
  }
};

// 3. Smart BMI Calculation & Biological Age Logic
window.calculateSmartBMI = () => {
  const ageInput = document.getElementById('bmi-age').value;
  const genderMale = document.getElementById('gender-male').checked;
  const weightInput = document.getElementById('bmi-weight').value;
  const unitFt = document.getElementById('unit-ft').checked;
  
  const alertContainer = document.getElementById('bmi-alert-container');
  const scoreVal = document.getElementById('bmi-score-val');
  const statusLbl = document.getElementById('bmi-status-lbl');
  
  const riskCard = document.getElementById('health-risk-card');
  const riskTitle = document.getElementById('risk-title');
  const riskDesc = document.getElementById('risk-desc');
  const riskBioAge = document.getElementById('risk-bio-age');

  if (!ageInput || !weightInput) {
    riskCard.classList.remove('show');
    scoreVal.textContent = '--';
    statusLbl.textContent = 'Enter Details Above';
    if (alertContainer) alertContainer.style.display = 'block';
    return;
  }

  let heightInMeters = 0;

  if (unitFt) {
    const ftInput = document.getElementById('bmi-ft').value;
    const inInput = document.getElementById('bmi-in-rem').value || 0;
    if (!ftInput) {
      riskCard.classList.remove('show');
      scoreVal.textContent = '--';
      statusLbl.textContent = 'Enter Details Above';
      if (alertContainer) alertContainer.style.display = 'block';
      return;
    }
    const totalInches = (parseInt(ftInput) * 12) + parseInt(inInput);
    heightInMeters = totalInches * 0.0254;
  } else {
    const cmInput = document.getElementById('bmi-cm').value;
    if (!cmInput) {
      riskCard.classList.remove('show');
      scoreVal.textContent = '--';
      statusLbl.textContent = 'Enter Details Above';
      if (alertContainer) alertContainer.style.display = 'block';
      return;
    }
    heightInMeters = parseInt(cmInput) / 100;
  }

  const weight = parseFloat(weightInput);
  const age = parseInt(ageInput);
  
  if (heightInMeters > 0 && weight > 0) {
    const bmi = weight / (heightInMeters * heightInMeters);
    const roundedBmi = bmi.toFixed(1);
    
    scoreVal.textContent = roundedBmi;
    
    let status = "";
    let riskClass = "";
    let bioAgeDelta = 0;
    
    if (bmi < 18.5) {
      status = "Underweight";
      riskClass = "risk-under";
      riskTitle.textContent = "⚠️ Underweight Risk";
      riskDesc.textContent = "You need to focus on gaining healthy muscle mass to improve immunity and energy.";
      bioAgeDelta = +2;
    } else if (bmi >= 18.5 && bmi < 24.9) {
      status = "Normal Weight";
      riskClass = "risk-normal";
      riskTitle.textContent = "✅ Healthy Status";
      riskDesc.textContent = "Great job! Keep maintaining your healthy lifestyle.";
      bioAgeDelta = -2; // Healthy people might have a lower biological age!
    } else if (bmi >= 25 && bmi < 29.9) {
      status = "Overweight";
      riskClass = "risk-over";
      riskTitle.textContent = "🟠 Overweight Risk";
      riskDesc.textContent = "You are at increased risk for joint issues and metabolic syndrome. Let's fix this.";
      bioAgeDelta = +4;
    } else {
      status = "Obese";
      riskClass = "risk-obese";
      riskTitle.textContent = "🔴 High Health Risk";
      riskDesc.textContent = "Immediate action needed. You are at high risk for diabetes and cardiovascular issues.";
      bioAgeDelta = +8;
    }
    
    statusLbl.textContent = status;
    
    // Calculate Biological Age
    const biologicalAge = Math.max(10, age + bioAgeDelta);
    riskBioAge.textContent = `Estimated Biological Age: ${biologicalAge} Years`;
    
    // Show Card
    riskCard.className = `health-risk-card show ${riskClass}`;
    
    if (alertContainer) alertContainer.style.display = 'none';
  }
};
