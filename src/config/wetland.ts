const { env } = process;

export const wetland = {
  devMigrations: env.NODE_ENV !== 'development' || env.WETLAND_DEV_MIGRATIONS,
  mapping: { defaultNamesToUnderscore: true, defaults: { cascades: [ 'persist' ] } },
};
