import { ContextInterface, createDebugLogger } from 'stix';

const debug = createDebugLogger('wetland:middleware');

export const wetlandQueryParserMiddleware = async function wetlandQueryParser (ctx: ContextInterface, next: Function) {
  debug('Building query parameters from request.');
  if (ctx.state.response) {
    return next();
  }

  ctx.state.query = {
    criteria: criteria(ctx),
    options: options.reduce((query: any, option: string) => {
      const value = pickers[option](ctx);

      if (value !== undefined) {
        query[option] = value;
      }

      return query;
    }, {}),
  };

  return next();
};

const simple = (key: string, allowJSON: boolean = false) => ({ query }: ContextInterface['query']) => {
  if (!allowJSON) {
    return query[key];
  }

  try {
    return JSON.parse(query[key]);
  } catch (error) {
    return query[key];
  }
};

const selects = ({ query }: ContextInterface['query']) => {
  const select = query.select;

  if (!select || !select.length) {
    return undefined;
  }

  if (Array.isArray(query.select)) {
    return query.select;
  }

  if (typeof select !== 'string') {
    return undefined;
  }

  try {
    return JSON.parse(query.select);
  } catch (error) {
    return select.split(',').map(s => s.trim());
  }
};

const pickers: { [option: string]: Function } = {
  // or: 'alias', 'alias.property' or mixed[] e.g. [ 'u', 'p.name', 'age' ]
  // Examples:
  //    ?select=u&select=p.name&select=age
  //    ?select=u,p.name,age
  //    ?select=["u","p.name","age"]
  //    ?select={"alias":"combinedAge","sum":"u.age"}
  //    ?select=[{"alias":"c","sum":"u.age"}]
  select: selects,

  // or: 'name' or mixed[] e.g. [ 'name', { age: 'asc' } ]
  orderBy: simple('orderBy', true),

  // or array e.g. [ 'age', 'gender' ]
  groupBy: simple('groupBy', true),

  // Alias for query builder (so you can use u.name when using joins)
  alias: simple('alias', false),

  // Limit number of records fetched
  limit: simple('limit', false),

  // Where to start fetching (skip, for pagination)
  offset: simple('offset', false),

  // Automatically sets (and overrides) the offset based on limit.
  page: simple('page', false),

  // Populate related results (join relations).
  // Use `true` to populate all relationships.
  // Note: If you don't use an alias you can use the property name.
  //       Example: [ 'profile', 'friends' ]
  // Note 2: You can populated nested queries.
  //       Example: [ { 'u.friends': 'f' }, 'u.profile', 'f.profile' ]
  populate: simple('populate', true),
};

const criteria = ({ query }: ContextInterface['query']) => {
  if (!query.where) {
    return Object.keys(query).reduce((cleaned: any, key: string) => {
      if (options.indexOf(key) === -1) {
        cleaned[key] = query[key];
      }

      return cleaned;
    }, {});
  }

  try {
    return JSON.parse(query.where);
  } catch (error) {
    return undefined;
  }
};


const options = Object.freeze(Object.keys(pickers));
