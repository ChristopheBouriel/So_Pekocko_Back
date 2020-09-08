const fs = require('fs');

module.exports = (req, res, next) => {
    const regex1 = RegExp(/^[a-z0-9]{24}$/);
    const regex2 = RegExp(/^[A-Z\u00C0-\u00D6\u00D8-\u00DF]{1}[a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F '-]{2,30}$/);
    const regex3 = RegExp(/^[A-Z\u00C0-\u00D6\u00D8-\u00DF]{1}[a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F '-]{2,30}$/);
    const regex4 = RegExp(/^[A-Z\u00C0-\u00D6\u00D8-\u00DF]{1}[0-9a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F !?:(),\n\.'-]{2,600}$/);
    const regex5 = RegExp(/^[A-Z\u00C0-\u00D6\u00D8-\u00DF]{1}[a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F '-]{2,30}$/);
      
    try {  
        const sauceModif = req.file ?
        {
          ...JSON.parse(req.body.sauce)
        } : { ...req.body};
        
        let test1 = regex1.test(sauceModif.userId);
        let test2 = regex2.test(sauceModif.name);
        let test3 = regex3.test(sauceModif.manufacturer);
        let test4 = regex4.test(sauceModif.description);
        let test5 = regex5.test(sauceModif.mainPepper);

          if (test1===true && test2===true && test3===true && test4===true && test5===true) {
            next();
          } else {
            if (!req.file === false) {
              fs.unlink(`images/${req.file.filename}`, () => {});//effacer l'image parce qu'elle a déjà été enregistré par multer
            }
            
            throw 'Invalid entry';
            }
          
        } catch {
          res.status(401).json({ message:`images/${req.file.filename}`});
        }
      };