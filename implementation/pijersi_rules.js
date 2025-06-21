"use strict";
/* PIJERSI-JS-COPYRIGHT-MD-BEGIN
# COPYRIGHT

The software PIJERSI-JS implements the rules of PIJERSI, which is an abstract/strategy board game. This copyright notice only covers the software PIJERSI-JS. The copyright of the PIJERSI rules and board game concept can be found at https://github.com/LucasBorboleta/pijersi.

Copyright (C) 2025 Lucas Borboleta (lucas.borboleta@free.fr).

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses>.

PIJERSI-JS-COPYRIGHT-MD-END */
///////////////////////////////////////////////////////////////////////////////
pijersi.rules = { };
pijersi.rules.__initModuleCalled = false;

pijersi.rules.__initModule = function(){

    if ( pijersi.rules.__initModuleCalled ) return;
    pijersi.rules.__initModuleCalled = true;

    // Init required modules
    pijersi.debug.__initModule();

    // Init inner classes
    // None

    pijersi.rules.xLabels = "123456789".split("");
    pijersi.rules.yLabels = "abcdefghi".split("").reverse();
    pijersi.debug.assert(pijersi.rules.xLabels.length === pijersi.rules.yLabels.length, "xLabels.length === yLabels.length");

    pijersi.rules.xIndices = Array.from(pijersi.rules.xLabels.keys());
    pijersi.rules.yIndices = Array.from(pijersi.rules.yLabels.keys());

    pijersi.rules.cellsPerSide = pijersi.rules.xIndices.length;

    pijersi.rules.CubeColor = { WHITE:0, BLACK:1 };
    pijersi.rules.CubeSort = { FOOL:0, KING:1, MOUNTAIN:2, PAPER:3, ROCK:4, SCISSORS:5, WISE:6 };
    pijersi.rules.CubeState = { ACTIVATED:0, CAPTURED:1, RESERVED:2 };

    pijersi.rules.CubeLabel = []
    pijersi.rules.CubeLabel[pijersi.rules.CubeColor.WHITE] = []
    pijersi.rules.CubeLabel[pijersi.rules.CubeColor.WHITE][pijersi.rules.CubeSort.FOOL] = 'F';
    pijersi.rules.CubeLabel[pijersi.rules.CubeColor.WHITE][pijersi.rules.CubeSort.KING] = 'K';
    pijersi.rules.CubeLabel[pijersi.rules.CubeColor.WHITE][pijersi.rules.CubeSort.MOUNTAIN] = 'M';
    pijersi.rules.CubeLabel[pijersi.rules.CubeColor.WHITE][pijersi.rules.CubeSort.PAPER] = 'P';
    pijersi.rules.CubeLabel[pijersi.rules.CubeColor.WHITE][pijersi.rules.CubeSort.ROCK] = 'R';
    pijersi.rules.CubeLabel[pijersi.rules.CubeColor.WHITE][pijersi.rules.CubeSort.SCISSORS] = 'S';
    pijersi.rules.CubeLabel[pijersi.rules.CubeColor.WHITE][pijersi.rules.CubeSort.WISE] = 'W';
    pijersi.rules.CubeLabel[pijersi.rules.CubeColor.BLACK] = []
    pijersi.rules.CubeLabel[pijersi.rules.CubeColor.BLACK][pijersi.rules.CubeSort.FOOL] = 'f';
    pijersi.rules.CubeLabel[pijersi.rules.CubeColor.BLACK][pijersi.rules.CubeSort.KING] = 'k';
    pijersi.rules.CubeLabel[pijersi.rules.CubeColor.BLACK][pijersi.rules.CubeSort.MOUNTAIN] = 'm';
    pijersi.rules.CubeLabel[pijersi.rules.CubeColor.BLACK][pijersi.rules.CubeSort.PAPER] = 'p';
    pijersi.rules.CubeLabel[pijersi.rules.CubeColor.BLACK][pijersi.rules.CubeSort.ROCK] = 'r';
    pijersi.rules.CubeLabel[pijersi.rules.CubeColor.BLACK][pijersi.rules.CubeSort.SCISSORS] = 's';
    pijersi.rules.CubeLabel[pijersi.rules.CubeColor.BLACK][pijersi.rules.CubeSort.WISE] = 'w';

    pijersi.rules.cells = [];
    pijersi.rules.cells_states = [];
    pijersi.rules.saved_cells_states = null;

    pijersi.rules.cubes = [];
    pijersi.rules.cubes_states = [];
    pijersi.rules.saved_cubes_states = null;

    pijersi.rules.game_is_running = false;

    pijersi.debug.writeMessage( "pijersi.rules.__initModule(): done" );
};

