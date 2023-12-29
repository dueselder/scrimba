import { tweetsData } from './data.js';
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
import { getFeedHtml } from './index.js';

export function handleLikeClick(id, isReply = false){
    let targetObj;

    console.log('handleLikeClick called with id:', id, 'isReply:', isReply);

    if (isReply === true) {
        tweetsData.forEach(tweet => {
            const reply = tweet.replies.find(reply => reply.uuid === id);
            if (reply) {
                targetObj = reply;
            }
        });
    } else {
        targetObj = tweetsData.find(tweet => tweet.uuid === id);
    }

    if (!targetObj) {
        console.log(targetObj)
        console.error('No tweet or reply found with the given id');
        return;
    }

    if (targetObj.isLiked){
        targetObj.likes--;
    } else {
        targetObj.likes++;
    }



    targetObj.isLiked = !targetObj.isLiked;
    render();
}

export function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    localStorage.setItem('tweetsData', JSON.stringify(tweetsData));
    render() 
}

export function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')

    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === replyId
    })[0]
    targetTweetObj.isHidden = !targetTweetObj.isHidden
    localStorage.setItem('tweetsData', JSON.stringify(tweetsData));
    console.log(tweetsData)
    render()
}

export function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    localStorage.setItem('tweetsData', JSON.stringify(tweetsData));
    render()
    tweetInput.value = ''
    }
}

export function handleReplyBtnClick(tweetId){
    const replyInput = document.getElementById(`reply-${tweetId}`)
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId})[0]

    if(replyInput.value){
        targetTweetObj.replies.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: replyInput.value,
            replies: [],
            isHidden: true,
            isReply: true,
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    }
    localStorage.setItem('tweetsData', JSON.stringify(tweetsData));
    render()
    replyInput.value = ''
}

export function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}