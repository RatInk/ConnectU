import mariadb from 'mariadb'
import { Pool } from 'mariadb'
import * as DB from './schema'

export class Database {
  // Properties
  private _pool: Pool
  // Constructor
  constructor() {
    this._pool = mariadb.createPool({
      database: process.env.DB_NAME || 'minitwitter',
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'minitwitter',
      password: process.env.DB_PASSWORD || 'supersecret123',
      connectionLimit: 5,
    })
    this.initializeDBSchema()
  }
  // Methods
  private initializeDBSchema = async () => {
    console.log('Initializing DB schema...')
    const conn = await this.startTransaction()
    try {
      await this.executeSQL(DB.DB1, conn)
      await this.executeSQL(DB.DB2, conn)
      await this.executeSQL(DB.DB3, conn)
      await this.executeSQL(DB.DB4, conn)
      await this.executeSQL(DB.DB5, conn)
      await this.executeSQL(DB.DB6, conn)
    } catch (error) {
      console.log(error)
      await this.rollbackTransaction(conn)
    }

    try { 
      await this.executeSQL(DB.DB7, conn)
    } catch (error) {
      console.log(error)
      await this.rollbackTransaction(conn)
    }
    
    await this.commitTransaction(conn)
  }

  public startTransaction = async () => {
    try {
      const conn = await this._pool.getConnection()
      await conn.beginTransaction()
      return conn
    } catch (err) {
      console.log(err)
    }
  }

  public executeSQL = async (query: string, conn: any) => {
    try {
      console.log(query)
      const res = await conn.query(query)
      return res
    } catch (err) {
      await this.rollbackTransaction(conn)
      console.log(err)
      
    }
  }

  public commitTransaction = async (conn: any) => {
    try {
      await conn.commit()
      conn.release()
    } catch (err) {
      console.log(err)
    }
  }

  public rollbackTransaction = async (conn: any) => {
    try {
      await conn.rollback()
      conn.release()
    } catch (err) {
      console.log(err)
    }
  }

}
