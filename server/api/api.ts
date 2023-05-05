import { Request, Response, Express } from 'express'
import { Authentication } from '../authentication'

export class API {
  // Properties
  app: Express
  auth: Authentication
  // Constructor

  constructor(app: Express, auth: Authentication) {
    this.app = app
    this.auth = auth
    this.app.post('/register', this.register)
    this.app.get('/posts', this.auth.authenticate.bind(this.auth), this.getPosts)
    this.app.get('/post/:id', this.auth.authenticate.bind(this.auth), this.getPost)
    this.app.post('/post', this.auth.authenticate.bind(this.auth), this.createPost)
    this.app.put('/posts:id', this.auth.authenticate.bind(this.auth), this.editPost)
  }

  // Methods
  private async register(req: Request, res: Response) {
    const { username, password } = req.body

    const conn = await backend.database.startTransaction()
    const users = await backend.database.executeSQL(`SELECT * FROM Users WHERE username = '${username}'`, conn)

    if (users.length > 0) return res.status(401).json({ message: 'Username already exists' })

    const hashedPassword = await Authentication.hashPassword(password)

    const response = await backend.database.executeSQL('INSERT INTO Users(username, password, role) VALUES ("'+ username +'" , "' + hashedPassword + '" , "user")', conn)

    console.log("registration: " + response)

    await backend.database.commitTransaction(conn)
  }

  private async getPost(req: Request, res: Response) {
  
    const conn = await backend.database.startTransaction()
    const post_id = req.params.id

    try {
      const response = await backend.database.executeSQL('SELECT * FROM posts WHERE post_id = "' + post_id + '"', conn)
      await backend.database.commitTransaction(conn)
      return res.status(200).json(response)
    }
    catch (error) {
      await backend.database.commitTransaction(conn)
      return res.status(500).json({ message: 'Error getting post' })
    }
  }

  private async getPosts(req: Request, res: Response) {
      const conn = await backend.database.startTransaction()

      try {
        const response = await backend.database.executeSQL('SELECT * FROM Posts', conn)
        return res.status(200).json(response)
      } catch (error) {
        return res.status(500).json({ message: 'Error getting posts' })
      }
  }

  private async createPost(req: Request, res: Response) {
    const { username, title, content } = req.body

    console.log(username, title, content)
    const conn = await backend.database.startTransaction()

    try {
      await backend.database.executeSQL(`INSERT INTO Posts(username, title, content) VALUES ('${username}', '${title}', '${content}')`, conn)          
      await backend.database.commitTransaction(conn)

      return res.status(200).json("true")
    }
    catch (error){
      console.log(error)
      await backend.database.commitTransaction(conn)
      return res.status(500).json({ message: 'Error creating post' })
    }
  }

  private async editPost(req: Request, res: Response) {
    const { title, content } = req.body
    const post_id = req.params.id

    const conn = await backend.database.startTransaction()

    try {
      const response = await backend.database.executeSQL(`UPDATE posts SET title = "${title}", content = "${content}" WHERE post_id = "${post_id}"`, conn)
      await backend.database.commitTransaction(conn)
      return res.status(200).json(response)
    }
    catch {
      await backend.database.commitTransaction(conn)
      return res.status(500).json({ message: 'Error editing post' })
    }
  }
  private async deletePost(req: Request, res: Response) {
    const post_id = req.params.id

    const conn = await backend.database.startTransaction()

    try {
      const response = await backend.database.executeSQL(`DELETE FROM posts WHERE post_id = "${post_id}"`, conn)
      await backend.database.commitTransaction(conn)
      return res.status(200).json(response)
    }
    catch {
      await backend.database.commitTransaction(conn)
      return res.status(500).json({ message: 'Error deleting post' })
    }
  }

}
