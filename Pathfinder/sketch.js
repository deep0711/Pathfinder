//Implemented till now:A* algo
//Follow this step:
//1.Program starts from setup() function.Go there first.Line nm:72
//Refer Wikipedia A* algo page for learning about algorithm

var rows = 25;
var cols = 52;
var grid = new Array(cols);
var check = false;

//Stores cells which need to be visited
var openset = [];
//Stores cells which are finished visiting!
var closedset = [];

var start;
var end;
var h, w;
var path = [];

//Property function of each Cell
function Spot(i, j) {

    this.i = i;
    this.j = j;
    this.f = 0;
    this.h = 0;
    this.g = 0;
    this.neighbours = [];
    this.camefrom = null;
    this.wall = false;

    if (random(1) < 0.2) {
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

//This function removes specified cell from openset,as it has been visited

function removefromarray(arr, ele) {

    for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i] == ele) {
            arr.splice(i, 1);
            return;
        }
    }
}

//making educated guess of euclidean distance

function heuristic(a, b) {
    //euclidean
    var eud = Math.sqrt((a.i - b.i) * (a.i - b.i) + (a.j - b.j) * (a.j - b.j));
    //manhattan
    var man = abs(a.i - b.i) + abs(a.j - b.j);
    return man;
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
    start = grid[0][0];
    //end at bottom right corner
    end = grid[cols - 1][rows - 1];
    //end = grid[29][5];
    //start with the initial position.

    start.wall = false;
    end.wall = false;

    //Storing neighbours of each cell in one of its property.Not considering diagonals
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].addneighbours(grid); //Refer to line 37
        }
    }
    openset.push(start);
}

//this function repeats itself again and again
function draw() {

    //A* starts from here
    //there are some cells remainging to be visited
    if (openset.length > 0) {

        //calcuting the cell which needs to be visited with the minimum 'f' value
        var winner = 0;

        for (var i = 0; i < openset.length; i++) {
            if (openset[i].f < openset[winner].f) {
                winner = i;
            }
        }

        var current = openset[winner];
        //if that unvisited cell is our destination
        if (current === end) {
            check = true;
            console.log("DONE!");
            //for stopping the calling of draw() function again.
            path = [];
            var temp = current;
            path.push(current);

            while (temp.camefrom) {
                path.push(temp.camefrom);
                temp = temp.camefrom;
            }

            noFill();
            stroke(255, 245, 102);
            strokeWeight(w / 8);
            beginShape();
            for (var i = 0; i < path.length; i++) {
                vertex(path[i].i * w + w / 2, path[i].j * h + h / 2);
            }
            endShape();

            noLoop();
        } else {
            //remove that current cell from openset as it has been visited
            removefromarray(openset, current);

            //and aad it to the closed set
            closedset.push(current);

            //taking all the neighbors of current cell
            var neigh = current.neighbours;

            for (var i = 0; i < neigh.length; i++) {
                var neighbor = neigh[i];
                //if that neighbour is not in closed set,then we only need to visit
                if (!closedset.includes(neighbor)) {
                    var tempG = current.g + 1;

                    // Updating minimum distance of any node if it has been visited before in the same loop
                    if (openset.includes(neighbor)) {
                        if (tempG < neighbor.g) {
                            neighbor.g = tempG;
                            neighbor.h = heuristic(neighbor, end);
                            neighbor.f = neighbor.g + neighbor.h;
                            neighbor.camefrom = current;
                        }
                    } else {
                        neighbor.g = tempG;
                        openset.push(neighbor);
                        neighbor.h = heuristic(neighbor, end);
                        neighbor.f = neighbor.g + neighbor.h;
                        neighbor.camefrom = current;

                    }
                }
            }
            //A* ends here   
        }

        if (!check) {
            background(0);
            for (var i = 0; i < cols; i++) {
                for (var j = 0; j < rows; j++) {
                    grid[i][j].showyou(color(255));
                }
            }


            for (var i = 0; i < openset.length; i++) {
                //if in neighbour of current node,colour them green
                openset[i].showyou(color(177, 250, 82));
            }

            for (var i = 0; i < closedset.length; i++) {
                //if already visited colour them red
                closedset[i].showyou(color(74, 247, 244));
            }

            //If want to show path on runtime :)
            /*
            path = [];
            var temp = current;
            path.push(current);
            while (temp.camefrom) {
                path.push(temp.camefrom);
                temp = temp.camefrom;
            }

            for (var i = 0; i < path.length; i++) {
                path[i].showyou(color(255, 231, 6));
            }

            //Drawing the line in the path

            noFill();
            stroke(255, 0, 255);
            strokeWeight(w / 4);
            beginShape();
            for (var i = 0; i < path.length; i++) {
                vertex(path[i].i * w + w / 2, path[i].j * h + h / 2);
            }
            endShape();

            */
            start.showyou(color(0, 255, 0));
            end.showyou(color(255, 0, 0));
        }
    } else {

        console.log("No path Exist!");
        noLoop();

        for (var i = 0; i < cols; i++) {
            for (var j = 0; j < rows; j++) {
                //white color for all grids
                grid[i][j].showyou(color(255));
            }
        }
        start.showyou(color(0, 255, 0));
        end.showyou(color(255, 0, 0));
    }
}

//end of the code!!
