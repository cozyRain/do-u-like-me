let yesButton = document.getElementById("yes");
let noButton = document.getElementById("no");
let questionText = document.getElementById("question");
let mainImage = document.getElementById("mainImage");

let clickCount = 0;

const noTexts = ["你不喜欢我了(´-ω-)", "要不再想想?(๑•́₃•̀๑)", "不许选这个!", "再选伤心了(｡•́︿•̀｡)", "别嘛~", "我不要!!!", "再选超爆:(", "嘿嘿嘿"];

// No 状态与变换
let noState = { x: 0, y: 0 };
function applyNoTransform() {
  const noTranslate = `translate(${noState.x}px, ${noState.y}px)`;
  const noScale = Math.max(0.55, 1 - clickCount * 0.06);
  noButton.style.transform = `${noTranslate} scale(${noScale})`;
}

// Yes 变换（向中间靠拢可选）
function applyYesTransform(towardCenter = false) {
  const yesScale = clickCount === noTexts.length + 1 ? 5.2 : 1 + clickCount * 0.15;
  let yesShift = 0;
  if (towardCenter) {
    const centerX = window.innerWidth / 2;
    const yesRect = yesButton.getBoundingClientRect();
    const yesCenter = yesRect.left + yesRect.width / 2;
    yesShift = (centerX - yesCenter) * 0.6;
    const maxShift = Math.min(window.innerWidth * 0.22, 160);
    yesShift = Math.max(Math.min(yesShift, maxShift), -maxShift);
  }
  yesButton.style.transform = `translateX(${yesShift}px) scale(${yesScale})`;
}

noButton.addEventListener("click", function () {
  clickCount++;

  // 最后一次点击：先放大 Yes，再隐藏 No
  if (clickCount === noTexts.length + 1) {
    applyYesTransform(true);
    setTimeout(() => {
      noButton.style.display = "none";
    }, 1);
    return;
  }

  noState.x += 50;
  const rect = noButton.getBoundingClientRect();
  const winW = window.innerWidth;
  if (rect.right + 50 > winW - 20) {
    noState.x = Math.max(-rect.left + 20, noState.x - 180);
    noState.y += (Math.random() > 0.5 ? 1 : -1) * 40;
  }

  applyNoTransform();
  applyYesTransform(true);

  let moveUp = Math.min(clickCount * 18, 220);
  mainImage.style.transform = `translateY(-${moveUp}px)`;
  questionText.style.transform = `translateY(-${moveUp}px)`;

  if (clickCount <= 9) {
    noButton.innerText = noTexts[clickCount - 1];
  }

  switch (clickCount) {
    case 1:
      mainImage.src = "images/shocked.gif";
      break;
    case 2:
      mainImage.src = "images/think.gif";
      break;
    case 3:
      mainImage.src = "images/angry.gif";
      break;
    case 4:
      mainImage.src = "images/crying1.gif";
      break;
    case 5:
      mainImage.src = "images/crying2.gif";
      break;
    case 6:
      mainImage.src = "images/crying3.gif";
      break;
    case 7:
      mainImage.src = "images/crying4.gif";
      break;
    case 8:
      mainImage.src = "images/crying5.gif";
      break;
    case 9:
      mainImage.src = "images/crying6.gif";
      break;
  }
});

// No 悬停躲避（不影响 Yes）
noButton.addEventListener("mouseenter", function () {
  if (Math.random() < 0.2) return;
  const rect = noButton.getBoundingClientRect();
  const winW = window.innerWidth;
  const winH = window.innerHeight;
  let dx = (Math.random() * 2 - 1) * 160;
  let dy = (Math.random() * 3 - 1.5) * 80;
  let newX = noState.x + dx;
  let newY = noState.y + dy;
  if (rect.left + newX < 10) newX = -rect.left + 10;
  if (rect.right + newX > winW - 10) newX = winW - rect.right - 10;
  if (rect.top + newY < 10) newY = -rect.top + 10;
  if (rect.bottom + newY > winH - 10) newY = winH - rect.bottom - 10;

  noState.x = newX;
  noState.y = newY;
  applyNoTransform();
});

window.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if (key === "y") yesButton.click();
  else if (key === "n") noButton.click();
});

