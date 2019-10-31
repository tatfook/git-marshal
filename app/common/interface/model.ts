import * as Sequelize from 'sequelize';

export interface IAdmin extends Sequelize.Model {
    id: number;
    username: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IGuard extends Sequelize.Model {
    id: number;
    name: string;
    url: string;
    repoCount: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IRepo extends Sequelize.Model {
    id: number;
    name: string;
    path: string;
    guardId: number;
    spaceId: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ISpace extends Sequelize.Model {
    id: number;
    name: string;
    userId: string;
    repoCount: number;
    createdAt?: Date;
    updatedAt?: Date;
}
