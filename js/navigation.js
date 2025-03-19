let menuStructure = [];
let contentCache = {}; // Cache para almacenar contenido ya cargado

fetch('menu.json')
    .then(response => response.json())
    .then(data => {
        menuStructure = data.menu;
        initializeNavigation();
    })
    .catch(error => console.error('Error cargando el menú:', error));

function initializeNavigation() {
    buildNavigationMenu();
    setupNavigationEvents();
    if (window.location.hash) {
        const path = window.location.hash.substring(1);
        loadContent(path);
    } else {
        showWelcomePage();
    }
}


function buildNavigationMenu() {
    const navContainer = document.getElementById('main-nav');
    if (!navContainer) return;
    navContainer.innerHTML = '';

    menuStructure.forEach(section => {
        // Crear el elemento de la sección
        const sectionElement = document.createElement('li');
        sectionElement.className = 'nav-item';

        // Crear el enlace de la sección
        const sectionLink = document.createElement('a');
        sectionLink.className = 'nav-link';
        sectionLink.href = '#';
        sectionLink.innerHTML = `
            <i class="fas fa-bars"></i>
            <span style="color:white">${section.title}</span>
        `;
        sectionLink.addEventListener('click', (e) => {
            e.preventDefault(); // Evitar el comportamiento por defecto del enlace
            toggleSection(section.section); // Expandir/colapsar la sección
        });
        sectionElement.appendChild(sectionLink);

        // Crear el contenedor colapsable para los ítems de la sección
        const collapseDiv = document.createElement('div');
        collapseDiv.id = `collapse${section.section}`;
        collapseDiv.className = 'collapse'; // Colapsado por defecto
        collapseDiv.setAttribute('aria-labelledby', `heading${section.section}`);

        const collapseInner = document.createElement('div');
        collapseInner.className = 'bg-white py-2 collapse-inner rounded';

        // Recorrer los ítems de la sección
        section.items.forEach(item => {
            // Crear el enlace del ítem
            const itemLink = document.createElement('a');
            itemLink.className = 'collapse-item';
            itemLink.href = `#${section.section}/${item.item}`;
            itemLink.textContent = item.title;
            itemLink.addEventListener('click', () => {
                loadContent(`${section.section}/${item.item}`);
                closeSubmenu(); // Cerrar el submenú después de hacer clic
            });
            collapseInner.appendChild(itemLink);

            // Si hay subítems, crearlos
            if (item.subitems && item.subitems.length > 0) {
                item.subitems.forEach(subItem => {
                    const subItemLink = document.createElement('a');
                    subItemLink.className = 'collapse-item pl-4'; // Añadir padding para indentar
                    subItemLink.href = `#${section.section}/${item.item}/${subItem.subitem}`;
                    subItemLink.textContent = subItem.title;
                    subItemLink.addEventListener('click', () => {
                        loadContent(`${section.section}/${item.item}/${subItem.subitem}`);
                        closeSubmenu(); // Cerrar el submenú después de hacer clic
                    });
                    collapseInner.appendChild(subItemLink);
                });
            }
        });

        collapseDiv.appendChild(collapseInner);
        sectionElement.appendChild(collapseDiv);
        navContainer.appendChild(sectionElement);
    });
}



function toggleSection(sectionId) {
    const collapseDiv = document.getElementById(`collapse${sectionId}`);
    if (collapseDiv.classList.contains('show')) {
        collapseDiv.classList.remove('show');
    } else {
        collapseOtherSections(sectionId); // Colapsar otras secciones
        collapseDiv.classList.add('show');
    }
}

function collapseOtherSections(currentSection) {
    document.querySelectorAll('.collapse').forEach(collapse => {
        if (!collapse.id.includes(currentSection)) {
            collapse.classList.remove('show');
        }
    });
}

function setupNavigationEvents() {
    // No necesitamos eventos adicionales aquí
}

