// -----------------------------------------------------------------------
// Open Specific Tab and Popup at Startup
// -----------------------------------------------------------------------

// Setting active sidebar item
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
    if(item.getAttribute('data-nav') == `tab-${CURRENT_TAB}`) {
        item.classList.add('active');
    }
});
// Setting active tab
const targetEl = document.getElementById(`tab-${CURRENT_TAB}`);
if (targetEl) {
    targetEl.classList.add('active');
}
// Setting active popup
if (CURRENT_POPUP === "editOrganisationPopup") {
    openEditPopup(POPUP_ID);
}
// -----------------------------------------------------------------------
// Sidebar Navigation
// -----------------------------------------------------------------------
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

// -----------------------------------------------------------------------
// "View All" Button Implementation
// -----------------------------------------------------------------------
const externalButtons = document.querySelectorAll('.view-all');

externalButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-nav');

        // Switch sections only
        sections.forEach(sec => sec.classList.remove('active'));
        const targetEl = document.getElementById(target);
        if (targetEl) {
            targetEl.classList.add('active');
        }

        // Update sidebar highlight
        const matchingSidebarItem = document.querySelector(`.nav-item[data-nav="${target}"]`);
        if (matchingSidebarItem) {
            navItems.forEach(i => i.classList.remove('active'));
            matchingSidebarItem.classList.add('active');
        }
    });
});

// -----------------------------------------------------------------------
// Handle Sidebar Pop-up menu
// -----------------------------------------------------------------------
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

// -----------------------------------------------------------------------
// Not Intrested Button functionality
// -----------------------------------------------------------------------
document.getElementById("notIntrested").addEventListener("click", () => {
  document.querySelector(".hero-banner").style.display = "none";
});

// -----------------------------------------------------------------------
// Dropdown functionality in Organisations
// -----------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".organisation-item").forEach(item => {
        item.addEventListener("click", function (e) {
            // Prevent toggling when clicking actual buttons
            if (e.target.closest("button")) return;

            const id = this.getAttribute("data-id");
            toggleRecipients(id);
        });
    });
});

function toggleRecipients(organisationId) {
    const allBoxes = document.querySelectorAll(".organisation-buttons");
    const current = document.getElementById("recipients-" + organisationId);

    // Close all others
    allBoxes.forEach(box => {
        if (box !== current) {
            box.style.display = "none";
            box.classList.add("hidden");
        }
    });

    // Toggle the clicked one
    if (current.style.display === "none" || current.classList.contains("hidden")) {
        current.style.display = "flex";
        current.classList.remove("hidden");
    } else {
        current.style.display = "none";
        current.classList.add("hidden");
    }
}

// -----------------------------------------------------------------------
// Add New Organisation Popup
// -----------------------------------------------------------------------
document.getElementById("createNewBtn").onclick = function () {
    document.getElementById("organisationPopup").style.display = "flex";
};
// Close Popup
document.getElementById("closePopup").onclick = function () {  
    document.getElementById("organisationPopup").style.display = "none";
};

// -----------------------------------------------------------------------
// Import CSV Functionality
// -----------------------------------------------------------------------
document.getElementById("fileTrigger").addEventListener("click", function() {
    document.getElementById("csvInput").click();
});

document.getElementById("csvInput").addEventListener("change", function() {
    const fileName = this.files.length > 0 ? this.files[0].name : "No file chosen";
    document.getElementById("fileName").textContent = fileName;
});

// -----------------------------------------------------------------------
// Compose Popup
// -----------------------------------------------------------------------
function openComposePopup(organisationId) {
    // Save organisation ID in hidden input (optional but useful)
    document.getElementById("compose-organisation-id").value = organisationId;

    // Target the container where checkboxes will appear
    const container = document.getElementById("groupCheckboxContainer");
    container.innerHTML = "";

    // Load groups for this organisation from JSON mapping
    const groups = ORG_GROUPS[organisationId] || [];

    groups.forEach(g => {
        const label = document.createElement("label");
        label.className = "checkbox-item";

        label.innerHTML = `
            <input type="checkbox" name="group_ids" value="${g.id}">
            ${g.name}
        `;

        container.appendChild(label);
    });

    // Show popup
    document.getElementById('composePopup').style.display = 'flex';
}

// Close button handler
document.getElementById("composeClosePopup").onclick = function () {
    document.getElementById("composePopup").style.display = "none";
};

