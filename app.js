new Vue({

    el: '#root',
    data: {

        logs: [],
        interval: null,
    },
    methods: {

        loadLogs: function() {
            var self = this;
            //verify connection
            fetch('http://localhost:8000/')
                .then(function(response) {
                    return response.json()
                }).then(function(json) {
                    if (json.toString() == "true")
                        self.logs.push('connected' + "    " + new Date())
                }).catch(function(ex) {
                    console.log('parsing failed', ex)
                })

            //fetch in interval to verify the connection
            setInterval(function() {
                fetch('http://localhost:8000/')
                    .then(function(response) {
                        return response.json()
                    }).then(function(json) {


                        if (json.toString() == "false") {
                            self.logs.push('not connected' + "    " + new Date());
                        }
                        if (self.logs.length == 10) {
                            self.logs.splice(0, 8)
                        }

                    }).catch(function(ex) {
                        console.log('parsing failed', ex)
                    })
            }.bind(this), 1000);

        },

        start: function() {
            var self = this;
            fetch('http://localhost:8000/start')
                .then(function(response) {
                    return response.json()
                }).then(function(json) {
                    self.logs.push(json.toString() + "    " + new Date());
                }).catch(function(ex) {
                    console.log('parsing failed', ex)
                });

        },
        stop: function() {
            var self = this;
            fetch('http://localhost:8000/stop')
                .then(function(response) {
                    return response.json()
                }).then(function(json) {
                    self.logs.push(json.toString() + "    " + new Date());
                }).catch(function(ex) {
                    console.log('parsing failed', ex)
                });
        },
        beforeDestroy: function() {
            clearInterval(this.interval);
        }
    }


});