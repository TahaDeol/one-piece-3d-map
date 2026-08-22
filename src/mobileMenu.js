const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileDrawer = document.getElementById('mobileDrawer');
const drawerClose = document.getElementById('drawerClose');

mobileMenuBtn.addEventListener('click', function () {
    mobileDrawer.classList.remove('hidden');
});

drawerClose.addEventListener('click', function () {
    mobileDrawer.classList.add('hidden');
});
