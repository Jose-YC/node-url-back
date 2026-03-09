import { prisma } from "../config";
import { bcryptjsAdapter } from "../shared";


async function main() {
  console.log('🌱 Iniciando seed...');

  // Limpiar datos existentes y reiniciar secuencias de IDs
  await prisma.$executeRaw`TRUNCATE TABLE url, role_permission, user_role, permission, role, "group", "user" RESTART IDENTITY CASCADE`;

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

  // 7. Crear URLs para el Admin (150 URLs)
  console.log('🔗 Creando URLs para el usuario Admin...');
  
  // Obtener IDs de grupos del admin
  const adminGroups = groups.slice(0, 5); // Los primeros 5 grupos son del admin
  
  const adminUrls = await Promise.all([
    // URLs con grupo y favoritas (30 URLs)
    ...Array.from({ length: 30 }, (_, i) => 
      prisma.url.create({
        data: {
          short_url: `adm${i + 1}`,
          original_url: [
            'https://github.com/trending',
            'https://stackoverflow.com/questions',
            'https://dev.to/',
            'https://medium.com/',
            'https://www.freecodecamp.org/',
            'https://leetcode.com/',
            'https://www.udemy.com/courses/development/',
            'https://www.coursera.org/',
            'https://www.pluralsight.com/',
            'https://www.linkedin.com/learning/',
            'https://hackernoon.com/',
            'https://www.smashingmagazine.com/',
            'https://css-tricks.com/',
            'https://www.digitalocean.com/community/tutorials',
            'https://aws.amazon.com/documentation/',
            'https://cloud.google.com/docs',
            'https://azure.microsoft.com/documentation/',
            'https://www.docker.com/resources',
            'https://kubernetes.io/docs/',
            'https://react.dev/',
            'https://nextjs.org/docs',
            'https://vuejs.org/guide/',
            'https://angular.io/docs',
            'https://nodejs.org/docs/',
            'https://expressjs.com/',
            'https://nestjs.com/',
            'https://www.mongodb.com/docs/',
            'https://www.postgresql.org/docs/',
            'https://redis.io/documentation',
            'https://www.elastic.co/guide/',
          ][i % 30],
          title: [
            'GitHub Trending',
            'Stack Overflow Q&A',
            'Dev.to Community',
            'Medium Articles',
            'FreeCodeCamp',
            'LeetCode Practice',
            'Udemy Dev Courses',
            'Coursera Online',
            'Pluralsight',
            'LinkedIn Learning',
            'HackerNoon',
            'Smashing Magazine',
            'CSS Tricks',
            'DigitalOcean Tutorials',
            'AWS Docs',
            'Google Cloud Docs',
            'Azure Documentation',
            'Docker Resources',
            'Kubernetes Docs',
            'React Documentation',
            'Next.js Docs',
            'Vue.js Guide',
            'Angular Docs',
            'Node.js Docs',
            'Express.js',
            'NestJS Framework',
            'MongoDB Docs',
            'PostgreSQL Docs',
            'Redis Documentation',
            'Elasticsearch Guide',
          ][i % 30],
          is_favorite: true,
          isPublic: true,
          statistic: i % 3 === 0,
          user_id: userAdmin.id,
          group_id: adminGroups[i % 5].id,
        },
      })
    ),
    
    // URLs con grupo pero no favoritas (50 URLs)
    ...Array.from({ length: 50 }, (_, i) => 
      prisma.url.create({
        data: {
          short_url: `adm${i + 31}`,
          original_url: [
            'https://www.youtube.com/watch?v=tutorial1',
            'https://twitter.com/user/status/123',
            'https://www.instagram.com/p/xyz/',
            'https://www.facebook.com/page',
            'https://www.reddit.com/r/programming',
            'https://news.ycombinator.com/',
            'https://www.producthunt.com/',
            'https://dribbble.com/shots',
            'https://www.behance.net/gallery',
            'https://codepen.io/pen',
            'https://jsbin.com/',
            'https://jsfiddle.net/',
            'https://codesandbox.io/s/',
            'https://replit.com/',
            'https://glitch.com/',
            'https://vercel.com/dashboard',
            'https://www.netlify.com/dashboard',
            'https://render.com/dashboard',
            'https://railway.app/project',
            'https://www.heroku.com/dashboard',
            'https://firebase.google.com/console',
            'https://supabase.com/dashboard',
            'https://planetscale.com/dashboard',
            'https://www.sanity.io/manage',
            'https://www.contentful.com/app',
            'https://strapi.io/dashboard',
            'https://ghost.org/admin',
            'https://wordpress.com/dashboard',
            'https://www.notion.so/',
            'https://www.figma.com/files',
            'https://www.sketch.com/workspace',
            'https://www.invisionapp.com/projects',
            'https://www.adobe.com/products/xd.html',
            'https://www.canva.com/design',
            'https://www.framer.com/projects',
            'https://webflow.com/dashboard',
            'https://www.wix.com/dashboard',
            'https://www.squarespace.com/dashboard',
            'https://www.shopify.com/admin',
            'https://www.woocommerce.com/',
            'https://www.bigcommerce.com/dashboard',
            'https://www.magento.com/admin',
            'https://stripe.com/dashboard',
            'https://paypal.com/dashboard',
            'https://www.mailchimp.com/dashboard',
            'https://sendgrid.com/dashboard',
            'https://www.twilio.com/console',
            'https://www.algolia.com/dashboard',
            'https://sentry.io/dashboard',
            'https://www.datadog.com/dashboard',
          ][i % 50],
          title: [
            'YouTube Tutorial',
            'Twitter Post',
            'Instagram Photo',
            'Facebook Page',
            'Reddit Programming',
            'Hacker News',
            'Product Hunt',
            'Dribbble Shot',
            'Behance Gallery',
            'CodePen Demo',
            'JSBin Code',
            'JSFiddle Test',
            'CodeSandbox Project',
            'Replit Environment',
            'Glitch App',
            'Vercel Dashboard',
            'Netlify Deploy',
            'Render Services',
            'Railway Project',
            'Heroku Apps',
            'Firebase Console',
            'Supabase Project',
            'PlanetScale DB',
            'Sanity CMS',
            'Contentful Space',
            'Strapi Admin',
            'Ghost Blog',
            'WordPress Site',
            'Notion Workspace',
            'Figma Files',
            'Sketch Workspace',
            'InVision Projects',
            'Adobe XD',
            'Canva Design',
            'Framer Projects',
            'Webflow Sites',
            'Wix Dashboard',
            'Squarespace',
            'Shopify Store',
            'WooCommerce',
            'BigCommerce',
            'Magento Admin',
            'Stripe Payments',
            'PayPal Account',
            'Mailchimp Campaigns',
            'SendGrid Email',
            'Twilio Console',
            'Algolia Search',
            'Sentry Errors',
            'Datadog Monitoring',
          ][i % 50],
          is_favorite: false,
          isPublic: i % 2 === 0,
          password: i % 2 === 0 ? null : bcryptjsAdapter.hash('admin123'),
          statistic: i % 4 === 0,
          user_id: userAdmin.id,
          group_id: adminGroups[i % 5].id,
        },
      })
    ),
    
    // URLs sin grupo pero favoritas (40 URLs)
    ...Array.from({ length: 40 }, (_, i) => 
      prisma.url.create({
        data: {
          short_url: `adm${i + 81}`,
          original_url: [
            'https://gmail.com/',
            'https://calendar.google.com/',
            'https://drive.google.com/',
            'https://docs.google.com/',
            'https://sheets.google.com/',
            'https://slides.google.com/',
            'https://meet.google.com/',
            'https://chat.google.com/',
            'https://mail.proton.me/',
            'https://www.office.com/',
            'https://outlook.office.com/',
            'https://teams.microsoft.com/',
            'https://onedrive.live.com/',
            'https://www.dropbox.com/',
            'https://trello.com/',
            'https://asana.com/',
            'https://monday.com/',
            'https://www.atlassian.com/software/jira',
            'https://www.atlassian.com/software/confluence',
            'https://slack.com/',
            'https://discord.com/',
            'https://zoom.us/',
            'https://www.spotify.com/',
            'https://music.youtube.com/',
            'https://www.netflix.com/',
            'https://www.amazon.com/',
            'https://www.ebay.com/',
            'https://www.aliexpress.com/',
            'https://www.booking.com/',
            'https://www.airbnb.com/',
            'https://www.tripadvisor.com/',
            'https://www.expedia.com/',
            'https://translate.google.com/',
            'https://www.deepl.com/translator',
            'https://www.grammarly.com/',
            'https://www.wikipedia.org/',
            'https://www.quora.com/',
            'https://www.stackoverflow.com/',
            'https://www.github.com/',
            'https://www.gitlab.com/',
          ][i % 40],
          title: [
            'Gmail Inbox',
            'Google Calendar',
            'Google Drive',
            'Google Docs',
            'Google Sheets',
            'Google Slides',
            'Google Meet',
            'Google Chat',
            'Proton Mail',
            'Office 365',
            'Outlook Mail',
            'Microsoft Teams',
            'OneDrive Cloud',
            'Dropbox Files',
            'Trello Boards',
            'Asana Tasks',
            'Monday Projects',
            'Jira Issues',
            'Confluence Wiki',
            'Slack Workspace',
            'Discord Server',
            'Zoom Meetings',
            'Spotify Music',
            'YouTube Music',
            'Netflix Shows',
            'Amazon Shopping',
            'eBay Auctions',
            'AliExpress Store',
            'Booking Hotels',
            'Airbnb Rentals',
            'TripAdvisor Reviews',
            'Expedia Travel',
            'Google Translate',
            'DeepL Translator',
            'Grammarly Editor',
            'Wikipedia',
            'Quora Answers',
            'Stack Overflow',
            'GitHub Repos',
            'GitLab Projects',
          ][i % 40],
          is_favorite: true,
          isPublic: true,
          statistic: i % 2 === 0,
          user_id: userAdmin.id,
          group_id: null,
        },
      })
    ),
    
    // URLs sin grupo y no favoritas (30 URLs)
    ...Array.from({ length: 30 }, (_, i) => 
      prisma.url.create({
        data: {
          short_url: `adm${i + 121}`,
          original_url: [
            'https://www.bbc.com/news',
            'https://www.cnn.com/',
            'https://www.nytimes.com/',
            'https://www.theguardian.com/',
            'https://www.reuters.com/',
            'https://www.bloomberg.com/',
            'https://www.techcrunch.com/',
            'https://www.theverge.com/',
            'https://www.wired.com/',
            'https://www.engadget.com/',
            'https://arstechnica.com/',
            'https://www.cnet.com/',
            'https://www.zdnet.com/',
            'https://www.pcmag.com/',
            'https://www.tomshardware.com/',
            'https://www.anandtech.com/',
            'https://www.gamespot.com/',
            'https://www.ign.com/',
            'https://www.polygon.com/',
            'https://www.kotaku.com/',
            'https://www.eurogamer.net/',
            'https://store.steampowered.com/',
            'https://www.epicgames.com/',
            'https://www.gog.com/',
            'https://www.humblebundle.com/',
            'https://itch.io/',
            'https://www.twitch.tv/',
            'https://www.tiktok.com/',
            'https://www.pinterest.com/',
            'https://www.tumblr.com/',
          ][i % 30],
          title: [
            'BBC News',
            'CNN Homepage',
            'NY Times',
            'The Guardian',
            'Reuters News',
            'Bloomberg Markets',
            'TechCrunch Tech News',
            'The Verge',
            'Wired Magazine',
            'Engadget',
            'Ars Technica',
            'CNET Reviews',
            'ZDNet',
            'PCMag',
            'Tom\'s Hardware',
            'AnandTech',
            'GameSpot',
            'IGN Games',
            'Polygon Gaming',
            'Kotaku',
            'Eurogamer',
            'Steam Store',
            'Epic Games',
            'GOG Games',
            'Humble Bundle',
            'Itch.io Indies',
            'Twitch Streaming',
            'TikTok Videos',
            'Pinterest Boards',
            'Tumblr Blog',
          ][i % 30],
          is_favorite: false,
          isPublic: i % 3 === 0,
          password: i % 3 === 0 ? null : bcryptjsAdapter.hash('admin123'),
          statistic: false,
          user_id: userAdmin.id,
          group_id: null,
        },
      })
    ),
  ]);

  console.log(`✅ ${adminUrls.length} URLs creadas para el usuario Admin`);

  // 8. Crear URLs para el Usuario Básico (50 URLs)
  console.log('🔗 Creando URLs para el usuario Básico...');
  
  // Obtener IDs de grupos del usuario básico
  const userGroups = groups.slice(5, 10); // Los últimos 5 grupos son del usuario básico
  
  const userUrls = await Promise.all([
    // URLs con grupo y favoritas (10 URLs)
    ...Array.from({ length: 10 }, (_, i) => 
      prisma.url.create({
        data: {
          short_url: `usr${i + 1}`,
          original_url: [
            'https://www.hubspot.com/',
            'https://www.salesforce.com/',
            'https://www.zoho.com/crm/',
            'https://www.pipedrive.com/',
            'https://www.mailerlite.com/',
            'https://www.constant-contact.com/',
            'https://www.activecampaign.com/',
            'https://www.convertkit.com/',
            'https://www.hootsuite.com/',
            'https://buffer.com/',
          ][i % 10],
          title: [
            'HubSpot CRM',
            'Salesforce Platform',
            'Zoho CRM',
            'Pipedrive Sales',
            'MailerLite Email',
            'Constant Contact',
            'ActiveCampaign',
            'ConvertKit',
            'Hootsuite Social',
            'Buffer Schedule',
          ][i % 10],
          is_favorite: true,
          isPublic: true,
          statistic: i % 2 === 0,
          user_id: userBasic.id,
          group_id: userGroups[i % 5].id,
        },
      })
    ),
    
    // URLs con grupo pero no favoritas (20 URLs)
    ...Array.from({ length: 20 }, (_, i) => 
      prisma.url.create({
        data: {
          short_url: `usr${i + 11}`,
          original_url: [
            'https://www.canva.com/templates/',
            'https://www.adobe.com/express/',
            'https://www.visme.co/',
            'https://www.piktochart.com/',
            'https://www.crello.com/',
            'https://www.remove.bg/',
            'https://www.photopea.com/',
            'https://www.pixlr.com/',
            'https://unsplash.com/',
            'https://www.pexels.com/',
            'https://pixabay.com/',
            'https://www.freepik.com/',
            'https://www.flaticon.com/',
            'https://fontawesome.com/',
            'https://fonts.google.com/',
            'https://www.dafont.com/',
            'https://coolors.co/',
            'https://www.colourlovers.com/',
            'https://www.brandcolors.net/',
            'https://www.materialpalette.com/',
          ][i % 20],
          title: [
            'Canva Templates',
            'Adobe Express',
            'Visme Infographics',
            'Piktochart Charts',
            'Crello Designs',
            'Remove.bg Tool',
            'Photopea Editor',
            'Pixlr Photo Editor',
            'Unsplash Photos',
            'Pexels Stock',
            'Pixabay Images',
            'Freepik Resources',
            'Flaticon Icons',
            'Font Awesome',
            'Google Fonts',
            'DaFont Typography',
            'Coolors Palettes',
            'Colour Lovers',
            'Brand Colors',
            'Material Palette',
          ][i % 20],
          is_favorite: false,
          isPublic: i % 2 === 0,
          password: i % 2 === 0 ? null : bcryptjsAdapter.hash('user123'),
          statistic: i % 3 === 0,
          user_id: userBasic.id,
          group_id: userGroups[i % 5].id,
        },
      })
    ),
    
    // URLs sin grupo pero favoritas (12 URLs)
    ...Array.from({ length: 12 }, (_, i) => 
      prisma.url.create({
        data: {
          short_url: `usr${i + 31}`,
          original_url: [
            'https://www.linkedin.com/feed/',
            'https://twitter.com/home',
            'https://www.facebook.com/home',
            'https://www.instagram.com/',
            'https://www.youtube.com/',
            'https://whatsapp.com/web',
            'https://telegram.org/',
            'https://www.messenger.com/',
            'https://www.reddit.com/',
            'https://flipboard.com/',
            'https://medium.com/me/stories',
            'https://substack.com/inbox',
          ][i % 12],
          title: [
            'LinkedIn Feed',
            'Twitter Home',
            'Facebook Feed',
            'Instagram',
            'YouTube Homepage',
            'WhatsApp Web',
            'Telegram',
            'Messenger',
            'Reddit Front',
            'Flipboard News',
            'Medium Stories',
            'Substack Inbox',
          ][i % 12],
          is_favorite: true,
          isPublic: true,
          statistic: true,
          user_id: userBasic.id,
          group_id: null,
        },
      })
    ),
    
    // URLs sin grupo y no favoritas (8 URLs)
    ...Array.from({ length: 8 }, (_, i) => 
      prisma.url.create({
        data: {
          short_url: `usr${i + 43}`,
          original_url: [
            'https://www.weather.com/',
            'https://www.accuweather.com/',
            'https://www.timeanddate.com/',
            'https://www.worldtimebuddy.com/',
            'https://www.xe.com/currencyconverter/',
            'https://www.calculator.net/',
            'https://www.unitconverters.net/',
            'https://www.randomwordgenerator.com/',
          ][i % 8],
          title: [
            'Weather Forecast',
            'AccuWeather',
            'Time and Date',
            'World Time Buddy',
            'XE Currency',
            'Online Calculator',
            'Unit Converter',
            'Random Generator',
          ][i % 8],
          is_favorite: false,
          isPublic: false,
          password: bcryptjsAdapter.hash('user123'),
          statistic: false,
          user_id: userBasic.id,
          group_id: null,
        },
      })
    ),
  ]);

  console.log(`✅ ${userUrls.length} URLs creadas para el usuario Básico`);

  // 9. Crear URLs temporales sin usuario (expiradas)
  console.log('⏰ Creando URLs temporales expiradas...');
  
  const expiredUrls = await Promise.all(
    Array.from({ length: 10 }, (_, i) => {
      const daysAgo = i + 1; // Expiradas hace 1 a 10 días
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() - daysAgo);
      
      return prisma.url.create({
        data: {
          short_url: `exp${i + 1}`,
          original_url: [
            'https://www.eventbrite.com/e/tech-conference-2026-tickets-123456789',
            'https://docs.google.com/document/d/1a2b3c4d5e6f7g8h9i0j/edit',
            'https://www.amazon.com/gp/promotion/details/A1B2C3D4E5F6G',
            'https://forms.gle/Ab1Cd2Ef3Gh4Ij5Kl6',
            'https://zoom.us/webinar/register/WN_AbCdEfGhIjK',
            'https://drive.google.com/file/d/1aBcDeFgHiJkLmNoPqRsTuVwXyZ/view',
            'https://www.groupon.com/deals/limited-time-offer-xyz123',
            'https://app.testflight.apple.com/join/AbCdEfGh',
            'https://www.ticketmaster.com/event/1A2B3C4D5E6F7G8H',
            'https://share.streamlit.io/username/app-preview/main',
          ][i % 10],
          title: null,
          is_favorite: false,
          isPublic: true,
          statistic: false,
          password: null,
          user_id: null,
          group_id: null,
          expires_at: expirationDate,
        },
      });
    })
  );

  console.log(`✅ ${expiredUrls.length} URLs temporales expiradas creadas`);

  // 10. Crear URLs temporales sin usuario (activas, expiran en el futuro)
  console.log('⏰ Creando URLs temporales activas...');
  
  const activeTemporaryUrls = await Promise.all(
    Array.from({ length: 10 }, (_, i) => {
      const daysUntilExpiration = i + 1; // Expiran en 1 a 10 días
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + daysUntilExpiration);
      
      return prisma.url.create({
        data: {
          short_url: `tmp${i + 1}`,
          original_url: [
            'https://www.meetup.com/es/tech-meetup-madrid/events/298765432/',
            'https://docs.google.com/presentation/d/1zYxWvUtSrQpOnMlKjIhGfEdCbA/edit',
            'https://www.udemy.com/course/web-development-bootcamp/?couponCode=SPRING2026',
            'https://www.surveymonkey.com/r/ABCD1234',
            'https://zoom.us/j/123456789?pwd=aBcDeFgHiJkLmNoPqRsTuVwXyZ',
            'https://wetransfer.com/downloads/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6/abcdef',
            'https://www.bestbuy.com/site/flash-sale-electronics/pcmcat12345.c',
            'https://beta.openai.com/signup?invite=abc123def456',
            'https://www.eventbrite.com/e/developer-summit-2026-tickets-987654321',
            'https://codesandbox.io/s/react-demo-preview-abc123',
          ][i % 10],
          title: null,
          is_favorite: false,
          isPublic: true,
          statistic: false,
          password: null,
          user_id: null,
          group_id: null,
          expires_at: expirationDate,
        },
      });
    })
  );

  console.log(`✅ ${activeTemporaryUrls.length} URLs temporales activas creadas`);

  console.log('\n🎉 Seed completado exitosamente!\n');
  console.log('📊 Resumen:');
  console.log(`   - ${permissions.length} permisos creados`);
  console.log(`   - 2 roles creados (user, admin)`);
  console.log(`   - 2 usuarios creados`);
  console.log(`   - ${groups.length} grupos creados`);
  console.log(`   - ${adminUrls.length} URLs creadas para Admin`);
  console.log(`   - ${userUrls.length} URLs creadas para Usuario Básico`);
  console.log(`   - ${expiredUrls.length} URLs temporales expiradas`);
  console.log(`   - ${activeTemporaryUrls.length} URLs temporales activas`);
  console.log(`   - Total de URLs: ${adminUrls.length + userUrls.length + expiredUrls.length + activeTemporaryUrls.length}`);
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
