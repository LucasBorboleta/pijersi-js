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
pijersi.model = { };
pijersi.model.__init_called = false;

pijersi.model.__init = function(){

    if ( pijersi.model.__init_called ) return;
    pijersi.model.__init_called = true;

    // Init the required sub-modules
    pijersi.debug.__init();

    // Init the sub-module constants

    pijersi.model.const = {};

    pijersi.model.const.MODE_RUN = "run";
    pijersi.model.const.MODE_REVIEW = "review";
    pijersi.model.const.MODE_EDIT = "edit";

    pijersi.model.const.CREDIT_MAX = 20;

    pijersi.model.const.PLAYER_WHITE = "white";
    pijersi.model.const.PLAYER_BLACK = "black";

    pijersi.model.const.PLAYERS = [];
    pijersi.model.const.PLAYERS.push(pijersi.model.const.PLAYER_WHITE);
    pijersi.model.const.PLAYERS.push(pijersi.model.const.PLAYER_BLACK);

    pijersi.model.const.CUBE_ROCK = "rock";
    pijersi.model.const.CUBE_PAPER = "paper";
    pijersi.model.const.CUBE_SCISSORS = "scissors";
    pijersi.model.const.CUBE_WISE = "wise";

    pijersi.model.const.CUBES = [];
    pijersi.model.const.CUBES.push(pijersi.model.const.CUBE_ROCK);
    pijersi.model.const.CUBES.push(pijersi.model.const.CUBE_PAPER);
    pijersi.model.const.CUBES.push(pijersi.model.const.CUBE_SCISSORS);
    pijersi.model.const.CUBES.push(pijersi.model.const.CUBE_WISE);
    
    pijersi.model.const.CUBE_COUNTS = {}
    pijersi.model.const.CUBE_COUNTS[pijersi.model.const.CUBE_ROCK] = 4;
    pijersi.model.const.CUBE_COUNTS[pijersi.model.const.CUBE_PAPER] = 4;
    pijersi.model.const.CUBE_COUNTS[pijersi.model.const.CUBE_SCISSORS] = 4;
    pijersi.model.const.CUBE_COUNTS[pijersi.model.const.CUBE_WISE] = 2;

    pijersi.model.const.LEGEND_WIN_SCORE = "1";
    pijersi.model.const.LEGEND_LOSS_SCORE = "0";
    pijersi.model.const.LEGEND_TIE_SCORE = "½";
    pijersi.model.const.LEGEND_FAKE_SCORE = " " + pijersi.model.const.LEGEND_WIN_SCORE + "-" + pijersi.model.const.LEGEND_LOSS_SCORE;

    // Freeze the sub-module constants
    Object.freeze(pijersi.model.const);

    // Init the sub-module variables

    pijersi.model.mode = undefined;
    pijersi.model.terminated = undefined;

    pijersi.model.turn_index = undefined;

    pijersi.model.turns = undefined;

    pijersi.model.player = undefined;
    pijersi.model.credit = undefined;
    pijersi.model.board = undefined;
    pijersi.model.legend = undefined;

    pijersi.model.hexagons = undefined;
    pijersi.model.hexagons_states = undefined;
    pijersi.model.captures = undefined;    

    // Seal the sub-module
    Object.seal(pijersi.model);
};
		

pijersi.model.get_mode = function(){
    return pijersi.model.mode;
};


pijersi.model.get_legend = function(){
    return pijersi.model.legend;
};


pijersi.model.get_credit = function(){
    return pijersi.model.credit;
};


pijersi.model.get_player = function(){
    return pijersi.model.player;
};


pijersi.model.next_player = function(){

    if ( pijersi.model.player === pijersi.model.const.PLAYER_WHITE ) {
        pijersi.model.player = pijersi.model.const.PLAYER_BLACK;

    } else if ( pijersi.model.player === pijersi.model.const.PLAYER_BLACK ) {
        pijersi.model.player = pijersi.model.const.PLAYER_WHITE;

    } else {
         pijersi.debug.log_error("unexpected 'pijersi.model.player' = " + pijersi.model.player);
    }
};


