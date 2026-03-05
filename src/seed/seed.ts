import { prisma } from "../config";
import { bcryptjsAdapter } from "../shared";


async function main() {
  console.log('🌱 Iniciando seed...');

  // Limpiar datos existentes y reiniciar secuencias de IDs
  await prisma.$executeRaw`TRUNCATE TABLE role_permission, user_role, permission, role, "group", "user" RESTART IDENTITY CASCADE`;

  console.log('✨ Datos anteriores eliminados y secuencias reiniciadas');

  // 1. Crear Permisos
  console.log('📝 Creando permisos...');
  const permissions = await Promise.all([
    // Permisos de Usuarios
    prisma.permission.create({
      data: {
        name: 'users:create',
        description: 'Crear usuarios',
        module: 'users',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'users:read',
        description: 'Leer usuarios',
        module: 'users',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'users:byid',
        description: 'Leer usuarios por ID',
        module: 'users',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'users:update',
        description: 'Actualizar usuarios',
        module: 'users',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'users:profile',
        description: 'Actualizar perfil y contraseña',
        module: 'users',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'users:delete',
        description: 'Eliminar usuarios',
        module: 'users',
      },
    }),

    // Permisos de Roles
    prisma.permission.create({
      data: {
        name: 'roles:create',
        description: 'Crear roles',
        module: 'roles',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'roles:read',
        description: 'Leer roles',
        module: 'roles',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'roles:byid',
        description: 'Leer roles por ID',
        module: 'roles',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'roles:update',
        description: 'Actualizar roles',
        module: 'roles',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'roles:delete',
        description: 'Eliminar roles',
        module: 'roles',
      },
    }),

    // Permisos de Permisos
    prisma.permission.create({
      data: {
        name: 'permissions:create',
        description: 'Crear permisos',
        module: 'permissions',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'permissions:read',
        description: 'Leer permisos',
        module: 'permissions',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'permissions:byid',
        description: 'Leer permisos por ID',
        module: 'permissions',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'permissions:update',
        description: 'Actualizar permisos',
        module: 'permissions',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'permissions:delete',
        description: 'Eliminar permisos',
        module: 'permissions',
      },
    }),
  ]);

  console.log(`✅ ${permissions.length} permisos creados`);

  // 2. Crear Roles
  console.log('🎭 Creando roles...');
  const roleUser = await prisma.role.create({
    data: {
      name: 'user',
      description: 'Usuario básico sin permisos especiales',
    },
  });

  const roleAdmin = await prisma.role.create({
    data: {
      name: 'admin',
      description: 'Administrador con todos los permisos',
    },
  });

  console.log('✅ Roles creados: user, admin');

  // 3. Asignar todos los permisos al rol admin
  console.log('🔗 Vinculando permisos al rol admin...');
  const rolePermissions = await Promise.all(
    permissions.map((permission) =>
      prisma.role_permission.create({
        data: {
          role_id: roleAdmin.id,
          permission_id: permission.id,
        },
      })
    )
  );

  console.log(`✅ ${rolePermissions.length} permisos vinculados al rol admin`);

  // 4. Crear Usuarios
  console.log('👥 Creando usuarios...');
  const userAdmin = await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'admin@example.com',
      password: bcryptjsAdapter.hash('admin123'),
    },
  });

  const userBasic = await prisma.user.create({
    data: {
      name: 'Usuario Básico',
      email: 'user@example.com',
      password: bcryptjsAdapter.hash('user123'),
    },
  });

  console.log('✅ Usuarios creados');

  // 5. Asignar roles a usuarios
  console.log('🔗 Asignando roles a usuarios...');
  await prisma.user_role.create({
    data: {
      user_id: userAdmin.id,
      role_id: roleAdmin.id,
    },
  });

  await prisma.user_role.create({
    data: {
      user_id: userBasic.id,
      role_id: roleUser.id,
    },
  });

  console.log('✅ Roles asignados a usuarios');

  // 6. Crear Grupos
  console.log('📁 Creando grupos...');
  const groups = await Promise.all([
    // Grupos del Admin
    prisma.group.create({
      data: {
        name: 'Trabajo',
        description: 'URLs relacionadas con el trabajo y proyectos laborales',
        user_id: userAdmin.id,
      },
    }),
    prisma.group.create({
      data: {
        name: 'Personal',
        description: 'Enlaces personales y de uso cotidiano',
        user_id: userAdmin.id,
      },
    }),
    prisma.group.create({
      data: {
        name: 'Redes Sociales',
        description: 'URLs de perfiles y páginas en redes sociales',
        user_id: userAdmin.id,
      },
    }),
    prisma.group.create({
      data: {
        name: 'Desarrollo',
        description: 'Recursos y herramientas para desarrollo de software',
        user_id: userAdmin.id,
      },
    }),
    prisma.group.create({
      data: {
        name: 'Educación',
        description: 'Cursos, tutoriales y material educativo',
        user_id: userAdmin.id,
      },
    }),
    // Grupos del Usuario Básico
    prisma.group.create({
      data: {
        name: 'Marketing',
        description: 'Campañas y materiales de marketing digital',
        user_id: userBasic.id,
      },
    }),
    prisma.group.create({
      data: {
        name: 'Documentación',
        description: 'Documentos importantes y referencias técnicas',
        user_id: userBasic.id,
      },
    }),
    prisma.group.create({
      data: {
        name: 'Clientes',
        description: 'URLs compartidas con clientes y socios comerciales',
        user_id: userBasic.id,
      },
    }),
    prisma.group.create({
      data: {
        name: 'Proyectos',
        description: 'Proyectos personales y colaborativos',
        user_id: userBasic.id,
      },
    }),
    prisma.group.create({
      data: {
        name: 'Temporales',
        description: 'Enlaces de uso temporal o de corta duración',
        user_id: userBasic.id,
      },
    }),
  ]);

  console.log(`✅ ${groups.length} grupos creados`);

  console.log('\n🎉 Seed completado exitosamente!\n');
  console.log('📊 Resumen:');
  console.log(`   - ${permissions.length} permisos creados`);
  console.log(`   - 2 roles creados (user, admin)`);
  console.log(`   - 2 usuarios creados`);
  console.log(`   - ${groups.length} grupos creados`);
  console.log(`   - Rol "admin" tiene todos los permisos`);
  console.log(`   - Rol "user" sin permisos\n`);
  console.log('👤 Credenciales:');
  console.log('   Admin: admin@example.com / admin123');
  console.log('   User:  user@example.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
