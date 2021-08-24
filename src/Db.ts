import SQLite from "better-sqlite3";

// Queries
import { Insert } from "./query/Insert";
import { Select } from "./query/Select";
import { Delete } from "./query/Delete";
import { Update } from "./query/Update";

export type FuncToDb =      (src: any) => DbValue;
export type FuncFromDb =    (dbValue: DbValue, Type: any) => any;

export type DbValue = null | number | string;

export type ColumnValue = {
    [column: string]: DbValue
};

export class Db
{
    _db: SQLite.Database;

    static Open(pathToDb: string)   { DB._db = SQLite(pathToDb); }
    static Close()                  { DB._db.close(); }

    static Select = Select;
    static Insert = Insert;
    static Update = Update;
    static Delete = Delete;

    static Transaction(queries: () => void)
    {
        DB._db.transaction(queries)();
    }
}

export const DB = new Db;

Db.Open('test/data.db');

/*let result = Db.Select.All({
    table: 'customer',
    columns: '*',
    where: AND(['@age', '>=', 10], OR(['lol', '=', 5], ['@firstName', '=', 'Peter']))
});*/

//let result = Db.Select.All({ table: 'customer', columns: '*', where: [5, '=', 5] });

//console.log(result);

/*Db.Update({
    table: 'customer',
    columnValues: { isPro: 1 },
    where: ['@firstName', '=', 'Николай']
});*/

/*let newUser = {
    customerId: 'nnagibin',
    firstName: 'Николай',
    secondName: 'Нагибин',
    age: 25,
    isPro: 1
}

Db.Insert({ table: 'customer', columnValues: newUser });*/

/*Db.Delete({
    table: 'customer',
    where: ['@isPro', '=', 1]
});*/