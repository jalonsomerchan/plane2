# AGENTS.md

## Regla principal

Este repositorio usa una base frontend con HTML, JavaScript, Vite y Tailwind CSS. Debe mantenerse ligera, modular, mantenible, accesible y preparada para desplegarse correctamente tanto en la raíz de un dominio como en una subruta.

Las reglas de este archivo son obligatorias. Todo agente, asistente IA o automatización que modifique este repositorio debe leerlas, aplicarlas y comprobarlas antes de terminar cualquier tarea.

Antes de modificar HTML, JavaScript, CSS, assets, rutas, tests, documentación, CI o despliegue, el agente debe consultar estas guías cuando existan:

- `docs/design-system.md`
- `docs/template-usage.md`
- `docs/deployment-guide.md`
- `docs/testing-guide.md`

## Prioridad

Estas instrucciones tienen prioridad sobre patrones antiguos, preferencias implícitas o soluciones rápidas, salvo que el usuario indique expresamente lo contrario.

Si existe conflicto entre una tarea y estas reglas, el agente debe cumplir la petición del usuario en la medida posible, mantener el proyecto pequeño, modular y fácil de reutilizar, y explicar cualquier excepción relevante en el resumen final.

## Principios obligatorios

- Mobile first.
- Diseño profesional, limpio, moderno y vistoso.
- Soporte correcto para light mode y dark mode cuando se añadan componentes nuevos.
- No usar fuentes externas de Google Fonts, Adobe Fonts ni CDNs similares.
- Usar system fonts.
- Evitar dependencias innecesarias.
- Cuidar Core Web Vitals.
- HTML semántico.
- Buen SEO técnico.
- Accesibilidad mínima WCAG AA.
- JavaScript modular con ES Modules.
- Componentes o funciones reutilizables cuando exista repetición.
- Variables CSS globales para colores, radios, sombras, espaciados y transiciones cuando aplique.
- Mantener compatibilidad con despliegues en dominio raíz (`/`) y en subruta (`/nombre-del-repositorio/` o similar).
- Mantener la configuración de Vite compatible con rutas relativas o `base` cuando aplique.
- Mantener checks simples y útiles: lint, format check y build.
- Mantener los ficheros lo más pequeños posible.
- Dividir el código por responsabilidad cuando un fichero crezca demasiado.
- Seguir estándares de calidad, legibilidad, modularidad y mantenibilidad.

## Reglas obligatorias para agentes e IA

Todo agente IA debe aplicar estas reglas en cualquier cambio:

1. Respetar siempre este archivo y la documentación de `docs/`.
2. No generar soluciones monolíticas si pueden dividirse en módulos, helpers, constantes o piezas pequeñas.
3. No añadir dependencias si la solución puede hacerse razonablemente con HTML, CSS, JavaScript, Tailwind, Vite o APIs nativas del navegador.
4. No romper rutas con `base`, despliegues en raíz/subruta, SEO básico, accesibilidad ni checks existentes.
5. No eliminar checks para ocultar problemas: corregir el código o actualizar la validación de forma robusta.
6. No duplicar lógica entre páginas, componentes o módulos si puede centralizarse.
7. No crear ficheros grandes por comodidad; preferir piezas pequeñas con nombres claros.
8. Documentar cualquier convención nueva que afecte al uso del proyecto.
9. Mantener `index.html` limpio: estructura semántica, pocos scripts y sin lógica compleja inline.
10. Mantener `src/js/` para lógica JavaScript, `src/css/` para estilos globales y `src/assets/` para assets fuente.

## Reglas obligatorias para crear issues

Cuando un agente IA cree issues en este repositorio, cada issue debe incluir siempre un prompt accionable para solucionarla.

Ese prompt debe cumplir estas condiciones:

- Hacer referencia explícita a este repositorio e incluir su URL.
- Explicar con claridad qué problema, mejora o tarea debe resolverse.
- Indicar que la solución debe respetar todas las condiciones de este `AGENTS.md`.
- Indicar que se deben mantener ficheros pequeños, modularidad, accesibilidad, SEO, rendimiento y compatibilidad con dominio raíz, subrutas y GitHub Pages cuando aplique.
- Pedir que se actualicen checks y documentación cuando el cambio lo requiera.
- Evitar instrucciones ambiguas sin contexto suficiente.

Formato recomendado:

