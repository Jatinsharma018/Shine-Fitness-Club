/* ==========================================================================
   SHINE FITNESS CLUB - INTERACTIVE LOGIC & 3D SLIDER
   By Vinod Sharma | 25 KG Weight Loss Secret
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initSlider();
  initModal();
  initSmoothScroll();
});

/* ==========================================================================
   1. INTERACTIVE 3D TRANSFORMATION SLIDER
   ========================================================================== */
function initSlider() {
  const track = document.getElementById('slider-track');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const cards = document.querySelectorAll('.trans-card');
  
  if (!track || cards.length === 0) return;

  let currentIndex = 0;
  const totalCards = cards.length;
  let autoplayInterval;

  // Calculate visible cards based on viewport width
  function getCardsPerView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function updateSliderPosition() {
    const cardsPerView = getCardsPerView();
    const maxIndex = Math.max(0, totalCards - cardsPerView);
    
    // Ensure currentIndex is within bounds
    if (currentIndex > maxIndex) currentIndex = 0;
    if (currentIndex < 0) currentIndex = maxIndex;

    const cardWidth = cards[0].offsetWidth;
    const gap = 30; // Matches css gap
    const moveAmount = (cardWidth + gap) * currentIndex;
    
    track.style.transform = `translate3d(-${moveAmount}px, 0, 0)`;

    // Add subtle 3D highlight to the active card
    cards.forEach((card, idx) => {
      if (idx === currentIndex) {
        card.style.opacity = '1';
        card.style.transform = 'perspective(1000px) translateY(0) scale(1)';
      } else {
        card.style.opacity = '0.92';
      }
    });
  }

  // Next Slide
  function nextSlide() {
    const cardsPerView = getCardsPerView();
    const maxIndex = Math.max(0, totalCards - cardsPerView);
    if (currentIndex < maxIndex) {
      currentIndex++;
    } else {
      currentIndex = 0; // Loop back to start
    }
    updateSliderPosition();
  }

  // Prev Slide
  function prevSlide() {
    const cardsPerView = getCardsPerView();
    const maxIndex = Math.max(0, totalCards - cardsPerView);
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = maxIndex;
    }
    updateSliderPosition();
  }

  if (nextBtn) nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoplay();
  });

  if (prevBtn) prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoplay();
  });

  // Handle Resize
  window.addEventListener('resize', () => {
    updateSliderPosition();
  });

  // Touch Swipe Support for 100% Mobile Responsiveness
  let startX = 0;
  let endX = 0;

  track.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    pauseAutoplay();
  }, { passive: true });

  track.addEventListener('touchend', e => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
    startAutoplay();
  }, { passive: true });

  function handleSwipe() {
    const threshold = 50;
    if (startX - endX > threshold) {
      nextSlide(); // Swiped left
    } else if (endX - startX > threshold) {
      prevSlide(); // Swiped right
    }
  }

  // Autoplay functionality
  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 4500);
  }

  function pauseAutoplay() {
    clearInterval(autoplayInterval);
  }

  function resetAutoplay() {
    pauseAutoplay();
    startAutoplay();
  }

  const sliderViewport = document.querySelector('.slider-viewport');
  if (sliderViewport) {
    sliderViewport.addEventListener('mouseenter', pauseAutoplay);
    sliderViewport.addEventListener('mouseleave', startAutoplay);
  }

  // Initial call
  updateSliderPosition();
  startAutoplay();
}

/* ==========================================================================
   2. CONSULTATION MODAL (POPUP FORM)
   ========================================================================== */
function initModal() {
  const modal = document.getElementById('consultation-modal');
  const openBtns = document.querySelectorAll('.open-modal-btn');
  const closeBtn = document.getElementById('close-modal-btn');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof resetSurveyModal === 'function') resetSurveyModal();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent body scroll
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Close when clicking outside modal content
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   MULTI-STEP POP-UP SURVEY FORM (CONDITIONAL LOGIC)
   ========================================================================== */
let surveyData = {
  goal: '',
  amount: '',
  age: ''
};

