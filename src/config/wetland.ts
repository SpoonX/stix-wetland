const { env } = process;

export const wetland = {
  devMigrations: env.NODE_ENV !== 'production' || env.WETLAND_DEV_MIGRATIONS === 'true',
  mapping: { defaultNamesToUnderscore: true, defaults: { cascades: [ 'persist' ] } },
};