yesButton.addEventListener("click", function () {
  let overlay = document.getElementById("yes-overlay");
  const cardHTML = `
    <div class="yes-card">
      <h1 class="yes-text">雨点也超级喜欢花花!! ヽ(○´∀`)ﾉ♪♡︎</h1>
      <img src="images/hug.gif" alt="拥抱" class="yes-image">
      <button id="restartBtn" class="small-btn">再玩一次</button>
    </div>
  `;
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "yes-overlay";
    overlay.className = "yes-screen";
    overlay.innerHTML = cardHTML;
    document.body.appendChild(overlay);
  } else {
    if (!overlay.innerHTML || overlay.innerHTML.trim() === "") {
      overlay.innerHTML = cardHTML;
    }
  }

  const restartBtn = overlay.querySelector("#restartBtn");
  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      location.reload();
    });
  }

  overlay.classList.add("visible");
  overlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  for (let i = 0; i < 24; i++) {
    setTimeout(() => createHeartParticle(), Math.random() * 600);
  }
});

// 生成爱心粒子（白/粉 随机）
function createHeartParticle() {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 32 29");
  svg.setAttribute("aria-hidden", "true");

  const isPink = Math.random() < 0.5;
  const whiteFill = "rgba(255,255,255,0.95)";
  const pinkFill = "rgba(255,90,138,0.98)";
  const fill = isPink ? pinkFill : whiteFill;

  svg.innerHTML = `<path d="M23.6 0c-2.9 0-4.9 1.7-7.6 4.4C12.3 1.7 10.3 0 7.4 0 3.3 0 0 3.3 0 7.4c0 8 16 21.6 16 21.6S32 15.4 32 7.4C32 3.3 28.7 0 24.6 0 24 0 23.8 0 23.6 0z" fill="${fill}"></path>`;

  const leftPct = 40 + Math.random() * 30;
  const bottomPct = 8 + Math.random() * 14;
  const baseSize = isPink ? 18 + Math.random() * 22 : 12 + Math.random() * 14;
  const scale = 0.8 + Math.random() * 0.9;
  svg.style.position = "fixed";
  svg.style.left = `${leftPct}%`;
  svg.style.bottom = `${bottomPct}%`;
  svg.style.width = `${baseSize}px`;
  svg.style.height = "auto";
  svg.style.transform = `translateX(${(Math.random() - 0.5) * 60}px) scale(${scale})`;
  svg.style.opacity = `${isPink ? 0.85 + Math.random() * 0.15 : 0.55 + Math.random() * 0.35}`;
  svg.style.zIndex = 9999;
  svg.style.pointerEvents = "none";

  svg.style.animationName = "floatUp";
  svg.style.animationDelay = `${Math.random() * 600}ms`;
  svg.style.animationDuration = `${3.2 + Math.random() * 1.6}s`;
  svg.style.animationTimingFunction = "cubic-bezier(.2,.8,.2,1)";
  svg.style.animationFillMode = "forwards";

  document.body.appendChild(svg);
  setTimeout(() => svg.remove(), 3600 + Math.random() * 3200);
}
let yesButton = document.getElementById("yes");
let noButton = document.getElementById("no");
let questionText = document.getElementById("question");
let mainImage = document.getElementById("mainImage");

let clickCount = 0;

const noTexts = ["你不喜欢我了(´-ω-)", "要不再想想?(๑•́₃•̀๑)", "不许选这个!", "再选伤心了(｡•́︿•̀｡)", "别嘛~", "我不要!!!", "再选超爆:(", "嘿嘿嘿"];

// No 状态与变换
let noState = { x: 0, y: 0 };
function applyNoTransform() {
  const noTranslate = `translate(${noState.x}px, ${noState.y}px)`;
  const noScale = Math.max(0.55, 1 - clickCount * 0.06);
  noButton.style.transform = `${noTranslate} scale(${noScale})`;
}

// Yes 变换（向中间靠拢可选）
function applyYesTransform(towardCenter = false) {
  const yesScale = clickCount === noTexts.length + 1 ? 5.2 : 1 + clickCount * 0.15;
  let yesShift = 0;
  if (towardCenter) {
    const centerX = window.innerWidth / 2;
    const yesRect = yesButton.getBoundingClientRect();
    const yesCenter = yesRect.left + yesRect.width / 2;
    yesShift = (centerX - yesCenter) * 0.6;
    const maxShift = Math.min(window.innerWidth * 0.22, 160);
    yesShift = Math.max(Math.min(yesShift, maxShift), -maxShift);
  }
  yesButton.style.transform = `translateX(${yesShift}px) scale(${yesScale})`;
}

noButton.addEventListener("click", function () {
  clickCount++;

  // 最后一次点击：先放大 Yes，再隐藏 No
  if (clickCount === noTexts.length + 1) {
    applyYesTransform(true);
    setTimeout(() => {
      noButton.style.display = "none";
    }, 1);
    return;
  }

  noState.x += 50;
  const rect = noButton.getBoundingClientRect();
  const winW = window.innerWidth;
  if (rect.right + 50 > winW - 20) {
    noState.x = Math.max(-rect.left + 20, noState.x - 180);
    noState.y += (Math.random() > 0.5 ? 1 : -1) * 40;
  }

  applyNoTransform();
  applyYesTransform(true);

  let moveUp = Math.min(clickCount * 18, 220);
  mainImage.style.transform = `translateY(-${moveUp}px)`;
  questionText.style.transform = `translateY(-${moveUp}px)`;

  if (clickCount <= 9) {
    noButton.innerText = noTexts[clickCount - 1];
  }

  switch (clickCount) {
    case 1:
      mainImage.src = "images/shocked.gif";
      break;
    case 2:
      mainImage.src = "images/think.gif";
      break;
    case 3:
      mainImage.src = "images/angry.gif";
      break;
    case 4:
      mainImage.src = "images/crying1.gif";
      break;
    case 5:
      mainImage.src = "images/crying2.gif";
      break;
    case 6:
      mainImage.src = "images/crying3.gif";
      break;
    case 7:
      mainImage.src = "images/crying4.gif";
      break;
    case 8:
      mainImage.src = "images/crying5.gif";
      break;
    case 9:
      mainImage.src = "images/crying6.gif";
      break;
  }
});

// No 悬停躲避（不影响 Yes）
noButton.addEventListener("mouseenter", function () {
  if (Math.random() < 0.2) return;
  const rect = noButton.getBoundingClientRect();
  const winW = window.innerWidth;
  const winH = window.innerHeight;
  let dx = (Math.random() * 2 - 1) * 160;
  let dy = (Math.random() * 3 - 1.5) * 80;
  let newX = noState.x + dx;
  let newY = noState.y + dy;
  if (rect.left + newX < 10) newX = -rect.left + 10;
  if (rect.right + newX > winW - 10) newX = winW - rect.right - 10;
  if (rect.top + newY < 10) newY = -rect.top + 10;
  if (rect.bottom + newY > winH - 10) newY = winH - rect.bottom - 10;

  noState.x = newX;
  noState.y = newY;
  applyNoTransform();
});

window.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if (key === "y") yesButton.click();
  else if (key === "n") noButton.click();
});

yesButton.addEventListener("click", function () {
  let overlay = document.getElementById("yes-overlay");
  const cardHTML = `
    <div class="yes-card">
      <h1 class="yes-text">!!!!施好好也超级喜欢贺好好!! ヽ (○´∀\`)ﾉ♪♡︎ᐝ</h1>
      <img src="images/hug.gif" alt="拥抱" class="yes-image">
      <button id="restartBtn" class="small-btn">再玩一次</button>
    </div>
  `;
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "yes-overlay";
    overlay.className = "yes-screen";
    overlay.innerHTML = cardHTML;
    document.body.appendChild(overlay);
  } else {
    if (!overlay.innerHTML || overlay.innerHTML.trim() === "") {
      overlay.innerHTML = cardHTML;
    }
  }

  const restartBtn = overlay.querySelector("#restartBtn");
  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      location.reload();
    });
  }

  overlay.classList.add("visible");
  overlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  for (let i = 0; i < 24; i++) {
    setTimeout(() => createHeartParticle(), Math.random() * 600);
  }
});

