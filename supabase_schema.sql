-- =====================================================================
-- SCRIPT DE INICIALIZACIÓN DE BASE DE DATOS (POSTGRESQL / SUPABASE)
-- PROYECTO: Nuestro Espacio - Panel de Control Compartido de Pareja
-- AUTOR: DBA & Arquitecto de Software
-- FECHA: 2026-06-17
-- =====================================================================

-- Habilitar extensiones recomendadas para IDs únicos UUID en el futuro
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================================
-- 1. TABLAS MAESTRAS Y CONFIGURACIÓN DEL SISTEMA
-- =====================================================================

-- Tabla para parejas (preparando multi-inquilino / multi-pareja para el futuro)
CREATE TABLE IF NOT EXISTS parejas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_1 VARCHAR(100) NOT NULL,
    nombre_2 VARCHAR(100) NOT NULL,
    fecha_aniversario DATE,
    plan_suscripcion VARCHAR(50) DEFAULT 'Premium',
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE parejas IS 'Almacena la información de las parejas registradas para soportar escalabilidad multi-usuario.';

-- Tabla Maestra de Módulos Dinámicos
CREATE TABLE IF NOT EXISTS modulos_config (
    id SERIAL PRIMARY KEY,
    key_modulo VARCHAR(50) UNIQUE NOT NULL,
    nombre_menu VARCHAR(100) NOT NULL,
    icono VARCHAR(50) NOT NULL,
    ruta_url VARCHAR(255) NOT NULL,
    activo BOOLEAN DEFAULT true,
    temporal BOOLEAN DEFAULT false,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE modulos_config IS 'Configuración dinámica para activar/desactivar módulos visuales en la interfaz.';
COMMENT ON COLUMN modulos_config.key_modulo IS 'Clave identificadora única del módulo (ej: "compra", "boda", "finanzas").';
COMMENT ON COLUMN modulos_config.activo IS 'Controla si el módulo se renderiza en la barra de navegación lateral y el menú móvil.';

-- =====================================================================
-- 2. TABLAS DE DATOS INDEPENDIENTES (MÓDULOS DE LA APLICACIÓN)
-- =====================================================================

-- Módulo: Lista de la Compra (compra)
CREATE TABLE IF NOT EXISTS compras (
    id SERIAL PRIMARY KEY,
    pareja_id UUID REFERENCES parejas(id) ON DELETE CASCADE, -- Clave foránea opcional preparada
    nombre VARCHAR(255) NOT NULL,
    cantidad INT DEFAULT 1 CHECK (cantidad > 0),
    categoria VARCHAR(100) DEFAULT 'Supermercado',
    completado BOOLEAN DEFAULT false,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE compras IS 'Almacena los artículos de la lista de compra compartida de la pareja.';

-- Módulo: Organizador de la Boda (boda)
CREATE TABLE IF NOT EXISTS boda_tareas (
    id SERIAL PRIMARY KEY,
    pareja_id UUID REFERENCES parejas(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    categoria VARCHAR(100) DEFAULT 'Logística',
    completado BOOLEAN DEFAULT false,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE boda_tareas IS 'Tareas específicas relacionadas con la planificación de la boda de la pareja.';

-- Módulo: Finanzas Compartidas (finanzas)
CREATE TABLE IF NOT EXISTS finanzas_gastos (
    id SERIAL PRIMARY KEY,
    pareja_id UUID REFERENCES parejas(id) ON DELETE CASCADE,
    descripcion VARCHAR(255) NOT NULL,
    monto NUMERIC(10, 2) NOT NULL CHECK (monto > 0.00),
    pagador VARCHAR(100) NOT NULL, -- Ej: 'Isra' o 'Lidia'
    fecha_gasto DATE DEFAULT CURRENT_DATE,
    -- Columnas preparadas para relaciones futuras (Interconexión)
    boda_tarea_id INT REFERENCES boda_tareas(id) ON DELETE SET NULL, -- Permite asociar un gasto a una tarea de boda
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE finanzas_gastos IS 'Registro detallado de los gastos del mes divididos 50/50 entre la pareja.';
COMMENT ON COLUMN finanzas_gastos.boda_tarea_id IS 'Enlace opcional que conecta un gasto de finanzas a una tarea específica del organizador de bodas.';

-- Cuentas Bancarias
CREATE TABLE IF NOT EXISTS finanzas_cuentas (
    id SERIAL PRIMARY KEY,
    pareja_id UUID REFERENCES parejas(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    saldo_inicial NUMERIC(10, 2) DEFAULT 0.00,
    color VARCHAR(20) DEFAULT '#4A8B8B',
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE finanzas_cuentas IS 'Cuentas bancarias de la pareja con sus saldos iniciales.';

-- Categorías Financieras (Gastos e Ingresos)
CREATE TABLE IF NOT EXISTS finanzas_categorias (
    id SERIAL PRIMARY KEY,
    pareja_id UUID REFERENCES parejas(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('gasto', 'ingreso')),
    icono VARCHAR(50) DEFAULT 'payments',
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE finanzas_categorias IS 'Categorías para clasificar transacciones (gastos o ingresos).';

-- Subcategorías Financieras
CREATE TABLE IF NOT EXISTS finanzas_subcategorias (
    id SERIAL PRIMARY KEY,
    categoria_id INT REFERENCES finanzas_categorias(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE finanzas_subcategorias IS 'Subcategorías dependientes de categorías financieras principales.';

-- Transacciones (Gasto / Ingreso)
CREATE TABLE IF NOT EXISTS finanzas_transacciones (
    id SERIAL PRIMARY KEY,
    pareja_id UUID REFERENCES parejas(id) ON DELETE CASCADE,
    cuenta_id INT REFERENCES finanzas_cuentas(id) ON DELETE CASCADE,
    categoria_id INT REFERENCES finanzas_categorias(id) ON DELETE SET NULL,
    subcategoria_id INT REFERENCES finanzas_subcategorias(id) ON DELETE SET NULL,
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('gasto', 'ingreso')),
    descripcion VARCHAR(255) NOT NULL,
    monto NUMERIC(10, 2) NOT NULL CHECK (monto > 0.00),
    pagador VARCHAR(100) NOT NULL, -- 'Isra', 'Lidia', o '50/50' (compartido)
    fecha DATE DEFAULT CURRENT_DATE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE finanzas_transacciones IS 'Registro detallado de transacciones (ingresos y gastos) asociadas a cuentas y categorías.';


-- Módulo: Metas de Ahorros y Viajes (dashboard/savings)
CREATE TABLE IF NOT EXISTS ahorros_metas (
    id SERIAL PRIMARY KEY,
    pareja_id UUID REFERENCES parejas(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    monto_objetivo NUMERIC(10, 2) NOT NULL CHECK (monto_objetivo > 0.00),
    monto_actual NUMERIC(10, 2) DEFAULT 0.00 CHECK (monto_actual >= 0.00),
    fecha_limite DATE,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE ahorros_metas IS 'Establece los objetivos de ahorro conjunto de la pareja (ej: Viaje a Japón).';

-- Módulo: Calendario y Eventos (eventos)
CREATE TABLE IF NOT EXISTS eventos (
    id SERIAL PRIMARY KEY,
    pareja_id UUID REFERENCES parejas(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    categoria VARCHAR(100) DEFAULT 'Planes', -- Ej: Planes, Médico, Familia, Viajes
    -- Enlaces de Interconexión futuros
    boda_tarea_id INT REFERENCES boda_tareas(id) ON DELETE SET NULL, -- Asocia una cita/reunión a una tarea de la boda
    ahorro_meta_id INT REFERENCES ahorros_metas(id) ON DELETE SET NULL, -- Asocia un evento a un viaje o meta de ahorro
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE eventos IS 'Citas, fechas importantes y agenda del calendario compartido.';
COMMENT ON COLUMN eventos.boda_tarea_id IS 'Asociación de citas con reuniones de planificación de boda.';

-- =====================================================================
-- 3. TRIGGERS AUTOMÁTICOS PARA ACTUALIZAR marcas 'updated_at'
-- =====================================================================

-- Función auxiliar para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Asignar triggers a todas las tablas para auditoría de cambios
DROP TRIGGER IF EXISTS set_timestamp_modulos ON modulos_config;
CREATE TRIGGER set_timestamp_modulos BEFORE UPDATE ON modulos_config FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_compras ON compras;
CREATE TRIGGER set_timestamp_compras BEFORE UPDATE ON compras FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_boda_tareas ON boda_tareas;
CREATE TRIGGER set_timestamp_boda_tareas BEFORE UPDATE ON boda_tareas FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_finanzas ON finanzas_gastos;
CREATE TRIGGER set_timestamp_finanzas BEFORE UPDATE ON finanzas_gastos FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_finanzas_cuentas ON finanzas_cuentas;
CREATE TRIGGER set_timestamp_finanzas_cuentas BEFORE UPDATE ON finanzas_cuentas FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_finanzas_categorias ON finanzas_categorias;
CREATE TRIGGER set_timestamp_finanzas_categorias BEFORE UPDATE ON finanzas_categorias FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_finanzas_subcategorias ON finanzas_subcategorias;
CREATE TRIGGER set_timestamp_finanzas_subcategorias BEFORE UPDATE ON finanzas_subcategorias FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_finanzas_transacciones ON finanzas_transacciones;
CREATE TRIGGER set_timestamp_finanzas_transacciones BEFORE UPDATE ON finanzas_transacciones FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_ahorros ON ahorros_metas;
CREATE TRIGGER set_timestamp_ahorros BEFORE UPDATE ON ahorros_metas FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_eventos ON eventos;
CREATE TRIGGER set_timestamp_eventos BEFORE UPDATE ON eventos FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();


-- =====================================================================
-- 4. INSERCIONES DE INICIALIZACIÓN (SEED DATA)
-- =====================================================================

-- Insertar pareja por defecto para inicializar la base de datos
INSERT INTO parejas (nombre_1, nombre_2, fecha_aniversario, plan_suscripcion)
VALUES ('Isra', 'Lidia', '2026-06-17', 'Premium')
ON CONFLICT DO NOTHING;

-- Obtener el ID de la pareja recién insertada para alimentar datos iniciales (Ejemplo de script)
DO $$
DECLARE
    v_pareja_id UUID;
BEGIN
    SELECT id INTO v_pareja_id FROM parejas LIMIT 1;
    -- Inserciones de Configuración de Módulos Existentes en el Dashboard
    INSERT INTO modulos_config (key_modulo, nombre_menu, icono, ruta_url, activo, temporal)
    VALUES 
        ('dashboard', 'Dashboard', 'dashboard', 'src/pages/dashboard.js', true, false),
        ('compra', 'Lista de Compra', 'shopping_cart', 'src/pages/modulos/compra.js', true, false),
        ('wedding', 'Nuestra Boda', 'celebration', 'src/pages/modulos/bodas.js', true, false),
        ('finanzas', 'Finanzas', 'payments', 'src/pages/modulos/finanzas/resumen.js', true, false),
        ('events', 'Eventos', 'event', 'src/pages/modulos/eventos.js', true, false)
    ON CONFLICT (key_modulo) DO UPDATE 
    SET nombre_menu = EXCLUDED.nombre_menu, icono = EXCLUDED.icono, activo = EXCLUDED.activo;

    -- Datos iniciales en Lista de Compra
    INSERT INTO compras (pareja_id, nombre, cantidad, categoria, completado)
    VALUES
        (v_pareja_id, 'Comprar aguacates', 3, 'Frutería', false),
        (v_pareja_id, 'Leche de avena', 2, 'Supermercado', true),
        (v_pareja_id, 'Vino tinto reserva', 1, 'Otros', false),
        (v_pareja_id, 'Papel de horno', 1, 'Hogar', false);

    -- Datos iniciales en Organizador de Boda
    INSERT INTO boda_tareas (pareja_id, titulo, categoria, completado)
    VALUES
        (v_pareja_id, 'Confirmar lista final de invitados', 'Invitados', false),
        (v_pareja_id, 'Degustación de menú y banquete', 'Banquete', true),
        (v_pareja_id, 'Prueba de vestido e invitaciones', 'Vestimenta', false),
        (v_pareja_id, 'Contratar fotógrafo y videógrafo', 'Logística', true),
        (v_pareja_id, 'Elegir banda de música / DJ', 'Logística', false);

    -- Datos iniciales de Meta de Ahorros (Viaje)
    INSERT INTO ahorros_metas (pareja_id, nombre, monto_objetivo, monto_actual, fecha_limite)
    VALUES
        (v_pareja_id, 'Ahorros Viaje a Japón', 5000.00, 4250.00, '2026-07-29');

    -- Datos iniciales de Cuentas Bancarias
    INSERT INTO finanzas_cuentas (pareja_id, nombre, saldo_inicial, color)
    VALUES
        (v_pareja_id, 'Cuenta Común BBVA', 1500.00, '#3E5219'),
        (v_pareja_id, 'Revolut Compartida', 350.00, '#4A8B8B'),
        (v_pareja_id, 'Efectivo en Casa', 80.00, '#E0F2F1');

    -- Datos iniciales de Categorías Financieras
    INSERT INTO finanzas_categorias (id, pareja_id, nombre, tipo, icono)
    VALUES
        (1, v_pareja_id, 'Alimentación', 'gasto', 'restaurant'),
        (2, v_pareja_id, 'Hogar & Servicios', 'gasto', 'home'),
        (3, v_pareja_id, 'Ingresos & Nóminas', 'ingreso', 'payments'),
        (4, v_pareja_id, 'Ocio & Viajes', 'gasto', 'flight'),
        (5, v_pareja_id, 'Otros', 'gasto', 'star')
    ON CONFLICT (id) DO UPDATE SET nombre = EXCLUDED.nombre, tipo = EXCLUDED.tipo, icono = EXCLUDED.icono;

    -- Datos iniciales de Subcategorías Financieras
    INSERT INTO finanzas_subcategorias (id, categoria_id, nombre)
    VALUES
        (1, 1, 'Supermercado'),
        (2, 1, 'Restaurantes y Cafés'),
        (3, 2, 'Alquiler/Hipoteca'),
        (4, 2, 'Luz, Internet y Gas'),
        (5, 3, 'Nómina Isra'),
        (6, 3, 'Nómina Lidia'),
        (7, 4, 'Cine y Conciertos'),
        (8, 4, 'Hoteles/Transporte'),
        (9, 5, 'Gastos Varios')
    ON CONFLICT (id) DO UPDATE SET nombre = EXCLUDED.nombre;

    -- Datos iniciales de Transacciones
    -- Para asociar correctamente, usaremos subconsultas con los nombres que acabamos de crear
    INSERT INTO finanzas_transacciones (pareja_id, cuenta_id, categoria_id, subcategoria_id, tipo, descripcion, monto, pagador, fecha)
    VALUES
        (v_pareja_id, (SELECT id FROM finanzas_cuentas WHERE nombre='Cuenta Común BBVA' LIMIT 1), 2, 3, 'gasto', 'Alquiler del mes', 950.00, 'Lidia', '2026-06-10'),
        (v_pareja_id, (SELECT id FROM finanzas_cuentas WHERE nombre='Cuenta Común BBVA' LIMIT 1), 1, 1, 'gasto', 'Compra semanal Mercadona', 120.00, 'Isra', '2026-06-12'),
        (v_pareja_id, (SELECT id FROM finanzas_cuentas WHERE nombre='Revolut Compartida' LIMIT 1), 1, 2, 'gasto', 'Cena aniversario restaurante', 80.00, 'Isra', '2026-06-15'),
        (v_pareja_id, (SELECT id FROM finanzas_cuentas WHERE nombre='Cuenta Común BBVA' LIMIT 1), 2, 4, 'gasto', 'Factura Luz & Internet', 150.00, 'Lidia', '2026-06-16'),
        (v_pareja_id, (SELECT id FROM finanzas_cuentas WHERE nombre='Efectivo en Casa' LIMIT 1), 5, 9, 'gasto', 'Mantenimiento del coche', 150.00, 'Isra', '2026-06-17'),
        (v_pareja_id, (SELECT id FROM finanzas_cuentas WHERE nombre='Cuenta Común BBVA' LIMIT 1), 3, 5, 'ingreso', 'Nómina Isra', 2100.00, 'Isra', '2026-06-01'),
        (v_pareja_id, (SELECT id FROM finanzas_cuentas WHERE nombre='Cuenta Común BBVA' LIMIT 1), 3, 6, 'ingreso', 'Nómina Lidia', 2100.00, 'Lidia', '2026-06-01');

    -- Datos iniciales en Eventos

    INSERT INTO eventos (pareja_id, titulo, fecha, hora, categoria)
    VALUES
        (v_pareja_id, 'Cena familiar de Lidia', '2026-06-20', '21:00', 'Familia'),
        (v_pareja_id, 'Cita con la modista (Boda)', '2026-06-25', '17:30', 'Planes'),
        (v_pareja_id, 'Revisión anual dentista Isra', '2026-07-02', '10:00', 'Médico'),
        (v_pareja_id, 'Escapada de fin de semana', '2026-07-15', '09:00', 'Viajes');

END $$;