function loadContent(path) {
    const contentDiv = document.getElementById('content');
    if (!contentDiv) return;

    // Verificar si el contenido ya está en caché
    if (contentCache[path]) {
        contentDiv.innerHTML = contentCache[path];
        updateNavigationState(...path.split('/'));
        closeSubmenu(); // Cerrar el submenú después de cargar el contenido
        return;
    }

    const pathParts = path.split('/');
    const section = pathParts[0];
    const item = pathParts[1];
    const subitem = pathParts[2];
    let contentPath = '';

    if (subitem) {
        contentPath = `contenido/${section}/${item}/${subitem}.html`;
    } else if (item) {
        contentPath = `contenido/${section}/${item}.html`;
    } else if (section) {
        contentPath = `contenido/${section}.html`;
    } else {
        showWelcomePage();
        return;
    }

    fetch(contentPath)
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('Contenido no disponible');
            }
        })
        .then(html => {
            contentDiv.innerHTML = html;
            contentCache[path] = html; // Almacenar en caché
            updateNavigationState(section, item, subitem);
            closeSubmenu(); // Cerrar el submenú después de cargar el contenido
        })
        .catch(error => {
            contentDiv.innerHTML = `
                <div class="card">
                    <h2 class="text-primary">Contenido no disponible</h2>
                    <p>El contenido para "${path}" está en desarrollo o no existe.</p>
                    <p class="mt-4">Error: ${error.message}</p>
                    <a href="#" onclick="showWelcomePage()">Volver al inicio</a>
                </div>
            `;
        });
}

// Función para cerrar el submenú
function closeSubmenu() {
    // Cerrar todos los submenús colapsados
    document.querySelectorAll('.collapse').forEach(collapse => {
        collapse.classList.remove('show');
    });
}




function updateNavigationState(section, item, subitem) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${section}/${item}`) {
            link.classList.add('active');
        }
    });
}

function showWelcomePage() {
    const contentDiv = document.getElementById('content');
    if (!contentDiv) return;

    // Construir la página de inicio
    contentDiv.innerHTML = `
        <div class="container-fluid">
            <div class="d-sm-flex align-items-center justify-content-between mb-4">
                <div class="text-center w-100">
                    <br><br>
                    <img src='img/Logo-Ingenia-Colour.png' class="mb-3" width='60%' style='max-width: 300px'>
                    <h1 class="h3 mb-0 text-gray-800" style="color: #fa832c;">Guía de Desarrollo Ingenia</h1>
                </div>
            </div>
            <div class="row">
                ${menuStructure.map(section => `
                    <div class="col-xl-4 col-md-6 mb-4">
                        <div class="card border-left-primary shadow h-100 py-2">
                            <div class="card-body">
                                <div class="row no-gutters align-items-center">
                                    <div class="col mr-2">
                                        <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                            ${section.title}</div>
                                        <!--<div class="h5 mb-0 font-weight-bold text-gray-800">${section.items[0].title}</div>-->
                                    </div>
                                    <div class="col-auto">
                                        <i class="fas fa-cogs fa-2x text-gray-300"></i>
                                    </div>
                                </div>
                                <div class="mt-3">
                                    <ul class="list-group">
                                        ${section.items.map(item => `
                                            <li class="list-group-item">
                                                <!-- Enlace principal del ítem -->
                                                <a href="#${section.section}/${item.item}" onclick="loadContent('${section.section}/${item.item}')">
                                                    ${item.title}
                                                </a>
                                                ${item.subitems && item.subitems.length > 0 ? `
                                                    <ul class="list-group mt-2">
                                                        ${item.subitems.map(subItem => `
                                                            <li class="list-group-item pl-4">
                                                                <!-- Enlace de subítem -->
                                                                <a href="#${section.section}/${item.item}/${subItem.subitem}" onclick="loadContent('${section.section}/${item.item}/${subItem.subitem}')">
                                                                    ${subItem.title}
                                                                </a>
                                                            </li>
                                                        `).join('')}
                                                    </ul>
                                                ` : ''}
                                            </li>
                                        `).join('')}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}
