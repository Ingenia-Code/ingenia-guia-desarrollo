// Estructura de navegación
const navigationStructure = {
  "fundamentos": {
    "title": "Fundamentos",
    "items": {
      "lenguajes": {
        "title": "Lenguajes",
        "subitems": {
          "lenguajes-python": "Python",
          "lenguajes-javascript": "JavaScript",
          "lenguajes-java": "Java",
          "lenguajes-csharp": "C#",
          // "lenguajes-otros": "Otros lenguajes"
        }
      },
      "ides": {
        "title": "IDEs y Editores",
        "subitems": {
          "ides-python": "Python",
          "ides-javascript": "JavaScript",
          "ides-java": "Java",
          "ides-dotnet": ".NET",
          "ides-vscode": "VSCode"
        }
      },
      "frameworks": {
        "title": "Frameworks",
        "subitems": {
          "frameworks-python": "Frameworks Python",
          "frameworks-javascript": "Frameworks JavaScript",
          "frameworks-dotnet": "Frameworks .NET",
          "frameworks-mobile": "Frameworks Mobile"
        }
      },
      "bases-datos": {
        "title": "Bases de Datos",
        "subitems": {
          "bd-sql": "Bases de Datos SQL",
          "bd-nosql": "Bases de Datos NoSQL",
          "bd-other": "Otras Bases de Datos"
        }
      }
    }
  },
  "herramientas": {
    "title": "Herramientas",
    "items": {
      "cloud": {
        "title": "Cloud y DevOps",
        "subitems": {
          "cloud-aws": "AWS",
          "cloud-azure": "Azure",
          "cloud-gcp": "Google Cloud",
          "cloud-devops": "Herramientas DevOps",
          "cloud-docker": "Docker y Kubernetes"
        }
      },
      "testing": {
        "title": "Testing y QA",
        "subitems": {
          "testing-unit": "Pruebas Unitarias",
          "testing-integration": "Pruebas de Integración",
          "testing-e2e": "Pruebas End-to-End",
          "testing-security": "Pruebas de Seguridad"
        }
      },
      "diseno": {
        "title": "Diseño y UX",
        "subitems": {
          "diseno-ui": "Herramientas UI",
          "diseno-prototipos": "Herramientas de Prototipado",
          "diseno-colaboracion": "Herramientas de Colaboración",
          "diseno-diagramas": "Diagramas y Flujos"
        }
      },
      "ia": {
        "title": "IA para Desarrollo",
        "subitems": {
          "ia-codigo": "Asistentes de Código",
          "ia-chat": "Chatbots y LLMs",
          "ia-imagenes": "Generación de Imágenes",
          "ia-otras": "Otras herramientas IA"
        }
      }
    }
  },
  "metodologias": {
    "title": "Metodologías Ágiles",
    "items": {
      "scrum": {
        "title": "Scrum",
        "subitems": {
          "scrum-roles": "Roles",
          "scrum-eventos": "Eventos",
          "scrum-artefactos": "Artefactos",
          "scrum-metricas": "Métricas"
        }
      },
      "kanban": {
        "title": "Kanban",
        "subitems": {
          "kanban-principios": "Principios",
          "kanban-tablero": "Tablero Kanban",
          "kanban-metricas": "Métricas Kanban",
          "kanban-practicas": "Prácticas Recomendadas"
        }
      },
      "xp": {
        "title": "Extreme Programming",
        "subitems": {
          "xp-practicas": "Prácticas XP",
          "xp-valores": "Valores XP",
          "xp-tdd": "Test-Driven Development"
        }
      },
      "safe": {
        "title": "SAFe",
        "subitems": {
          "safe-niveles": "Niveles de SAFe",
          "safe-principios": "Principios",
          "safe-implementacion": "Implementación"
        }
      }
    }
  },
  "colaboracion": {
    "title": "Herramientas de Colaboración",
    "items": {
      "gestion-proyectos": {
        "title": "Gestión de Proyectos",
        "subitems": {
          "gestion-trello": "Trello",
          "gestion-monday": "Monday",
          "gestion-linear": "Linear",
          "gestion-otras": "Otras herramientas"
        }
      },
      "documentacion": {
        "title": "Documentación",
        "subitems": {
          "doc-gitbook": "GitBook",
          "doc-confluence": "Confluence",
          "doc-mermaid": "Mermaid",
          "doc-diagramas": "Diagramas"
        }
      }
    }
  }
};

// Inicializar la navegación
document.addEventListener('DOMContentLoaded', function () {
  // Construir menú de navegación
  buildNavigationMenu();
  
  // Configurar eventos
  setupNavigationEvents();
  
  // Cargar contenido por defecto (página de bienvenida)
  if (window.location.hash) {
    // Si hay un hash en la URL, cargar ese contenido
    const path = window.location.hash.substring(1);
    loadContent(path);
  } else {
    // Cargar la página de bienvenida
    showWelcomePage();
  }
});