function resetSurveyModal() {
  surveyData = { goal: '', amount: '', age: '' };
  document.querySelectorAll('.option-card.selected').forEach(el => el.classList.remove('selected'));
  document.querySelectorAll('.validation-error').forEach(el => el.style.display = 'none');
  
  const nameEl = document.getElementById('survey-name');
  const phoneEl = document.getElementById('survey-phone');
  const emailEl = document.getElementById('survey-email');
  if (nameEl) nameEl.value = '';
  if (phoneEl) phoneEl.value = '';
  if (emailEl) emailEl.value = '';
  
  goToStep(1, true);
}

function goToStep(stepNum, skipValidate = false) {
  if (!skipValidate) {
    if (stepNum === 2 && !surveyData.goal) {
      const err = document.getElementById('err-step-1');
      if (err) err.style.display = 'block';
      return;
    }
    if (stepNum === 3) {
      if (!surveyData.amount || !surveyData.age) {
        const err = document.getElementById('err-step-2');
        if (err) err.style.display = 'block';
        return;
      }
    }
  }

  // Switch step visibility
  document.querySelectorAll('.survey-step').forEach(step => step.classList.remove('active'));
  const targetStep = document.getElementById(`step-${stepNum}`);
  if (targetStep) targetStep.classList.add('active');

  // Update step indicators
  for (let i = 1; i <= 3; i++) {
    const dot = document.getElementById(`dot-step-${i}`);
    if (dot) {
      dot.classList.remove('active', 'completed');
      if (i < stepNum) dot.classList.add('completed');
      else if (i === stepNum) dot.classList.add('active');
    }
  }

  // Update step title text
  const titleEl = document.getElementById('step-title-text');
  if (titleEl) {
    if (stepNum === 1) titleEl.textContent = 'Step 1 of 3: Your Health Goal';
    else if (stepNum === 2) titleEl.textContent = 'Step 2 of 3: Customize Your Plan';
    else if (stepNum === 3) titleEl.textContent = 'Step 3 of 3: Contact & WhatsApp Plan';
  }
}

function selectSurveyOption(category, value, el, autoAdvance = true) {
  surveyData[category] = value;
  
  // Remove selected class from sibling cards
  const parentGrid = el.closest('.option-grid, .option-grid-2col');
  if (parentGrid) {
    parentGrid.querySelectorAll('.option-card').forEach(card => card.classList.remove('selected'));
  }
  el.classList.add('selected');

  // If primary goal selected, handle conditional logic for step 2
  if (category === 'goal') {
    surveyData.amount = ''; // reset amount when goal changes
    const blockLoss = document.getElementById('block-weight-loss');
    const blockGain = document.getElementById('block-weight-gain');
    const blockEnergy = document.getElementById('block-energy');
    
    if (blockLoss) blockLoss.style.display = 'none';
    if (blockGain) blockGain.style.display = 'none';
    if (blockEnergy) blockEnergy.style.display = 'none';

    if (value === 'Weight Loss' && blockLoss) {
      blockLoss.style.display = 'block';
    } else if (value === 'Weight Gain' && blockGain) {
      blockGain.style.display = 'block';
    } else if (value === 'Energy & Fitness' && blockEnergy) {
      blockEnergy.style.display = 'block';
    }
  }

  // Hide validation errors when selection is made
  const errStep1 = document.getElementById('err-step-1');
  const errStep2 = document.getElementById('err-step-2');
  if (errStep1 && category === 'goal') errStep1.style.display = 'none';
  if (errStep2 && (category === 'amount' || category === 'age')) errStep2.style.display = 'none';

  // Automatic Next Question / Step Transition
  if (autoAdvance) {
    if (category === 'goal') {
      setTimeout(() => {
        const step1 = document.getElementById('step-1');
        if (step1 && step1.classList.contains('active')) {
          goToStep(2);
        }
      }, 350);
    } else if (category === 'amount' || category === 'age') {
      if (category === 'amount' && !surveyData.age) {
        const ageElem = document.getElementById('options-age');
        if (ageElem) ageElem.scrollIntoView({ behavior: 'smooth' });
      } else if (category === 'age' && !surveyData.amount) {
        const activeBlock = document.querySelector('#step-2 .question-block[style*="block"]');
        if (activeBlock) activeBlock.scrollIntoView({ behavior: 'smooth' });
      }
      
      if (surveyData.amount && surveyData.age) {
        setTimeout(() => {
          const step2 = document.getElementById('step-2');
          if (step2 && step2.classList.contains('active')) {
            goToStep(3);
          }
        }, 350);
      }
    }
  }
}

