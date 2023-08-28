const {faker} = require('@faker-js/faker');
const axios = require('axios');

const makeFakeUserInfo = async (seed,length) => {
    
    faker.seed(seed);
    const userInfo = Array.from({length:length}).map(async ()=>{
        const response = await axios.get('https://picsum.photos/800');
        const imageUrl = response.request.res.responseUrl;
        return {
            email:faker.internet.email(),
            password:faker.internet.password(),
            name:faker.internet.userName(),
            phoneNumber:faker.phone.number('###########'),
            imageUrl: imageUrl
        }
    });

    const users = await Promise.all(userInfo);
    
    return users;
}

const getRandomValueFromArray = (array, value) => {
    const randomArray = [];
    while (randomArray.length < value) {
        randomArray.push(array[faker.number.int({ min: 0, max: array.length-1})]);
    }
    return randomArray;
}

const makeFakeFriend = (seed, users) => {
    faker.seed(seed);
    const userLength = users.length;

    const relation = users.map((user)=>{
        const relationValue = faker.number.int({min: 0, max:userLength-1});
        return [user, getRandomValueFromArray(users.filter((u)=>user!==u), relationValue)];
    })
    return relation;
}

const makeFakePost = async(seed, length, users) => {
    faker.seed(seed);
    const userLength = users.length;

    const postsFunction = Array.from({length:length}).map(async()=>{
        const userId = users[faker.number.int({min: 0, max:userLength-1})];
        const imageValue = faker.number.int({min: 1, max:6});
        const imagesFunction = Array.from({length:imageValue}).map(async()=>{
            const response = await axios.get('https://picsum.photos/800');
            return response.request.res.responseUrl;
        })
        const images = await Promise.all(imagesFunction);
        return {
            userId,
            content: faker.word.words({ count: { min: 1, max: 100 } }),
            likeCount: faker.number.int({min: 0, max: 65535}),
            imgUrl: images
        }
    })

    const posts = await Promise.all(postsFunction);
    
    return posts;

}

const makeFakeComment = async(seed, length, users, posts) => {
    faker.seed(seed);
    const userLength = users.length;
    const postLength = posts.length;

    const comments = Array.from({length:length}).map(()=>{
        const userId = users[faker.number.int({min: 0, max:userLength-1})];
        const postId = posts[faker.number.int({min: 0, max:postLength-1})];
        return {
            userId,
            postId,
            content: faker.word.words({ count: { min: 1, max: 10 } })
        }
    })

    return comments;
}

module.exports.makeFakeFriend = makeFakeFriend;
module.exports.makeFakeUserInfo = makeFakeUserInfo;
module.exports.makeFakePost = makeFakePost;
module.exports.makeFakeComment = makeFakeComment;