// --- JERSI_BEGIN: getters ---

pijersi.rules.cellHasCube = function(cell){
    const cell_state = pijersi.rules.cells_states[cell.index];
    return cell_state.bottom != null || cell_state.top != null;
};

pijersi.rules.cellHasSelectableCube = function(cell){
    return pijersi.rules.cellHasCube(cell);
};

pijersi.rules.cellHasSelectableStack = function(cell){
    return pijersi.rules.cellHasStack(cell);
};

pijersi.rules.cellHasStack = function(cell){
    const cell_state = pijersi.rules.cells_states[cell.index];
    return cell_state.bottom != null && cell_state.top != null;
};

pijersi.rules.getCell = function(cell_name){
    return pijersi.rules.cells.find(function(cell, index, array){ return cell.name === cell_name; });
};

pijersi.rules.getCube = function(cube_name){
    return pijersi.rules.cubes.find(function(cube, index, array){ return cube.name === cube_name; });
};

pijersi.rules.getCubeColorAndSort = function(cube_label){
    for ( const cube_color of Object.values(pijersi.rules.CubeColor) ) {
        for ( const cube_sort of Object.values(pijersi.rules.CubeSort) ) {
            if ( pijersi.rules.CubeLabel[cube_color][cube_sort] === cube_label ) {
                return {color: cube_color, sort: cube_sort};
            }
        }
    }
    pijersi.debug.assert(false, "pijersi.rules.getCubeColorAndSort(): failed");
};

pijersi.rules.iSEmptyCell = function(cell){
    const cell_state = pijersi.rules.cells_states[cell.index];
    return cell_state.bottom == null && cell_state.top == null;
};

pijersi.rules.isSelectableDestinationCell = function(cell){
    return pijersi.rules.iSEmptyCell(cell);
};

pijersi.rules.isSelectableSourceCell = function(cell){
    return ! pijersi.rules.iSEmptyCell(cell);
};

// --- JERSI_END: getters ---

// --- JERSI_BEGIN: makers ---

