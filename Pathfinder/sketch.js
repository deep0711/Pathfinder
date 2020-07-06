//Implemented till now:A* algo
//Follow this step:
//1.Program starts from setup() function.Go there first.Line nm:72
//Refer Wikipedia A* algo page for learning about algorithm
var rows = 21;
var cols = 45;
var grid;
var check;
var pqueue;
var start;
var end;
var h, w;
var first_time = 0;

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

    showyou(col) {
        fill(col);
        if (this.wall == true)
            fill(124, 125, 125);
        strokeWeight(1);
        stroke(124, 125, 125);
        rect(this.i * w, this.j * h, w, h);

    }


    //for adding neighbours of current cell
    addneighbours(grid) {
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

    enqueue(i, j) {

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

    dequeue() {

        this.items.splice(0, 1);
    }

    front() {
        return this.items[0];
    }

    isEmpty() {
        return this.items.length == 0;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

$("#strt").click(function() {
    Algorithm();
});

$(document).on("mousedown", function(event) {

    //Finding Cell Coordinates!

    if (first_time == 1) {
        for (var i = 0; i < cols; i++) {
            for (var j = 0; j < rows; j++) {
                if (!grid[i][j].wall)
                    grid[i][j].showyou(color(255));
            }
        }
        start.showyou(color(0, 255, 0));
        end.showyou(color(255, 0, 0));
        first_time = 0;
    }
    if (first_time == 2)
        first_time = 1;

    //X- coordinate
    var xc = Math.floor(mouseX / w);

    //Y- coordinate
    var yc = Math.floor(mouseY / h);

    /**
     * Check if the cell is currently a wall!
     */
    if (grid[xc][yc].wall == false) {

        //Check if the current cell is not Souce and Destination
        if (grid[xc][yc] != start && grid[xc][yc] != end) {

            //If only pressed then also make the Cell a obstacle
            grid[xc][yc].wall = true;

            //Color the Cell
            grid[xc][yc].showyou(color(255));

            /**
             * If the mouse is pressed and moved
             * make every cell a obstacles excluding Sources and Destination
             */
            $(document).on("mousemove", function(ev) {

                var xc = Math.floor(mouseX / w);
                var yc = Math.floor(mouseY / h);

                if (grid[xc][yc] != strt && grid[xc][yc] != end) {

                    grid[xc][yc].wall = true;
                    grid[xc][yc].showyou(color(255));
                }
            });

            $(document).on("mouseup", function(e) {
                //Stop the mousemove and mouseup
                //Ready for Another MouseClick and MouseMove
                $(this).unbind("mouseup mousemove");
            });

        }
    } else {
        //If the Cell is a Obstacle then it can't be Souce or Destination
        grid[xc][yc].wall = false;
        grid[xc][yc].showyou(color(255));
        $(document).on("mousemove", function(event) {

            //Current Cordinates of cell on which the mouse is!
            var xc = Math.floor(mouseX / w);
            var yc = Math.floor(mouseY / h);

            grid[xc][yc].wall = false;
            grid[xc][yc].showyou(color(255));

        });
        $(document).on("mouseup", function(event) {
            $(this).unbind("mouseup mousemove");
        });
    }

});

$("#clr").click(function() {
    setup();
});
//Main function.starts from here!

function setup() {

    createCanvas(1360, 650);
    h = height / rows;
    w = width / cols;
    grid = new Array(cols);

    //making a 2D array.An 1D array of grid created before.See at line 8
    for (var i = 0; i < cols; i++)
        grid[i] = new Array(rows);

    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j] = new Spot(i, j); //refer to line 20.Spot is just a constructor initialising property of each cell to zero.
        }
    }
    //Assigning property to each cell of 2D grid i.e. its f,g,h value 
    //start from top left corner
    start = grid[2][10];
    //end at bottom right corner
    //end = grid[cols - 1][rows - 1];
    end = grid[29][5];

    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].showyou(color(255));
        }
    }
    start.showyou(color(0, 255, 0));
    end.showyou(color(255, 0, 0));
}


async function Algorithm() {
    first_time = 2;
    pqueue = new priority_queue();
    check = false;

    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].g = Infinity;
            grid[i][j].f = Infinity;
            grid[i][j].h = Infinity;
            grid[i][j].visited = false;
            grid[i][j].neighbours = [];
        }
    }

    start.g = 0;
    start.f = Math.abs(start.i - end.i) + Math.abs(start.j - end.j); //dist(start.i, start.j, end.i, end.j); 
    pqueue.enqueue(start.i, start.j);

    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].showyou(color(255));
        }
    }



    var e = document.getElementById("select_algo");
    var algo = e.options[e.selectedIndex].text;
    console.log(algo);

    var closedset = [];
    //A* starts from here
    //there are some cells remainging to be visited
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].addneighbours(grid); //Refer to line 37
        }
    }

    while (!pqueue.isEmpty()) {
        console.log("running!");
        var current = pqueue.front().element;

        //if that unvisited cell is our destination
        if (current === end) {
            check = true;
            console.log("DONE!");

            var path = [];
            var temp = current;
            path.push(current);

            while (temp.camefrom) {
                path.push(temp.camefrom);
                temp = temp.camefrom;
            }
            swal({
                title: "Congratulations!!",
                text: "Found the path with length=" + path.length,
                icon: "success",
                button: "yes!",
            });
            noFill();
            stroke(255, 245, 102);
            strokeWeight(w / 5);
            beginShape();
            for (var i = 0; i < path.length; i++) {
                vertex(path[i].i * w + w / 2, path[i].j * h + h / 2);
            }
            endShape();
            //for stopping the calling of draw() function again.
            break;
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
                    var temph = Math.abs(neighbor.i - end.i) + Math.abs(neighbor.j - end.j); //dist(neighbor.i, neighbor.j, end.i, end.j); Math.abs(neighbor.i - end.i) + Math.abs(neighbor.j - end.j); //Math.sqrt((neighbor.i - end.i) * (neighbor.i - end.i) + (neighbor.j - end.j) * (neighbor.j - end.j)); //Math.abs(neighbor.i - end.i) + Math.abs(neighbor.j - end.j);
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
            await sleep(25);
        }
    }
    if (!check && pqueue.isEmpty()) {
        swal({
            title: "Sorry",
            text: "No Path Found!",
            icon: "error",
            button: "no!",
        });
        console.log("No path Exist!");
        start.showyou(color(0, 255, 0));
        end.showyou(color(255, 0, 0));
        //for stopping the calling of draw() function again.
    }
}
//end of the code!!