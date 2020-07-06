//Implementing Dijiskstra Algorithm
//Program starts From setup() function

var row = 21;
var col = 45;
var grid = new Array(col);
var h , w;
var strt , end;
var check=false;

function Cell(i , j) {

    this.i = i;
    this.j = j;
    this.wall = false;
	this.visited=false;
    this.camefrom = null;
    
    //if(random(1) < 0.2) this.wall = true;
    this.showyou = function(col) {
        
        fill(col);
        if (this.wall == true) 
			fill(124, 125, 125);
        
        strokeWeight(1);
        stroke(124, 125, 125);
        //To make a Rectangle at coordinate @param1 and @param2
        rect(this.i * w, this.j * h, w, h);
    }

    //To Get The X Coordinate
    this.getX = function() {
        return this.i;
    }
    // To Get the Y Coordinate
    this.getY = function() {
        return this.j;
    }

}
function QItem(x , y , w)
{
    //QItem Elements
    this.row = x;
    this.col = y;
    this.dist = w;
}

class Queue 
{ 
    // Array is used to implement a Queue 
    constructor() 
    { 
        this.items = []; 
    } 
                  
    // Functions to be implemented 
    // enqueue function 
    enqueue = function(element) 
    {	 
	    // adding element to the queue 
	    this.items.push(element);   
    } 
        // dequeue function 
    dequeue = function() 
    {  
        if(this.isEmpty()) 
            return "Underflow"; 
        return this.items.shift(); 
    } 

    // front function 
    front = function() 
    {  
        if(this.isEmpty()) 
            return "No elements in Queue"; 
        return this.items[0]; 
    } 
    // isEmpty function 
    isEmpty = function() 
    { 
        return this.items.length == 0; 
    } 
} 

var que = new Queue();
var visited = new Array(col);

for(var i = 0 ; i < col ; i++) visited[i] = new Array(row);

var source = new QItem(0 , 0 , 0);

//Function starts from here !!!
function setup(){

    createCanvas(1360 , 650);
    console.log("Algorithm Starts!!");
    
    h = height / row;
    w = width / col;

    for(var i = 0 ; i < col ; i++) {
        grid[i] = new Array(row);
    }

    //Assigning each cell its properties
    for(var i = 0 ; i < col ; i++) {
        for(var j = 0 ; j < row ; j++) {
            grid[i][j] = new Cell(i , j);
        }
    }

    strt = grid[2][10];

    end = grid[29][5];

    strt.wall = false;
    end.wall = false;
    
    //Coloring Each cell White and Walls Black!
    for(var i = 0 ; i < col ; i++ ) {
        for(var j = 0 ; j < row ; j++) {

            grid[i][j].showyou(color(255));
        }
    }

    var ok = false;
	
	source.row=strt.i;
	source.col=strt.j;
	strt.visited=true;
    //Coloring Start Index Green!
    strt.showyou(color(0 , 255 , 0));
    //Coloring End Index Red!!
    end.showyou(color(255, 0, 0));
}

que.enqueue(source);
visited[source.row][source.col] = true;

var cSet = [];
var path = [];
var closedset=[];
function draw() {

    var p = que.front();
	closedset.push(p);
    que.dequeue();
	
    
    //console.log("Finding!!!");
    if(grid[p.row][p.col] === end) {
        check=true;
		console.log("Path Found");
        
		var x = grid[p.row][p.col];
        noFill();
        stroke(0, 0, 255);
        strokeWeight(w / 7);
        beginShape();
        vertex(x.i * w + w / 2 , x.j * h + h / 2);
        x = x.camefrom;
        while(true) {
            //console.log("HEllo!");
            vertex(x.i * w + w / 2 , x.j * h + h / 2);
            x = x.camefrom;
            if(x == strt || x == null ) {
                vertex(x.i * w + w / 2 , x.j * h + h / 2);
                break;  
            }
        }
        endShape();
        noLoop();
    }
    
    if(p.row - 1 >= 0 && grid[p.row - 1][p.col].visited == false) {
        
		
        var q = new QItem(p.row - 1 , p.col , p.dist + 1);
        que.enqueue(q);
        //flag = 0;
        grid[p.row - 1][p.col].visited = true;
        grid[p.row - 1][p.col].camefrom = grid[p.row][p.col];

    }

    if(p.row + 1 < col && grid[p.row + 1][p.col].visited == false) {
        
        var q = new QItem(p.row + 1 , p.col , p.dist + 1);
        que.enqueue(q);
        //flag = 0;
        grid[p.row + 1][p.col].visited = true;
        grid[p.row + 1][p.col].camefrom = grid[p.row][p.col];

    }

    if(p.col - 1 >= 0 && grid[p.row][p.col - 1].visited == false) {
        
        var q = new QItem(p.row , p.col - 1 , p.dist + 1);
        que.enqueue(q);
        //flag = 0;
        grid[p.row][p.col - 1].visited = true;
        grid[p.row][p.col - 1].camefrom = grid[p.row][p.col];
	}

    if(p.col + 1 < row && grid[p.row][p.col + 1].visited == false) {
        
        var q = new QItem(p.row , p.col + 1 , p.dist + 1);
        que.enqueue(q);
        grid[p.row][p.col + 1].visited = true;
        grid[p.row][p.col + 1].camefrom = grid[p.row][p.col];
    }
	
    
	if(que.isEmpty()) {
        console.log("Finish");
        check=true;
        if(grid[p.row][p.col] === end) {
            console.log("Path Found");
            var x = grid[p.row][p.col];
            x = x.camefrom;
            noFill();
            stroke(0, 0, 255);
            strokeWeight(w / 7);
            beginShape();
            while(true) {
                //console.log("HEllo!");
                vertex(x.i * w + w / 2 , x.j * h + h / 2);
                x = x.camefrom;
                if(x == strt || x == null )  break;
            }
            endShape();
            noLoop();

        }
        else console.log("No Path Find!!!!");
        noLoop();
    }
	
	if(!check)
	{
	for(var i=0;i<que.items.length;i++)
		grid[que.items[i].row][que.items[i].col].showyou(color(177, 250, 82));
	
	for(var i=0;i<closedset.length;i++)
		grid[closedset[i].row][closedset[i].col].showyou(color(74, 247, 244));
	}
	strt.showyou(color(0 , 255 , 0));
    //Coloring End Index Red!!
    end.showyou(color(255, 0, 0));
    //noLoop();
}
