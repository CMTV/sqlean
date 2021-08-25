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

//
//
//

let logEntityData = () =>
{
    console.log(Customer.entityData);
}

let getById = () =>
{
    let cmtv = Customer.getById([5]);
    cmtv.getFullName();
}

let save = () =>
{
    let newCustomer = new Customer;
        newCustomer.customerId = 'newCustomer';
        newCustomer.firstName = 'John'
        newCustomer.age = 38;
        newCustomer.isPro = true;
    
    newCustomer.save();
}

let deleteEntity = () =>
{
    let newCustomer = Customer.getById('newCustomer');

    if (newCustomer)
        newCustomer.delete();
}

//
//
//

deleteEntity();