function submitSurveyForm() {
  const nameEl = document.getElementById('survey-name');
  const phoneEl = document.getElementById('survey-phone');
  const emailEl = document.getElementById('survey-email');
  const errStep3 = document.getElementById('err-step-3');

  const name = nameEl ? nameEl.value.trim() : '';
  const phone = phoneEl ? phoneEl.value.trim() : '';
  const email = emailEl ? emailEl.value.trim() : '';

  // Validate 10-digit phone and non-empty name
  if (!name || !/^[0-9]{10}$/.test(phone)) {
    if (errStep3) errStep3.style.display = 'block';
    return;
  }
  if (errStep3) errStep3.style.display = 'none';

  // Get latest BMI score if available
  const bmiScoreVal = document.getElementById('bmi-score-val');
  const bmiText = (bmiScoreVal && !isNaN(parseFloat(bmiScoreVal.textContent))) ? bmiScoreVal.textContent.trim() : "N/A";

  // Prepare data payload for Google Sheets
  const payload = {
    name: name,
    phone: phone,
    email: email || "N/A",
    goal: surveyData.goal || "Not specified",
    targetWeight: surveyData.amount || "Not specified",
    age: surveyData.age || "Not specified",
    bmi: bmiText
  };

  // Store user info in localStorage for Thank You page personalization
  try {
    localStorage.setItem('shine_user_name', name);
    localStorage.setItem('shine_user_phone', phone);
    localStorage.setItem('shine_user_goal', `${surveyData.goal || ''} (${surveyData.amount || ''})`.trim());
  } catch(e) {}

  // Google Apps Script Web App URL
  const scriptURL = 'https://script.google.com/macros/s/AKfycbyd3hGmFl1KCkTZRo6DmlUBPMQGgEd6gmXa-MvbFuG1-PPuBiND8TZuv-w-UUUc5KuoPg/exec';

  // Send data to Google Sheet silently in the background (keepalive ensures delivery even during page redirect)
  fetch(scriptURL, {
    method: 'POST',
    mode: 'no-cors',
    keepalive: true,
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify(payload)
  }).catch(err => console.error('Error syncing to Google Sheet:', err));

  // Show quick celebration spinner and redirect immediately to Thank You page
  const modalContent = document.getElementById('survey-modal-content');
  if (modalContent) {
    modalContent.innerHTML = `
      <div style="text-align: center; padding: 36px 16px;">
        <div style="width: 72px; height: 72px; border: 5px solid #e2e8f0; border-top-color: var(--primary-teal); border-radius: 50%; margin: 0 auto 24px; animation: spin 0.8s linear infinite;"></div>
        <h3 style="font-size: 1.7rem; color: #0d9488; margin-bottom: 12px; font-family: 'Outfit', sans-serif; font-weight: 900;">Saving Details & Unlocking VIP Access... ⚡</h3>
        <p style="font-size: 1.05rem; color: #64748b; font-weight: 600;">Please wait while we redirect you to your personalized starter kit!</p>
      </div>
    `;
  }

  // Redirect to Thank You page after a brief 600ms transition
  setTimeout(() => {
    window.location.href = `thankyou.html?name=${encodeURIComponent(name)}`;
  }, 600);
}

/* ==========================================================================
   3. SMOOTH SCROLL FOR NAV LINKS
   ========================================================================== */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ==========================================================================
   4. SMART BMI CALCULATOR & RISK ANALYZER
   ========================================================================== */
let activeBmiTab = 'ft';

