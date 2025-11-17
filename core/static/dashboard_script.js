// DOM Elements
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebarToggle = document.getElementById('sidebarToggle');
const tabButtons = document.querySelectorAll('.tab-btn');
const navItems = document.querySelectorAll('.nav-item');
const navGroups = document.querySelectorAll('[data-toggle]');

// Mobile Menu Toggle
mobileMenuBtn?.addEventListener('click', () => {
    sidebar?.classList.toggle('active');
    sidebarOverlay?.classList.toggle('active');
});

sidebarToggle?.addEventListener('click', () => {
    sidebar?.classList.toggle('active');
});

sidebarOverlay?.addEventListener('click', () => {
    sidebar?.classList.remove('active');
    sidebarOverlay?.classList.remove('active');
});

// Navigation Groups Toggle
navGroups.forEach(group => {
    group.addEventListener('click', function() {
        const submenuId = this.getAttribute('data-toggle');
        const submenu = document.getElementById(submenuId);
        const isActive = submenu?.classList.contains('active');
        
        // Close all other submenus
        document.querySelectorAll('.nav-submenu.active').forEach(menu => {
            if (menu.id !== submenuId) {
                menu.classList.remove('active');
                const icon = menu.previousElementSibling?.querySelector('.toggle-icon');
                if (icon) icon.classList.remove('active');
            }
        });

        // Toggle current submenu
        submenu?.classList.toggle('active');
        const toggleIcon = this.querySelector('.toggle-icon');
        toggleIcon?.classList.toggle('active');
    });
});

// Tab Navigation
tabButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const tabName = this.getAttribute('data-tab');
        
        // Remove active class from all buttons and contents
        tabButtons.forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Add active class to clicked button and corresponding content
        this.classList.add('active');
        const tabContent = document.getElementById(`tab-${tabName}`);
        if (tabContent) {
            tabContent.classList.add('active');
        }
    });
});

// Navigation Item Active State
navItems.forEach(item => {
    item.addEventListener('click', function() {
        navItems.forEach(i => i.classList.remove('active'));
        this.classList.add('active');
    });
});

// Close sidebar when clicking on nav items on mobile
document.querySelectorAll('.nav-item, .nav-submenu a').forEach(item => {
    item.addEventListener('click', function() {
        if (window.innerWidth < 768) {
            sidebar?.classList.remove('active');
            sidebarOverlay?.classList.remove('active');
        }
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Set first tab as active
    const firstTab = document.querySelector('.tab-btn');
    if (firstTab) {
        firstTab.click();
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        sidebar?.classList.remove('active');
        sidebarOverlay?.classList.remove('active');
    }
});
