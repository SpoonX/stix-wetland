# Config

stix-wetland doesn't come with a whole lot of special configuration options apart from the ones wetland provides.

There's one additional configuration option, which is `devMigrations` which by default this looks at the `NODE_ENV` or `WETLAND_DEV_MIGRATIONS`.
As long as `NODE_ENV` is not `'production'` or `WETLAND_DEV_MIGRATIONS` is set, stix-wetland will run your dev migrations for you.

Read more about the configuration options in the [wetland documentation](https://wetland.spoonx.org/configuration.html).
