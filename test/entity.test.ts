import { Db, Column, Entity, PrimaryKey, Table, DB } from "../src/index";

Db.Open('test/data.db');

@Table('customer')
class Customer extends Entity
{
    @PrimaryKey
    @Column
    customerId: string;
    
    @Column
    firstName: string;

    @Column
    secondName: string;

    @Column
    age: number;

    @Column
    isPro: boolean;

    getFullName()
    {
        console.log(this.firstName + (' ' + this.secondName || ''));
    }
}

@Table('movie')
class Movie extends Entity
{
    @PrimaryKey
    @Column
    movieId: number;

    @Column
    title: string;
}

//
//
//

let logEntityData = () =>
{
    console.log(Customer.entityData);
    console.log(Movie.entityData);
}

logEntityData();