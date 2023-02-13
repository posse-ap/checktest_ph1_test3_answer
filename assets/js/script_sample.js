"use strict";

/**
 * tab
 * 
 * 参考URL https://developer.mozilla.org/ja/docs/Web/Accessibility/ARIA/Roles/Tab_Role
 */

const tabs = document.querySelectorAll('[role="tab"]');
const tabList = document.querySelector('[role="tablist"]');

const changeTabs = e => {
  const target = e.target;
  const parent = target.parentNode;
  const grandparent = parent.parentNode;

  // タブから現在すべての選択状態を取り除く
  parent
    .querySelectorAll('[aria-selected="true"]')
    .forEach(t => t.setAttribute("aria-selected", false));

  // このタブを選択されたタブとして設定
  target.setAttribute("aria-selected", true);

  // すべてのタブパネルを非表示
  grandparent
    .querySelectorAll('[role="tabpanel"]')
    .forEach(p => p.setAttribute("hidden", true));

  // 選択されたパネルを表示
  grandparent.parentNode
    .querySelector(`#${target.getAttribute("aria-controls")}`)
    .removeAttribute("hidden");
}

tabs.forEach(tab => {
  tab.addEventListener('click', changeTabs);
});

/**
 * form
 * 
 * 参考URL https://into-the-program.com/forms/
 */
const formElements = document.forms.contactForm;

formElements.addEventListener( 'submit', e => {
  e.preventDefault();

  console.log(`ご用件：${formElements.title.value}`);
  console.log(`お名前：${formElements.name.value}`);
  console.log(`電話番号：${formElements.tel.value}`);
  console.log(`メールアドレス：${formElements.email.value}`);
  console.log(`性別：${formElements.sex.value}`);

  Array.prototype.forEach.call(formElements.job, function (checkbox) {
    if(checkbox.checked === true){
      console.log('職業：', checkbox.value);
    }
  });

  console.log(`お問い合わせ内容：${formElements.content.value}`);
})
