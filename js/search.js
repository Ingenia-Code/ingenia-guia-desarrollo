// Inicializar la búsqueda
document.addEventListener('DOMContentLoaded', function() {
  initializeSearch();
});

function initializeSearch() {
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  
  if (!searchInput || !searchResults) return;
  
  // Índice de búsqueda (se construirá dinámicamente)
  let searchIndex = {};
  
  // Construir índice de búsqueda a partir de la estructura de navegación
  buildSearchIndex();
  
  // Escuchar eventos de entrada en el campo de búsqueda
  searchInput.addEventListener('input', debounce(function(e) {
    const query = e.target.value.trim().toLowerCase();
    
    if (query.length < 2) {
      searchResults.style.display = 'none';
      return;
    }
    
    const results = performSearch(query);
    displaySearchResults(results);
  }, 300));
  
  // Cerrar resultados al hacer clic fuera
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.search-container')) {
      searchResults.style.display = 'none';
    }
  });
  
  // Construir índice de búsqueda
  function buildSearchIndex() {
    // Recorrer la estructura de navegación para construir el índice
    for (const [sectionKey, section] of Object.entries(navigationStructure)) {
      for (const [itemKey, item] of Object.entries(section.items)) {
        // Añadir el elemento principal
        const itemPath = `${sectionKey}/${itemKey}`;
        searchIndex[itemPath] = {
          title: item.title,
          section: section.title,
          path: itemPath,
          keywords: `${item.title} ${section.title}`.toLowerCase()
        };
        
        // Añadir subelementos si existen
        if (item.subitems) {
          for (const [subItemKey, subItemTitle] of Object.entries(item.subitems)) {
            const subItemPath = `${sectionKey}/${itemKey}/${subItemKey}`;
            searchIndex[subItemPath] = {
              title: subItemTitle,
              section: item.title,
              path: subItemPath,
              keywords: `${subItemTitle} ${item.title} ${section.title}`.toLowerCase()
            };
          }
        }
      }
    }
    
    // Añadir términos de búsqueda adicionales para mejorar los resultados
    enrichSearchIndex();
  }
  
  // Enriquecer el índice con términos adicionales
  function enrichSearchIndex() {
    // Mapeo de términos comunes a rutas
    const additionalTerms = {
      "aws": "herramientas/cloud/cloud-aws",
      "azure": "herramientas/cloud/cloud-azure",
      "google cloud": "herramientas/cloud/cloud-gcp",
      "docker": "herramientas/cloud/cloud-docker",
      "kubernetes": "herramientas/cloud/cloud-docker",
      "k8s": "herramientas/cloud/cloud-docker",
      "devops": "herramientas/cloud/cloud-devops",
      "ci/cd": "herramientas/cloud/cloud-devops",
      "jenkins": "herramientas/cloud/cloud-devops",
      "git": "herramientas/cloud/cloud-devops",
      "github": "herramientas/cloud/cloud-devops",
      "vs code": "fundamentos/ides/ides-javascript",
      "visual studio code": "fundamentos/ides/ides-javascript",
      "visual studio": "fundamentos/ides/ides-dotnet",
      "intellij": "fundamentos/ides/ides-java",
      "pycharm": "fundamentos/ides/ides-python",
      "react": "fundamentos/frameworks/frameworks-javascript",
      "angular": "fundamentos/frameworks/frameworks-javascript",
      "vue": "fundamentos/frameworks/frameworks-javascript",
      "django": "fundamentos/frameworks/frameworks-python",
      "flask": "fundamentos/frameworks/frameworks-python",
      "fastapi": "fundamentos/frameworks/frameworks-python",
      "flutter": "fundamentos/frameworks/frameworks-mobile",
      "react native": "fundamentos/frameworks/frameworks-mobile",
      "ionic": "fundamentos/frameworks/frameworks-mobile",
      "mongodb": "fundamentos/bases-datos/bd-nosql",
      "postgresql": "fundamentos/bases-datos/bd-sql",
      "mysql": "fundamentos/bases-datos/bd-sql",
      "sqlite": "fundamentos/bases-datos/bd-sql",
      "redis": "fundamentos/bases-datos/bd-nosql",
      "neo4j": "fundamentos/bases-datos/bd-grafos",
      "influxdb": "fundamentos/bases-datos/bd-time-series",
      "jest": "herramientas/testing/testing-unit",
      "cypress": "herramientas/testing/testing-e2e",
      "selenium": "herramientas/testing/testing-e2e",
      "figma": "herramientas/diseno/diseno-ui",
      "sketch": "herramientas/diseno/diseno-ui",
      "adobe xd": "herramientas/diseno/diseno-ui",
      "miro": "herramientas/diseno/diseno-colaboracion",
      "mermaid": "colaboracion/documentacion/doc-mermaid",
      "chatgpt": "herramientas/ia/ia-chat",
      "copilot": "herramientas/ia/ia-codigo",
      "github copilot": "herramientas/ia/ia-codigo",
      "claude": "herramientas/ia/ia-chat",
      "blackbox": "herramientas/ia/ia-codigo",
      "trello": "colaboracion/gestion-proyectos/gestion-trello",
      "monday": "colaboracion/gestion-proyectos/gestion-monday",
      "linear": "colaboracion/gestion-proyectos/gestion-linear",
      "jira": "colaboracion/gestion-proyectos/gestion-otras",
      "gitbook": "colaboracion/documentacion/doc-gitbook",
      "metabase": "herramientas/diseno/diseno-diagramas",
      "graphql": "fundamentos/lenguajes/lenguajes-otros",
      "replit": "fundamentos/ides/ides-javascript",
      "dbdiagram": "colaboracion/documentacion/doc-diagramas",
      "dbdiagram.io": "colaboracion/documentacion/doc-diagramas",
      "api rest": "fundamentos/lenguajes/lenguajes-otros",
      "flutter flow": "fundamentos/frameworks/frameworks-mobile",
      "gamma": "herramientas/ia/ia-otras",
      "perplexity": "herramientas/ia/ia-chat"
    };
    
    // Añadir términos adicionales
    for (const [term, path] of Object.entries(additionalTerms)) {
      if (searchIndex[path]) {
        searchIndex[path].keywords += ` ${term}`;
      }
    }
  }
  
  // Realizar búsqueda
  function performSearch(query) {
    const results = [];
    
    // Buscar coincidencias
    for (const [path, data] of Object.entries(searchIndex)) {
      if (data.keywords.includes(query)) {
        results.push({
          title: data.title,
          section: data.section,
          path: data.path,
          relevance: calculateRelevance(query, data.keywords)
        });
      }
    }
    
    // Ordenar por relevancia
    results.sort((a, b) => b.relevance - a.relevance);
    
    // Limitar a 10 resultados
    return results.slice(0, 10);
  }
  
  // Calcular relevancia de los resultados
  function calculateRelevance(query, keywords) {
    // Relevancia básica basada en el número de coincidencias
    const occurrences = (keywords.match(new RegExp(query, 'g')) || []).length;
    
    // Relevancia adicional si el término está al principio
    const startBonus = keywords.startsWith(query) ? 5 : 0;
    
    // Relevancia adicional si el término es exacto
    const exactBonus = keywords.includes(` ${query} `) ? 3 : 0;
    
    return occurrences + startBonus + exactBonus;
  }
  
  // Mostrar resultados
  function displaySearchResults(results) {
    if (results.length === 0) {
      searchResults.style.display = 'none';
      return;
    }
    
    // Limpiar resultados anteriores
    searchResults.innerHTML = '';
    
    // Añadir nuevos resultados
    results.forEach(result => {
      const resultItem = document.createElement('div');
      resultItem.className = 'search-result-item';
      resultItem.innerHTML = `
        <div>${result.title}</div>
        <div style="font-size: 0.8rem; color: var(--light-text);">${result.section}</div>
      `;
      
      // Añadir evento de clic
      resultItem.addEventListener('click', function() {
        window.location.hash = result.path;
        searchResults.style.display = 'none';
        searchInput.value = '';
      });
      
      searchResults.appendChild(resultItem);
    });
    
    // Mostrar resultados
    searchResults.style.display = 'block';
  }
  
  // Función de debounce para evitar muchas búsquedas
  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
}
