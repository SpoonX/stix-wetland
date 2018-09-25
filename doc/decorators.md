# Decorators

Stix-wetland comes with a handful of decorators to make working with wetland in combination with stix both easier and honestly, more fun.

Decorators of stix-wetland rely on `@inject()` and `@patch()`, both of which are supplied by stix.

## @injectRepository(Entity?)

Using this decorator you can benefit from stix's decorator DI support and have stix-wetland look-up and inject a repository on a property of your choice.

This decorator isn't magical. All it does is call `wetland.getEntityManager().getRepository(Entity)` to save you the hassle of having to create a service factory.

```ts
import { AbstractActionController } from 'stix';
import { EntityRepository } from 'wetland';
import { injectRepository } from 'stix-wetland';
import { User } from '../Entity';

class UserController extends AbstractActionController {

  @injectRepository(User)
  private userRepository: EntityRepository<User>;

  // Implementation not relevant
}
```

Now you can use the repository to call your custom repository methods for non-default queries.

## @findAction(Entity?)

This decorator uses stix's `@patch()` decorator to patch your controller with a `find` action.

The find action is powerful and allows you to query your data in a very flexible manner. When using stix-wetland, all requests will end up with a formatted query object _(`ctx.state.query`)_ that you can modify if needed _(e.g. to enforce security rules)_.

### Example

```ts
import { AbstractActionController } from 'stix';
import { findAction } from 'stix-wetland';
import { User } from '../Entity/User';

@findAction(User)
export class UserController extends AbstractActionController {
}
```

### Options

Find actions come with powerful options that allow you to do almost anything without the need to implement different actions or querying systems. Most of the options allow JSON to be used providing even more flexibility.

<details>
<summary><em><strong>Options cheat-sheet</strong></em></summary>
<p>

An overview of the options provided.

| Option     | Description                                                                | Example                                                                                                        |
| ---------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `select`   | Properties to fetch from the database, and populate in the results.        | `?select=[{"alias":"c","sum":"u.age"}]`                                      |
| `orderBy`  | Property/properties to order the results by, and in what order (asc/desc). | `?orderBy=["name", {"age": "asc"}]`                                                        |
| `groupBy`  | Property/properties to group the results by.                               | `?groupBy=["age","gender"]`                                                               |
| `alias`    | The alias of the primary table being queried (the associated entity).      | `?alias=u`                                                                                                     |
| `limit`    | Maximum number of rows to be fetched from the table.                       | `?limit=30`                                                                                                    |
| `offset`   | Number of records to skip before selecting your rows.                      | `?offset=60`                                                                                                   |
| `page`     | Automatically sets _(and overrides)_ the offset based on limit.              | `?page=3`                                                                                                      |
| `populate` | Populate related results (join relations).                                 | `?populate=["profile","friends"]`                                                        |
| `where`    | Flexible object of criteria to apply to the query.                         | `?where={"city":{"not":"Amsterdam"},{"age":{">":"18"}}}`             |
| `*`        | Any other non-option properties will be used as `where` criteria.          | `?name=RWOverdijk&city=Heerhugowaard`                                                     |

</p>
</details>

#### select

The `select` option allows you to specify which properties (or fields) you would like to see returned. Not only does this make sure that the response doesn't contain any of the other properties on the entity, it also doesn't query the database for them to begin with. This reduces both query and http transfer overhead.

On top of that, you can also provide function selectors. Some examples:

- `?select=u&select=p.name&select=age`
- `?select=u,p.name,age`
- `?select=["u","p.name","age"]`
- `?select={"alias":"combinedAge","sum":"u.age"}`
- `?select=[{"alias":"averageAge","avg":"u.age"}]`
- `?select=[{"alias":"orderCount","count":"o.id"}]`

