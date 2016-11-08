/**
 * Created by huangxueping on 2016/11/6.
 */
$(function(){

    //赢法数组
    var wins=[];
    for(var i=0;i<15;i++){
        wins[i]=[];
        for(var j=0;j<15;j++){
            wins[i][j]=[];
        }
    }

    var count=0;
    for(var i=0;i<15;i++){
        for(var j=0;j<11;j++){
            for(var k=0;k<5;k++){
                wins[i][j+k][count]=true;
            }
            count++;
        }
    }

    for(var i=0;i<15;i++){
        for(var j=0;j<11;j++){
            for(var k=0;k<5;k++){
                wins[j+k][i][count]=true;
            }
            count++;
        }
    }
    for(var i=0;i<11;i++){
        for(var j=0;j<11;j++){
            for(var k=0;k<5;k++){
                wins[i+k][j+k][count]=true;
            }
            count++;
        }
    }
    for(var i=0;i<11;i++){
        for(var j=14;j>3;j--){
            for(var k=0;k<5;k++){
                wins[i+k][j-k][count]=true;
            }
            count++;
        }
    }

    //赢法数组
    var myWin=[];//人
    var computerWin=[];//电脑
    var over=false;
    for(var i=0;i<count;i++){
        myWin[i]=[];
        computerWin[i]=[];
    }




    var chessBoard=[];//避免重复落子
    for(var i=0;i<15;i++){
        chessBoard[i]=[];
        for(var j=0;j<15;j++){
            chessBoard[i][j]=0;
        }
    }




    var canvas=document.getElementById("chess");

    var context=canvas.getContext("2d");
   // context.strokeStyle="#BFBFBF";

    context.strokeStyle=" #080808";//线的颜色


    var em=true;
    //画背景图片（先加载）
   var logo= new Image();
    logo.src="images/wuziqi.jpg";
    logo.onload=function(){
        context.drawImage(logo,0,0,450,450);
        drawchess();
    }

    //画棋盘
var drawchess=function(){
    for(i=0;i<15;i++){
        //纵坐标不变，横坐标变化
        context.moveTo(15+30*i,15);
        context.lineTo(15+30*i,435);
        context.stroke();
        //横坐标不变，纵坐标变化
        context.moveTo(15,15+30*i);
        context.lineTo(435,15+30*i);
        context.stroke();
    }
}

    //画棋子
    var onestep=function(i,j,em){
        context.beginPath();
        context.arc(15+i*30,15+j*30,13,0,2*Math.PI);//画圆---x,y,r，起始角度，结束角度）
        context.closePath();

        //渐变颜色
        var gradient= context.createRadialGradient(15+i*30+2,15+j*30-2,13,15+i*30+2,15+j*30-2,0);
        if(em){
            gradient.addColorStop(0,"#0A0A0A");
            gradient.addColorStop(1,"#636766");
        }else{
            gradient.addColorStop(0,"#D1D1D1");
            gradient.addColorStop(1,"#F9F9F9");
        }

        context.fillStyle=gradient;
        context.fill();
    }



    canvas.onclick=function(e){//鼠标的点击事件
        if(over){
            return;
        }
        if(!em){
            return;
        }
        var x= e.offsetX;
        var y= e.offsetY;
        var i=Math.floor(x/30);
        var j=Math.floor(y/30);
        if(chessBoard[i][j]==0){
            onestep(i,j,em);
            chessBoard[i][j]=1;

            for(var k=0;k<count;k++){
                if(wins[i][j][k]){
                    myWin[k]++;
                    computerWin[k]=6;
                    if(myWin[k]==5){//五个字连在一起
                        alert("你赢了");
                        over=true;
                    }
                }
            }
            if(!over){
                em=!em;
                computerAI();
            }
        }

    }

    var computerAI=function(){
        var myScore=[];
        var computerScore=[]
        var max=0;
        var u= 0;
        var v=0;

        for(var i=0;i<15;i++){
            myScore[i]=[];
            computerScore[i]=[];
            for(var j=0;j<15;j++){
                myScore[i][j]=0;
                computerScore[i][j]=0;
            }

        }
        for(var i=0;i<15;i++){
            for(var j=0;j<15;j++){
                if(chessBoard[i][j]==0){
                    for(var k=0;k<count;k++){
                        if(wins[i][j][k]){
                            if(myWin[k]==1){
                                myScore[i][j]+=200;
                            }else if(myWin[k]==2){
                                myScore[i][j]+=400;
                            }else if(myWin[k]==3){
                                myScore[i][j]+=2000;
                            }else if(myWin[k]==4){
                                myScore[i][j]+=10000;
                            }
                            if(computerScore[k]==1){
                                computerScore[i][j]+=220;
                            }else if(myWin[k]==2){
                                computerScore[i][j]+=420;
                            }else if(myWin[k]==3){
                                computerScore[i][j]+=2200;
                            }else if(myWin[k]==4){
                                computerScore[i][j]+=10000;
                            }
                        }

                    }

                    if(myScore[i][j]>max){
                        max=myScore[i][j];
                        u=i;
                        v=j;
                    }else if(myScore[i][j]==max){
                        if(computerScore[i][j]>computerScore[u][v]){
                            u=i;
                            v=j;
                        }
                    }
                    if(computerScore[i][j]>max){
                        max=computerScore[i][j];
                        u=i;
                        v=j;
                    }else if(computerScore[i][j]==max){
                        if(myScore[i][j]>myScore[i][j]){
                            u=i;
                            v=j;
                        }
                    }
                }
            }

        }
        onestep(u,v,false);
        chessBoard[u][v]=2;

        for(var k=0;k<count;k++){
            if(wins[u][v][k]){
                computerWin[k]++;
                myWin[k]=6;
                if(computerWin[k]==5){//五个字连在一起
                    alert("计算机赢了");
                    over=true;
                }
            }

        }
        if(!over){
            em=!em;

        }
    }
});
