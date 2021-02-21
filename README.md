# About this repo :

This is the back-end for a hot sauces rating app which has been made with Node.js and Express.  
A front-end had been provided by Openclassrooms as part of a project for their Junior Web Develepper training. You'll find the Github repository by following this link :  
https://github.com/OpenClassrooms-Student-Center/dwj-projet6  
You can get more details about this project in my portfolio :  
https://portfolio-christophe-bouriel.netlify.app  


## The API

In order to have a back-end as safe as I could given my knowledge on the moment, I tried to follow the recommendations of OWASP concerning the points on which the developper can take part. 
I installed packages downloaded from the npm registry, I wrote my own middlewares for user's inputs validation, but I also added verifications on some routes depending on the type of the request : for example, in order to be sure that the user wanting to modify or delete a sauce is the same one who created it.  


## The packages for security

The following packages have been used :
* [express-rate-limit](https://www.npmjs.com/package/express-rate-limit)
* [bcrypt](https://www.npmjs.com/package/bcrypt)
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
* [xss-filters](https://www.npmjs.com/package/xss-filters)
* [helmet](https://www.npmjs.com/package/helmet)
* [mongoose-unique-validator](https://www.npmjs.com/package/mongoose-unique-validator)
* [mongoose-validator*](https://www.npmjs.com/package/mongoose-validator)

*Well, this last one isn't usefull since in the end I preferred to make my own validators and it is employed only to check the email format.  


## The whole app

However, I already deployed the whole app on Internet so that you can directly use it.  
The front-end has been slightly improved to be responsive and is hosted on Netlify, this back-end is on Heroku and the data base on MongoDB Atlas, while the images are stored on Cloudinary.

