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
    this.app.get('/posts', this.auth.authenticate.bind(this.auth), this.getPosts)
    this.app.get('/post', this.auth.authenticate.bind(this.auth), this.getUserPosts)
    this.app.post('/post', this.auth.authenticate.bind(this.auth), this.createPost)
    this.app.put('/post/:id', this.auth.authenticate.bind(this.auth), this.editPost)
    this.app.delete('/post/:id', this.auth.authenticate.bind(this.auth), this.deletePost)
    this.app.post('/comment' , this.auth.authenticate.bind(this.auth), this.createComment)
    this.app.put('/comment/:id', this.auth.authenticate.bind(this.auth), this.editComment)
    this.app.get('/comments/:post_id', this.auth.authenticate.bind(this.auth), this.getPostComments)
    this.app.delete('/comment/:id', this.auth.authenticate.bind(this.auth), this.deleteComment)
    this.app.post('/like/:post_id', this.auth.authenticate.bind(this.auth), this.likePost)
    this.app.post('/dislike/:post_id', this.auth.authenticate.bind(this.auth), this.dislikePost)
  }

  // Methods
  //Register
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

  //Posts
  private async getUserPosts(req: Request, res: Response) {
    const Token = req.headers.authorization
    const conn = await backend.database.startTransaction()
    const username = backend.auth.verifyToken(Token as string).username


    try {
      const response = await backend.database.executeSQL('SELECT * FROM posts WHERE username = "' + username + '"', conn)
      await backend.database.commitTransaction(conn)
      return res.status(200).json(response)
    }
    catch (error) {
      await backend.database.commitTransaction(conn)
      return res.status(500).json({ message: 'Error while getting post' })
    }
  }

  private async getPosts(req: Request, res: Response) {
      const conn = await backend.database.startTransaction()

      try {
        const response = await backend.database.executeSQL('SELECT * FROM Posts', conn)
        return res.status(200).json(response)
      } catch (error) {
        return res.status(500).json({ message: 'Error while getting posts' })
      }
  }

  private async createPost(req: Request, res: Response) {
    const { username, title, content } = req.body
    const conn = await backend.database.startTransaction()

    try {
      await backend.database.executeSQL(`INSERT INTO Posts(username, title, content) VALUES ('${username}', '${title}', '${content}')`, conn)          
      await backend.database.commitTransaction(conn)

      return res.status(200).json(true)
    }
    catch (error){
      console.log(error)
    await backend.database.commitTransaction(conn)
      return res.status(500).json({ message: 'Error while creating post' })
    }
  }

  private async editPost(req: Request, res: Response) {
    const { title, content } = req.body
    const post_id = req.params.id
    const Token = req.headers.authorization
    const userToken = backend.auth.verifyToken(Token as string)
    const conn = await backend.database.startTransaction()

    const post = await backend.database.executeSQL(`SELECT * FROM Posts WHERE post_id = "${post_id}"`, conn)
    const user = await backend.database.executeSQL(`SELECT * FROM Users WHERE username = "${userToken.username}"`, conn)
    if (post.length === 0) return res.status(404).json({ message: 'Post not found' })
    if (user.length === 0) return res.status(404).json({ message: 'User not found' })


    if (user[0].role === 'admin' || user[0].role === 'moderator' || post[0].username === userToken.username) {
        try {
        const response = await backend.database.executeSQL(`UPDATE Posts SET title = "${title}", content = "${content}" WHERE post_id = "${post_id}"`, conn)
        await backend.database.commitTransaction(conn)
        return res.status(200).json(true)
      }
      catch {
        await backend.database.commitTransaction(conn)
        return res.status(500).json({ message: 'Error while editing post' })
      }
    }
  }

  private async deletePost(req: Request, res: Response) {
    console.log("delete post")
    const post_id = req.params.id
    const Token = req.headers.authorization
    // get username from token in cookie
    const conn = await backend.database.startTransaction()
    //get username from the JWT Token
    const userToken = backend.auth.verifyToken(Token as string)

    const post = await backend.database.executeSQL(`SELECT * FROM Posts WHERE post_id = "${post_id}"`, conn)
    const user = await backend.database.executeSQL(`SELECT * FROM Users WHERE username = "${userToken.username}"`, conn)
    if (post.length === 0) return res.status(404).json({ message: 'Post not found' })
    if (user.length === 0) return res.status(404).json({ message: 'User not found' })

    if (user[0].role === 'admin' || user[0].role === 'moderator' || post[0].username === userToken.username) {
      try {
        await backend.database.executeSQL(`DELETE FROM Posts WHERE post_id = "${post_id}"`, conn)
        await backend.database.commitTransaction(conn)
        return res.status(200).json({ message: 'Post deleted' })
      }
      catch (error) {
        console.log(error)
        await backend.database.rollbackTransaction(conn)
        return res.status(500).json({ message: 'Error while deleting post' })
      }
    }
    return res.status(401).json({ message: 'Unauthorized' })
    


    
  }

  //Comments
  private async getPostComments(req: Request, res: Response) {
    const { username, content } = req.body
    const post_id = req.params.post_id

    const conn = await backend.database.startTransaction()

    try {
      const response = await backend.database.executeSQL(`SELECT * FROM Comments WHERE id_post = "${post_id}"`, conn)
      await backend.database.commitTransaction(conn)
      return res.status(200).json(response)
    } catch (error) {
      await backend.database.rollbackTransaction(conn)
      return res.status(500).json({ message: 'Error while getting comments' })
    }
  }

  private async createComment(req: Request, res: Response) {
    const { username, content, post_id } = req.body

    console.log(username, content, post_id)
    const conn = await backend.database.startTransaction()

    try {
      await backend.database.executeSQL(`INSERT INTO Comments(username, content, id_post) VALUES ('${username}', '${content}', ${post_id})`, conn)          
      await backend.database.commitTransaction(conn)
      return res.status(200).json(true)
    }
    catch (error){
      console.log(error)
    await backend.database.commitTransaction(conn)
      return res.status(500).json({ message: 'Error while creating comment' })
    }
  }

  private async editComment(req: Request, res: Response) {
    const { content } = req.body
    const comment_id = req.params.id
    const Token = req.headers.authorization
    const userToken = backend.auth.verifyToken(Token as string)

    const conn = await backend.database.startTransaction()

    const comment = await backend.database.executeSQL(`SELECT * FROM Posts WHERE post_id = "${comment_id}"`, conn)
    const user = await backend.database.executeSQL(`SELECT * FROM Users WHERE username = "${userToken.username}"`, conn)
    if (comment.length === 0) return res.status(404).json({ message: 'Post not found' })
    if (user.length === 0) return res.status(404).json({ message: 'User not found' })

    if (user[0].role === 'admin' || user[0].role === 'moderator' || comment[0].username === userToken.username) {
      try {
        const response = await backend.database.executeSQL(`UPDATE posts SET content = "${content}" WHERE comment_id = "${comment_id}"`, conn)
        await backend.database.commitTransaction(conn)
        return res.status(200).json(response)
      }
      catch {
        await backend.database.commitTransaction(conn)
        return res.status(500).json({ message: 'Error while editing comment' })
      }
    }
  }

  private async deleteComment(req: Request, res: Response) {
    const comment_id = req.params.id
    const Token = req.headers.authorization
    // get username from token in cookie
    const conn = await backend.database.startTransaction()
    //get username from the JWT Token
    const userToken = backend.auth.verifyToken(Token as string)

    const comment = await backend.database.executeSQL(`SELECT * FROM Comments WHERE comment_id = "${comment_id}"`, conn)
    const user = await backend.database.executeSQL(`SELECT * FROM Users WHERE username = "${userToken.username}"`, conn)
    if (comment.length === 0) return res.status(404).json({ message: 'Comment not found' })
    if (user.length === 0) return res.status(404).json({ message: 'User not found' })

    if (user[0].role === 'admin' || user[0].role === 'moderator' || comment[0].username === userToken.username) {
      try {
        await backend.database.executeSQL(`DELETE FROM Comments WHERE comment_id = "${comment_id}"`, conn)
        await backend.database.commitTransaction(conn)
        return res.status(200).json({ message: 'Comment deleted' })
      }
      catch (error) {
        console.log(error)
        await backend.database.rollbackTransaction(conn)
        return res.status(500).json({ message: 'Error while deleting comment' })
      }
    }
    return res.status(401).json({ message: 'Unauthorized' })
  }

  //dis/like posts
  private async likePost(req: Request, res: Response) {
    const username = req.body
    const post_id = req.params.post_id

    const conn = await backend.database.startTransaction()

    try {
      await backend.database.executeSQL(`INSERT INTO Likes(username, id_post) VALUES ('${username}', ${post_id})`, conn)          
      await backend.database.commitTransaction(conn)
      return res.status(200).json(true)
    }
    catch (error){
      console.log(error)
    await backend.database.rollbackTransaction(conn)
      return res.status(500).json({ message: 'Error while liking post' })
    }
  }

  private async dislikePost(req: Request, res: Response) {
    const username = req.body
    const post_id = req.params.post_id

    const conn = await backend.database.startTransaction()

    try {
      await backend.database.executeSQL(`DELETE FROM Likes WHERE username = "${username}" AND id_post = ${post_id}`, conn)          
      await backend.database.commitTransaction(conn)
      return res.status(200).json(true)
    } catch (error){
      console.log(error)
    await backend.database.rollbackTransaction(conn)
      return res.status(500).json({ message: 'Error while disliking post' })
    }
  }

  // edit profile

  private async changeName(req: Request, res: Response) {
    const 
  }

}
