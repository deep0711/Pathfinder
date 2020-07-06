//Implemented till now:A* algo
//Follow this step:
//1.Program starts from setup() function.Go there first.Line nm:72
//Refer Wikipedia A* algo page for learning about algorithm
var rows = 21;
var cols = 45;
var grid = new Array(cols);
var distance = new Array(5);
var pathorigin = new Array(5);
var destination = [];
var check = false;
var path = [];
var temp;
var z = 0;
var h, w;

//Property function of each Cell
class Spot {
    constructor(i, j) {
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
            if (random(1) < 0) {
                this.wall = true;
            }
        }
        //for displaying each cell
    showyou = function(col) {
        fill(col);
        if (this.wall == true)
            fill(124, 125, 125);

        strokeWeight(1);
        stroke(124, 125, 125);
        rect(this.i * w, this.j * h, w, h);
    }

    //for adding neighbours of current cell
    addneighbours = function(grid) {
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
        /*
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
        */
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

class TSP {
    constructor(strt, distance) {
        this.start_node = strt;
        this.distance = distance;
        this.N = distance.length;
        this.finish_state = (1 << this.N) - 1;
        this.mintourcost = Infinity;
        this.ransolver = false;
        this.tour = [];

    }

    recursive_tsp = function(curr, state, memo, prev) {
        if (state == this.finish_state)
            return this.distance[curr][this.start_node];
        if (memo[curr][state] != -1)
            return memo[curr][state];

        var mincost = Infinity;
        var index = -1;

        for (var i = 0; i < this.N; i++) {
            if ((state & (1 << i)) != 0)
                continue;

            var nextState = (state | (1 << i));
            var newcost = this.distance[curr][i] + this.recursive_tsp(i, nextState, memo, prev);

            if (newcost < mincost) {
                mincost = newcost;
                index = i;
            }
        }
        prev[curr][state] = index;
        return memo[curr][state] = mincost;
    }

    solve = function() {
        var state = (1 << this.start_node);
        var memo = new Array(this.N);

        for (var i = 0; i < this.N; i++)
            memo[i] = new Array(1 << this.N);

        for (var i = 0; i < this.N; i++) {
            for (var j = 0; j < (1 << this.N); j++) {
                memo[i][j] = -1;
            }
        }

        var prev = new Array(this.N);

        for (var i = 0; i < this.N; i++)
            prev[i] = new Array(1 << this.N);

        for (var i = 0; i < this.N; i++) {
            for (var j = 0; j < (1 << this.N); j++) {
                prev[i][j] = -1;
            }
        }
        this.minTourCost = this.recursive_tsp(this.start_node, state, memo, prev);

        var index = this.start_node;

        while (true) {
            this.tour.push(index);
            var nextIndex = prev[index][state];

            if (nextIndex == -1)
                break;
            var nextState = (state | (1 << nextIndex));
            state = nextState;
            index = nextIndex;
        }
        this.tour.push(this.start_node);
        this.ranSolver = true;

    }

    getTourCost = function() {
        if (!this.ranSolver)
            this.solve();

        this.tour.push(this.minTourCost);
        return this.tour;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
            grid[i][j] = new Spot(i, j); //refer to line 20.Spot is just a constructor initialising property of each cell to zero.
        }
    }

    //start from top left corner
    start = grid[5][5];
    //end at bottom right corner
    //end = grid[cols - 1][rows - 1];
    destination.push(start);
    destination.push(grid[13][13]);
    destination.push(grid[20][13]);
    destination.push(grid[7][9]);
    destination.push(grid[25][5]);

    for (var i = 0; i < destination.length; i++)
        destination[i].wall = false;


    //Storing neighbours of each cell in one of its property.Not considering diagonals
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].addneighbours(grid); //Refer to line 37
        }
    }

    //Creating a priority_queue instance

    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].showyou(color(255));
        }
    }

    start.showyou(color(0, 255, 0));
    for (var i = 1; i < destination.length; i++)
        destination[i].showyou(color(255, 0, 0));

    for (var i = 0; i < 5; i++)
        distance[i] = new Array(5);

    for (var i = 0; i < 5; i++)
        pathorigin[i] = new Array(5);

    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 5; j++)
            pathorigin[i][j] = -1;
    }

    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 5; j++) {
            if (i == j)
                distance[i][j] = 0;
            else
                distance[i][j] = Infinity;
        }
    }
    Algorithm();
}

//this function repeats itself again and again
async function Algorithm() {

    //A* starts from here
    //there are some cells remainging to be visited

    for (var a = 0; a < destination.length; a++) {

        for (b = 0; b < destination.length; b++) {

            if (a == b)
                continue;

            for (var i = 0; i < cols; i++) {
                for (var j = 0; j < rows; j++) {
                    grid[i][j].g = Infinity;
                    grid[i][j].f = Infinity;
                    grid[i][j].h = Infinity;
                    grid[i][j].visited = false;
                    grid[i][j].camefrom = null;
                }
            }

            end = destination[b];
            var pqueue = new priority_queue();
            destination[a].g = 0;
            destination[a].f = Math.abs(destination[a].i - end.i) + Math.abs(destination[a].j - end.j);
            pqueue.enqueue(destination[a].i, destination[a].j);

            while (!pqueue.isEmpty()) {

                var current = pqueue.front().element;

                //if that unvisited cell is our destination
                if (current === end) {
                    check = true;
                    //console.log("DONE!");

                    path[z] = new Array(1);
                    temp = current;
                    path[z].push(current);

                    while (temp.camefrom) {
                        path[z].push(temp.camefrom);
                        temp = temp.camefrom;
                    }
                    distance[a][b] = path[z].length;
                    //distance[b][a] = path[z].length;
                    pathorigin[a][b] = z;
                    //pathorigin[b][a] = z;
                    z++;
                    break;
                    //for stopping the calling of draw() function again.
                } else {
                    //remove that current cell from openset as it has been visited
                    pqueue.dequeue();

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
            }

        }

    }
    var obj = new TSP(0, distance);
    var follow = [];

    follow = obj.getTourCost();
    //console.log(follow);

    if (follow[follow.length - 1] == Infinity) {
        swal({
            title: "Sorry!",
            text: "NO common path found!!",
            icon: "error",
            button: "noo!",
        });

    } else {

        var cnt = 0;
        noFill();
        stroke(0, 0, 0);
        strokeWeight(w / 5);
        beginShape();

        for (var i = 0; i < follow.length - 2; i++) {
            for (var j = path[pathorigin[follow[i]][follow[i + 1]]].length - 1; j >= 1; j--) {
                path[pathorigin[follow[i]][follow[i + 1]]][j].showyou(color(0, 0, 255));
                cnt++;

                destination[0].showyou(color(0, 255, 0));

                for (var k = 1; k < destination.length; k++)
                    destination[k].showyou(color(255, 0, 0));

                await sleep(100);
                path[pathorigin[follow[i]][follow[i + 1]]][j].showyou(color(74, 247, 244));

            }
        }
        endShape();

        destination[0].showyou(color(0, 255, 0));

        for (var k = 1; k < destination.length; k++)
            destination[k].showyou(color(255, 0, 0));
        cnt -= destination.length;
        swal({
            title: "Congratulations!!",
            text: "Path Found with length " + cnt,
            icon: "success",
            button: "yesss!",
        });
    }
}