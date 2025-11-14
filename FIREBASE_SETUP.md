# Configuración de Firebase Realtime Database

## Problema: Error permission_denied

Si recibes el error `permission_denied` al intentar acceder a los datos, necesitas configurar las reglas de seguridad en Firebase Console.

## Pasos para configurar las reglas

### 1. Accede a Firebase Console
- Ve a: https://console.firebase.google.com/
- Selecciona tu proyecto: **player-86149**

### 2. Navega a Realtime Database
- En el menú lateral, ve a **Realtime Database**
- Haz clic en la pestaña **Reglas**

### 3. Configura las reglas

#### Para Desarrollo (Permisivos)
Copia y pega estas reglas en el editor de reglas:

```json
{
  "rules": {
    "canciones": {
      ".read": true,
      ".write": true
    }
  }
}
```

#### Para Producción (Recomendado)
Usa estas reglas más seguras que incluyen validaciones:

```json
{
  "rules": {
    "canciones": {
      "$cancionId": {
        ".read": true,
        ".write": true,
        ".validate": "newData.hasChildren(['artista', 'genero', 'album', 'anioLanzamiento', 'enlaceSpotify'])",
        "artista": {
          ".validate": "newData.isString() && newData.val().length >= 2"
        },
        "genero": {
          ".validate": "newData.isString() && newData.val().length > 0"
        },
        "album": {
          ".validate": "newData.isString() && newData.val().length > 0"
        },
        "anioLanzamiento": {
          ".validate": "newData.isNumber() && newData.val() >= 1900 && newData.val() <= 2100"
        },
        "enlaceSpotify": {
          ".validate": "newData.isString() && newData.val().matches(/^https:\\/\\/open\\.spotify\\.com\\/.*/)"
        },
        "$other": {
          ".validate": false
        }
      }
    }
  }
}
```

### 4. Publica las reglas
- Haz clic en **Publicar** para aplicar los cambios

## Nota de Seguridad

⚠️ **IMPORTANTE**: Las reglas de desarrollo permiten acceso público completo. 
- Úsalas solo para desarrollo y pruebas
- Para producción, considera implementar autenticación de usuarios
- Las reglas de producción incluyen validaciones de datos

## Reglas con Autenticación (Recomendado para Producción)

Si quieres implementar autenticación más adelante, puedes usar estas reglas:

```json
{
  "rules": {
    "canciones": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

Esto requiere que los usuarios estén autenticados para leer y escribir datos.

