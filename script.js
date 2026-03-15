
buttonColours=["red", "blue", "green", "yellow"];
gamePattern=[];
userClickedPattern=[];
level=0;
var currentScore=0;
var highestScore=0

// var started=1;   this i as doing which does not make sense  i can do this way but leave
// if(started===1){            i have to put it in a function then I have to call it some time
//     started=1;                  her logic is great
    // $(document).one('keydown',nextSequence);
// }

started=1;
$(document).keydown(function(){
    if(started)
    {
        started=0;   // see i have not removed the event listener but even after pressing 
        nextSequence();  //  any key nothing happens  and i will make started=1 at required situation
    }        
});

// which button got pressed 
// $('.btn').click(function(event){

$('.btn').click(clickHandler);

function clickHandler(event){
    var userChosenColour;
    userChosenColour=event.target.id;      
    // or userChosenColour=this.id;         //remember event.target===this ✓ ✅)    
    // or userChosenColour=$(this).attr('id');
    console.log(this.id);
    userClickedPattern.push(event.target.id);
    // console.log(userClickedPattern);

    playSound(this.id);
    animatePress(event.target.id);

    checkAnswer(userClickedPattern.length-1)
}

function nextSequence(){

    userClickedPattern = [];
    var randomNumber=Math.floor(Math.random()*4);
    console.log(randomNumber);
    var randomChosenColour = buttonColours[randomNumber];
    console.log(randomChosenColour);
    gamePattern.push(randomChosenColour);

    $(`#${randomChosenColour}`).animate({opacity:0}, function(){
        setTimeout(function(){
            $(`#${randomChosenColour}`).animate({opacity:1});
        },10);
    }); //or           
    // $(`#${randomChosenColour}`).fadeOut(100).fadeIn(100);

    // console.log(`./sounds/${randomChosenColour}.mp3`);
    playSound(randomChosenColour);

    // lec 175
    level++;
    $('h1').text('Level '+ level)

    
}


// nextSequence();  //this is giving error since it call the Audio's play function without human interction
// it will work without human interction only when we change the chrome settings
// just go to settings =>privacy and security => site-settings =>open Additional content settings
// go to sound and then add your local url to - Allowed to play sound  done

// $(document).click(nextSequence);// it is required since audio cant play directly without human interection 
// provided you have not changed the settings
// use chrome and call nextSequence() from console (human interection)


async function checkAnswer(currentLevel){

    console.log(gamePattern);
    console.log(userClickedPattern)
    if(gamePattern[currentLevel]===userClickedPattern[currentLevel])
    {
        console.log('success');

        if(userClickedPattern.length===gamePattern.length){
            currentScore+=10;
            $('.cs').text(`Current Score - ${currentScore}`);
            setTimeout(function(){
                nextSequence();
            },1000);
        }
    }
    else{
        console.log('wrong');
        started=1;
        level=0;
        gamePattern=[];
        var lastScore=currentScore;
        if(currentScore>highestScore){
            highestScore=currentScore;
            $('.hs').text(`Highest Score - ${highestScore}`);
        }
        $('.ls').text(`Last Score - ${lastScore}`);
        currentScore=0;
        $('.cs').text(`Current Score - ${currentScore}`);
        console.log('in else level ->'+ level);
        $('h1').text('You Lost, Press any key to play again !');        
        // setTimeout(function(){ not needed
        //     nextSequence();
        // },1000);

        playSound('wrong');
        $('body').addClass('game-over');
        setTimeout(function(){
            $('body').removeClass('game-over');
        },200);

        // this 2 lines i have written just now becoz even after player looses the game 
        // click event is still there which should not be the case hence i removed the click event from btn
        // once the player lost the game 
        // and then i called  await waitForKey(); which attches the an keydown event to 
        // whole document and this event will run the linked anonymous function
        // when ever the event happens 
        // when event happens that is 
        // user pressed any button then anonymous function runs which again attches the clickHandler
        // to all the 4 buttons and then resolve the promise so that the execution continues
        // i can also do one thing extra here that is 
        // instarting i have written $(document).keydown 
        // instead of this i can write $(document).one('keydown', ()=>{.....})
        // and then again attch this for once in waitkey resolution can be done
        // due this that if block will not be required in $(document).keydown function

        $('.btn').off();
        await waitForKey();

    }
}

async function waitForKey() {
    return new Promise(resolve => {
        $(document).one('keydown', function() {
            // setTimeout(function() {       not imp just waiting
            //     resolve("Done waiting");
            // }, 3000);
            $('.btn').click(clickHandler);
            resolve(); // Resumes your async function
        });
    });
}

function playSound(name){
    var audio=new Audio(`./sounds/${name}.mp3`);
    audio.play();
}

function animatePress(currentColour){
    $('#'+currentColour).addClass('pressed');
    setTimeout(function(){
        $('#'+currentColour).toggleClass('pressed');  //removeClass ✓ ✅
    },100)
}

