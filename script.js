/* Populate initial table */
table = document.getElementById("myPuzzle");
$(function() {
    resetBoard();
});


/* Reset puzzle board function */
function resetBoard ()
{
    var correct_array =
    [["1", "2", "3", "4"],
     ["5", "6", "7", "8"],
     ["9", "10", "11", "12"],
     ["13", "14", "15", " "]];

    for (var i = 0; i < table.rows.length; i++)
    {
        for (var j = 0; j < table.rows[i].cells.length; j++)
        {
            table.rows[i].cells[j].innerHTML = correct_array[i][j];
        }
    }

    resetBoardColor();
}

/* Event-listener for resetting the table */
resetButton = document.getElementById("button1");
resetButton.onclick = function(){
    resetBoard(table);
};

/* Event-listener for scramble radio-button levels */
var scramble_level = 20; // default level
var radios = document.forms["rButtons"].elements["scramble_value"];
for(var i = 0; i < radios.length; i++) {
    radios[i].onclick = function()
    {
        switch(this.value)
        {
            case "low":
                scramble_level = 5;
                break;
            case "medium":
                scramble_level = 20;
                break;
            case "high":
                scramble_level = 100;
                break;
        }
    };
}

/* Function to locate the blank cell and clickable adjacent ones. */
function locateCells() {

    /* Cells adjacent to the blank cell */
    up = null;
    down = null;
    left = null;
    right = null;

    for (var i = 0; i < table.rows.length; i++)
    {
        for (var j = 0; j < table.rows[i].cells.length; j++)
        {
            if (table.rows[i].cells[j].innerHTML == " ") {

                current_row = table.rows[i].cells[j].parentElement.rowIndex;
                current_col = table.rows[i].cells[j].cellIndex;

                // obtain the top cell.
                if (current_row != 0)
                    up = table.rows[current_row-1].cells[current_col];

                // obtain the bottom cell.
                if (current_row != 3)
                    down = table.rows[current_row+1].cells[current_col];

                // obtain the left cell.
                if (current_col != 0)
                    left = table.rows[current_row].cells[current_col-1];

                // obtain the right cell.
                if (current_col != 3)
                    right = table.rows[current_row].cells[current_col+1];

                scrambleTable(up, down, left, right);
                return;
            }
        }
    }
}

/* Scramble the table function */
function scrambleTable(up, down, left, right)
{
    /* Check which cells are clickable. */
    var items = [];

    if (up != null)
        items.push(up);
    if (down != null)
        items.push(down);
    if (left != null)
        items.push(left);
    if (right != null)
        items.push(right);

    // simulate a click on the random_cell
    random_cell = items[Math.floor(Math.random()*items.length)];
    random_cell.click();
}

/* Event-listener for scrambling the table */
scrambleButton = document.getElementById("button2");
scrambleButton.onclick = function() {
    for (var i = 0; i < scramble_level; i++) {
        locateCells();
    }
};

/* Event-listener for selecting a cell to move */
for (var i = 0; i < table.rows.length; i++)
{
    for (var j = 0; j < table.rows[i].cells.length; j++)
    {
        table.rows[i].cells[j].onclick = function() {

            current_row = this.parentElement.rowIndex;
            current_col = this.cellIndex;

            up = null;
            down = null;
            right = null;
            left = null;

            /* obtain the top cell. */
            if (current_row != 0)
                up = table.rows[current_row-1].cells[current_col];

            /* obtain the bottom cell. */
            if (current_row != 3)
                down = table.rows[current_row+1].cells[current_col];

            /* obtain the left cell. */
            if (current_col != 0)
                left = table.rows[current_row].cells[current_col-1];

            /* obtain the right cell. */
            if (current_col != 3)
                right = table.rows[current_row].cells[current_col+1];

            swapCells(this, up, down, left, right);
        };
    }
}

/* Function to swap cells */
function swapCells(cell, up, down, left, right)
{
    var swappable = 0;
    if (up !=null && up.innerHTML === " ") {
        swappable = 1;
        // swap with above cell.
        temp = cell.innerHTML;
        up.innerHTML = temp;
        cell.innerHTML = " ";
    }
    if (down !=null && down.innerHTML === " ") {
        swappable = 1;
        // swap with below cell.
        temp = cell.innerHTML;
        down.innerHTML = temp;
        cell.innerHTML = " ";
    }
    if (left !=null && left.innerHTML === " ") {
        swappable = 1;
        // swap with left cell.
        temp = cell.innerHTML;
        left.innerHTML = temp;
        cell.innerHTML = " ";
    }
    if (right !=null && right.innerHTML === " ") {
        swappable = 1;
        // swap with right cell.
        temp = cell.innerHTML;
        right.innerHTML = temp;
        cell.innerHTML = " ";
    }

    if (swappable == 0) {
        return;
    }

    /* call function to check if table is at original state. */
    puzzleCompleted();
}

/* Function to check if the puzzle's been solved. */
function puzzleCompleted() {
    var correct_array =
    [["1", "2", "3", "4"],
    ["5", "6", "7", "8"],
    ["9", "10", "11", "12"],
    ["13", "14", "15", " "]];

    for (var i = 0; i < table.rows.length; i++)
    {
        for (var j = 0; j < table.rows[i].cells.length; j++)
        {
            if (table.rows[i].cells[j].innerHTML == correct_array[i][j]) {
                 continue;
            }
            else {
                resetBoardColor();
                return;
            }
        }
    }

    /* Activate puzzle board winning color. */
    puzzleWinner();
}

/* Puzzle Winner */
function puzzleWinner() {
    for (var i = 0; i < 16; i++)
        document.getElementsByTagName('td')[i].setAttribute("style", "color:black; border: 1px solid #6CDA4F;");
}

/* Function to reset puzzle board color. */
function resetBoardColor() {
    for (var i = 0; i < 16; i++)
        document.getElementsByTagName('td')[i].setAttribute("style", "color:black; border: 1px solid black;");
}
