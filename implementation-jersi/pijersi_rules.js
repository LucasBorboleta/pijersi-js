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

    pijersi.rules.hexagonsPerSide = pijersi.rules.xIndices.length;

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

    pijersi.rules.hexagons = [];
    pijersi.rules.hexagons_states = [];
    pijersi.rules.saved_hexagons_states = null;

    pijersi.rules.cubes = [];
    pijersi.rules.cubes_states = [];
    pijersi.rules.saved_cubes_states = null;

    pijersi.rules.game_is_running = false;

    pijersi.debug.writeMessage( "pijersi.rules.__initModule(): done" );
};

// --- PIJERSI_BEGIN: getters ---

pijersi.rules.hexagonHasCube = function(hexagon){
    const hexagon_state = pijersi.rules.hexagons_states[hexagon.index];
    return hexagon_state.bottom != null || hexagon_state.top != null;
};

pijersi.rules.hexagonHasSelectableCube = function(hexagon){
    return pijersi.rules.hexagonHasCube(hexagon);
};

pijersi.rules.hexagonHasSelectableStack = function(hexagon){
    return pijersi.rules.hexagonHasStack(hexagon);
};

pijersi.rules.hexagonHasStack = function(hexagon){
    const hexagon_state = pijersi.rules.hexagons_states[hexagon.index];
    return hexagon_state.bottom != null && hexagon_state.top != null;
};