// 生成爱心粒子（白/粉 随机）
function createHeartParticle() {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 32 29");
  svg.setAttribute("aria-hidden", "true");

  const isPink = Math.random() < 0.5;
  const whiteFill = "rgba(255,255,255,0.95)";
  const pinkFill = "rgba(255,90,138,0.98)";
  const fill = isPink ? pinkFill : whiteFill;

  svg.innerHTML = `<path d="M23.6 0c-2.9 0-4.9 1.7-7.6 4.4C12.3 1.7 10.3 0 7.4 0 3.3 0 0 3.3 0 7.4c0 8 16 21.6 16 21.6S32 15.4 32 7.4C32 3.3 28.7 0 24.6 0 24 0 23.8 0 23.6 0z" fill="${fill}"></path>`;

  const leftPct = 40 + Math.random() * 30;
  const bottomPct = 8 + Math.random() * 14;
  const baseSize = isPink ? 18 + Math.random() * 22 : 12 + Math.random() * 14;
  const scale = 0.8 + Math.random() * 0.9;
  svg.style.position = "fixed";
  svg.style.left = `${leftPct}%`;
  svg.style.bottom = `${bottomPct}%`;
  svg.style.width = `${baseSize}px`;
  svg.style.height = "auto";
  svg.style.transform = `translateX(${(Math.random() - 0.5) * 60}px) scale(${scale})`;
  svg.style.opacity = `${isPink ? 0.85 + Math.random() * 0.15 : 0.55 + Math.random() * 0.35}`;
  svg.style.zIndex = 9999;
  svg.style.pointerEvents = "none";

  svg.style.animationName = "floatUp";
  svg.style.animationDelay = `${Math.random() * 600}ms`;
  svg.style.animationDuration = `${3.2 + Math.random() * 1.6}s`;
  svg.style.animationTimingFunction = "cubic-bezier(.2,.8,.2,1)";
  svg.style.animationFillMode = "forwards";

  document.body.appendChild(svg);
  setTimeout(() => svg.remove(), 3600 + Math.random() * 3200);
}
 
