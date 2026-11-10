# Sitio web INTEGRA SALUD PREVENTIVA IPS SAS

Sitio institucional y comercial de una sola página. Presenta **Consulta externa, Home Care y Atención extramural** como tres líneas con el mismo protagonismo. Está hecho con HTML, CSS y JavaScript puros: no requiere instalar nada ni compilar.

## Contenido del proyecto

```
integra-ips/
├── index.html          Sitio completo (9 secciones)
├── styles.css          Diseño, colores, tipografía y adaptación a celular/tableta
├── script.js           Menú, animaciones, pestañas, formulario y CONFIGURACIÓN
├── README.md           Este archivo
├── CREDITOS-FOTOS.md   Origen y licencia de cada fotografía
├── .htaccess           HTTPS obligatorio y cabeceras de seguridad (hosting Apache)
├── robots.txt
├── api/solicitud.php   Receptor de formularios de referencia (PHP, opcional)
├── herramientas/optimizar_imagenes.py   Para optimizar fotos nuevas
└── assets/img/
    ├── logo.png / logo-vertical.jpg       Logotipos oficiales
    ├── favicon.png / apple-touch-icon.png Íconos del sitio
    ├── unidad-movil.jpg                   Unidad Móvil institucional aprobada (corregida)
    ├── consulta-especializada(-2).jpg     Consulta externa
    ├── homecare-1 a homecare-4.jpg        Home Care
    ├── extramural.jpg / extramural-2.jpg  Atención extramural
    ├── educacion-salud.jpg                Promoción y prevención
    ├── presentacion-inicial.jpg / atencion-inicial.jpg   Quiénes somos
    └── portada.jpg / terapias.jpg / citas.jpg   Fotografías de referencia (Unsplash)
```

### Secciones (menú superior)

| Sección | Ancla | Contenido |
|---|---|---|
| Inicio | `#inicio` | Portada con fotografía, mensaje institucional, 3 accesos y tarjetas de las líneas |
| Quiénes somos | `#nosotros` | Presentación institucional |
| Misión, visión y valores | `#mision` | Misión, visión y 7 valores institucionales |
| Consulta externa | `#consulta-externa` | 6 especialidades, terapias y toma de muestras |
| Home Care | `#home-care` | Modelo de acompañamiento, continuidad del cuidado y orientación a familias |
| Atención extramural | `#extramural` | Unidad Móvil, 8 servicios, promoción y prevención |
| Transparencia | `#transparencia` | 5 categorías en pestañas |
| Solicitud de citas | `#citas` | Formulario completo con autorización de datos |
| Contacto | `#contacto` | Dirección, teléfonos, correo, mapa y cobertura |

## 1. Ver el sitio

- **Opción rápida:** abra `index.html` con doble clic en Chrome, Edge o Firefox.
- **Servidor local (recomendado):** en una terminal, dentro de la carpeta del proyecto, ejecute `python -m http.server 8000` y abra http://localhost:8000.

El mapa de Google y las tipografías necesitan conexión a internet.

## 2. Funciones que requieren conexión o validación antes de publicar

| Función | Estado actual | Qué hacer |
|---|---|---|
| **Formulario de citas** | Valida los datos, pero **no envía nada**. Al presionar «Enviar» informa que aún no está conectado y ofrece teléfonos y correo. | Conectar un receptor seguro (ver punto 3) y escribir su URL en `formEndpoint` de `script.js`. |
| **Botón de WhatsApp** | Oculto. | Escribir el número institucional **autorizado** en `whatsapp` de `script.js` (ej. `"573001234567"`). Aparecen un botón flotante y una tarjeta en Contacto. |
| **Misión, visión y valores** | Publicados con redacción institucional y los 7 valores definidos. | Ajustar en `index.html` si la IPS adopta otra redacción. |
| **Transparencia** | NIT, sede, contacto y horario publicados. Documentos marcados «Próximamente». No se publican códigos de habilitación ni datos del representante legal. | Cargar los PDF aprobados en `assets/docs/` y enlazarlos (punto 4). |
| **Horario** | Se publica «7:00 a. m. a 7:00 p. m.». | Si se confirma que es de lunes a sábado, buscar «7:00 a. m. a 7:00 p. m.» en `index.html` (aparece en Contacto, Transparencia y pie de página) y anteponer «Lunes a sábado,». |
| **Servicios y modalidades de Home Care** | Descritos como modelo de atención, sin modalidades específicas. | Confirmar los servicios domiciliarios habilitados. |
| **Política de tratamiento de datos** | Mencionada en el formulario. | Publicar el documento oficial y enlazarlo. |



