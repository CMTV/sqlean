<div style="display: flex; align-items: center; gap: 30px;">
  <a href="https://gulpjs.com">
    <img height="70" src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png">
  </a>
  <div>
    <p style="font-size: 220%; margin-bottom: 0; font-weight: bold;">SQLean</p>
    <p style="font-size: 120%">Write <strong>Code</strong>, not <strong>Queries</strong></p>
  </div>
</div>

<p></p>

#

SQLean (*/s_clean/*) is a simple SQLite database manager built on top of [better-sqlite3](https://www.npmjs.com/package/better-sqlite3) package.

Working with a database on a low level is a nightmare since you have to convert your data to database format, then to query strings and vice verca.

With SQLean you can easily perform basic operations with database (select, insert, update, delete) passing data as objects and constructing `WHERE` clauses with code constructions instead of mixing strings with data.

SQLean also supports **entity system** allowing you to create relations between TypeScript classes with SQLite columns using modern decorator syntax. With this system you can forget about SQL-stuff at all and work directly with classes and instances, letting SQLean to do all insert, update, select, delete job behind the scenes.

Before you start:

* SQLean is intended to be used in TypeScript projects
* SQLean is synchronous (just as [better-sqlite3](https://www.npmjs.com/package/better-sqlite3))
* SQLean does not protect you from SQL-injections
* SQLean **always** automatically converts `camelCase` (code side) to `snake_case` (db side) and vice verca

## Quick links

1. [Install](#install)
2. [Opening database](#opening-database)
3. [Simple Queries](#simple-queries)
    * [Insert](#insert)
    * [Building `WHERE` clauses](#building-where-clauses)
    * [Select](#select)
    * [Update and Delete](#update-and-delete)
4. [**Entity system**](#entity-system)
5. [Using better-sqlite3](#using-better-sqlite3)

## Install

```console
$ npm i sqlean
```

## Opening database

Let's assume you already have a SQLite database called `data.db` file with columns structure and maybe some data. A typical way  to create such databases is to use something like [DB4S](https://sqlitebrowser.org/).

First of all, we need to open the database file. It must be done before calling any other SQLean methods!

```typescript
import { Db } from "sqlean";

Db.Open('data.db')

// Do stuff with database
// ...

Db.Close(); // Optional. Can be omitted
```

## Simple Queries

The basic idea is simple. You just call a desired static method of `Db` class and pass data object which contains info about table, columns and where clauses.

### Insert

```typescript
let customerData = {
    customerId: 'cmtv',
    firstName: 'Peter',
    //secondName: 'Radko' // Allowed to be null in database
    age: 23,
    isPro: 1 // SQLite does not support Boolean values
};

Db.Insert({
    table: 'customer',
    columnValues: customerData
});
```

| customer_id | first_name | second_name | age | is_pro |
|-------------|------------|-------------|-----|--------|
| cmtv        | Peter      | *NULL*      | 23  | 1      |

### Building `WHERE` clauses

There are three ways to build `WHERE` clauses:

1 - Pure string clause:
```typescript
let where = `@firstName = 'Peter' AND 5 = 2`;

// first_name = 'Peter' AND 5 = 2
```

2 - Single array-clause:
```typescript
let where: WhereClause;
    
    where = ['@firstName', '=', 'Peter'];
            // WHERE first_name = $param0

    where = [2, '>=', 5];
            // $param0 >= $param1

    where = ['@customerId', 'LIKE', 'c%'];
            // customer_id LIKE $param0
```

3 - Group clauses in which you can combine all three ways:
```typescript
let where = AND(
    ['@firstName', '=', 'Peter'],
    OR(
        ['@customerId', 'LIKE', 'c%'],
        '2 >= 5'
    )
);

// (first_name = $param0) AND ((customer_id LIKE $param1) OR (2 >= 5))
```

There are two important things you should keep in mind.

First of all, everything prefixed with `@` will be converted to `snake_case` and left in query without quotes.

Secondly, notice how strings and numbers are converted into `$paramX` references in array-clauses.
When query run, the values will be automatically injected adding quotes for strings if needed. This works only in array-clauses.

### Select

Selecting one row:

```typescript
let cmtv = Db.Select.Get({
    table: 'customer',
    columns: '*',
    where: ['@firstName', '=', 'Peter']
});
```

```console
{ customerId: 'cmtv', firstName: 'Peter', secondName: null, isPro: 1 }
```

Selecting multiple rows:

```typescript
let rows = Db.Select.All({
    table:      'customer',
    columns:    ['customerId', 'age'],
    where:      OR('2 = 2', [3, '>', 20])
});
```

```console
[
  { customerId: 'nnagibin', age: 25 },
  { customerId: 'cmtv', age: 23 }     
]
```

Notice how came casel column names automatically convert to snake case database column names and vice versa.

Return values can be plucked:

```typescript
let prepared = Db.Select.Prepare({
    table:      'customer',
    columns:    ['firstName'],
});

let firstNames = prepared.statement.pluck().all(prepared.whereParams);
```

```console
[ 'Nicholas', 'Peter' ]
```

### Update and Delete

The `UPDATE` and `DELETE` queries are built the same way we already discovered:

```typescript
Db.Update({
    table:          'customer',
    columnValues:   { firstName: 'Steve'},
    where:          ['@customerId', '=', 'cmtv']
});

Db.Delete({
    table:  'customer',
    where:  ['@customerId', '=', 'cmtv']
});
```

## Entity system



## Using better-sqlite3

If you need to build complex SQL queries or access low-level database settings you can always access [better-sqlite3](https://www.npmjs.com/package/better-sqlite3) database instance directly by accessing `_db` property:

```typescript
import { Db, DB } from "sqlean";

Db.Open('data.db');

DB._db.pragma('cache_size = 32000');
DB._db.pragma('journal_mode = WAL');

DB._db.prepare('CREATE TABLE my_table (my_primary_key INTEGER NOT NULL, my_column TEXT, PRIMARY KEY(my_primary_key))').run();
```

Notice the small difference between `Db` class which is used to access SQLean static methods and `DB` singleton instance!

For more information about `_db` see official better-sqlite3 [docs](https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/api.md).