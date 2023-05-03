import mariadb from 'mariadb'
import { Pool } from 'mariadb'
import { USER_TABLE, TWEET_TABLE } from './schema'

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
    await this.executeSQL(USER_TABLE, conn)
    await this.executeSQL(TWEET_TABLE, conn)
    this.commitTransaction(conn)
  }

  public startTransaction = async ():Promise<mariadb.PoolConnection | null> => {
    try {
      const conn = await this._pool.getConnection()
      await conn.beginTransaction()
      return conn
    } catch (err) {
      console.log(err)
      return null
    }
  }

  public commitTransaction = async (conn: any) => {
    try {
      await conn.commit()
      conn.end()
    } catch (err) {
      console.log(err)
    }
  }

  public rollbackTransaction = async (conn: any) => {
    try {
      await conn.rollback()
      conn.end()
    } catch (err) {
      console.log(err)
    }
  }

  public executeSQL = async (query: string, conn: any):Promise<Array<any>> => {
    try {
      if (!conn) return []
      const res = await conn.query(query)
      console.log(query)
      conn.end()
      return res
    } catch (err) {
      console.log(err)
      return []
    }
  }
}