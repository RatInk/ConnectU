import { Request, Response, Express } from 'express'
import { Authentication } from '../authentication'
import { backend } from '../index'

export class API {
  // Properties
  app: Express
  auth: Authentication
  // Constructor

  constructor(app: Express, auth: Authentication) {
    this.app = app
    this.auth = auth
    this.app.post('/register', this.register)
    // edit profile methods
    this.app.put('/user/:id', this.auth.authenticate.bind(this.auth), this.changeName)
    this.app.put('/user/:id', this.auth.authenticate.bind(this.auth), this.changePassword)
    this.app.delete('/user/:id', this.auth.authenticate.bind(this.auth), this.deleteUser)
    // need create methods
  }

  //Methods
  //Register
  private async register(req: Request, res: Response) {
    const { username, password } = req.body

    const conn = await backend.database.startTransaction()
    const users = await backend.database.executeSQL(`SELECT * FROM Users WHERE username = '${username}'`, conn)

    if (users.length > 0) return res.status(401).json({ message: 'Username already exists' })

    const hashedPassword = await Authentication.hashPassword(password)
    try {
      const response = await backend.database.executeSQL('INSERT INTO Users(username, password) VALUES ("' + username + '" , "' + hashedPassword + '")', conn)
      console.log("registration: " + response)
      await backend.database.commitTransaction(conn)
      return res.status(200).json(true)
    } catch {
      await backend.database.rollbackTransaction(conn)
      return res.status(500).json({ message: 'Error while registering' })
    }
  }

  // edit profile
  private async changeName(req: Request, res: Response) {
    const { newUsername } = req.body
    const Token = req.headers.authorization
    const oldUsername = backend.auth.verifyToken(Token as string).username

    const conn = await backend.database.startTransaction()

    const result = await backend.database.executeSQL(`SELECT * FROM Users WHERE username = "${oldUsername}"`, conn)

    if (result.length === 0) return res.status(404).json({ message: 'User not found' })

    try {
      await backend.database.executeSQL(`UPDATE Users SET username = "${newUsername}" WHERE username = "${result[0].username}"`, conn)
      await backend.database.commitTransaction(conn)
      return res.status(200).json({ message: 'Username changed' })
    } catch (error) {
      console.log(error)
      await backend.database.rollbackTransaction(conn)
      return res.status(500).json({ message: 'Error while changing username' })
    }
  }

  private async changePassword(req: Request, res: Response) {
    const { newPassword } = req.body
    const Token = req.headers.authorization
    const usernameToken = backend.auth.verifyToken(Token as string).username

    const newHashedPassword = await Authentication.hashPassword(newPassword)

    const conn = await backend.database.startTransaction()

    const result = await backend.database.executeSQL(`SELECT * FROM Users WHERE username = "${usernameToken}"`, conn)
    if (result.length === 0) return res.status(404).json({ message: 'User not found' })

    try {
      await backend.database.executeSQL(`UPDATE Users SET password = "${newHashedPassword}" WHERE username = "${usernameToken}"`, conn)
      await backend.database.commitTransaction(conn)
      return res.status(200).json({ message: 'Password changed' })
    } catch (error) {
      console.log(error)
      await backend.database.rollbackTransaction(conn)
      return res.status(500).json({ message: 'Error while changing password' })
    }
  }

  // admin functions
  private async deleteUser(req: Request, res: Response) {
    const username = req.params.username
    const Token = req.headers.authorization
    const admin = backend.auth.verifyToken(Token as string)

    const conn = await backend.database.startTransaction()

    const user = await backend.database.executeSQL(`SELECT * FROM Users WHERE username = "${username}"`, conn)
    if (user.length === 0) return res.status(404).json({ message: 'User not found' })

    if (admin.role === 'admin') {
      try {
        await backend.database.executeSQL(`DELETE FROM Users WHERE username = "${username}"`, conn)
        await backend.database.commitTransaction(conn)
        return res.status(200).json({ message: 'User deleted' })
      } catch (error) {
        console.log(error)
        await backend.database.rollbackTransaction(conn)
        return res.status(500).json({ message: 'Error while deleting user' })
      }
    }
    return res.status(401).json({ message: 'Unauthorized' })
  }
}
