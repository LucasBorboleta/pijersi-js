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
pijersi.debug = { };
pijersi.debug.__initModuleCalled = false;

pijersi.debug.__initModule = function(){

    if ( pijersi.debug.__initModuleCalled ) return;
    pijersi.debug.__initModuleCalled = true;

    // Init required modules
    // None

    // Init inner classes
    // None

    pijersi.debug.zone = document.getElementById( "pijersi_debugZone" );
    pijersi.debug.messages = document.getElementById( "pijersi_debug_messages" );
    pijersi.debug.mousePosition = document.getElementById( "pijersi_debug_mousePosition" );

    pijersi.debug.messageCount = 0;
    pijersi.debug.is_enabled = false;
    pijersi.debug.enable(pijersi.debug.is_enabled);
};

pijersi.debug.assert = function(condition, message){
    if ( typeof message === "undefined" ) {
        message = "[look at javascript console]";
    }

    console.assert(condition, message);
    if ( ! condition ) {
        pijersi.debug.writeMessage("assertion failed: " + message);
    }
};

pijersi.debug.clearMessages = function(){
    pijersi.debug.messages.innerHTML = "" ;
};

pijersi.debug.debug = function(){
    pijersi.debug.is_enabled = ! pijersi.debug.is_enabled;
    pijersi.debug.enable(pijersi.debug.is_enabled);
};

pijersi.debug.enable = function(condition){
    pijersi.debug.is_enabled = condition;

    if ( ! pijersi.debug.is_enabled ) {
        pijersi.debug.clearMessages();
    }

    if ( pijersi.debug.is_enabled ) {
        pijersi.debug.zone.style.display = "inherit";
    } else {
        pijersi.debug.zone.style.display = "none";
    }
};

pijersi.debug.writeMessage = function(text){
    if ( pijersi.debug.is_enabled ) {
        pijersi.debug.messageCount += 1 ;

        pijersi.debug.messages.innerHTML = pijersi.debug.messageCount + ":" +
                                              text + "<br/>" + pijersi.debug.messages.innerHTML;
    }
};

pijersi.debug.writeMousePosition = function(x, y){
    pijersi.debug.mousePosition.innerHTML = "Mouse(x,y) = (" + x + ", " + y + ")" ;
};
///////////////////////////////////////////////////////////////////////////////
