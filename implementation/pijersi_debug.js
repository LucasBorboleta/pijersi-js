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
pijersi.debug.__init_called = false;

pijersi.debug.__init = function(){

    if ( pijersi.debug.__init_called ) return;
    pijersi.debug.__init_called = true;

    // Init the required sub-modules: None

    // Init the sub-module constants
    pijersi.debug.const = {};
    pijersi.debug.const.TITLE_DEFAULT = document.title;
    pijersi.debug.const.ERROR_ICON = "\u26A0";

    // Freeze the sub-module constants
    Object.freeze(pijersi.debug.const);

    // Init the sub-module variables
    pijersi.debug.error_count = 0;

    // Seal the sub-module
    Object.seal(pijersi.debug);
};


pijersi.debug.log_error = function(message){
    pijersi.debug.error_count += 1;
    document.title = pijersi.debug.const.TITLE_DEFAULT + " " + pijersi.debug.const.ERROR_ICON + "*" + pijersi.debug.error_count.toString();

    console.error("error:" + pijersi.debug.error_count.toString() + ": " + message);
    console.trace();
};

///////////////////////////////////////////////////////////////////////////////
		