```md
## Prompt para resolver esta issue

Trabaja en este repositorio: [añade aquí la URL del repositorio].

Resuelve esta issue manteniendo todas las condiciones descritas en `AGENTS.md`: ficheros lo más pequeños posible, código modular, HTML semántico, JavaScript limpio con ES Modules, accesibilidad, SEO, rendimiento, compatibilidad con dominio raíz (`/`), subrutas (`/nombre-del-repositorio/`) y GitHub Pages cuando aplique, además de checks útiles.

[Describe aquí la tarea concreta, el comportamiento esperado y los ficheros o zonas afectadas si se conocen.]

Actualiza checks y documentación si el cambio modifica comportamiento, arquitectura, rutas, estilos, scripts o convenciones del proyecto.
```

Toda issue creada por IA debe ser lo bastante clara como para que otro agente pueda resolverla sin pedir contexto adicional.

Si el usuario pide crear varias issues, cada issue debe ser independiente, accionable y resoluble por otro agente sin depender de contexto externo no incluido en la propia issue.

Si una tarea es grande, dividirla en varias issues o PRs pequeñas, cada una con un objetivo verificable.

## Reglas para trabajar con GitHub API

Cuando un agente IA trabaje con este repositorio mediante GitHub API, debe priorizar cambios pequeños, trazables y fáciles de revisar.

### Antes de modificar código

El agente debe:

1. Identificar la rama base correcta, normalmente `main`.
2. Revisar la estructura del repositorio antes de proponer cambios.
3. Leer los ficheros relevantes antes de editarlos.
4. Comprobar si ya existe una issue, PR o rama relacionada.
5. Evitar cambios masivos si la tarea puede resolverse con cambios pequeños.

### Ramas y pull requests

- Crear una rama nueva por cada tarea o grupo de tareas relacionadas.
- Usar nombres de rama descriptivos, por ejemplo `fix-base-paths`, `improve-mobile-navigation` o `split-app-modules`.
- No trabajar directamente sobre `main`, salvo que el usuario lo pida expresamente.
- Abrir una PR con resumen claro de cambios.
- La PR debe indicar qué se ha cambiado, por qué, qué ficheros principales se han tocado, cómo probarlo y si se han actualizado checks o documentación.

### Commits

- Hacer commits pequeños y coherentes.
- No mezclar cambios no relacionados en el mismo commit.
- Usar mensajes de commit claros, en imperativo y con contexto.
- Evitar commits genéricos como `fix`, `changes`, `update` o `wip`.

### Edición de ficheros

- Leer siempre el fichero actual antes de actualizarlo.
- No sobrescribir ficheros enteros si basta con un cambio localizado.
- Conservar estilo, estructura y convenciones existentes.
- Evitar reordenar código sin necesidad, porque dificulta revisar el diff.
- No borrar comentarios útiles, documentación o checks salvo que estén obsoletos y se justifique.

### Pull requests creadas mediante GitHub API

Toda PR creada por IA debe incluir:

```md
## Cambios

- [Cambio principal 1]
- [Cambio principal 2]

## Motivo

[Explica por qué se hizo el cambio.]

## Cómo probarlo

```sh
npm ci
npm run lint
npm run format:check
npm run build
```

## Notas

[Indica limitaciones, decisiones técnicas o cosas no verificadas.]
```

### Búsquedas y contexto

Cuando el agente necesite entender el proyecto, debe buscar primero por:

- IDs o clases usadas en HTML,
- módulos de `src/js/`,
- estilos globales de `src/css/`,
- assets en `src/assets/`,
- scripts de `package.json`,
- configuración de Vite, ESLint o GitHub Actions.

No debe asumir que un fichero existe sin comprobarlo.

### Seguridad

- No incluir tokens, secretos, claves API ni credenciales en commits, issues o PRs.
- No imprimir valores de variables de entorno sensibles.
- No crear ficheros `.env` reales; usar `.env.example` para documentación.
- No añadir permisos amplios a workflows de GitHub Actions si no son necesarios.
- No modificar configuración de despliegue sin explicar el impacto.

### Automatización y CI

- Si se toca código fuente, intentar mantener o actualizar checks.
- Si se toca routing o assets, comprobar compatibilidad con `base`, dominio raíz, subrutas y GitHub Pages.
- Si se toca UI, comprobar responsive, dark mode y accesibilidad básica.
- Si no se pueden ejecutar checks, indicarlo claramente en la PR.

## Tamaño y modularidad de ficheros

Los ficheros deben mantenerse lo más pequeños posible sin sacrificar claridad.

Buenas prácticas obligatorias:

