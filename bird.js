// 写js代码

// 小鸟路径的数组
var birdArr = ['images/0.gif','images/1.gif','images/2.gif'];
// 上下文(画笔)
var context;  //undefined
// 创建背景对象
var backGround = new BackGround(0,0,400,600,'images/bg.png');
// 创建地板对象
var floor = new Floor(0,550,400,50,'images/ground.png');
// 创建下面障碍物对象
var downPipe = new Pipe(0,400,100,150,'images/pipe.png');
// 创建上面障碍物的对象
var upPipe = new Pipe(0,0,100,150,'images/pipe.png');
// 创建小鸟对象
var bird = new Bird(30,259,42,32,'images/0.gif');
// 标记第几次绘制小鸟
var index = 0;
// 定时器的标记
var tid;
// 分数
var score = 0;
// 是否开始计分
var isScore;
// 移动速度
var velocity = 10;
// 游戏是否结束
var gameOver;
// on:代表事件的标识
// load: 代表具体的事件
// 浏览器窗口加载完毕的事件
window.onload = function () {
	// 1.取得画布
	var canvas = document.getElementById('canvas');
	console.log(canvas);
	// 2.拿到画笔(上下文context),context才有值
	context = canvas.getContext('2d');
	// 添加事件(按键)
	document.onkeyup = keyup;
	document.onclick = reload;
	// 定时器,延迟调用,每隔几毫秒调用一个函数
	// setInterval(a,b),a是需要重复调用的函数,b是毫秒数
	tid = setInterval(drawAll,80);
	// 3.画画
}
// 重新开始
function reload() {

	if (gameOver) {
			// 刷新网页
		window.location.reload();
	}

}
// 按键松开响应的事件
function keyup (evt) {
	// arguments:函数参数的集合
	// console.log(arguments[0]);
	// evt:事件对象,window.evt:兼容IE
	evt = evt || window.evt;
	// 键码(ASCII)
	// 空格键键码是32
	var currentKey = evt.keyCode || evt.charCode;
	if (currentKey == 32) {
		if (bird.Y < 5) {
			bird.Y = 0;
		} else {
			// 小鸟上升
		    bird.Y -= 80;
		}
		
	}
	
}

// 绘制所有的图片
function drawAll() {
	// 清除画布
	context.clearRect(0,0,400,600);
	backGround.drawBgImage();
	floor.drawFloorImage();
	downPipe.drawDownPipe();
	upPipe.drawUpPipe();
	bird.drawBird();
	move();
}
// 移动
function move () {
	// 让小鸟下降,改变y坐标
	bird.Y += 10;
	if (downPipe.X + downPipe.width <= 0) {
		// 从右边重新绘制障碍物
		downPipe.X = 400;
		upPipe.X = 400;
		// 随机设置障碍物的高度,并且保证上下障碍物的距离不变(200)
		//上面障碍物的高度100-300
		upPipe.height = Math.random() * 200 + 100;
		// 下面障碍物的y点坐标
		downPipe.Y = upPipe.height + 200;
		downPipe.height = 550 - downPipe.Y;
		// 开始计分
		isScore = true;
	} else {
		downPipe.X -= velocity;
		upPipe.X -= velocity;
	}
	// 和地板碰撞
	var floorCondition = bird.Y + bird.height >= floor.Y + 5;
	// 天花板碰撞
	var ceilCondition = bird.Y == 0;
	// 上管道的碰撞
	// 左上角的点
	var leftTop = (bird.X >= upPipe.X && bird.X <= upPipe.X + upPipe.width) && (bird.Y <= upPipe.height + 5);
	// 右上角点
	var rightTop = (bird.X + bird.width >= upPipe.X + 20 && bird.X + bird.width <= upPipe.X + upPipe.width) && (bird.Y <= upPipe.height + 5);
	// 左下角
	var leftBottom = (bird.X >= downPipe.X && bird.X <= downPipe.X + downPipe.width) && (bird.Y + bird.height >= downPipe.Y);
	var rightBottom = (bird.X + bird.width >= downPipe.X + 20 && bird.X + bird.width <= downPipe.X + downPipe.width) && (bird.Y + bird.height >= downPipe.Y);
	if (floorCondition || ceilCondition || leftTop || rightTop || leftBottom || rightBottom) {
		// 关闭定时器
		clearInterval(tid);
		// 游戏结束
		gameOver = true;
		// 在画布上显示分数
		// 设置文字颜色
		context.fillStyle = 'red';
		// 设置字体大小
		context.font = '20px 黑体';
		// 画文字
		// context.fillText(文字内容,x,y)
		context.fillText('游戏结束,分数为:'+score,100,100);
	}

	if (isScore && bird.X >= upPipe.X + upPipe.width) {
		score++;
		if (score % 3 == 0) {
			velocity += 5;
		}
		// 不要计分了
		isScore = false;
	}
}
// 背景的构造函数
function BackGround (x,y,width,height,src) {
	// 添加属性
	this.X = x;
	this.Y = y;
	this.width = width;
	this.height = height;
	// 创建图片
	var bgImage = new Image();
	// src属性:设置图片的路径
	bgImage.src = src;
	this.bgImage = bgImage;
	// 方法
	this.drawBgImage = function () {
		// 绘制背景图片
		// context.drawImage(图片对象,图片的X,图片的Y,图片的width,图片的高);
		context.drawImage(this.bgImage,this.X,this.Y,this.width,this.height);
	}
}

