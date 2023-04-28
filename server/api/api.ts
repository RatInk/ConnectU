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
    this.app.get('/hello', this.sayHello)
    this.app.get('/hello/secure', this.auth.authenticate.bind(this.auth), this.sayHelloSecure)
  }
  // Methods
  private sayHello(req: Request, res: Response) {
    res.send('Hello There!')
  }

  private sayHelloSecure(req: Request, res: Response) {
    res.status(200).json({ message: 'Hello There from Secure endpoint!' })
  }
}
