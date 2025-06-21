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
const pijersi = { };
pijersi.__initModuleCalled = false;

pijersi.__initModule = function(){

    if ( pijersi.__initModuleCalled ) return;
    pijersi.__initModuleCalled = true;

    // Init required packages
    pijersi.debug.__initModule();
    pijersi.debug.enable (true);

    pijersi.draw.__initModule();
    pijersi.presenter.__initModule();
    pijersi.rules.__initModule();

    // Init inner classes
    // None

    // Hide the pleaseWait message
    if ( true ) {
        document.getElementById( "pijersi_text_pleaseWait" ).style.display = "none";
    }

    pijersi.debug.writeMessage( "pijersi.__initModule(): done" );
};
///////////////////////////////////////////////////////////////////////////////