> El sitio no incluye habilitaciones, certificaciones, contratos, cifras, testimonios ni alianzas inventadas.

## 3. Conectar el formulario de forma segura

Al inicio de `script.js`:

```js
var INTEGRA_CONFIG = {
  formEndpoint: "",   // ← URL HTTPS del receptor de solicitudes
  whatsapp: "",       // ← número autorizado, solo dígitos con 57
  ...
};
```

Hay tres opciones, de la más recomendada a la menos recomendada para datos de salud:

1. **Sistema institucional** (software de agendamiento, CRM o API propia) con control de acceso y registro de la autorización de datos.
2. **`api/solicitud.php`** (incluido): valida y reenvía la solicitud por correo. Edite las constantes al inicio del archivo (dominio, correo de destino y remitente) y use `formEndpoint: "api/solicitud.php"`. Requiere hosting con PHP 8 o superior y HTTPS.
3. **Servicio externo de formularios**, solo si la IPS firma con el proveedor un acuerdo de tratamiento de datos.

El formulario envía JSON con estos campos: `tipo_documento, numero_documento, nombres, apellidos, telefono, correo, departamento, municipio, tipo_solicitud, eps, linea, servicio, fecha_preferida, jornada, observaciones, autorizacion_datos`.

## 4. Publicar documentos de Transparencia

1. Copie el PDF a `assets/docs/` (por ejemplo `politica-datos.pdf`).
2. En `index.html`, dentro de la pestaña correspondiente, reemplace `<span class="doc__soon">Próximamente</span>` del documento por:
   ```html
   <a class="doc__dl" href="assets/docs/politica-datos.pdf" target="_blank" rel="noopener">Descargar PDF</a>
   ```

## 5. Publicar el sitio en internet

**Hosting con cPanel** (permite usar `api/solicitud.php`):
1. Suba todo el contenido de la carpeta a `public_html/` con el Administrador de archivos o por FTP.
2. Active el certificado SSL gratuito (AutoSSL / Let's Encrypt).
3. Configure el formulario como se indica en el punto 3.

**Netlify, Vercel o Cloudflare Pages** (gratuitos, sin PHP):
1. Cree una cuenta y arrastre la carpeta del proyecto a «Deploy manually».
2. Conecte el dominio de la IPS desde el panel. El HTTPS se activa solo.
3. Para el formulario, use la opción 1 o 3 del punto 3.

**Dominio:** apunte los DNS del dominio de la IPS al hosting elegido, según las instrucciones del proveedor.

### Lista de verificación final
- [ ] Textos institucionales revisados por la IPS
- [ ] Formulario conectado y probado con un envío real
- [ ] Número de WhatsApp autorizado configurado (si aplica)
- [ ] Política de tratamiento de datos publicada
- [ ] HTTPS activo
- [ ] Revisión en celular, tableta y computador
- [ ] `robots.txt` actualizado con la URL real

## 6. Cambiar fotografías

Reemplace el archivo en `assets/img/` **con el mismo nombre**. Para optimizar fotos nuevas:

```
pip install Pillow
python herramientas/optimizar_imagenes.py CARPETA_CON_ORIGINALES
```

Se recomienda conseguir versiones de mayor resolución del logotipo (PNG transparente o SVG) y de la imagen de la Unidad Móvil.

## Identidad visual

| Uso | Color |
|---|---|
| Azul oscuro (índigo del logo) | `#2F3B78` / `#1A2155` |
| Azul turquesa (isotipo) | `#1CB6EC` |
| Púrpura / lavanda (isotipo) | `#6656B0` / `#8D7FC4` |
| Blanco | `#FFFFFF` |

Tipografías: Sora (títulos) y DM Sans (textos), de Google Fonts.
