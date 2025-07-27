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
   
    pijersi.model.const.MODE_RUNNING = "running";
    pijersi.model.const.MODE_REVIEWING = "reviewing";
    pijersi.model.const.MODE_EDITING = "editing";

    pijersi.model.const.CREDIT_MAX = 20;

    pijersi.model.const.PLAYER_WHITE = "white";
    pijersi.model.const.PLAYER_BLACK = "black";
 
    // Freeze the sub-module constants
    Object.freeze(pijersi.model.const);

    // Init the sub-module variables 

    pijersi.model.mode = pijersi.model.const.MODE_RUNNING;
    pijersi.model.credit = pijersi.model.const.CREDIT_MAX;

    pijersi.model.turns = undefined;
    pijersi.model.current_turn = undefined;
    pijersi.model.player = pijersi.model.const.PLAYER_WHITE;

    // Seal the sub-module
    Object.seal(pijersi.model);
};
		

pijersi.model.get_mode = function(){
    return pijersi.model.mode;
};


pijersi.model.set_mode = function(mode){

    if ( mode === pijersi.model.const.MODE_RUNNING || mode === pijersi.model.const.MODE_REVIEWING || mode === pijersi.model.const.MODE_EDITING ) {
        pijersi.model.mode = mode;

    } else {
        pijersi.debug.log_error("unexpected 'mode' = " + mode);
    }
};


pijersi.model.get_legend = function(){
    return pijersi.model.turns[pijersi.model.current_turn].legend;
};


pijersi.model.get_credit = function(){
    return pijersi.model.turns[pijersi.model.current_turn].credit;
};


pijersi.model.increment_credit = function(){
    if ( pijersi.model.mode !== pijersi.model.const.MODE_EDITING ) return;

    pijersi.model.credit = pijersi.model.credit + 1;
    if ( pijersi.model.credit > pijersi.model.const.CREDIT_MAX ) pijersi.model.credit = 0;

    pijersi.model.turns[pijersi.model.current_turn].credit = pijersi.model.credit;
};


pijersi.model.decrement_credit = function(){
    pijersi.model.credit = pijersi.model.credit - 1;
    if ( pijersi.model.credit < 0 ) pijersi.model.credit = 0;

    pijersi.model.turns[pijersi.model.current_turn].credit = pijersi.model.credit;
};


pijersi.model.reset_credit = function(){
    pijersi.model.credit = pijersi.model.const.CREDIT_MAX;

    pijersi.model.turns[pijersi.model.current_turn].credit = pijersi.model.credit;
};


pijersi.model.get_player = function(){
    return pijersi.model.player;
};


pijersi.model.set_player = function(player){

    if ( player === pijersi.model.const.PLAYER_WHITE || player === pijersi.model.const.PLAYER_BLACK ) {
        pijersi.model.player = player;
    
    } else {
        pijersi.debug.log_error("unexpected 'player' = " + player);
    }
};


pijersi.model.change_player = function(){

    if ( pijersi.model.player === pijersi.model.const.PLAYER_WHITE ) {
        pijersi.model.player = pijersi.model.const.PLAYER_BLACK;

    } else if ( pijersi.model.player === pijersi.model.const.PLAYER_BLACK ) {
        pijersi.model.player = pijersi.model.const.PLAYER_WHITE;
    }
};


pijersi.model.reset_turns = function(){
    pijersi.model.current_turn = 0;
    pijersi.model.turns = []

    const new_legend = "";
    const new_turn = {legend: new_legend, credit: pijersi.model.const.CREDIT_MAX};

    pijersi.model.turns.push(new_turn);
};
		

pijersi.model.new_turn = function(){
    pijersi.model.current_turn += 1;

    const new_legend = pijersi.model.current_turn.toString() + " " + "xi-yi=zk";
    const new_turn = {legend: new_legend, credit: pijersi.model.credit};

    pijersi.model.turns.push(new_turn);
};
///////////////////////////////////////////////////////////////////////////////