// -----------------------------------------------------------------------
// Edit Organisation Popup
// -----------------------------------------------------------------------
function openEditPopup(organisationId) {
    // Save organisation ID in hidden input
    document.getElementById("compose-organisation-id").value = organisationId;

    // Target the container where Groups will appear
    const sidebar = document.getElementById("organisation-sidebar");
    // Refresh Group list
    sidebar.innerHTML = ""; 

    // Button for Organisation's General Details
    const btn = document.createElement("button");
    btn.className = "organisation-nav-item";
    
    btn.dataset.nav = `tab-general`;    

    btn.addEventListener('click', () => {
        openSection(btn);
        autofillGeneral(organisationId);
    });
    
    const span = document.createElement("span");

    span.textContent = "General";
    btn.appendChild(span);
    sidebar.appendChild(btn);

    // Execute them once to activate general section
    openSection(btn);
    autofillGeneral(organisationId);

    // "Create New Group" Button functionality
    const createBtn = document.getElementById("createNewGroup");
    createBtn.addEventListener('click', () => {
        openSection(createBtn);
        autofillNewGroup(organisationId)
    });
    
    // Load groups for this organisation from JSON mapping
    const groups = ORG_GROUPS[organisationId] || [];

    groups.forEach(g => {
        const btn = document.createElement("button");
        btn.className = "organisation-nav-item";
        btn.dataset.nav = "tab-modify-group";

        btn.addEventListener('click', () => {
            openSection(btn);
            autofillGroup(g, organisationId);
        });

        const span = document.createElement("span");
        span.textContent = g.name;

        btn.appendChild(span);
        sidebar.appendChild(btn);
    });

    // Show popup
    document.getElementById('editOrganisationPopup').style.display = 'flex';
}

// Close Edit popup
function closeEditPopup() {
    document.getElementById("editOrganisationPopup").style.display = "none";
};

// Close when clicking on the overlay (outside the content)
const editOrgPopup = document.getElementById("editOrganisationPopup");
editOrgPopup.addEventListener("click", function (event) {
    if (event.target === editOrgPopup) {
        closeEditPopup();
    }
});

// -----------------------------------------------------------------------
// Groups Sidebar Navigation (In Edit popup)
// -----------------------------------------------------------------------
// This works differently because the buttons and sections are dynamic
function openSection(btn) {
  const target = btn.getAttribute('data-nav');

  // Deactivate all nav items
  document.querySelectorAll('.organisation-nav-item')
    .forEach(i => i.classList.remove('active'));
  btn.classList.add('active');

  // Deactivate all sections
  document.querySelectorAll('.organisation-tab-content')
    .forEach(sec => sec.classList.remove('active'));

  // Activate the target section
  const targetEl = document.getElementById(target);
  if (targetEl) {
    targetEl.classList.add('active');
  }
}
// -----------------------------------------------------------------------
// Autofill Fields
// -----------------------------------------------------------------------
function autofillGeneral(organisationId) {
    const details = ORG_DETAILS[organisationId];
    if (!details) return;

    document.getElementById("org-id").value = organisationId;
    const nameBox = document.getElementById("org-name");
    const descBox = document.getElementById("org-description");

    if (nameBox) nameBox.value = details.name || "";
    if (descBox) descBox.value = details.description || "";
}

function autofillGroup(group, organisationId) {
    document.getElementById("modify-org-id").value = organisationId;
    document.getElementById("group-id").value = group.id;

    const nameBox = document.getElementById("group-name");
    const descBox = document.getElementById("group-recipients");

    if (nameBox) nameBox.value = group.name || "";
    if (descBox) descBox.value = group.recipients || "";

    // Autofilling Confirm Deletion Popup's Id and name
    document.getElementById("org-id-for-delete-group-id").value = organisationId;
    document.getElementById("delete-group-id").value = group.id;
    document.getElementById('group-name-placeholder').textContent = group.name;
};

function autofillNewGroup(organisationId) {
    document.getElementById("create-org-id").value = organisationId;
}

// -----------------------------------------------------------------------
// Delete Organisation Confrimation
// -----------------------------------------------------------------------
function deleteOrganisation(orgId, orgName) {
    document.getElementById('deleteOrgConfirm').style.display = 'flex';
    document.getElementById('org-name-placeholder').textContent = orgName;
}
// Close popup
function closeDeleteOrganisationPopup() {
    document.getElementById("deleteOrgConfirm").style.display = "none";
};

// Close when clicking on the overlay (outside the content)
const confirmDeleteOrgPopup = document.getElementById("deleteOrgConfirm");
confirmDeleteOrgPopup.addEventListener("click", function (event) {
    if (event.target === confirmDeleteOrgPopup) {
        closeDeleteOrganisationPopup();
    }
});

// -----------------------------------------------------------------------
// Delete Group Confrimation
// -----------------------------------------------------------------------

// Open popup
function deleteGroup() {
    document.getElementById('deleteGroupConfirmation').style.display = 'flex';
}
// Close popup
function closeDeleteGroupPopup() {
    document.getElementById("deleteGroupConfirmation").style.display = "none";
};

// Close when clicking on the overlay (outside the content)
const confirmDeleteGroupPopup = document.getElementById("deleteGroupConfirmation");
confirmDeleteGroupPopup.addEventListener("click", function (event) {
    if (event.target === confirmDeleteGroupPopup) {
        closeDeleteGroupPopup();
    }
});