pijersi.rules.makeAllCells = function(){

    // Row "a"
    pijersi.rules.makeCell( 'a1', [-1, -4] );
    pijersi.rules.makeCell( 'a2', [-0, -4] );
    pijersi.rules.makeCell( 'a3', [1, -4] );
    pijersi.rules.makeCell( 'a4', [2, -4] );
    pijersi.rules.makeCell( 'a5', [3, -4] );
    pijersi.rules.makeCell( 'a6', [4, -4] );
    pijersi.rules.makeCell( 'a7', [5, -4] );

    pijersi.rules.makeCell( 'a', [6, -4], true);

    // Row "b"
    pijersi.rules.makeCell( 'b1', [-2, -3] );
    pijersi.rules.makeCell( 'b2', [-1, -3] );
    pijersi.rules.makeCell( 'b3', [0, -3] );
    pijersi.rules.makeCell( 'b4', [1, -3] );
    pijersi.rules.makeCell( 'b5', [2, -3] );
    pijersi.rules.makeCell( 'b6', [3, -3] );
    pijersi.rules.makeCell( 'b7', [4, -3] );
    pijersi.rules.makeCell( 'b8', [5, -3] );

    pijersi.rules.makeCell( 'b', [6, -3], true);

    // Row "c"
    pijersi.rules.makeCell( 'c1', [-2, -2] );
    pijersi.rules.makeCell( 'c2', [-1, -2] );
    pijersi.rules.makeCell( 'c3', [0, -2] );
    pijersi.rules.makeCell( 'c4', [1, -2] );
    pijersi.rules.makeCell( 'c5', [2, -2] );
    pijersi.rules.makeCell( 'c6', [3, -2] );
    pijersi.rules.makeCell( 'c7', [4, -2] );

    pijersi.rules.makeCell( 'c', [5, -2], true);

    // Row "d"
    pijersi.rules.makeCell( 'd1', [-3, -1] );
    pijersi.rules.makeCell( 'd2', [-2, -1] );
    pijersi.rules.makeCell( 'd3', [-1, -1] );
    pijersi.rules.makeCell( 'd4', [0, -1] );
    pijersi.rules.makeCell( 'd5', [1, -1] );
    pijersi.rules.makeCell( 'd6', [2, -1] );
    pijersi.rules.makeCell( 'd7', [3, -1] );
    pijersi.rules.makeCell( 'd8', [4, -1] );

    pijersi.rules.makeCell( 'd', [5, -1], true);

    // Row "e"
    pijersi.rules.makeCell( 'e1', [-4, 0] );
    pijersi.rules.makeCell( 'e2', [-3, 0] );
    pijersi.rules.makeCell( 'e3', [-2, 0] );
    pijersi.rules.makeCell( 'e4', [-1, 0] );
    pijersi.rules.makeCell( 'e5', [0, 0] );
    pijersi.rules.makeCell( 'e6', [1, 0] );
    pijersi.rules.makeCell( 'e7', [2, 0] );
    pijersi.rules.makeCell( 'e8', [3, 0] );
    pijersi.rules.makeCell( 'e9', [4, 0] );

    // Row "f"

    pijersi.rules.makeCell( 'f', [-5, 1], true);

    pijersi.rules.makeCell( 'f1', [-4, 1] );
    pijersi.rules.makeCell( 'f2', [-3, 1] );
    pijersi.rules.makeCell( 'f3', [-2, 1] );
    pijersi.rules.makeCell( 'f4', [-1, 1] );
    pijersi.rules.makeCell( 'f5', [0, 1] );
    pijersi.rules.makeCell( 'f6', [1, 1] );
    pijersi.rules.makeCell( 'f7', [2, 1] );
    pijersi.rules.makeCell( 'f8', [3, 1] );

    // Row "g"
    pijersi.rules.makeCell( 'g', [-5, 2], true);

    pijersi.rules.makeCell( 'g1', [-4, 2] );
    pijersi.rules.makeCell( 'g2', [-3, 2] );
    pijersi.rules.makeCell( 'g3', [-2, 2] );
    pijersi.rules.makeCell( 'g4', [-1, 2] );
    pijersi.rules.makeCell( 'g5', [0, 2] );
    pijersi.rules.makeCell( 'g6', [1, 2] );
    pijersi.rules.makeCell( 'g7', [2, 2] );

    // Row "h"
    pijersi.rules.makeCell( 'h', [-6, 3], true);

    pijersi.rules.makeCell( 'h1', [-5, 3] );
    pijersi.rules.makeCell( 'h2', [-4, 3] );
    pijersi.rules.makeCell( 'h3', [-3, 3] );
    pijersi.rules.makeCell( 'h4', [-2, 3] );
    pijersi.rules.makeCell( 'h5', [-1, 3] );
    pijersi.rules.makeCell( 'h6', [0, 3] );
    pijersi.rules.makeCell( 'h7', [1, 3] );
    pijersi.rules.makeCell( 'h8', [2, 3] );

    // Row "i"
    pijersi.rules.makeCell( 'i', [-6, 4], true);

    pijersi.rules.makeCell( 'i1', [-5, 4] );
    pijersi.rules.makeCell( 'i2', [-4, 4] );
    pijersi.rules.makeCell( 'i3', [-3, 4] );
    pijersi.rules.makeCell( 'i4', [-2, 4] );
    pijersi.rules.makeCell( 'i5', [-1, 4] );
    pijersi.rules.makeCell( 'i6', [0, 4] );
    pijersi.rules.makeCell( 'i7', [1, 4] );
}

pijersi.rules.makeCell = function(cell_name, position_uv, reserve){

    if ( typeof reserve === "undefined" ) {
        reserve = false;
    };

    const cell = {
        index: pijersi.rules.cells.length,
        u: position_uv[0],
        v: position_uv[1],
        name: cell_name,
        reserve: reserve
    };

    const cell_state = {
        index: cell.index,
        bottom: null,
        top: null
    };

    pijersi.rules.cells.push(cell);
    pijersi.rules.cells_states.push(cell_state);

    return  cell;
};

