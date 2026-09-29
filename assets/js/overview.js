function goToOverviewFiltered(kind){window.location.href='overview/list.html?status='+encodeURIComponent(kind)}
function goToPage(page){var routes={overview:'overview.html','admin-form-list':'approvals/list.html','remit-vendor-list':'remittance/vendor-list.html','remit-payroll-list':'remittance/payroll-list.html','my-delegate':'delegates/my-delegate.html','delegate-settings':'delegates/settings.html',profile:'settings/profile.html'};if(routes[page])window.location.href=routes[page]}
function showLoginScreen(){window.location.href='login.html'}
function toggleDropdown(id){var el=document.getElementById(id);if(el)el.classList.toggle('open')}
