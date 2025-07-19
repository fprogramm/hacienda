# Archivos duplicados que deben eliminarse

Los siguientes archivos están duplicados y causan conflictos de importación:

## ❌ ELIMINAR (archivos viejos):
- `src/components/Header.tsx`
- `src/components/HeaderMenu.tsx`
- `src/components/ThemedText.tsx`
- `src/components/ThemedView.tsx`

## ✅ MANTENER (archivos nuevos en estructura organizada):
- `src/components/common/Header.tsx`
- `src/components/common/HeaderMenu.tsx`
- `src/components/ui/ThemedText.tsx`
- `src/components/ui/ThemedView.tsx`

## Error actual:
```
Unable to resolve "@/utils/errorHandler" from "src\components\HeaderMenu.tsx"
```

**Causa:** El archivo viejo `src/components/HeaderMenu.tsx` tiene importaciones incorrectas y está siendo encontrado por el bundler antes que el archivo correcto.

**Solución:** Eliminar los archivos duplicados de la raíz de `src/components/`.