pijersi.rules.makeAllCubes = function(){
    for ( const cube_color of Object.values(pijersi.rules.CubeColor) ) {
        for ( const cube_sort of Object.values(pijersi.rules.CubeSort) ) {

            let cube_sort_count = 0;
            if ( cube_sort === pijersi.rules.CubeSort.ROCK ||
                 cube_sort === pijersi.rules.CubeSort.PAPER ||
                 cube_sort === pijersi.rules.CubeSort.SCISSORS ||
                 cube_sort === pijersi.rules.CubeSort.MOUNTAIN ) { cube_sort_count = 4; }

            else if ( cube_sort === pijersi.rules.CubeSort.FOOL ||
                      cube_sort === pijersi.rules.CubeSort.WISE ) { cube_sort_count = 2; }

            else if ( cube_sort === pijersi.rules.CubeSort.KING ) { cube_sort_count = 1; }

            for ( let cube_sort_index=1; cube_sort_index <= cube_sort_count; cube_sort_index++ ) {
                const cube_label = pijersi.rules.CubeLabel[cube_color][cube_sort];
                const cube_name = cube_label + cube_sort_index;

                const cube = { color: cube_color,
                               sort: cube_sort,
                               label: cube_label,
                               name: cube_name,
                               index: pijersi.rules.cubes.length };
                pijersi.rules.cubes.push(cube);
                pijersi.rules.cubes_states.push(pijersi.rules.CubeState.CAPTURED);
            }
        }
    }
};

// --- JERSI_END: makers ---

// --- JERSI_BEGIN: setters ---

pijersi.rules.clearCell = function(cell){
    const cell_state = pijersi.rules.cells_states[cell.index];
    cell_state.bottom = null;
    cell_state.top = null;
}

pijersi.rules.clearAllCells = function(){
    pijersi.rules.cells.forEach(pijersi.rules.clearCell);
};

pijersi.rules.moveCube = function(cell_source, cell_destination){
    pijersi.debug.assert( pijersi.rules.cellHasCube(cell_source), "cell_source has cube");
    pijersi.debug.assert( pijersi.rules.iSEmptyCell(cell_destination), "cell_destination is empty");

    const cell_source_status = pijersi.rules.cells_states[cell_source.index];
    const cell_destination_status = pijersi.rules.cells_states[cell_destination.index];

    if ( cell_source_status.top != null ) {
        cell_destination_status.bottom = cell_source_status.top;
        cell_source_status.top = null;

    } else {
        cell_destination_status.bottom = cell_source_status.bottom;
        cell_source_status.bottom = null;
    }
};

pijersi.rules.moveStack = function(cell_source, cell_destination){
    pijersi.debug.assert( pijersi.rules.cellHasStack(cell_source), "cell_source has stack");
    pijersi.debug.assert( pijersi.rules.iSEmptyCell(cell_destination), "cell_destination is empty");

    const cell_source_status = pijersi.rules.cells_states[cell_source.index];
    const cell_destination_status = pijersi.rules.cells_states[cell_destination.index];

    cell_destination_status.bottom = cell_source_status.bottom;
    cell_destination_status.top = cell_source_status.top;

    cell_source_status.bottom = null;
    cell_source_status.top = null;
};

pijersi.rules.setCube = function(cell, cube){
    const cell_state = pijersi.rules.cells_states[cell.index];

    if ( cell_state.bottom === null ) { cell_state.bottom = cube; }
    else if  ( cell_state.top === null ) { cell_state.top = cube; }
    else {
        pijersi.debug.assert(false, "pijersi.rules.setCube(): failed");
    }

    if ( cell.reserve ) {
        pijersi.rules.cubes_states[cube.index] = pijersi.rules.CubeState.RESERVED;
    } else {
        pijersi.rules.cubes_states[cube.index] = pijersi.rules.CubeState.ACTIVATED;
    }
};

