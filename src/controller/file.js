// express router
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs').promises;

//env
const PATH = process.env.SERVER_PATH;
const SERVER_DOMAIN = process.env.SERVER_DOMAIN;

// model
const {updateUserImg} = require(PATH + '/src/model/account');

const uploadDirectory = PATH + '/src/view/image/profile';

router.post('/upload', upload.single('file') , async (req, res)=>{
    try{
        const userId = res.locals.userId;
        if (!req.file) {
          return res.status(400).json({ message: '파일을 찾을 수 없습니다.' });
        }
        
        const point = req.file.originalname.lastIndexOf('.');
        const extension = req.file.originalname.slice(point);
        await fs.rename(req.file.path, `${uploadDirectory}/${userId}${extension}`);
        const fileLocation = SERVER_DOMAIN + `/image/profile/${userId}${extension}`;
        const [response, state] = await updateUserImg(userId, fileLocation);
        if(state !== 'SUCCESS'){
            throw response;
        }
        res.json({state:"SUCCESS"});
    }catch(err){
        console.error(err);
        res.status(500);
        res.json({state:"ERROR"});
    }
});

module.exports = router;