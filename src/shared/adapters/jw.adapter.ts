import jwt from 'jsonwebtoken';
import { env } from '../../config';

export class jwtAdapter {

    static generatetJWT<T>(payload:any, duration: number = 86400):Promise<T | null>{ // 86400 -> 24h
        return new Promise((resolve) => {
          
            jwt.sign(payload, env.JWT_SECRET, { expiresIn: duration }, 

                (err, token) => {
                if (err) return resolve(null);
                resolve(token as T);   
                }
            )
            
        });
    }

    static validatetJWT<T>(token:string):Promise<T | null>{
        return new Promise((resolve) => {
            
            jwt.verify(token, env.JWT_SECRET, 
                (err, decoded) => {
                    if (err) return resolve(null);
                    resolve(decoded as T);   
                    
            });
            
        });
    }
   
    static decodeJWT<T>(token:string):Promise<T | null>{
        return new Promise((resolve) => {
            jwt.verify(token, env.JWT_SECRET, 
                    { ignoreExpiration: true }, // Ignora la expiración
                    (err, decoded) => {
                        if (err) return resolve(null);
                        resolve(decoded as T);   
                    }
            );
        });
    }
  
  }