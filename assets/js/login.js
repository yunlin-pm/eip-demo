function hideLoginScreen() { window.location.href = 'overview.html'; }
document.querySelector('.login-google-btn')?.addEventListener('click', hideLoginScreen);
document.querySelector('.login-reset-link')?.addEventListener('click', function (event) { event.preventDefault(); this.textContent = '重設密碼流程待確認'; });
