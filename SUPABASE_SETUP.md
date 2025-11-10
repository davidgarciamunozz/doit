# Configuración de Supabase para Recetas

## Pasos para configurar la base de datos

### 1. Crear la tabla de recetas

Para que la funcionalidad de recetas funcione correctamente, necesitas ejecutar la migración SQL en tu base de datos de Supabase.

#### Opción A: Usar el SQL Editor en Supabase Dashboard

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Navega a **SQL Editor** en el menú lateral
3. Haz clic en **New Query**
4. Copia y pega el contenido del archivo `supabase/migrations/create_recipes_table.sql`
5. Haz clic en **Run** para ejecutar la migración

#### Opción B: Usar Supabase CLI (si lo tienes instalado)

```bash
# Desde la raíz del proyecto
supabase db push
```

### 2. Verificar la tabla

Después de ejecutar la migración, verifica que la tabla se haya creado correctamente:

1. Ve a **Table Editor** en Supabase Dashboard
2. Deberías ver la tabla `recipes` con las siguientes columnas:
   - `id` (uuid, primary key)
   - `user_id` (uuid, foreign key)
   - `title` (text)
   - `ingredients` (text)
   - `portion_size` (text)
   - `price` (text)
   - `preparation_time` (text)
   - `instructions` (text[])
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

### 3. Políticas de seguridad (RLS)

La migración ya incluye las políticas de Row Level Security (RLS) para que:

- Los usuarios solo puedan ver sus propias recetas
- Los usuarios solo puedan crear, actualizar y eliminar sus propias recetas

## Funcionalidades implementadas

✅ **Crear recetas**: Navega a `/dashboard/recipes` y haz clic en "Add new recipe"
✅ **Listar recetas**: Las recetas se cargan automáticamente desde Supabase
✅ **Almacenamiento seguro**: Cada usuario solo puede ver y manipular sus propias recetas
✅ **Validación**: Los campos requeridos son validados en el formulario
✅ **Feedback visual**: Notificaciones toast para éxito/error

## Estructura de datos

```typescript
interface Recipe {
  id?: string;
  title: string;
  ingredients: string;
  portion_size: string;
  price: string;
  preparation_time: string;
  instructions?: string[];
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}
```

## Próximos pasos opcionales

- [ ] Implementar búsqueda de recetas
- [ ] Agregar funcionalidad de edición
- [ ] Agregar funcionalidad de eliminación
- [ ] Agregar imágenes a las recetas
- [ ] Implementar categorías de recetas
