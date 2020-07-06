//Implemented till now:A* algo
//Follow this step:
//1.Program starts from setup() function.Go there first.Line nm:72
//Refer Wikipedia A* algo page for learning about algorithm

var rows = 21;
var cols = 45;
var grid = new Array(cols);
var check = false;
var pqueue;
var closedset = [];
var start;
var end;
var h, w;
var path = [];

//Property function of each Cell
function Spot(i, j) {
    this.i = i;
    this.j = j;
    this.f = Infinity;
    this.h = Infinity;
    this.g = Infinity;
    this.visited = false;
    this.neighbours = [];
    this.camefrom = null;
    this.wall = false;

    //random wall creation
    if (random(1) < 0.4) {
        this.wall = true;
    }

    //for displaying each cell
    this.showyou = function(col) {
        fill(col);
        if (this.wall == true)
            fill(124, 125, 125);
        strokeWeight(1);
        stroke(124, 125, 125);
        rect(this.i * w, this.j * h, w, h);
    }

    //for adding neighbours of current cell
    this.addneighbours = function(grid) {
        var i = this.i;
        var j = this.j;

        if (i < cols - 1 && grid[i + 1][j].wall == false) {
            this.neighbours.push(grid[i + 1][j]);
        }
        if (i > 0 && grid[i - 1][j].wall == false) {
            this.neighbours.push(grid[i - 1][j]);
        }
        if (j < rows - 1 && grid[i][j + 1].wall == false) {
            this.neighbours.push(grid[i][j + 1]);
        }
        if (j > 0 && grid[i][j - 1].wall == false) {
            this.neighbours.push(grid[i][j - 1]);
        }
        //add diagonals also
        
        if (i < cols - 1 && j < rows - 1 && grid[i + 1][j + 1].wall == false) {
            this.neighbours.push(grid[i + 1][j + 1]);
        }
        if (i > 0 && j > 0 && grid[i - 1][j - 1].wall == false) {
            this.neighbours.push(grid[i - 1][j - 1]);
        }
        if (i > 0 && j < rows - 1 && grid[i - 1][j + 1].wall == false) {
            this.neighbours.push(grid[i - 1][j + 1]);
        }
        if (j > 0 && i < cols - 1 && grid[i + 1][j - 1].wall == false) {
            this.neighbours.push(grid[i + 1][j - 1]);
        }
        
    }
}

//priority queue element
class queue_element {
    constructor(i, j) {

        this.element = grid[i][j];
        this.priority = grid[i][j].f;
    }
}

//priority queue definitoins and method 
class priority_queue {

    constructor() {
        this.items = [];
    }

    enqueue = function(i, j) {

        var ele = new queue_element(i, j);
        var contain = false;

        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].priority > ele.priority) {
                this.items.splice(i, 0, ele);
                contain = true;
                break;
            }
        }
        if (!contain) {
            this.items.push(ele);
        }
    }

    dequeue = function() {

        this.items.splice(0, 1);
    }

    front = function() {
        return this.items[0];
    }

    isEmpty = function() {
        return this.items.length == 0;
    }
}

//Main function.starts from here!
function setup() {

    createCanvas(1360, 650);
    console.log("Pathfinder");
    h = height / rows;
    w = width / cols;

    //making a 2D array.An 1D array of grid created before.See at line 8
    for (var i = 0; i < cols; i++)
        grid[i] = new Array(rows);

    //Assigning property to each cell of 2D grid i.e. its f,g,h value 
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j] = new Spot(i, j); //refer to line 20.Spot function is just like a constructor function initialising property of each cell to zero.
        }
    }

    //start from top left corner
    start = grid[5][10];
    //end at bottom right corner
    end = grid[35][10];
    //end = grid[29][5];

    start.wall = false;
    end.wall = false;

    //Storing neighbours of each cell in one of its property.Not considering diagonals
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].addneighbours(grid); //Refer to line 37
        }
    }

    //Creating a priority_queue instance
    pqueue = new priority_queue();
    start.g = 0;
    start.f = 0;
    pqueue.enqueue(start.i, start.j);

    // Coloring each Cell in the grid in White!
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].showyou(color(255));
       }
    }
}

//this function repeats itself again and again
/*function draw() {

    //A* starts from here
    //there are some cells remainging to be visited
    if (!pqueue.isEmpty()) {

        var current = pqueue.front().element;

        //if that unvisited cell is our destination
        if (current === end) {
            check = true;
            console.log("DONE!");

            path = [];
            var temp = current;
            path.push(current);

            while (temp.camefrom) {
                path.push(temp.camefrom);
                temp = temp.camefrom;
            }

            noFill();
            stroke(255, 245, 102);
            strokeWeight(w / 7);
            beginShape();
            for (var i = 0; i < path.length; i++) {
                vertex(path[i].i * w + w / 2, path[i].j * h + h / 2);
            }
            endShape();

            //for stopping the calling of draw() function again.
            noLoop();
        } else {
            //remove that current cell from openset as it has been visited
            pqueue.dequeue();
            //and aad it to the closed set
            closedset.push(current);
            //taking all the neighbors of current cell
            var neigh = current.neighbours;

            for (var i = 0; i < neigh.length; i++) {
                var neighbor = neigh[i];
                //if that neighbour is not in closed set,then we only need to visit
                if (!neighbor.visited) {
                    neighbor.visited = true;
                    var tempG = current.g + 1;

                    if (tempG < neighbor.g) {
                        neighbor.g = tempG;
                        neighbor.camefrom = current;

                    }
                    var temph = Math.abs(neighbor.i - end.i) + Math.abs(neighbor.j - end.j); //Math.sqrt((neighbor.i - end.i) * (neighbor.i - end.i) + (neighbor.j - end.j) * (neighbor.j - end.j)); //Math.abs(neighbor.i - end.i) + Math.abs(neighbor.j - end.j);
                    var newcost = neighbor.g + temph;

                    if (newcost < neighbor.f) {
                        neighbor.h = temph;
                        neighbor.f = newcost;
                        pqueue.enqueue(neighbor.i, neighbor.j);
                    }
                }
            }
            //A* ends here   
        }

        if (!check) {

            for (var i = 0; i < pqueue.items.length; i++) {
                //if in neighbour of current node,colour them green
                pqueue.items[i].element.showyou(color(177, 250, 82));
            }

            for (var i = 0; i < closedset.length; i++) {
                //if already visited colour them blue
                closedset[i].showyou(color(74, 247, 244));
            }

            start.showyou(color(0, 255, 0));
            end.showyou(color(255, 0, 0));
        }
    } else {

        console.log("No path Exist!");
        start.showyou(color(0, 255, 0));
        end.showyou(color(255, 0, 0));
        //for stopping the calling of draw() function again.
        noLoop();
    }
}*/