pijersi.rules.getHexagon = function(hexagon_name){
    return pijersi.rules.hexagons.find(function(hexagon, index, array){ return hexagon.name === hexagon_name; });
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

pijersi.rules.iSEmptyHexagon = function(hexagon){
    const hexagon_state = pijersi.rules.hexagons_states[hexagon.index];
    return hexagon_state.bottom == null && hexagon_state.top == null;
};

pijersi.rules.isSelectableDestinationHexagon = function(hexagon){
    return pijersi.rules.iSEmptyHexagon(hexagon);
};

pijersi.rules.isSelectableSourceHexagon = function(hexagon){
    return ! pijersi.rules.iSEmptyHexagon(hexagon);
};

// --- PIJERSI_END: getters ---

// --- PIJERSI_BEGIN: makers ---

pijersi.rules.makeAllHexagons = function(){

    // Row "a"
    pijersi.rules.makeHexagon( 'a1', [-1, -4] );
    pijersi.rules.makeHexagon( 'a2', [-0, -4] );
    pijersi.rules.makeHexagon( 'a3', [1, -4] );
    pijersi.rules.makeHexagon( 'a4', [2, -4] );
    pijersi.rules.makeHexagon( 'a5', [3, -4] );
    pijersi.rules.makeHexagon( 'a6', [4, -4] );
    pijersi.rules.makeHexagon( 'a7', [5, -4] );

    pijersi.rules.makeHexagon( 'a', [6, -4], true);

    // Row "b"
    pijersi.rules.makeHexagon( 'b1', [-2, -3] );
    pijersi.rules.makeHexagon( 'b2', [-1, -3] );
    pijersi.rules.makeHexagon( 'b3', [0, -3] );
    pijersi.rules.makeHexagon( 'b4', [1, -3] );
    pijersi.rules.makeHexagon( 'b5', [2, -3] );
    pijersi.rules.makeHexagon( 'b6', [3, -3] );
    pijersi.rules.makeHexagon( 'b7', [4, -3] );
    pijersi.rules.makeHexagon( 'b8', [5, -3] );

    pijersi.rules.makeHexagon( 'b', [6, -3], true);

    // Row "c"
    pijersi.rules.makeHexagon( 'c1', [-2, -2] );
    pijersi.rules.makeHexagon( 'c2', [-1, -2] );
    pijersi.rules.makeHexagon( 'c3', [0, -2] );
    pijersi.rules.makeHexagon( 'c4', [1, -2] );
    pijersi.rules.makeHexagon( 'c5', [2, -2] );
    pijersi.rules.makeHexagon( 'c6', [3, -2] );
    pijersi.rules.makeHexagon( 'c7', [4, -2] );

    pijersi.rules.makeHexagon( 'c', [5, -2], true);

    // Row "d"
    pijersi.rules.makeHexagon( 'd1', [-3, -1] );
    pijersi.rules.makeHexagon( 'd2', [-2, -1] );
    pijersi.rules.makeHexagon( 'd3', [-1, -1] );
    pijersi.rules.makeHexagon( 'd4', [0, -1] );
    pijersi.rules.makeHexagon( 'd5', [1, -1] );
    pijersi.rules.makeHexagon( 'd6', [2, -1] );
    pijersi.rules.makeHexagon( 'd7', [3, -1] );
    pijersi.rules.makeHexagon( 'd8', [4, -1] );

    pijersi.rules.makeHexagon( 'd', [5, -1], true);

    // Row "e"
    pijersi.rules.makeHexagon( 'e1', [-4, 0] );
    pijersi.rules.makeHexagon( 'e2', [-3, 0] );
    pijersi.rules.makeHexagon( 'e3', [-2, 0] );
    pijersi.rules.makeHexagon( 'e4', [-1, 0] );
    pijersi.rules.makeHexagon( 'e5', [0, 0] );
    pijersi.rules.makeHexagon( 'e6', [1, 0] );
    pijersi.rules.makeHexagon( 'e7', [2, 0] );
    pijersi.rules.makeHexagon( 'e8', [3, 0] );
    pijersi.rules.makeHexagon( 'e9', [4, 0] );

    // Row "f"

    pijersi.rules.makeHexagon( 'f', [-5, 1], true);

    pijersi.rules.makeHexagon( 'f1', [-4, 1] );
    pijersi.rules.makeHexagon( 'f2', [-3, 1] );
    pijersi.rules.makeHexagon( 'f3', [-2, 1] );
    pijersi.rules.makeHexagon( 'f4', [-1, 1] );
    pijersi.rules.makeHexagon( 'f5', [0, 1] );
    pijersi.rules.makeHexagon( 'f6', [1, 1] );
    pijersi.rules.makeHexagon( 'f7', [2, 1] );
    pijersi.rules.makeHexagon( 'f8', [3, 1] );

    // Row "g"
    pijersi.rules.makeHexagon( 'g', [-5, 2], true);

    pijersi.rules.makeHexagon( 'g1', [-4, 2] );
    pijersi.rules.makeHexagon( 'g2', [-3, 2] );
    pijersi.rules.makeHexagon( 'g3', [-2, 2] );
    pijersi.rules.makeHexagon( 'g4', [-1, 2] );
    pijersi.rules.makeHexagon( 'g5', [0, 2] );
    pijersi.rules.makeHexagon( 'g6', [1, 2] );
    pijersi.rules.makeHexagon( 'g7', [2, 2] );

    // Row "h"
    pijersi.rules.makeHexagon( 'h', [-6, 3], true);

    pijersi.rules.makeHexagon( 'h1', [-5, 3] );
    pijersi.rules.makeHexagon( 'h2', [-4, 3] );
    pijersi.rules.makeHexagon( 'h3', [-3, 3] );
    pijersi.rules.makeHexagon( 'h4', [-2, 3] );
    pijersi.rules.makeHexagon( 'h5', [-1, 3] );
    pijersi.rules.makeHexagon( 'h6', [0, 3] );
    pijersi.rules.makeHexagon( 'h7', [1, 3] );
    pijersi.rules.makeHexagon( 'h8', [2, 3] );

    // Row "i"
    pijersi.rules.makeHexagon( 'i', [-6, 4], true);

    pijersi.rules.makeHexagon( 'i1', [-5, 4] );
    pijersi.rules.makeHexagon( 'i2', [-4, 4] );
    pijersi.rules.makeHexagon( 'i3', [-3, 4] );
    pijersi.rules.makeHexagon( 'i4', [-2, 4] );
    pijersi.rules.makeHexagon( 'i5', [-1, 4] );
    pijersi.rules.makeHexagon( 'i6', [0, 4] );
    pijersi.rules.makeHexagon( 'i7', [1, 4] );
}

pijersi.rules.makeHexagon = function(hexagon_name, position_uv, reserve){

    if ( typeof reserve === "undefined" ) {
        reserve = false;
    };

    const hexagon = {
        index: pijersi.rules.hexagons.length,
        u: position_uv[0],
        v: position_uv[1],
        name: hexagon_name,
        reserve: reserve
    };

    const hexagon_state = {
        index: hexagon.index,
        bottom: null,
        top: null
    };

    pijersi.rules.hexagons.push(hexagon);
    pijersi.rules.hexagons_states.push(hexagon_state);

    return  hexagon;
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

// --- PIJERSI_END: makers ---

// --- PIJERSI_BEGIN: setters ---

pijersi.rules.clearHexagon = function(hexagon){
    const hexagon_state = pijersi.rules.hexagons_states[hexagon.index];
    hexagon_state.bottom = null;
    hexagon_state.top = null;
}

pijersi.rules.clearAllHexagons = function(){
    pijersi.rules.hexagons.forEach(pijersi.rules.clearHexagon);
};

pijersi.rules.moveCube = function(hexagon_source, hexagon_destination){
    pijersi.debug.assert( pijersi.rules.hexagonHasCube(hexagon_source), "hexagon_source has cube");
    pijersi.debug.assert( pijersi.rules.iSEmptyHexagon(hexagon_destination), "hexagon_destination is empty");

    const hexagon_source_status = pijersi.rules.hexagons_states[hexagon_source.index];
    const hexagon_destination_status = pijersi.rules.hexagons_states[hexagon_destination.index];

    if ( hexagon_source_status.top != null ) {
        hexagon_destination_status.bottom = hexagon_source_status.top;
        hexagon_source_status.top = null;

    } else {
        hexagon_destination_status.bottom = hexagon_source_status.bottom;
        hexagon_source_status.bottom = null;
    }
};

pijersi.rules.moveStack = function(hexagon_source, hexagon_destination){
    pijersi.debug.assert( pijersi.rules.hexagonHasStack(hexagon_source), "hexagon_source has stack");
    pijersi.debug.assert( pijersi.rules.iSEmptyHexagon(hexagon_destination), "hexagon_destination is empty");

    const hexagon_source_status = pijersi.rules.hexagons_states[hexagon_source.index];
    const hexagon_destination_status = pijersi.rules.hexagons_states[hexagon_destination.index];

    hexagon_destination_status.bottom = hexagon_source_status.bottom;
    hexagon_destination_status.top = hexagon_source_status.top;

    hexagon_source_status.bottom = null;
    hexagon_source_status.top = null;
};

pijersi.rules.setCube = function(hexagon, cube){
    const hexagon_state = pijersi.rules.hexagons_states[hexagon.index];

    if ( hexagon_state.bottom === null ) { hexagon_state.bottom = cube; }
    else if  ( hexagon_state.top === null ) { hexagon_state.top = cube; }
    else {
        pijersi.debug.assert(false, "pijersi.rules.setCube(): failed");
    }

    if ( hexagon.reserve ) {
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

pijersi.rules.setCubeByLabels = function(hexagon_name, cube_name){
    const hexagon = pijersi.rules.getHexagon(hexagon_name);
    const cube = pijersi.rules.getCube(cube_name);
    pijersi.rules.setCube(hexagon, cube);
};

// --- PIJERSI_END: setters ---

// --- PIJERSI_BEGIN: starters and savers ---

pijersi.rules.startGame = function(){
    pijersi.rules.makeAllHexagons();
    pijersi.rules.makeAllCubes();
    pijersi.rules.restartGame();
};

pijersi.rules.restartGame = function(){
    pijersi.rules.clearAllHexagons();
    pijersi.rules.setAllCubes();
    pijersi.rules.saveGame();
    pijersi.rules.game_is_running = true;
};

pijersi.rules.saveGame = function(){
    pijersi.rules.saveAllHexagonsStates();
    pijersi.rules.saveAllCubesStates();
};

pijersi.rules.saveHexagonState = function(hexagon_state, hexagon_index){
    const saved_hexagon_state = {bottom:hexagon_state.bottom, top:hexagon_state.top};
    pijersi.rules.saved_hexagons_states[hexagon_index] = saved_hexagon_state;
}

pijersi.rules.saveAllHexagonsStates = function(){

    if  ( pijersi.rules.saved_hexagons_states === null ) {
        pijersi.rules.saved_hexagons_states = Array.from(pijersi.rules.hexagons_states);
        pijersi.rules.saved_hexagons_states.fill(null);
    }

    pijersi.rules.hexagons_states.forEach(pijersi.rules.saveHexagonState);
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
    pijersi.rules.loadAllHexagonsStates();
    pijersi.rules.loadAllCubeStates();
};

pijersi.rules.loadHexagonState = function(saved_hexagon_state, hexagon_index){
    const hexagon_state = pijersi.rules.hexagons_states[hexagon_index];
    hexagon_state.bottom = saved_hexagon_state.bottom;
    hexagon_state.top = saved_hexagon_state.top;
}

pijersi.rules.loadAllHexagonsStates = function(){
    pijersi.rules.saved_hexagons_states.forEach(pijersi.rules.loadHexagonState);
};

pijersi.rules.loadCubeState = function(saved_cube_state, cube_index){
    pijersi.rules.saved_cubes_states[cube_index] = saved_cube_state;
}

pijersi.rules.loadAllCubeStates = function(){
    pijersi.rules.saved_cubes_states.forEach(pijersi.rules.loadCubeState);
};

// --- PIJERSI_END: starters and savers ---

//////////////////////////////////////////////////////////////////////////
