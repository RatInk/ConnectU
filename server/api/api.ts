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
    this.app.get('/hello', this.sayHello)
    this.app.get('/hello/secure', this.auth.authenticate.bind(this.auth), this.sayHelloSecure)
    this.app.get('/posts', this.auth.authenticate.bind(this.auth), this.getPosts)
    this.app.post('/posts', this.auth.authenticate.bind(this.auth), this.createPost)
    this.app.put('/posts', this.auth.authenticate.bind(this.auth), this.editPost)
  }
  // Methods
  private sayHello(req: Request, res: Response) {
    res.send('Hello There!')
  }

  private sayHelloSecure(req: Request, res: Response) {
    res.status(200).json({ message: 'Hello There from Secure endpoint!' })
  }

  private async register(req: Request, res: Response) {
    const { username, password } = req.body

    const conn = await backend.database.startTransaction()
    const users = await backend.database.executeSQL(`SELECT * FROM users WHERE username = '${username}'`, conn)

    if (users.length > 0) return res.status(401).json({ message: 'Username already exists' })

    const hashedPassword = await Authentication.hashPassword(password)

    const response = await backend.database.executeSQL('INSERT INTO users(username, password, role) VALUES ("'+ username +'" , "' + hashedPassword + '" , "user")', conn)

    console.log("registration: " + response)

    await backend.database.commitTransaction(conn)
  }

  private async getPosts(req: Request, res: Response) {
      const conn = await backend.database.startTransaction()

      try {
        const response = await backend.database.executeSQL('SELECT * FROM posts', conn)
        return res.status(200).json(response)
      } catch (error) {
        return res.status(500).json({ message: 'Error getting posts' })
      }


  }

  private async createPost(req: Request, res: Response) {
    const { title, content } = req.body

    const conn = await backend.database.startTransaction()

    const response = await backend.database.executeSQL('INSERT INTO posts(title, content) VALUES ('+ title +', ' + content + ')', conn)

    console.log("post creation: " + response)

    await backend.database.commitTransaction(conn)
  }

  private async editPost() {
    const { title, content } = req.body

  }

}
