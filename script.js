// fix loading issues
window.onload = function() {
    if(!window.location.hash) {
        window.location = window.location + '#loaded';
        window.location.reload();
    }
}

/* Populate initial table */
table = document.getElementById("puzzle");
$(function() {
    resetBoard();
});

var rotation_state = 0;
var clockwise_count = 0;
var flip_count = 0;

function rotate_clockwise() {
    if (clockwise_count == 0) {
        rotation_state = 1; // change to clockwise 90 degree state
        clockwise_count += 1

        // change to active color
        document.getElementById("btn_rotate90c").setAttribute("style", "border: 2px solid #2EE59D;");

        let n = table.rows.length;

        // 1. take rows and make them columns (transpose our matrix)
        for (var i = 0; i < n; i++) {
            for (var j = i; j < n; j++) {
                let temp = table.rows[i].cells[j].innerHTML;
                table.rows[i].cells[j].innerHTML = table.rows[j].cells[i].innerHTML;
                table.rows[j].cells[i].innerHTML = temp;
            }
        }
    
        // 2. flip horizontally: traverse row from front/back and swap elements until middle element
        for (var i = 0; i < n; i++) {
            for (var j = 0; j < (n/2); j++) {
                let temp = table.rows[i].cells[j].innerHTML;
                table.rows[i].cells[j].innerHTML =  table.rows[i].cells[n-1-j].innerHTML;
                table.rows[i].cells[n-1-j].innerHTML = temp;
            }
        }
        // disable other button
        document.getElementById("btn_rotate180").disabled = true;
    }
    else {
        // change to inactive color
        document.getElementById("btn_rotate90c").setAttribute("style", "border: none;");

        // enable other button
        document.getElementById("btn_rotate180").disabled = false;

        rotation_state = 0; // reset to normal state
        clockwise_count = 0;
        resetBoard();
    }
    
    console.log("rotation_state = ", rotation_state);
}

function rotate_flip() {
    if (flip_count == 0) {
        rotation_state = 2; // change to 180 degree state
        flip_count += 1

        let n = table.rows.length;
        for (var i = 0; i < n; i++) {
            for (var j = 0; j < (n/2); j++) {
                let temp = table.rows[i].cells[n-j-1].innerHTML;
                table.rows[i].cells[n-j-1].innerHTML = table.rows[i].cells[j].innerHTML;
                table.rows[i].cells[j].innerHTML = temp;
            }
        }
        
        // change to active color
        document.getElementById("btn_rotate180").setAttribute("style", "border: 2px solid #2EE59D;");

        // enable other button
        document.getElementById("btn_rotate90c").disabled = true;
    }
    else {
        // enable other button
        document.getElementById("btn_rotate90c").disabled = false;
        
        // change to inactive color
        document.getElementById("btn_rotate180").setAttribute("style", "border: none;");

        rotation_state = 0; // reset to normal state
        flip_count = 0;
        resetBoard();
    }
    console.log("rotation_state = ", rotation_state);
}

/* Reset puzzle board function */
function resetBoard () {

    var correct_array = [
        ["1", "2", "3", "4"],
        ["5", "6", "7", "8"],
        ["9", "10", "11", "12"],
        ["13", "14", "15", " "]
    ];

    rotation_state = 0;

    console.log("rotation_state = ", rotation_state);

    for (var i = 0; i < table.rows.length; i++) {
        for (var j = 0; j < table.rows[i].cells.length; j++)
            table.rows[i].cells[j].innerHTML = correct_array[i][j];
        
    }

    document.getElementById("btn_rotate90c").disabled = false;
    document.getElementById("btn_rotate180").disabled = false;
    document.getElementById("btn_rotate90c").setAttribute("style", "border: none;");
    document.getElementById("btn_rotate180").setAttribute("style", "border: none;");
    resetBoardColor();
}

/* Event-listener for resetting the table */
resetButton = document.getElementById("btn_reset");
resetButton.onclick = function(){
    resetBoard(table);
};

/* Event-listener for scramble radio-button levels */
var scramble_level = 20; // default level
var radios = document.forms["rButtons"].elements["scramble_value"];
for(var i = 0; i < radios.length; i++) {
    radios[i].onclick = function() {
        switch(this.value) {
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

    for (var i = 0; i < table.rows.length; i++) {
        for (var j = 0; j < table.rows[i].cells.length; j++) {
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
function scrambleTable(up, down, left, right) {
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
scrambleButton = document.getElementById("btn_scramble");
scrambleButton.onclick = function() {
    for (var i = 0; i < scramble_level; i++) {
        locateCells();
    }
};

// Event-listener for selecting a cell to move 
for (var i = 0; i < table.rows.length; i++) {
    for (var j = 0; j < table.rows[i].cells.length; j++) {
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
function swapCells(cell, up, down, left, right) {
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
    var correct_array = [
        ["1", "2", "3", "4"],
        ["5", "6", "7", "8"],
        ["9", "10", "11", "12"],
        ["13", "14", "15", " "]
    ];

    if (rotation_state == 0) 
        correct_array =
        [
            ["1", "2", "3", "4"],
            ["5", "6", "7", "8"],
            ["9", "10", "11", "12"],
            ["13", "14", "15", " "]
        ];
    if (rotation_state == 1)
        correct_array =
        [
            ["13", "9", "5", "1"],
            ["14", "10", "6", "2"],
            ["15", "11", "7", "3"],
            [" ", "12", "8", "4"]
        ];

    if (rotation_state == 2)
        correct_array =
        [
            ["4", "3", "2", "1"],
            ["8", "7", "6", "5"],
            ["12", "11", "10", "9"],
            [" ", "15", "14", "13"]
        ];

    console.log("rotation_state = ", rotation_state);

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
        document.getElementsByTagName('td')[i].setAttribute("style", "background-color:green; border: 2px solid white;");
}

/* Function to reset puzzle board color. */
function resetBoardColor() {
    for (var i = 0; i < 16; i++)
        document.getElementsByTagName('td')[i].setAttribute("style", "border: 2px solid whitesmoke;");
}