- Un fichero debe tener una responsabilidad principal.
- Extraer constantes compartidas a `src/js/config/` o un módulo equivalente.
- Extraer helpers reutilizables a `src/js/utils/` o módulos propios.
- Evitar duplicar bloques grandes de HTML, CSS o JavaScript.
- Evitar módulos con demasiada lógica interna.
- Mantener los estilos globales para tokens, resets y utilidades realmente globales.
- Mantener estilos específicos cerca de su módulo cuando sea más claro.

Guía orientativa:

- Si un módulo JavaScript supera aproximadamente 200 líneas, valorar dividirlo.
- Si un helper mezcla varias responsabilidades, separarlo.
- Si `index.html` contiene mucha UI repetible o lógica inline, mover lógica a `src/js/`.
- Si una lista de datos crece, moverla a un fichero de datos o configuración.

La prioridad es claridad, reutilización y mantenimiento.

## Rutas, assets y despliegue

El proyecto debe funcionar tanto en raíz de dominio como en subruta.

Ejemplos válidos:

```txt
https://example.com/
https://example.com/proyecto/
https://usuario.github.io/nombre-repo/
```

No crear enlaces internos o assets con rutas absolutas duras tipo `/archivo.svg`, `/src/...`, `/assets/...` o `/ruta/` si deben respetar `base` o funcionar dentro de una subcarpeta.

En Vite, para recursos procesados por el bundler, preferir imports desde JavaScript o rutas relativas válidas. Para assets públicos, usar rutas compatibles con `base`.

Antes de terminar cualquier cambio que afecte a rutas, assets, navegación, manifest, canonical, Open Graph o enlaces internos, comprobar mentalmente ambos escenarios:

- dominio raíz: `base = '/'`.
- subruta: `base = '/nombre-del-repositorio/'`.

## Estándares de calidad

Todo cambio debe cumplir estos estándares:

- Código claro, simple y fácil de revisar.
- Nombres descriptivos para funciones, constantes, módulos, clases CSS y ficheros.
- Sin lógica duplicada innecesaria.
- Sin código muerto, comentarios obsoletos ni checks desactivados sin motivo.
- Sin hacks frágiles si existe una solución estable.
- Sin dependencias pesadas para tareas simples.
- Accesibilidad básica: labels, textos alternativos, foco visible, contraste y estructura semántica.
- SEO básico: título, descripción, canonical cuando aplique, Open Graph y HTML bien estructurado.
- Rendimiento: evitar assets pesados, scripts innecesarios y bloqueos de render.

## Arquitectura actual

La base del proyecto usa:

- HTML estático.
- JavaScript ES Modules.
- Vite.
- Tailwind CSS 4 mediante `@tailwindcss/vite`.
- ESLint.
- Prettier.
- GitHub Actions para CI.

## Estructura importante

- `index.html`: documento base, SEO inicial y estructura semántica.
- `src/js/app.js`: entrada principal JavaScript.
- `src/css/main.css`: Tailwind y estilos globales.
- `src/assets/`: assets fuente del proyecto.
- `package.json`: scripts y dependencias.
- `eslint.config.js`: reglas de lint.
- `.github/workflows/ci.yml`: checks de calidad y build.

## Checklist antes de terminar una tarea

- ¿Se han aplicado las reglas de este `AGENTS.md`?
- ¿El proyecto sigue funcionando en `/`?
- ¿El proyecto sigue funcionando en `/nombre-del-repositorio/` o subruta equivalente?
- ¿Las rutas internas y assets evitan rutas absolutas duras que rompan en subruta?
- ¿La UI sigue siendo responsive?
- ¿Hay HTML semántico y accesible?
- ¿Los ficheros modificados siguen siendo pequeños y con una responsabilidad clara?
- ¿Se ha evitado duplicar lógica o UI?
- ¿El cambio respeta `docs/design-system.md` si existe?
- ¿El código cumple estándares de calidad, accesibilidad, SEO y rendimiento?
- ¿Se mantiene `npm run lint` como comprobación básica?
- ¿Se mantiene `npm run build` como comprobación básica?
- ¿Se actualizó la documentación si cambió una convención?

## Comandos útiles

```sh
npm ci
npm run dev
npm run lint
npm run format:check
npm run build
npm run preview
```

## Qué evitar

- Convertir el proyecto en algo difícil de reutilizar o mantener.
- Añadir frameworks de UI pesados sin necesidad.
- Usar rutas absolutas que fallen en despliegues con subruta o GitHub Pages.
- Borrar checks porque parezcan simples.
- Usar fuentes externas.
- Añadir JavaScript si HTML/CSS lo resuelve bien.
- Crear ficheros enormes con varias responsabilidades.
- Crear issues sin prompt accionable para resolverlas.
- Ignorar este archivo por rapidez.
