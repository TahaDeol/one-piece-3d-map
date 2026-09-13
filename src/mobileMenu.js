const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileDrawer = document.getElementById('mobileDrawer');
const drawerClose = document.getElementById('drawerClose');

export function openDrawer() {
    mobileDrawer.classList.remove('hidden');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
}

export function closeDrawer() {
    mobileDrawer.classList.add('hidden');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
}

mobileMenuBtn.addEventListener('click', openDrawer);
drawerClose.addEventListener('click', closeDrawer);
