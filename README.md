
# 🚀 Automation Sandbox E-commerce

Este es un entorno de pruebas e-commerce diseñado específicamente para ingenieros de QA y desarrolladores que desean practicar automatización de pruebas (Selenium, Cypress, Playwright).

## 🌐 Live Demo
[Inserta aquí tu link de GitHub Pages una vez desplegado]

## ✨ Características para QA
- **Locadores Estables**: Todos los elementos críticos tienen `id` únicos o atributos `data-testid`.
- **Flujos Completos**: Registro, Login, Carrito de compras, Filtros de búsqueda y Checkout.
- **Sin Dependencias de Backend**: Funciona totalmente en el navegador para pruebas rápidas y deterministas.
- **Panel de Casos de Prueba**: Incluye una guía interactiva con 6 casos de prueba base.

## 🔍 Guía de Locadores (Locators)
Para tus scripts de automatización, utiliza los siguientes selectores recomendados:

| Elemento | Tipo de Selector | Valor |
|----------|-----------------|-------|
| Botón Login | ID | `nav-login` |
| Input Usuario | ID | `login-username` |
| Input Password | ID | `login-password` |
| Search Bar | ID | `search-input` |
| Botón Add to Cart | ID | `btn-add-to-cart-{id}` |
| Badge del Carrito | ID | `cart-badge` |
| Formulario Registro | ID | `register-form` |
| Botón Checkout | ID | `btn-checkout` |

## 🛠️ Tecnologías
- **React 19** (vía ESM.sh)
- **Tailwind CSS** (Estilizado)
- **Lucide React** (Iconografía)
- **TypeScript** (Tipado estricto)

## 🚀 Despliegue Local
1. Clona este repositorio o descarga los archivos.
2. Abre `index.html` en cualquier navegador moderno.
3. No requiere `npm install` ni compilación manual gracias a la arquitectura basada en módulos ES6.

## 📝 Casos de Prueba Incluidos
1. **TC-001**: Login Exitoso.
2. **TC-002**: Añadir producto al carrito.
3. **TC-003**: Eliminar producto del carrito.
4. **TC-004**: Validación de formulario de checkout.
5. **TC-005**: Filtro por categorías.
6. **TC-006**: Registro de nuevo usuario.

---
Creado para la comunidad de QA Automation. ¡Feliz testing! 🧪
