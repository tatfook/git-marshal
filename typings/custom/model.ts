import * as Sequelize from 'sequelize';

export interface IAdmin extends Sequelize.Model {
    readonly id: number;
    username: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IGuard extends Sequelize.Model {
    readonly id: number;
    name: string;
    url: string;
    repoCount: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IRepo extends Sequelize.Model {
    readonly id: number;
    name: string;
    space: string;
    path: string;
    guardId: number;
    createdAt?: Date;
    updatedAt?: Date;
}
