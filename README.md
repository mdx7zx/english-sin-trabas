# English Sin Trabas

Aplicación web responsive para recuperar las bases del inglés, construir frases directamente en el idioma y practicar listening, speaking, writing, reading y conversación.

## Ejecutar localmente

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Verificaciones

```bash
npm run lint
npm run typecheck
npm run build
```

## Contenido y extensiones

- Nuevas lecciones y unidades: `data/lessons.ts`
- Nuevos verbos y ejemplos: `data/verbs.ts`
- Retos de práctica: `data/practice.ts`
- Contratos de IA: `services/ai/types.ts`
- Implementación simulada de IA: `services/ai/mock-ai-service.ts`
- Voz del navegador: `services/speech/browser-speech-service.ts`
- Contratos de voz: `services/speech/types.ts`
- Persistencia local: `components/providers/progress-provider.tsx`

## Variables de entorno

Copia `.env.example` a `.env.local` y reemplaza los valores con el objeto de configuración que Firebase muestra al registrar una aplicación web:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=tu-app-id
```

Esta configuración identifica la aplicación web y puede estar en el navegador. La protección de los datos depende de Firebase Authentication y de las reglas de Firestore incluidas en el proyecto.

## Activar cuentas y guardado en la nube

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/) y registra una aplicación web.
2. En **Authentication**, habilita el proveedor **Correo electrónico/contraseña**.
3. Crea una base de datos **Cloud Firestore** en modo producción.
4. En la pestaña **Rules** de Firestore, pega el contenido de `firestore.rules` y pulsa **Publish**.
5. Copia `.env.example` como `.env.local`, agrega la configuración de la aplicación web y reinicia `npm run dev`.
6. Abre el botón de perfil de la aplicación y crea una cuenta.

Al crear la primera cuenta, el progreso existente en el navegador se migra automáticamente. Después, cada usuario conserva una copia local independiente y una copia sincronizada en Cloud Firestore.

## Estado de las integraciones

- Text-to-Speech: funcional mediante `SpeechSynthesis` del navegador.
- Speech-to-Text: funcional cuando el navegador expone `SpeechRecognition`; hay entrada manual de respaldo.
- Tutor conversacional y análisis: implementación mock determinista, preparada para sustituirse por un proveedor real.
- Datos: respaldo local y sincronización automática por usuario mediante Cloud Firestore.
- Autenticación: registro, inicio y cierre de sesión por correo y contraseña.