_**Note:** You might have noticed that some of the values are prepended with a character followed by a period (`.`). These are [aliased](#alias) properties allowing you to specify what entity you want to select the property of. For example, `u.username` when alias `u` stands for user says you want `user.username`._

<details>
<summary><em><strong>Supported functions</strong></em></summary>
<p>

- sum
- count
- max
- min
- avg
- distinct

</p>
</details>

#### orderBy

With the `orderBy` option you can specify what property and direction to order your results by. You can supply the property, direction and even multiple options using a JSON array.

> `?orderBy=["name", {"age": "asc"}]`

#### groupBy

With the `groupBy` option you can specify what property/properties you wish to group the results by. Using a JSON array you can specify multiple properties to group by.

> `?groupBy=["age","gender"]`

#### alias

The `alias` option allows you to define the alias for the main query. Let's say you're querying `/user`, the alias would be for the user table. This is useful when used in combination with the [select](#select) and [populate](#populate) options.

> `/user?alias=u&select=u.username`

#### limit

The `limit` option allows you to limit the number of results returned.

> `?limit=30`

#### offset

The `offset` option allows you to skip the specified number of records.

> `?offset=30`

#### page

The `page` option automatically sets _(and overrides)_ the offset based on limit. In other words: `offset=(page-1)*limit`

> `?limit=30&page=3`

#### populate

The `populate` options allows you to get the data for relations defined on the entity. This option is very powerful as it works recursively.

> `/user?alias=u&populate=["u.profile",{"u.friends":"f"},"f.profile"]`

_Fetch the user, their profile, their friends, and their friends's profiles._

#### where

The `where` option accepts JSON, and is by far the most powerful one. It allows you to compose a criteria tree in an intuitive format.

> `?where={"city":{"not":"Amsterdam"},{"age":{">":"18"}}}`

<details>
<summary><em><strong>
Expand for an over-the-top example.
</strong></em></summary>
<p>

_Taken from the actual wetland tests:_

```json
{
  "id":1337,
  "a.country":"Netherlands",
  "a.street":{
    "endsWith":"street"
  },
  "or":[
    {
      "id":{
        "between":[
          1,
          100
        ]
      }
    },
    {
      "a.houseNumber":{
        "gt":12
      }
    },
    {
      "and":[
        {
          "id":{
            "between":[
              100,
              500
            ]
          }
        },
        {
          "role":{
            "not":[
              "guest",
              "spectator"
            ]
          }
        },
        {
          "or":[
            {
              "role":"no idea"
            },
            {
              "and":[
                {
                  "id":{
                    "notBetween":[
                      6,
                      9
                    ]
                  }
                },
                {
                  "t.status":2
                },
                {
                  "u.name":"Frank"
                },
                {
                  "or":[
                    {
                      "id":{
                        "not":[
                          5,
                          6,
                          7,
                          8
                        ]
                      }
                    },
                    {
                      "role":{
                        "gt":666
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

</p>
</details>

##### Conditions

The criteria supplied to where can be glued together using what we call _conditions_. Condtions are `and` and `or` and can be combined and nested as much as you like.

##### Operators

Your criteria can use quite a lot of different operators. Feel free to expand the details below for a complete list.

<details>
<summary><em><strong>Supported operators</strong></em></summary>
<p>

- `<`
- `lt`
- `lessThan`
- `<=`
- `lte`
- `lessThanOrEqual`
- `>`
- `gt`
- `greaterThan`
- `>=`
- `greaterThanOrEqual`
- `gte`
- `!`
- `not`
- `between`
- `notBetween`
- `in`
- `notIn`
- `is`
- `isNot`
- `like`
- `notLike`
- `contains`
- `notContains`
- `startsWith`
- `notStartsWith`
- `endsWith`
- `notEndsWith`

</p>
</details>

## @findOneAction(Entity?)

This decorator uses stix's `@patch()` decorator to patch your controller with a `findOne` action. This will simply fetch a single record where its primary key value is the value supplied in `:id` _(see **requirements** for more information)_.

_**Note:** you can supply the same options here that you can supply to the [find action](#options). This is especially useful when using the `select` and `populate` options._

### Requirements

This method requires you to specify the primary key value of the record you wish to fetch in your route using the `id` parameter:

> `GET /user/:id`

_**Note:** Annoyed that you have to pass in the `id`? Simply use the find action with a `limit=1`!_

### Example

```ts
import { AbstractActionController } from 'stix';
import { findOneAction } from 'stix-wetland';
import { User } from '../Entity/User';

@findOneAction(User)
export class UserController extends AbstractActionController {
}
```

## @modifyAction(Entity?)

This decorator uses stix's `@patch()` decorator to patch your controller with a `modify` action.

To use this endpoint, you have to supply the patch in the request body.

**Example payload:**

```json
{"username":"newUsername"}
```

### Requirements

This method requires you to specify the primary key value of the record you wish to modify in your route using the `id` parameter:

> `PATCH /user/:id`

### Example

```ts
import { AbstractActionController } from 'stix';
import { modifyAction } from 'stix-wetland';
import { User } from '../Entity/User';

@modifyAction(User)
export class UserController extends AbstractActionController {
}
```

## @destroyAction(Entity?)

This decorator uses stix's `@patch()` decorator to patch your controller with a `destroy` action. The reason it's called _destroy_ and not _delete_ is that `delete` is a reserved keyword in JavaScript.

### Requirements

This method requires you to specify the primary key value of the record you wish delete in your route using the `id` parameter:

> `DELETE /user/:id`

### Example

```ts
import { AbstractActionController } from 'stix';
import { destroyAction } from 'stix-wetland';
import { User } from '../Entity/User';

@destroyAction(User)
export class UserController extends AbstractActionController {
}
```

## @createAction(Entity?)

This decorator uses stix's `@patch()` decorator to patch your controller with a `create` action.

To use this endpoint, you have to supply the patch in the request body.

> `POST /user`

**Example payload:**

```json
{"username":"newUser","password":"superSecure!"}
```

**Example response:**

```json
{
  "username": "newUser",
  "password": "superSecure!",
  "id": 15,
  "lastLogin": null,
  "createdAt": "2018-09-24T21:28:14.000Z",
  "updatedAt": "2018-09-24T21:28:14.000Z"
}
```

### Many records

The `create` action allows you to create many records in one go.

**Example payload:**

```json
[
  {"username":"newUser","password":"superSecure!"},
  {"username":"otherUser","password":"lessSecure!"},
]
```

**Example response:**

```json
[
  {
    "username": "newUser",
    "password": "superSecure!",
    "id": 15,
    "lastLogin": null,
    "createdAt": "2018-09-24T21:28:14.000Z",
    "updatedAt": "2018-09-24T21:28:14.000Z"
  },
  {
    "username": "otherUser",
    "password": "lessSecure!",
    "id": 16,
    "lastLogin": null,
    "createdAt": "2018-09-24T21:28:14.000Z",
    "updatedAt": "2018-09-24T21:28:14.000Z"
  }
]
```

### Example

```ts
import { AbstractActionController } from 'stix';
import { createAction } from 'stix-wetland';
import { User } from '../Entity/User';

@createAction(User)
export class UserController extends AbstractActionController {
}
```

## @dbActions(Entity?)

A lot of functionality tucked into one tiny decorator. This convenience decorator applies all of the previously mentioned Action patcher decorators to your controller in one go:

- [@findAction()](#findactionentity)
- [@findOneAction()](#findoneactionentity)
- [@modifyAction()](#modifyactionentity)
- [@destroyAction()](#destroyactionentity)
- [@createAction()](#createactionentity)

### Example

```ts
import { AbstractActionController } from 'stix';
import { dbActions } from 'stix-wetland';
import { User } from '../Entity/User';

@dbActions(User)
export class UserController extends AbstractActionController {
}
```

## @associatedEntity(Entity)

This decorator allows you to tell stix-wetland, using class metadata as a medium, about the entity associated with your controller. This is useful in combination with other decorators stix-wetland offers as it allows you to omit the `Entity` argument.

All other decorators use the associated entity you've set in case you omit the argument. Example:

```ts
import { AbstractActionController } from 'stix';
import { EntityRepository } from 'wetland';
import { findAction, createAction, modifyAction, injectRepository } from 'stix-wetland';
import { User } from '../Entity';

@findAction(User)
@createAction(User)
@modifyAction(User)
class UserController extends AbstractActionController {

  @injectRepository(User)
  private userRepository: EntityRepository<User>;

  // Implementation not relevant
}
```

Can also be written like this:

```ts
import { AbstractActionController } from 'stix';
import { EntityRepository } from 'wetland';
import { associatedEntity, findAction, createAction, modifyAction, injectRepository } from 'stix-wetland';
import { User } from '../Entity';

@findAction()
@createAction()
@modifyAction()
@associatedEntity(User)
class UserController extends AbstractActionController {

  @injectRepository()
  private userRepository: EntityRepository<User>;

  // Implementation not relevant
}
```

So in summary: If no argument was supplied to any of the decorators, they will default to the associated entity you've set using `@associatedEntity()`.