pijersi.model.new_game = function(){

    pijersi.model.mode = pijersi.model.const.MODE_RUN;

    pijersi.model.terminated = false;

    pijersi.model.turn_index = 0;

    pijersi.model.player = pijersi.model.const.PLAYER_WHITE;
    pijersi.model.credit = pijersi.model.const.CREDIT_MAX;
    pijersi.model.board = [];
    pijersi.model.legend = "";

    const turn = {
        turn_index: pijersi.model.turn_index,
        player: pijersi.model.player,
        credit: pijersi.model.credit,
        terminated: pijersi.model.terminated,
        board: pijersi.model.board,
        legend: pijersi.model.legend
    };

    pijersi.model.turns = []
    pijersi.model.turns.push(turn);

    pijersi.model.turn_index += 1;
    pijersi.model.player = pijersi.model.const.PLAYER_WHITE;
};
		

pijersi.model.new_turn = function(){

    if ( pijersi.model.mode !== pijersi.model.const.MODE_RUN ) {
        pijersi.debug.log_error("unexpected 'pijersi.model.mode' = " + pijersi.model.mode);
        return;
    }

    if ( pijersi.model.terminated ) return;

    pijersi.model.legend = pijersi.model.turn_index.toString().padStart(2, '0') + " " + "xi-yi=zk";

    pijersi.model.credit = pijersi.model.credit - 1;

    if ( pijersi.model.credit <= 0 ) {
        pijersi.model.terminated = true;
        pijersi.model.legend += pijersi.model.const.LEGEND_FAKE_SCORE;

    } else {
        pijersi.model.terminated = false;
    }

    const turn = {
        turn_index: pijersi.model.turn_index,
        player: pijersi.model.player,
        credit: pijersi.model.credit,
        terminated: pijersi.model.terminated,
        board: pijersi.model.board,
        legend: pijersi.model.legend
    };

    pijersi.model.turns.push(turn);

    if ( ! pijersi.model.terminated ) {
        pijersi.model.turn_index += 1;
        pijersi.model.next_player();
    }
};


pijersi.model.stop_review_game = function(){

    if ( pijersi.model.mode === pijersi.model.const.MODE_REVIEW ) return;

    pijersi.model.mode = pijersi.model.const.MODE_REVIEW;

    const last_turn_index = pijersi.model.turns.length - 1;
    const last_turn = pijersi.model.turns[last_turn_index];

    pijersi.model.turn_index = last_turn.turn_index;
    pijersi.model.player = last_turn.player;
    pijersi.model.credit = last_turn.credit;
    pijersi.model.terminated = last_turn.terminated;
    pijersi.model.board = last_turn.board;
    pijersi.model.legend = last_turn.legend;
};


pijersi.model.goto_next_turn = function(){

    if ( pijersi.model.mode !== pijersi.model.const.MODE_REVIEW ) {
        pijersi.debug.log_error("unexpected 'pijersi.model.mode' = " + pijersi.model.mode);
        return;
    }

    const first_turn_index = 0;
    const last_turn_index = pijersi.model.turns.length - 1;

    let next_turn_index = pijersi.model.turn_index + 1;
    if ( next_turn_index > last_turn_index ) {
        next_turn_index = first_turn_index;
    }

    const next_turn = pijersi.model.turns[next_turn_index];

    pijersi.model.turn_index = next_turn.turn_index;
    pijersi.model.player = next_turn.player;
    pijersi.model.credit = next_turn.credit;
    pijersi.model.terminated = next_turn.terminated;
    pijersi.model.board = next_turn.board;
    pijersi.model.legend = next_turn.legend;
};


