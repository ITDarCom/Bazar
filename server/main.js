import {check} from "meteor/check"
import {Match} from "meteor/check"
import {EJSON} from "meteor/ejson"

//these globals are necessary for search-source pacakge
GLOBAL.check = check
GLOBAL.Match = Match
GLOBAL.EJSON = EJSON

import '/imports/startup/server';