// Construir el menú de navegación
function buildNavigationMenu() {
  const navContainer = document.getElementById('main-nav');
  if (!navContainer) return;
  
  // Limpiar el contenedor
  navContainer.innerHTML = '';
  
  // Construir cada sección
  for (const [sectionKey, section] of Object.entries(navigationStructure)) {
    const sectionElement = document.createElement('div');
    sectionElement.className = 'nav-section';
    
    // Título de la sección
    const sectionTitle = document.createElement('h2');
    sectionTitle.className = 'nav-section-title';
    sectionTitle.textContent = section.title;
    sectionElement.appendChild(sectionTitle);
    
    // Elementos de la sección
    for (const [itemKey, item] of Object.entries(section.items)) {
      const navItem = document.createElement('div');
      navItem.className = 'nav-item';
      navItem.dataset.section = sectionKey;
      navItem.dataset.item = itemKey;
      navItem.textContent = item.title;
      sectionElement.appendChild(navItem);
      
      // Subelementos (si existen)
      if (item.subitems && Object.keys(item.subitems).length > 0) {
        const subNav = document.createElement('div');
        subNav.className = 'sub-nav';
        subNav.id = `${sectionKey}-${itemKey}-subnav`;
        
        for (const [subItemKey, subItemTitle] of Object.entries(item.subitems)) {
          const subNavItem = document.createElement('div');
          subNavItem.className = 'sub-nav-item';
          subNavItem.dataset.section = sectionKey;
          subNavItem.dataset.item = itemKey;
          subNavItem.dataset.subitem = subItemKey;
          subNavItem.textContent = subItemTitle;
          subNav.appendChild(subNavItem);
        }
        
        sectionElement.appendChild(subNav);
      }
    }
    
    navContainer.appendChild(sectionElement);
  }
}

// Configurar eventos de navegación
function setupNavigationEvents() {
  // Eventos para elementos del menú principal
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
      const section = this.dataset.section;
      const item = this.dataset.item;
      
      // Toggle del submenú
      const subNav = document.getElementById(`${section}-${item}-subnav`);
      if (subNav) {
        document.querySelectorAll('.sub-nav').forEach(nav => {
          if (nav !== subNav) nav.classList.remove('expanded');
        });
        subNav.classList.toggle('expanded');
      }
      
      // Cargar contenido
      const contentPath = `${section}/${item}`;
      loadContent(contentPath);
      
      // Actualizar estado activo
      document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.remove('active');
      });
      this.classList.add('active');
      
      // Actualizar hash de la URL
      window.location.hash = contentPath;
    });
  });
  
  // Eventos para subelementos
  document.querySelectorAll('.sub-nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
      e.stopPropagation(); // Evitar que se propague al menú principal
      
      const section = this.dataset.section;
      const item = this.dataset.item;
      const subitem = this.dataset.subitem;
      
      // Cargar contenido específico
      const contentPath = `${section}/${item}/${subitem}`;
      loadContent(contentPath);
      
      // Actualizar estado activo
      document.querySelectorAll('.sub-nav-item').forEach(el => {
        el.classList.remove('active');
      });
      this.classList.add('active');
      
      // Actualizar hash de la URL
      window.location.hash = contentPath;
    });
  });
}

// Cargar contenido
function loadContent(path) {
  const contentDiv = document.getElementById('content');
  if (!contentDiv) return;
  
  // Separar la ruta en componentes
  const pathParts = path.split('/');
  const section = pathParts[0];
  const item = pathParts[1];
  const subitem = pathParts[2];
  
  let contentPath = '';
  
  if (subitem) {
    // Cargar contenido específico de subitem
    contentPath = `contenido/${section}/${item}/${subitem}.html`;
  } else if (item) {
    // Cargar contenido de item
    contentPath = `contenido/${section}/${item}.html`;
  } else {
    // Cargar contenido general de sección
    contentPath = `contenido/${section}.html`;
  }
  
  // Realizar solicitud
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
      
      // Actualizar la navegación
      updateNavigationState(section, item, subitem);
    })
    .catch(error => {
      contentDiv.innerHTML = `
        <div class="card">
          <h2 class="text-primary">Contenido no disponible</h2>
          <p>El contenido para "${path}" está en desarrollo o no existe.</p>
          <p class="mt-4">Error: ${error.message}</p>
        </div>
      `;
    });
}

// Actualizar el estado de navegación
function updateNavigationState(section, item, subitem) {
  // Actualizar elementos del menú principal
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.remove('active');
    
    if (el.dataset.section === section && el.dataset.item === item) {
      el.classList.add('active');
      
      // Expandir el submenú correspondiente
      const subNav = document.getElementById(`${section}-${item}-subnav`);
      if (subNav) {
        subNav.classList.add('expanded');
      }
    }
  });
  
  // Actualizar subelementos
  if (subitem) {
    document.querySelectorAll('.sub-nav-item').forEach(el => {
      el.classList.remove('active');
      
      if (el.dataset.section === section && 
          el.dataset.item === item && 
          el.dataset.subitem === subitem) {
        el.classList.add('active');
      }
    });
  }
}

// Mostrar página de bienvenida
function showWelcomePage() {
  const contentDiv = document.getElementById('content');
  if (!contentDiv) return;
  
  contentDiv.innerHTML = `
    <div class="welcome-screen">
      <h1 class="welcome-title">Guía de Desarrollo Ingenia 2025</h1>
      <p class="welcome-subtitle">Recursos y herramientas para el desarrollo de software moderno</p>
      
      <div class="grid-container">
        <div class="card">
          <h2 class="text-primary">Contenido Destacado</h2>
          <ul class="feature-list">
            <li>Guías de herramientas modernas</li>
            <li>Metodologías ágiles</li>
            <li>Mejores prácticas</li>
            <li>Recursos interactivos</li>
          </ul>
        </div>
        
        <div class="card">
          <h2 class="text-primary">Actualizaciones Recientes</h2>
          <ul class="feature-list">
            <li>Nuevas herramientas de IA</li>
            <li>Frameworks modernos</li>
            <li>Calculadora ágil</li>
            <li>Guías de implementación</li>
          </ul>
        </div>
      </div>
      
      <p>Selecciona una sección del menú lateral para comenzar a explorar.</p>
    </div>
  `;
}
