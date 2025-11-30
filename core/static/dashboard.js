
// Sidebar Navigation
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.tab-content');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const target = item.getAttribute('data-nav');

        // Sidebar active state
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        // Sections switching
        sections.forEach(sec => sec.classList.remove('active'));
        const targetEl = document.getElementById(target);
        if (targetEl) {
          targetEl.classList.add('active');
        }
    });
});

// Handle Pop-up menu
document.addEventListener("DOMContentLoaded", () => {
    const trigger = document.getElementById("profileTrigger");
    const popup = document.getElementById("profilePopup");

    if (!trigger || !popup) return;

    const togglePopup = () => {
        popup.classList.toggle("open");
    };

    const closePopup = () => {
        popup.classList.remove("open");
    };

    trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        togglePopup();
    });

    document.addEventListener("click", (e) => {
        if (!popup.contains(e.target) && !trigger.contains(e.target)) {
            closePopup();
        }
    });
});

// Not Intrested Button functionality (On Guides Section)
document.getElementById("notIntrested").addEventListener("click", () => {
  document.querySelector(".hero-banner").style.display = "none";
});

// Dropdown functionality in Gorups
function toggleRecipients(groupId) {
    const box = document.getElementById("recipients-" + groupId);
    if (box.style.display === "none" || box.classList.contains("hidden")) {
        box.style.display = "block";
        box.classList.remove("hidden");
    } else {
        box.style.display = "none";
        box.classList.add("hidden");
    }
}

// Add New Group Popup
document.getElementById("createNewBtn").onclick = function () {
    document.getElementById("groupPopup").style.display = "flex";
};

document.getElementById("closePopup").onclick = function () {
    document.getElementById("groupPopup").style.display = "none";
};

// Compose Popup
function openComposePopup(groupId, groupName) {
    // Set hidden field with the group id
    document.getElementById('compose-group-id').value = groupId;

    // Optional: show group name in the popup
    document.getElementById('compose-group-label').textContent =
        'Sending to group: ' + groupName;

    // Show popup
    document.getElementById('composePopup').style.display = 'flex';
}

// Close button handler
document.getElementById("composeClosePopup").onclick = function () {
    document.getElementById("composePopup").style.display = "none";
};