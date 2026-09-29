function toggleDropdown(id) {
  var dropdown = document.getElementById(id);
  if (!dropdown) return;
  document.querySelectorAll('.dropdown.open').forEach(function (item) { if (item !== dropdown) item.classList.remove('open'); });
  dropdown.classList.toggle('open');
}
function selectLang(element) {
  document.querySelectorAll('.lang-option').forEach(function (item) { item.classList.remove('current'); });
  element.classList.add('current');
  document.getElementById('langSelectToggle').textContent = element.textContent.trim();
  document.getElementById('langDropdown').classList.remove('open');
}
function switchProfileTab(element, tab) {
  document.querySelectorAll('.page-tab').forEach(function (item) { item.classList.remove('active'); });
  element.classList.add('active');
  var personal = document.getElementById('profileTabPersonal');
  var work = document.getElementById('profileTabWork');
  personal.style.display = tab === 'personal' ? 'block' : 'none';
  work.style.display = tab === 'work' ? 'block' : 'none';
}
function goToPage(page) {
  var routes = { overview:'../overview.html', 'admin-form-list':'../approvals/list.html', 'remit-vendor-list':'../remittance/vendor-list.html', 'remit-payroll-list':'../remittance/payroll-list.html', 'my-delegate':'../delegates/my-delegate.html', 'delegate-settings':'../delegates/settings.html', profile:'profile.html' };
  if (routes[page]) window.location.href = routes[page];
}
function showLoginScreen() { window.location.href = '../login.html'; }
document.addEventListener('click', function (event) { if (!event.target.closest('.menu-wrap')) document.querySelectorAll('.dropdown.open').forEach(function (item) { item.classList.remove('open'); }); });
var actionButtons = document.querySelectorAll('.form-action-bar .btn');
var originalEmail = document.querySelector('#profileTabPersonal input[type="text"]')?.value || '';
if (actionButtons[0]) actionButtons[0].addEventListener('click', function () { var input=document.querySelector('#profileTabPersonal input[type="text"]'); if(input) input.value=originalEmail; });
if (actionButtons[1]) actionButtons[1].addEventListener('click', function () { var toast=document.getElementById('profileToast'); toast.style.cssText='display:block;position:fixed;right:20px;bottom:20px;z-index:100;padding:10px 14px;border-radius:5px;background:#25364a;color:#fff;font-size:13px;box-shadow:0 8px 24px #0003'; setTimeout(function(){toast.style.display='none';},1600); });
