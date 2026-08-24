// Bean Route 模範解答
// Week06〜Week10 の範囲だけで書いています（async/await・fetch・try/catch・配列メソッド・DOM操作）。

const listEl = document.getElementById("cafe-list");
const tabsEl = document.getElementById("cafe-tabs");
const formEl = document.getElementById("contact-form");
const nameErrorEl = document.getElementById("name-error");

// data.json から読み込んだカフェを、あとで絞り込めるように持っておく
let cafes = [];

// --- 一覧の描画 ---------------------------------------------------------

// data.json の中身を innerHTML に流し込むと、そこにHTMLタグが混ざっていたときに
// そのままタグとして解釈されてしまう（Week07で「まず textContent を使う」と言っているのはこれ）。
// 要素は createElement で作り、文字は textContent で入れる。
function el(tag, className, text) {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) {
    node.textContent = text;
  }
  return node;
}

function createCard(cafe) {
  const li = el(
    "li",
    "overflow-hidden rounded-xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
  );

  const image = el("img", "h-44 w-full object-cover");
  image.src = cafe.image;
  image.alt = cafe.name;

  const body = el("div", "p-5");
  body.appendChild(
    el(
      "span",
      "inline-block rounded-full bg-brand px-3 py-1 text-xs text-white",
      cafe.categoryLabel
    )
  );
  body.appendChild(el("h3", "mt-3 text-lg font-bold", cafe.name));
  body.appendChild(el("p", "mt-1 text-xs text-sub", cafe.area));
  body.appendChild(el("p", "mt-3 text-sm leading-6", cafe.description));
  body.appendChild(el("p", "mt-4 text-xs text-sub", `営業時間 ${cafe.hours}`));

  li.appendChild(image);
  li.appendChild(body);
  return li;
}

function render(items) {
  listEl.textContent = "";
  items.forEach((cafe) => {
    listEl.appendChild(createCard(cafe));
  });
}

// --- エラー表示（仕様書の「取得に失敗したときはメッセージを出す」） -------

function showError(message) {
  listEl.textContent = "";
  listEl.appendChild(
    el(
      "li",
      "col-span-full rounded-xl border border-sub bg-white p-8 text-center text-sm",
      message
    )
  );
}

// --- 読み込み -----------------------------------------------------------

async function loadCafes() {
  try {
    const response = await fetch("./data.json");
    if (!response.ok) {
      throw new Error(`データの取得に失敗しました（${response.status}）`);
    }
    cafes = await response.json();
    render(cafes);
  } catch (error) {
    console.error(error);
    showError("カフェ情報を読み込めませんでした。時間をおいて再度お試しください。");
  }
}

// --- タブ ---------------------------------------------------------------

const ACTIVE_CLASSES = ["bg-brand", "text-white", "border-brand"];
// 選択中のタブは背景がオレンジなので、hover の文字色オレンジが残ると文字が消える。
// 選択中だけ hover の指定を外す。
const HOVER_CLASSES = ["hover:border-brand", "hover:text-brand"];

function selectTab(button) {
  const buttons = tabsEl.querySelectorAll("button");
  buttons.forEach((b) => {
    b.classList.remove(...ACTIVE_CLASSES);
    b.classList.add(...HOVER_CLASSES);
  });
  button.classList.add(...ACTIVE_CLASSES);
  button.classList.remove(...HOVER_CLASSES);

  // 読み込みに失敗しているときは、タブを押してもエラー表示を消さない
  if (cafes.length === 0) {
    return;
  }

  const category = button.dataset.category;
  if (category === "all") {
    render(cafes);
  } else {
    render(cafes.filter((cafe) => cafe.category === category));
  }
}

tabsEl.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (button) {
    selectTab(button);
  }
});

// --- フォーム -----------------------------------------------------------

formEl.addEventListener("submit", (event) => {
  event.preventDefault();

  // form.name はフォーム自身の name 属性を指してしまうので、要素は id から取る
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value;
  const category = document.getElementById("category").value;
  const message = document.getElementById("message").value;

  if (name === "") {
    nameErrorEl.textContent = "お名前を入力してください";
    return;
  }
  nameErrorEl.textContent = "";

  alert(
    `お名前: ${name}\nメールアドレス: ${email}\nご用件: ${category}\nお問い合わせ内容: ${message}`
  );
});

// --- 起動 ---------------------------------------------------------------

selectTab(tabsEl.querySelector('button[data-category="all"]'));
loadCafes();
