// --- 1. Data Structures (Arrays & Objects) ---
const classesData = [
  { id: 1, name: "Morning Vinyasa Flow", category: "vinyasa", instructor: "Sarah", time: "09:00 AM" },
  { id: 2, name: "Deep Yin Yoga", category: "yin", instructor: "David", time: "11:00 AM" },
  { id: 3, name: "Power Yoga & Core", category: "power", instructor: "Alice", time: "05:00 PM" }
];

const membershipTiers = [
  { tier: "Basic", price: 49 },
  { tier: "Unlimited", price: 89 },
  { tier: "VIP All-Access", price: 129 }
];

const userSettings = {
  currentFilter: "all",
  isFormValid: false
};

// --- 2. Interactive Feature: Class Schedule Filter ---
const filterButtons = document.querySelectorAll(".filter-btn");
const scheduleContainer = document.querySelector(".schedule-container");

function renderClasses(filter) {
  if (!scheduleContainer) return;
  
  const filtered = filter === "all" 
    ? classesData 
    : classesData.filter(item => item.category === filter);

  if (filtered.length === 0) {
    scheduleContainer.innerHTML = "<p>No classes found for this category.</p>";
    return;
  }

  const htmlString = filtered.map(cls => `
    <div class="class-card" style="border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; border-radius: 5px;">
      <h3>${cls.name}</h3>
      <p><strong>Instructor:</strong> ${cls.instructor}</p>
      <p><strong>Time:</strong> ${cls.time}</p>
    </div>
  `).join("");

  scheduleContainer.innerHTML = htmlString;
}

if (filterButtons.length > 0) {
  filterButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const filterValue = e.target.getAttribute("data-filter") || "all";
      userSettings.currentFilter = filterValue;
      localStorage.setItem("preferredFilter", filterValue);
      renderClasses(filterValue);
    });
  });
}

// --- 3. Page Initialization & Form Persistence (DOMContentLoaded 안전 장치 적용) ---
window.addEventListener("DOMContentLoaded", () => {
  // A. 스케줄 필터 상태 복원
  const savedFilter = localStorage.getItem("preferredFilter");
  if (savedFilter && scheduleContainer) {
    userSettings.currentFilter = savedFilter;
    renderClasses(savedFilter);
  } else {
    renderClasses("all");
  }

  // B. 폼 입력값 자동 저장 및 새로고침 시 복원 (Data Persistence)
  const regForm = document.querySelector("form");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");

  if (regForm) {
    const formInputs = regForm.querySelectorAll("input, select, textarea");

    // 페이지가 열릴 때 LocalStorage에 저장된 값이 있으면 입력창에 자동으로 채우기
    formInputs.forEach(input => {
      if (input.id) {
        const savedValue = localStorage.getItem(`form_${input.id}`);
        if (savedValue !== null) {
          input.value = savedValue;
        }

        // 사용자가 타이핑할 때마다 실시간으로 LocalStorage에 저장
        input.addEventListener("input", (e) => {
          localStorage.setItem(`form_${e.target.id}`, e.target.value);
        });
      }
    });

    // C. 폼 유효성 검사 및 제출 이벤트
    regForm.addEventListener("submit", (event) => {
      event.preventDefault(); // ERR_FILE_NOT_FOUND 에러 방지

      let isValid = true;

      // 에러 메시지 초기화 함수
      function showError(inputElement, message) {
        inputElement.classList.add("input-error");
        let errorSpan = document.getElementById(`${inputElement.id}-error`);
        if (!errorSpan) {
          errorSpan = document.createElement("span");
          errorSpan.id = `${inputElement.id}-error`;
          errorSpan.className = "error-message";
          errorSpan.style.color = "red";
          errorSpan.style.fontSize = "0.875rem";
          inputElement.parentNode.appendChild(errorSpan);
        }
        errorSpan.textContent = message;
      }

      function clearError(inputElement) {
        inputElement.classList.remove("input-error");
        const errorSpan = document.getElementById(`${inputElement.id}-error`);
        if (errorSpan) errorSpan.textContent = "";
      }

      if (nameInput) clearError(nameInput);
      if (emailInput) clearError(emailInput);

      // 검사 1: 이름 필수 입력
      if (nameInput && nameInput.value.trim() === "") {
        showError(nameInput, "Name is required.");
        isValid = false;
      }

      // 검사 2: 이메일 '@' 포함 여부
      if (emailInput) {
        const emailVal = emailInput.value.trim();
        if (emailVal === "") {
          showError(emailInput, "Email is required.");
          isValid = false;
        } else if (!emailVal.includes("@")) {
          showError(emailInput, "Please enter a valid email address containing '@'.");
          isValid = false;
        }
      }

      userSettings.isFormValid = isValid;

      if (userSettings.isFormValid) {
        alert("Thank you! Your request has been successfully submitted.");
        
        // 제출 성공 시 저장된 스토리지 데이터 삭제 및 폼 초기화
        formInputs.forEach(input => {
          if (input.id) localStorage.removeItem(`form_${input.id}`);
        });
        regForm.reset();
      }
    });
  }
});

// --- Interactive Feature: FAQ Toggle (동적 업데이트 기능) ---
const faqBtn = document.getElementById("faq-toggle-btn");
const faqContent = document.getElementById("faq-content");

if (faqBtn && faqContent) {
  faqBtn.addEventListener("click", () => {
    // 현재 숨겨져 있으면 보이게 하고, 보여지고 있으면 숨기기 (동적 토글)
    if (faqContent.style.display === "none" || faqContent.style.display === "") {
      faqContent.style.display = "block";
      faqBtn.textContent = "Hide Answer";
    } else {
      faqContent.style.display = "none";
      faqBtn.textContent = "What should I bring to class?";
    }
  });
}