pijersi.model.goto_previous_turn = function(){

    if ( pijersi.model.mode !== pijersi.model.const.MODE_REVIEW ) {
        pijersi.debug.log_error("unexpected 'pijersi.model.mode' = " + pijersi.model.mode);
        return;
    }

    const first_turn_index = 0;
    const last_turn_index = pijersi.model.turns.length - 1;

    let previous_turn_index = pijersi.model.turn_index - 1;
    if ( previous_turn_index < first_turn_index ) {
        previous_turn_index = last_turn_index;
    }

    const previous_turn = pijersi.model.turns[previous_turn_index];

    pijersi.model.turn_index = previous_turn.turn_index;
    pijersi.model.player = previous_turn.player;
    pijersi.model.credit = previous_turn.credit;
    pijersi.model.terminated = previous_turn.terminated;
    pijersi.model.board = previous_turn.board;
    pijersi.model.legend = previous_turn.legend;
};


pijersi.model.resume_game = function(){

    if ( pijersi.model.mode === pijersi.model.const.MODE_RUN ) return;

    pijersi.model.mode = pijersi.model.const.MODE_RUN;

    pijersi.model.turns = pijersi.model.turns.slice(0, pijersi.model.turn_index + 1)

    if ( ! pijersi.model.terminated ) {
        pijersi.model.turn_index += 1;
        pijersi.model.next_player();
    }
};


pijersi.model.edit_game = function(){
    if ( pijersi.model.mode === pijersi.model.const.MODE_EDIT ) return;

    pijersi.model.mode = pijersi.model.const.MODE_EDIT;

    pijersi.model.turn_index = 0;
    pijersi.model.legend = "";

    if ( pijersi.model.credit <= 0 ) {
        pijersi.model.terminated = true;
        pijersi.model.legend += pijersi.model.const.LEGEND_FAKE_SCORE;

    } else {
        pijersi.model.terminated = false;
    }

    const turn = {
        turn_index: pijersi.model.turn_index,
        player: pijersi.model.player,
        credit: pijersi.model.credit,
        terminated: pijersi.model.terminated,
        board: pijersi.model.board,
        legend: pijersi.model.legend
    };

    pijersi.model.turns = []
    pijersi.model.turns.push(turn);
};


pijersi.model.edit_credit = function(){

    if ( pijersi.model.mode !== pijersi.model.const.MODE_EDIT ) {
        pijersi.debug.log_error("unexpected 'pijersi.model.mode' = " + pijersi.model.mode);
        return;
    }

    pijersi.model.credit = pijersi.model.credit + 1;
    if ( pijersi.model.credit > pijersi.model.const.CREDIT_MAX ) pijersi.model.credit = 0;

    pijersi.model.turn_index = 0;
    pijersi.model.legend = "";

    if ( pijersi.model.credit <= 0 ) {
        pijersi.model.terminated = true;
        pijersi.model.legend += pijersi.model.const.LEGEND_FAKE_SCORE;

    } else {
        pijersi.model.terminated = false;
    }

    const turn = {
        turn_index: pijersi.model.turn_index,
        player: pijersi.model.player,
        credit: pijersi.model.credit,
        terminated: pijersi.model.terminated,
        board: pijersi.model.board,
        legend: pijersi.model.legend
    };

    pijersi.model.turns = []
    pijersi.model.turns.push(turn);
};


pijersi.model.edit_player_turn = function(){

    if ( pijersi.model.mode !== pijersi.model.const.MODE_EDIT ) {
        pijersi.debug.log_error("unexpected 'pijersi.model.mode' = " + pijersi.model.mode);
        return;
    }

    pijersi.model.next_player();

    pijersi.model.turn_index = 0;
    pijersi.model.legend = "";

    if ( pijersi.model.credit <= 0 ) {
        pijersi.model.terminated = true;
        pijersi.model.legend += pijersi.model.const.LEGEND_FAKE_SCORE;

    } else {
        pijersi.model.terminated = false;
    }

    const turn = {
        turn_index: pijersi.model.turn_index,
        player: pijersi.model.player,
        credit: pijersi.model.credit,
        terminated: pijersi.model.terminated,
        board: pijersi.model.board,
        legend: pijersi.model.legend
    };

    pijersi.model.turns = []
    pijersi.model.turns.push(turn);
};
///////////////////////////////////////////////////////////////////////////////