pijersi.rules.setAllCubes = function(){

    // whites

    pijersi.rules.setCubeByLabels("b1", "F1");
    pijersi.rules.setCubeByLabels("b8", "F2");
    pijersi.rules.setCubeByLabels("a4", "K1");

    pijersi.rules.setCubeByLabels("b2", "R1");
    pijersi.rules.setCubeByLabels("b3", "P1");
    pijersi.rules.setCubeByLabels("b4", "S1");
    pijersi.rules.setCubeByLabels("b5", "R2");
    pijersi.rules.setCubeByLabels("b6", "P2");
    pijersi.rules.setCubeByLabels("b7", "S2");

    pijersi.rules.setCubeByLabels("a3", "R3");
    pijersi.rules.setCubeByLabels("a2", "S3");
    pijersi.rules.setCubeByLabels("a1", "P3");
    pijersi.rules.setCubeByLabels("a5", "S4");
    pijersi.rules.setCubeByLabels("a6", "R4");
    pijersi.rules.setCubeByLabels("a7", "P4");

    // blacks

    pijersi.rules.setCubeByLabels("h1", "f1");
    pijersi.rules.setCubeByLabels("h8", "f2");
    pijersi.rules.setCubeByLabels("i4", "k1");

    pijersi.rules.setCubeByLabels("h7", "r1");
    pijersi.rules.setCubeByLabels("h6", "p1");
    pijersi.rules.setCubeByLabels("h5", "s1");
    pijersi.rules.setCubeByLabels("h4", "r2");
    pijersi.rules.setCubeByLabels("h3", "p2");
    pijersi.rules.setCubeByLabels("h2", "s2");

    pijersi.rules.setCubeByLabels("i5", "r3");
    pijersi.rules.setCubeByLabels("i6", "s3");
    pijersi.rules.setCubeByLabels("i7", "p3");
    pijersi.rules.setCubeByLabels("i3", "s4");
    pijersi.rules.setCubeByLabels("i2", "r4");
    pijersi.rules.setCubeByLabels("i1", "p4");

    // white reserve

    pijersi.rules.setCubeByLabels("a", "M1");
    pijersi.rules.setCubeByLabels("a", "M2");
    pijersi.rules.setCubeByLabels("b", "M3");
    pijersi.rules.setCubeByLabels("b", "M4");
    pijersi.rules.setCubeByLabels("c", "W1");
    pijersi.rules.setCubeByLabels("c", "W2");

    // black reserve

    pijersi.rules.setCubeByLabels("i", "m1");
    pijersi.rules.setCubeByLabels("i", "m2");
    pijersi.rules.setCubeByLabels("h", "m3");
    pijersi.rules.setCubeByLabels("h", "m4");
    pijersi.rules.setCubeByLabels("g", "w1");
    pijersi.rules.setCubeByLabels("g", "w2");
};

pijersi.rules.setCubeByLabels = function(cell_name, cube_name){
    const cell = pijersi.rules.getCell(cell_name);
    const cube = pijersi.rules.getCube(cube_name);
    pijersi.rules.setCube(cell, cube);
};

// --- JERSI_END: setters ---

// --- JERSI_BEGIN: starters and savers ---

pijersi.rules.startGame = function(){
    pijersi.rules.makeAllCells();
    pijersi.rules.makeAllCubes();
    pijersi.rules.restartGame();
};

pijersi.rules.restartGame = function(){
    pijersi.rules.clearAllCells();
    pijersi.rules.setAllCubes();
    pijersi.rules.saveGame();
    pijersi.rules.game_is_running = true;
};

pijersi.rules.saveGame = function(){
    pijersi.rules.saveAllCellsStates();
    pijersi.rules.saveAllCubesStates();
};

pijersi.rules.saveCellState = function(cell_state, cell_index){
    const saved_cell_state = {bottom:cell_state.bottom, top:cell_state.top};
    pijersi.rules.saved_cells_states[cell_index] = saved_cell_state;
}

pijersi.rules.saveAllCellsStates = function(){

    if  ( pijersi.rules.saved_cells_states === null ) {
        pijersi.rules.saved_cells_states = Array.from(pijersi.rules.cells_states);
        pijersi.rules.saved_cells_states.fill(null);
    }

    pijersi.rules.cells_states.forEach(pijersi.rules.saveCellState);
};

pijersi.rules.saveCubeState = function(cube_state, cube_index){
    const saved_cube_state = cube_state;
    pijersi.rules.saved_cubes_states[cube_index] = saved_cube_state;
}

pijersi.rules.saveAllCubesStates = function(){

    if  ( pijersi.rules.saved_cubes_states === null ) {
        pijersi.rules.saved_cubes_states = Array.from(pijersi.rules.cubes_states);
        pijersi.rules.saved_cubes_states.fill(null);
    }

    pijersi.rules.cubes_states.forEach(pijersi.rules.saveCubeState);
};

pijersi.rules.loadGame = function(){
    pijersi.rules.loadAllCellsStates();
    pijersi.rules.loadAllCubeStates();
};

pijersi.rules.loadCellState = function(saved_cell_state, cell_index){
    const cell_state = pijersi.rules.cells_states[cell_index];
    cell_state.bottom = saved_cell_state.bottom;
    cell_state.top = saved_cell_state.top;
}

pijersi.rules.loadAllCellsStates = function(){
    pijersi.rules.saved_cells_states.forEach(pijersi.rules.loadCellState);
};

pijersi.rules.loadCubeState = function(saved_cube_state, cube_index){
    pijersi.rules.saved_cubes_states[cube_index] = saved_cube_state;
}

pijersi.rules.loadAllCubeStates = function(){
    pijersi.rules.saved_cubes_states.forEach(pijersi.rules.loadCubeState);
};

// --- JERSI_END: starters and savers ---

//////////////////////////////////////////////////////////////////////////
