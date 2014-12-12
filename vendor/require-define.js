"use strict";

// Shim in vendor libraries and frameworks so they can be treated as modules.
require.define({
    "jquery": function (require, exports, module) {
        return module.exports = $;
    },

    "underscore": function (require, exports, module) {
        return module.exports = _;
    },

    "backbone": function (require, exports, module) {
        return module.exports = Backbone;
    },

    "moment": function (require, exports, module) {
        return module.exports = moment;
    },

    "react": function (require, exports, module) {
        return module.exports = React;
    },
    
    "flux": function (require, exports, module) {
        return module.exports = Flux;
    },
    
    "eventEmitter": function(require, exports, module) {
        return module.exports = EventEmitter;
    }
});