pijersi.model.make_hexagon = function(hexagon_index, hexagon_name, position_uv){

    const hexagon = {
        index: hexagon_index,
        name: hexagon_name,
        u: position_uv[0],
        v: position_uv[1]
    };

    return  hexagon;
};


pijersi.model.make_hexagon_state = function(hexagon){

     const hexagon_state = {
        index: hexagon.index,
        bottom: null,
        top: null
    };

    return  hexagon_state;
};


pijersi.model.make_all_hexagons = function(){

    if ( pijersi.model.hexagons === undefined ) {

        let hexagons = []

        // Row "a"
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'a1',  [-1, -3] ));
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'a2',  [-0, -3] ));
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'a3',  [1, -3] ));
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'a4',  [2, -3] ));
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'a5',  [3, -3] ));
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'a6',  [4, -3] ));

        // Row "b"
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'b1',  [-2, -2] ));
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'b2',  [-1, -2] ));
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'b3',  [0, -2] ));
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'b4',  [1, -2] ));
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'b5',  [2, -2] ));
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'b6',  [3, -2] ));
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'b7',  [4, -2] ));

        // Row "c"
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'c1',  [-2, -1] ));
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'c2',  [-1, -1] ));
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'c3',  [0, -1] ));
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'c4',  [1, -1] ));
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'c5',  [2, -1] ));
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'c6',  [3, -1] ));

        // Row "d"
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'd1',  [-3, 0] ));
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'd2',  [-2, 0] ));
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'd3',  [-1, 0] ));
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'd4',  [0, 0] ));
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'd5',  [1, 0] ));
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'd6',  [2, 0] ));
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'd7',  [3, 0] ));

        // Row "e"
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'e1',  [-3, 1] ));
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'e2',  [-2, 1] ));
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'e3',  [-1, 1] ));
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'e4',  [0, 1] ));
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'e5',  [1, 1] ));
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'e6',  [2, 1] ));

        // Row "f"
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'f1',  [-4, 2] ));
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'f2',  [-3, 2] ));
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'f3',  [-2, 2] ));
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'f4',  [-1, 2] ));
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'f5',  [0, 2] ));
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'f6',  [1, 2] ));
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'f7',  [2, 2] ));

        // Row "g"
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'g1', [-4, 3] ));
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'g2', [-3, 3] ));
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'g3', [-2, 3] ));
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'g4', [-1, 3] ));
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'g5', [0, 3] ));
        hexagons.push( pijersi.model.make_hexagon( hexagons.length , 'g6', [1, 3] ));
        
        pijersi.model.hexagons = hexagons;
    }
};


pijersi.model.make_all_hexagons_states = function(hexagons){

    if ( pijersi.model.hexagons_states === undefined ) {

        let hexagons_states = [];

        for ( const hexagon of hexagons ) {
            hexagons_states[hexagon.index] = pijersi.model.make_hexagon_state(hexagon);
        }

        pijersi.model.hexagons_states = hexagons_states;
    }
};


pijersi.model.make_all_captures = function(){

    if ( pijersi.model.captures === undefined ) {

        let captures = {};

        for ( const player of pijersi.model.const.PLAYERS ) {
            captures[player] = {};

            for ( const cube_sort of pijersi.model.const.CUBES ) {
                captures[player][cube_sort] = [];

                const cube_count =  pijersi.model.const.CUBE_COUNTS[cube_sort];
            
                for ( let cube_index = 0 ; cube_index < cube_count ;  cube_index++ ) {
                    captures[player][cube_sort].push(false);
                }
            }
        }
    
        pijersi.model.captures = captures;
    }
};


pijersi.model.get_hexagon_by_name = function(name){
    const maybe_hexagon = pijersi.model.hexagons.find(hexagon => hexagon.name === name);
    return maybe_hexagon;
};
