// Локализация
const langData = {
  "ru-RU": {
    // sysTitle: "ChatGPT Система пополнения счета",
    // sysDesc: "Безопасное и быстрое пополнение счета",
    // stepTitle: "Порядок пополнения счета",
    // stepFlow: [
    //   "1. Войдите в систему и получите accessToken",
    //   "2. Введите CDK",
    //   "3. Проверьте и пополните счет",
    // ],
    // tokenLabel: "Введите accesssToken учетной записи",
    // cdkLabel: "Введите CDK код",
    verifyBtn: "Проверить CDK",
    emailLabel: "Адрес электронной почты：",
    subLabel: "Подписка：",
    // logTitle: "Журнал операций",
    accountInfoTitle: "Информация об учетной записи",
    // footer:
    //   "© 2025 Официальная система пополнения счета. Все права защищены.<br> \
		// 	Используя этот сервис, вы соглашаетесь с нашими Условиями предоставления услуг \
		// 	и Политикой конфиденциальности.",
    // logTableHead: ["Учетная запись", "CDK", "Статус"],
    logEmpty: "Записей пока нет",
    cdk_used: (email) =>
      `Этот CDK был использован ${email.email} - ${email.updated_at.replace(" ", "-")}`,
    cdk_invalid: "CDK недействителен, пожалуйста, проверьте и повторите попытку",
    cdk_success: "CDK подтвержден, пожалуйста, нажмите пополнить счет",
    cdk_plus: "Ваш аккаунт уже пополнен, и вы не сможете пополнить его до истечения срока действия",
    cdk_network: "Сетевая ошибка, пожалуйста, повторите попытку позже",
    cdk_empty: "Пожалуйста, введите CDK",
    token_empty: "Пожалуйста, введите accessToken",
    rechargeBtn: "Подтвердите пополнение счета",
    recharge_success: "Пополнение счета прошло успешно! Теперь ваш аккаунт пополнен",
    recharge_fail: "Не удалось выполнить перезарядку, пожалуйста, повторите попытку позже",
    err_team_account: "Учетная запись должна быть личной, не может быть командной, и срок действия вашей подписки Plus не истек",
    logStatus: { success: "Успешно", used: "Используется", fail: "Не удалось" },
    subStatus: { free: "Free", plus: "PLUS" },
    getTokenTip:
      'Как получить? Пожалуйста зайдите в свою \
			<a href="https://chatgpt.com/auth/login" target="_blank">учетную запись ChatGPT</a> \
			, затем перейдите \
			<a href="https://chatgpt.com/api/auth/session" target="_blank">сюда</a> \
			, чтобы получить accessToken, скопируйте все содержимое в поле ввода ниже.',
  },
};
// let lang = "zh-CN";
let lang = "ru-RU";
let userEmail = "-";
let userSub = "-";
let logList = [];
let isPlus = false;
let cdkKey = "";
let token = "";
// Переключение на несколько языков (расширяемая кнопка)
// function setLang(l) {
//   lang = l;
//   const t = langData[lang];
//   document.getElementById("sysTitle").textContent = t.sysTitle;
//   document.getElementById("sysDesc").textContent = t.sysDesc;
//   document.getElementById("stepTitle").textContent = t.stepTitle;
//   document.getElementById("stepFlow").innerHTML = t.stepFlow
//     .map((s) => `<div>${s}</div>`)
//     .join("");
//   document.getElementById("tokenLabel").textContent = t.tokenLabel;
//   document.getElementById("cdkLabel").textContent = t.cdkLabel;
//   document.getElementById("verifyBtn").textContent = t.verifyBtn;
//   document.getElementById("emailLabel").textContent = t.emailLabel;
//   document.getElementById("subLabel").textContent = t.subLabel;
//   document.getElementById("logTitle").textContent = t.logTitle;
//   document.getElementById("accountInfoTitle").textContent = t.accountInfoTitle;
//   document.getElementById("footerText").innerHTML = t.footer;
//   // Заголовок журнала
//   const ths = t.logTableHead.map((h) => `<th>${h}</th>`).join("");
//   document.querySelector("#logTable thead tr").innerHTML = ths;
//   renderLog();
//   // Статус подписки
//   document.getElementById("subValue").textContent =
//     t.subStatus[userSub] || userSub;
//   // Обновите, чтобы получить запрос на токен
//   let tipElem = document.getElementById("getTokenTip");
//   if (!tipElem) {
//     tipElem = document.createElement("div");
//     tipElem.id = "getTokenTip";
//     tipElem.style.fontSize = "13px";
//     tipElem.style.color = "#2d7cff";
//     tipElem.style.marginBottom = "6px";
//     tipElem.style.lineHeight = "1.6";
//     tipElem.style.userSelect = "text";
//     document
//       .getElementById("tokenInput")
//       .parentNode.insertBefore(tipElem, document.getElementById("tokenInput"));
//   }
//   tipElem.innerHTML = t.getTokenTip;
//   // Проверьте и повторно отобразите запрос о том, что был использован CDK
//   const resultMsg = document.getElementById("resultMsg");
//   if (resultMsg && resultMsg.innerHTML) {
//     // Проверьте, не выдается ли сообщение о том, что был использован CDK (поддерживаются как китайский, так и английский языки).
//     const usedMatch = resultMsg.innerHTML.match(
//       /([\w.-]+@[\w.-]+).*?(\d{4}-\d{2}-\d{2}-\d{2}:\d{2}:\d{2})/
//     );
//     if (
//       usedMatch &&
//       (resultMsg.innerHTML.includes("CDK") ||
//         resultMsg.innerHTML.includes("used"))
//     ) {
//       const email = usedMatch[1];
//       const updated_at = usedMatch[2];
//       resultMsg.innerHTML = `<div class="error">${t.cdk_used({
//         email,
//         updated_at,
//       })}</div>`;
//     }
//   }
// }
// Журнал рендеринга
function renderLog() {
  const t = langData[lang];
  const logBody = document.getElementById("logBody");
  if (!logList.length) {
    logBody.innerHTML = `<tr><td colspan="3">${t.logEmpty}</td></tr>`;
    return;
  }
  logBody.innerHTML = logList
    .map(
      (item) =>
        `<tr><td>${item.email}</td><td>${item.cdk}</td><td>${
          t.logStatus[item.status] || item.status
        }</td></tr>`
    )
    .join("");
}
// Проверка CDK
function verifyCDK() {
  cdkKey = document.getElementById("cdkInput").value.trim();
  token = document.getElementById("tokenInput").value.trim();
  const t = langData[lang];
  const resultMsg = document.getElementById("resultMsg");
  resultMsg.innerHTML = "";
  if (!token) {
    resultMsg.innerHTML = `<div class="error">${t.token_empty}</div>`;
    return;
  }
  // Новое: accessToken должен быть в формате JSON и содержать пользовательскую строку
  let session = null;
  try {
    session = JSON.parse(token);
  } catch {
    // resultMsg.innerHTML = `<div class="error">accessToken 必须为 JSON 格式</div>`;
		resultMsg.innerHTML = `<div class="error">accessToken должен быть в формате JSON</div>`;
    return;
  }
  if (!cdkKey) {
    resultMsg.innerHTML = `<div class="error">${t.cdk_empty}</div>`;
    return;
  }
  document.getElementById("verifyBtn").disabled = true;
  resultMsg.innerHTML = `<div class="info">${t.verifyBtn}...</div>`;
  // Предположим, что в токене есть информация о подписке (реальный проект должен быть проверен серверной частью).
  // Смоделируйте синтаксический анализ токена здесь
  try {
    // Предположим, что токен представляет собой строку в формате json
    // const session = JSON.parse(token); // Уже разобранный
    userEmail = session.user?.email || "-";
    userSub = session.account?.planType === "plus" ? "plus" : "free";
    isPlus = userSub === "plus";
    document.getElementById("emailValue").textContent = userEmail;
    document.getElementById("subValue").textContent =
      t.subStatus[userSub] || userSub;
  } catch {
    userEmail = "-";
    userSub = "-";
    isPlus = false;
    document.getElementById("emailValue").textContent = "-";
    document.getElementById("subValue").textContent = "-";
  }
  // Если вы являетесь участником программы PLUS, пополнение счета запрещено
  if (isPlus) {
    resultMsg.innerHTML = `<div class="error">${t.cdk_plus}</div>`;
    document.getElementById("verifyBtn").disabled = true;
    return;
  }
  // Запросить подтверждение CDK
  fetch("https://api.gptpluscz.com/api/cdks/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cdk_key: cdkKey }),
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("verifyBtn").disabled = false;
      if (data.status === "valid") {
        resultMsg.innerHTML = `<div class="success">${t.cdk_success}</div><button class='btn' id='rechargeBtn'>${t.rechargeBtn}</button>`;
      } else if (data.status === "used") {
        resultMsg.innerHTML = `<div class="error">${t.cdk_used(data)}</div>`;
        showToast(t.cdk_used(data));
        logList.unshift({ email: data.email, cdk: cdkKey, status: "used" });
        renderLog();
      } else {
        resultMsg.innerHTML = `<div class="error">${t.cdk_invalid}</div>`;
      }
    })
    .catch(() => {
      document.getElementById("verifyBtn").disabled = false;
      resultMsg.innerHTML = `<div class="error">${t.cdk_network}</div>`;
    });
}
// Перезаряжать
function recharge() {
  const t = langData[lang];
  const resultMsg = document.getElementById("resultMsg");
  const btn = document.getElementById("rechargeBtn");
  if (btn) btn.disabled = true;
  resultMsg.innerHTML = `<div class="info">${t.rechargeBtn}...</div>`;
  fetch("https://api.gptpluscz.com/recharge", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fetch_token: cdkKey,
      session_data: JSON.parse(token),
    }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    })
    .then((data) => {
      if (data.success) {
        resultMsg.innerHTML = `<div class="success">${t.recharge_success}</div>`;
        logList.unshift({ email: userEmail, cdk: cdkKey, status: "success" });
        renderLog();
        if (btn) btn.disabled = true;
        userSub = "plus";
        document.getElementById("subValue").textContent =
          langData[lang].subStatus[userSub] || userSub;
      } else {
        let errMsg;
				// if (data.message === "账号必须是个人账号不能为团队账号 且plus未过期") {
        if (data.message === "Учетная запись должна быть личной, не может быть командной, и срок действия вашей подписки Plus не истек") {
          // Используйте перевод на текущий язык
          errMsg = t.err_team_account;
        } else {
          errMsg = data.message || t.recharge_fail;
        }
        resultMsg.innerHTML = `<div class="error">${errMsg}</div>`;

        logList.unshift({ email: userEmail, cdk: cdkKey, status: "fail" });
        renderLog();
      }
    })
    .catch((error) => {
      console.error(error);
      showToast(error);
      resultMsg.innerHTML = `<div class="error">${t.cdk_network}</div>`;
    });
}
// // Кнопка переключения на несколько языков (в правом верхнем углу)
// const langBtn = document.createElement("div");
// langBtn.style.position = "fixed";
// langBtn.style.top = "18px";
// langBtn.style.right = "24px";
// langBtn.style.zIndex = "999";
// langBtn.innerHTML = `
// 			<!--button onclick="setLang('ru-RU')">RU</!--button-->
//       <!--button onclick="setLang('zh-CN')">简</!--button-->
//       <!--button onclick="setLang('zh-TW')">繁</!--button-->
//       <!--button onclick="setLang('en')">EN</!--button-->
//     `;
// document.body.appendChild(langBtn);
// // Английский по умолчанию
// // setLang("zh-TW");
// setLang("ru-RU");
// Делегат мероприятия, убедитесь, что кнопка пополнения счета должна быть активирована
document.body.addEventListener("click", function (e) {
  if (e.target && e.target.id === "rechargeBtn") {
    recharge();
  }
});
// Событие кнопки "Очистить входную информацию"
document.body.addEventListener("click", function (e) {
  if (e.target && e.target.id === "clearInputBtn") {
    document.getElementById("tokenInput").value = "";
    document.getElementById("cdkInput").value = "";
    document.getElementById("emailValue").textContent = "-";
    document.getElementById("subValue").textContent = "-";
    userEmail = "-";
    userSub = "-";
    isPlus = false;
    document.getElementById("resultMsg").innerHTML = "";
  }
});
// page 底部 <script> 里随便放
function showToast(msg) {
  // 1. Создайте полупрозрачный слой-маску
  const overlay = document.createElement("div");
  Object.assign(overlay.style, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.4)",
    zIndex: 10000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });

  // 2. Создайте всплывающий контейнер
  const modal = document.createElement("div");
  Object.assign(modal.style, {
    maxWidth: "90%",
    minWidth: "320px",
    padding: "20px 24px",
    background: "#fff",
    color: "#333",
    fontSize: "16px",
    borderRadius: "8px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    textAlign: "center",
    lineHeight: "1.5",
    position: "relative",
  });

  // 3. Название (унифицированное традиционное китайское “не удалось перезарядить")
  const title = document.createElement("div");
  title.textContent = "充值失敗";
  Object.assign(title.style, {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "12px",
    color: "#e74c3c",
  });

  // 4. Содержание сообщения
  const content = document.createElement("div");
  content.textContent = msg;
  Object.assign(content.style, {
    marginBottom: "20px",
    wordBreak: "break-word",
  });

  // 5. Кнопка закрытия
  const closeBtn = document.createElement("button");
  // closeBtn.textContent = "關閉";
	closeBtn.textContent = "Закрыть";
  Object.assign(closeBtn.style, {
    padding: "8px 16px",
    fontSize: "14px",
    border: "none",
    borderRadius: "4px",
    background: "#2d7cff",
    color: "#fff",
    cursor: "pointer",
  });
  closeBtn.addEventListener("click", () => {
    clearTimeout(autoClose);
    overlay.remove();
  });

  // 6. Соберите и вставьте на страницу
  modal.appendChild(title);
  modal.appendChild(content);
  modal.appendChild(closeBtn);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // 7. Автоматически выключается через 10 секунд
  const autoClose = setTimeout(() => {
    overlay.remove();
  }, 15000);
}

// --------------------

// Текущий год
document.getElementById("year").textContent = new Date().getFullYear();

// hint
const hint = document.getElementById("hint");
const content = document.getElementById("hint-content");

hint.addEventListener("click", () => {
	if (content.style.maxHeight) {
		// скрываем
		content.style.maxHeight = null;
		hint.classList.remove("open");
	} else {
		// раскрываем
		content.style.maxHeight = content.scrollHeight + "px";
		hint.classList.add("open");
	}
});
