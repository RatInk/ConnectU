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
    await this.executeSQL(DB.DB1, conn)
    await this.executeSQL(DB.DB2, conn)
    await this.executeSQL(DB.DB3, conn)
    await this.executeSQL(DB.DB4, conn)
    await this.executeSQL(DB.DB5, conn)
    await this.executeSQL(DB.DB6, conn)
    if (!(await this.executeSQL("SELECT * FROM Roles;" ,conn ))) {
      await this.executeSQL(DB.DB7, conn)
      await this.executeSQL(DB.DB8, conn)
      await this.executeSQL(DB.DB9, conn)
      await this.executeSQL(DB.DB10, conn)
      await this.executeSQL(DB.DB11, conn)
      await this.executeSQL(DB.DB12, conn)
      await this.executeSQL(DB.DB13, conn)
      await this.executeSQL(DB.DB14, conn)
      await this.executeSQL(DB.DB15, conn)
      await this.executeSQL(DB.DB16, conn)
      await this.executeSQL(DB.DB17, conn)
      await this.executeSQL(DB.DB18, conn)
      await this.executeSQL(DB.DB19, conn)
      await this.executeSQL(DB.DB20, conn)
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