// 地板的构造函数
function Floor (x,y,width,height,src) {
	// 添加属性
	this.X = x;
	this.Y = y;
	this.width = width;
	this.height = height;
	// 创建图片对象
	var floorImage = new Image();
	// src属性:设置图片的路径
	floorImage.src = src;
	this.floorImage = floorImage;
	// 方法
	this.drawFloorImage = function () {
		// 绘制地板图片
		// context.drawImage(图片对象,图片的X,图片的Y,图片的width,图片的高);
		context.drawImage(this.floorImage,this.X,this.Y,this.width,this.height);
	}
}

// 障碍物的构造函数
function Pipe (x,y,width,height,src) {
	this.X = x,
	this.Y = y;
	this.width = width;
	this.height = height;

	// 图片对象
	var pipeImage = new Image();
	pipeImage.src = src;
	this.pipeImage = pipeImage;

	// 画下面障碍物的方法
	this.drawDownPipe = function () {
		// 精灵图:将所有需要重复使用到的图片放置到一张图片上去

		// context.drawImage(this.pipeImage,图片在精灵图中的X,图片在精灵图中的Y,图片在精灵图中的W,图片在精灵图中的H,this.X,this.Y,this.width,this.height);
		context.drawImage(this.pipeImage,0,480,150,500,this.X,this.Y,this.width,this.height);
	}
	// 画上面障碍物的方法
	this.drawUpPipe = function () {
		// 精灵图:将所有需要重复使用到的图片放置到一张图片上去

		// context.drawImage(this.pipeImage,图片在精灵图中的X,图片在精灵图中的Y,图片在精灵图中的W,图片在精灵图中的H,this.X,this.Y,this.width,this.height);
		context.drawImage(this.pipeImage,155,500,150,800,this.X,this.Y,this.width,this.height);
	}
}

// 小鸟的构造函数
function Bird (x,y,width,height) {
	this.X = x,
	this.Y = y;
	this.width = width;
	this.height = height;

	this.drawBird = function () {
		// 图片对象
		var birdImage = new Image();
		// 第一次 第二次 第三次 第四次..
		// 0 1 2 0 1 2 0 1 2
		birdImage.src = birdArr[index % 3];
		index++;
		context.drawImage(birdImage,this.X,this.Y,this.width,this.height);
	}
}







