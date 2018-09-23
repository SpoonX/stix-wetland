const { env } = process;

export const wetland = {
  devMigrations: true, //env.NODE_ENV === 'development' || env.WETLAND_DEV_MIGRATIONS,
  // entityPaths: path.resolve(process.cwd(), 'api', 'entity'),
  mapping   : { defaultNamesToUnderscore: true, defaults: { cascades: [ 'persist' ] } },
  stores    : {
    defaultStore: {
      client    : 'mysql',
      connection: {
        host              : env.DB_HOSTNAME || 'localhost',
        user              : env.DB_USERNAME || 'root',
        password          : env.DB_PASSWORD || '',
        database          : env.DB_DATABASE || 'egeote',
        charset           : 'utf8mb4',
      },
    },
  },
};