function switchBmiTab(tab) {
  activeBmiTab = tab;
  const tabFtBtn = document.getElementById('tab-ft-in');
  const tabInBtn = document.getElementById('tab-in');
  const contFt = document.getElementById('height-ft-container');
  const contIn = document.getElementById('height-in-container');

  if (tab === 'ft') {
    tabFtBtn.classList.add('active');
    tabInBtn.classList.remove('active');
    contFt.style.display = 'block';
    contIn.style.display = 'none';
  } else {
    tabInBtn.classList.add('active');
    tabFtBtn.classList.remove('active');
    contIn.style.display = 'block';
    contFt.style.display = 'none';
  }
  calculateBMI();
}

function calculateBMI() {
  const weightInput = document.getElementById('bmi-weight');
  const ftInput = document.getElementById('bmi-ft');
  const inRemInput = document.getElementById('bmi-in-rem');
  const inTotalInput = document.getElementById('bmi-in-total');
  const ageInput = document.getElementById('bmi-age');
  const genderInput = document.getElementById('bmi-gender');

  const scoreValEl = document.getElementById('bmi-score-val');
  const statusLblEl = document.getElementById('bmi-status-lbl');
  const alertContainer = document.getElementById('bmi-alert-container');
  const ctaBox = document.getElementById('bmi-cta-box');

  if (!weightInput || !scoreValEl) return;

  const weight = parseFloat(weightInput.value);
  const age = ageInput ? parseInt(ageInput.value) : 0;
  const gender = genderInput ? genderInput.value : '';
  let totalInches = 0;

  if (activeBmiTab === 'ft') {
    const ft = parseFloat(ftInput.value) || 0;
    const inRem = parseFloat(inRemInput.value) || 0;
    totalInches = (ft * 12) + inRem;
  } else {
    totalInches = parseFloat(inTotalInput.value) || 0;
  }

  // Validate inputs
  if (isNaN(weight) || weight <= 0 || isNaN(totalInches) || totalInches <= 0 || isNaN(age) || age <= 0 || !gender) {
    scoreValEl.textContent = '--';
    statusLblEl.textContent = 'Enter Details Above';
    scoreValEl.style.color = 'var(--text-light)';
    statusLblEl.style.color = 'var(--text-muted)';
    alertContainer.innerHTML = `
      <div class="bmi-alert-box" style="background: var(--teal-soft); border: 2px solid rgba(13, 148, 136, 0.2); color: var(--primary-teal-dark);">
        <div class="bmi-alert-icon"><i class="fa-solid fa-circle-info"></i></div>
        <div>Please enter your age, gender, weight, and height to see your scientific BMI analysis, biological age, and personalized health risk report.</div>
      </div>
    `;
    if (ctaBox) ctaBox.style.display = 'none';
    return;
  }

  // Height in meters = Inches * 0.0254
  const heightMeters = totalInches * 0.0254;
  const bmi = weight / (heightMeters * heightMeters);
  const bmiRounded = bmi.toFixed(1);

  scoreValEl.textContent = bmiRounded;
  if (ctaBox) ctaBox.style.display = 'block';

  let biologicalAgeText = '';
  if (age > 0 && gender) {
    let bioAge = age;
    if (bmi < 18.5) {
      bioAge = age + Math.round((18.5 - bmi) * 1.5);
    } else if (bmi > 24.9) {
      bioAge = age + Math.round((bmi - 24.9) * (gender === 'female' ? 1.3 : 1.5));
    } else {
      bioAge = Math.max(1, age - 2); 
    }
    
    let ageDiff = bioAge - age;
    let bioMessage = '';
    
    if (ageDiff > 0) {
      bioMessage = `<span style="color: #ef4444; font-weight: bold;">You are biologically ${ageDiff} years older than your actual age!</span>`;
    } else if (ageDiff < 0) {
      bioMessage = `<span style="color: #16a34a; font-weight: bold;">Great! You are biologically ${Math.abs(ageDiff)} years younger than your actual age.</span>`;
    } else {
      bioMessage = `<span style="color: #16a34a; font-weight: bold;">Your biological age matches your actual age. Keep it up!</span>`;
    }

    biologicalAgeText = `
      <div style="margin-top: 15px; padding-top: 12px; border-top: 1px solid rgba(0,0,0,0.1);">
        <strong style="color: #333;">Chronological Age:</strong> <span style="color: #333;">${age} Years</span><br>
        <strong style="color: #333;">Biological Age:</strong> <span style="color: #333;">${bioAge} Years</span><br>
        <div style="margin-top: 5px;">${bioMessage}</div>
      </div>
    `;
  }

  let alertHtml = '';
  let statusText = '';
  let statusColor = '';

  if (bmi < 18.5) {
    // Underweight (BMI < 18.5) -> Yellow Alert Box
    statusText = 'Underweight';
    statusColor = '#ca8a04';
    alertHtml = `
      <div class="bmi-alert-box alert-yellow">
        <div class="bmi-alert-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
        <div>
          <strong style="display: block; font-size: 1.05rem; margin-bottom: 4px;">⚠️ Your weight is below normal!</strong>
          <span><strong>Health Risks:</strong> Low immunity, constant fatigue, weak bones (osteoporosis), and nutritional deficiency.</span>
          ${biologicalAgeText}
        </div>
      </div>
    `;
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    // Normal (BMI 18.5 - 24.9) -> Green Alert Box
    statusText = 'Normal & Healthy';
    statusColor = '#16a34a';
    alertHtml = `
      <div class="bmi-alert-box alert-green">
        <div class="bmi-alert-icon"><i class="fa-solid fa-circle-check"></i></div>
        <div>
          <strong style="display: block; font-size: 1.05rem; margin-bottom: 4px;">🎉 Awesome! Your BMI is in the healthy range.</strong>
          <span>Maintain it with proper nutrition and active lifestyle guidance from Shine Fitness Club.</span>
          ${biologicalAgeText}
        </div>
      </div>
    `;
  } else if (bmi >= 25 && bmi <= 29.9) {
    // Overweight (BMI 25 - 29.9) -> Orange Alert Box
    statusText = 'Overweight';
    statusColor = '#ea580c';
    alertHtml = `
      <div class="bmi-alert-box alert-orange">
        <div class="bmi-alert-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
        <div>
          <strong style="display: block; font-size: 1.05rem; margin-bottom: 4px;">🚨 Caution! You are overweight.</strong>
          <span><strong>Health Risks:</strong> Lethargy, joint pain, fatty liver, and increased risk of Type-2 Diabetes.</span>
          ${biologicalAgeText}
        </div>
      </div>
    `;
  } else {
    // Obese (BMI 30+) -> Red Alert Box
    statusText = 'High Alert: Obesity Range';
    statusColor = '#dc2626';
    alertHtml = `
      <div class="bmi-alert-box alert-red">
        <div class="bmi-alert-icon"><i class="fa-solid fa-circle-exclamation"></i></div>
        <div>
          <strong style="display: block; font-size: 1.05rem; margin-bottom: 4px;">🛑 High Alert! You are in the Obesity range.</strong>
          <span><strong>Health Risks:</strong> High blood pressure, heart issues, severe joint pressure, and difficulty breathing.</span>
          ${biologicalAgeText}
        </div>
      </div>
    `;
  }

  statusLblEl.textContent = statusText;
  statusLblEl.style.color = statusColor;
  scoreValEl.style.color = statusColor;
  alertContainer.innerHTML = alertHtml;
}

function passBmiToModal() {
  if (typeof resetSurveyModal === 'function') resetSurveyModal();

  // If coming from BMI calculator, auto-select Weight Loss if BMI is overweight/obese
  const bmiScoreVal = document.getElementById('bmi-score-val');
  if (bmiScoreVal && !isNaN(parseFloat(bmiScoreVal.textContent))) {
    const bmi = parseFloat(bmiScoreVal.textContent);
    if (bmi >= 25) {
      const lossCard = document.querySelector("#options-goal .option-card:first-child");
      if (lossCard) selectSurveyOption('goal', 'Weight Loss', lossCard, false);
    }
  }

  // Open the consultation modal
  const modal = document.getElementById('consultation-modal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}
