<template>
    <div id="app">
        <b-container fluid>
            <b-row no-gutters>
                <b-col cols="12" md="4" order="1" no-gutters>
                    <ul>
                        <h1>Logs</h1>
                        <li v-for="log in logs" v-text="log"></li>
                    </ul>
                </b-col>
                <b-col cols="12" md="8" order="2" no-gutters>
                    <b-card style="background-color:#F5F5F5;" no-body>
                        <b-tabs pills card>
                            <b-tab v-for="cam in cams" :key="cam.id" :title="'CAMERA [ '+cam.id+' ]'">
                                <h2>CAMERA {{'[ ' + cam.id + ' ]'}} </h2>
                                <b-row class="no">
                                    <b-col>
                                        <b-img center width="400" v-bind:src="cam.picture" fluid alt="Fluid image" />
                                    </b-col>
                                    <b-col>
                                        <b-button v-on:click="changeToMode1(cam.index)" size="lg" :disabled="cam.mode1" variant="outline-primary">MODE:1</b-button>
                                        <b-button v-on:click="changeToMode2(cam.index)" size="lg" :disabled="cam.mode2" variant="outline-primary">MODE:2</b-button>
                                        <br>
                                        <br>
                                        <b-button v-if="cam.mode1" v-on:click="changeToMode2(cam.index)" size="lg" variant="warning">SNAPSHOT</b-button>
                                        <b-button v-if="cam.mode2 && cam.start" v-on:click="start(cam.index,cam.id)" size="lg" variant="success">START</b-button>
                                        <b-button v-if="cam.mode2 && cam.stop" v-on:click="stop(cam.index,cam.id)" size="lg" variant="danger">STOP</b-button>
                                        <br>
                                        <br>
                                        <h5>RECORDING STATE:</h5>
                                        <div v-if="cam.mode2 && cam.recording" class="pulsating-circle"></div>
                                        <div v-if="cam.mode2 && cam.recording == false" class="dot"></div>
                                    </b-col>
                                </b-row>
                            </b-tab>
                        </b-tabs>
                    </b-card>
                    <b-card style="background-color:#F5F5F5;height: 330px" no-body>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>
<script>
export default {
    name: 'app',
    data() {
        return {
            cams: [],
            camsIds: [],
            url: 'http://localhost:8000/',
            timeout: 0,
            logs: [],
            verifyConnection: null,
            testbutton: true
        }
    },
    async created() {
        var self = this;
        self.connnexion();
    },
    methods: {
        createCams: function() {
            var self = this;
            var i;
            for (i = 0; i < self.camsIds.length; i++) {
                var camera = { id: self.camsIds[i], index: i, mode1: true, picture: "static/logo.png", mode2: false, start: true, stop: false, snapshot: true, recording: false };
                self.cams.push(camera);
            }
        },
        changeToMode1: function(id) {
            var self = this;
            self.cams[id].mode1 = true;
            self.cams[id].mode2 = false;
            self.stop(id);

        },
        changeToMode2: function(index) {
            var self = this
            console.log(self.cams[index].mode2)
            self.cams[index].mode1 = false;
            self.cams[index].mode2 = true;
        },
        connnexion: function() {
            var self = this;

            fetch(self.url).then(function(response) {
                return response.json()
            }).then(function(json) {
                self.camsIds = json
                self.createCams()

            }).catch(function(ex) {
                self.logs.unshift('Can not connect to the rocket , try again' + " [ " + new Date().toLocaleTimeString() + "  ]")
                console.log('parsing failed', ex)

            });

            /*fetch(self.url).then(function(response) {
                return response.json();
            }).then(function(json) {
                if (json.connected == true) {
                    self.logs.unshift(json.stdout + "[ " + new Date().toLocaleTimeString() + " ]");
                    self.cams[id].connect = 'invisible';
                    self.cams[id].snapshot = 'invisible';
                    self.cams[id].start = 'visible';


                }
            }).catch(function(ex) {
                self.logs.unshift('Can not connect to the rocket , try again' + " [ " + new Date().toLocaleTimeString() + "  ]");
                console.log('parsing failed', ex);

            })*/
        },
        start: function(index, id) {
            var self = this;
            self.cams[index].start = false;
            self.cams[index].stop = true;
            self.cams[index].recording = true;

            /*  fetch(self.url + 'start/' + id)
                  .then(function(response) {
                      return response.json()
                  }).then(function(json) {
                      if (json.running == true) {
                          self.logs.unshift(json.stdout + " [ " + new Date().toLocaleTimeString() + "  ]");
                          self.cams[id].start = 'invisible';
                          self.cams[id].stop = 'visible';
                      }
                  }).catch(function(ex) {
                      console.log('parsing failed', ex);
                  });

              //fetch in interval to verify the connection
              self.verifyConnection = setInterval(function() {
                  fetch(self.url)
                      .then(function(response) {
                          return response.json()
                      }).then(function(json) {
                          if (json.running == false) {
                              self.timeout++;
                          }
                          if (self.timeout == 3) {
                              self.logs.unshift('The camera stopped running , please reload the page and try again' + " [ " + new Date().toLocaleTimeString() + "  ]");
                              self.cams[id].stop = 'invisible';
                              self.beforeDestroy();
                              self.timeout = 0;
                          }
                      }).catch(function(ex) {
                          self.logs.unshift('Connection lost please reload the page and try again' + " [ " + new Date().toLocaleTimeString() + "  ]");
                          console.log('parsing failed', ex.toString())
                          self.beforeDestroy();
                      })
              }.bind(this), 1000);*/
        },
        stop: function(index, id) {
            var self = this;
            self.cams[index].start = true;
            self.cams[index].stop = false;
            self.cams[index].recording = false;

            /*   fetch(self.url + 'stop/' + id)
                   .then(function(response) {
                       return response.json()
                   }).then(function(json) {
                       if (json.running == false) {
                           self.logs.unshift(json.stdout + " [ " + new Date().toLocaleTimeString() + "  ]");
                           self.cams[id].stop = 'invisible';
                           self.cams[id].connect = 'visible';
                           self.cams[id].snapshot = 'visible';
                       }
                   }).catch(function(ex) {
                       console.log('parsing failed', ex.toString());
                   });*/
        },
        snapshot: function(id) {
            var self = this;
            fetch(self.url + 'picture/' + id)
                .then(function(response) {
                    return response.json()
                }).then(function(json) {
                    self.cams[id].picture = "data:image/jpg;base64," + json.stdout;
                    self.logs.unshift("cam " + id + " picture changed" + " [ " + new Date().toLocaleTimeString() + "  ]");

                }).catch(function(ex) {
                    console.log('parsing failed', ex.toString());
                });

        },
        beforeDestroy: function() {
            var self = this;
            clearInterval(self.verifyConnection);
        }
    }
}
</script>
<style lang="scss">
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}


h2 {


    color: red;
    margin-top: 10px;
    margin-bottom: 20px;
    font-family: 'Share Tech Mono',
}

h1 {
    color: #ffffff;
    margin-top: 10px;
    margin-bottom: 20px;
    text-shadow: 0 0 20px rgba(10, 175, 230, 1), 0 0 20px rgba(10, 175, 230, 0);
    font-family: 'Share Tech Mono',
}

.nav-pills .nav-link.active,
.nav-pills .show>.nav-link {
    color: white;
    background-color: #0f3854;
}

a {
    color: red;
}

a:hover {
    color: green;
}

.no-gutters>.col,
.no-gutters>[class*=col-] {
    height: 1000px;
    background: #0f3854;
    background: radial-gradient(ellipse at center, #0a2e38 0%, #000000 70%);
}

.container-fluid {
    //background-color: #0f3854;
    background: radial-gradient(ellipse at center, #0a2e38 0%, #000000 70%);
}

.card {

    height: 600px;
}

.pulsating-circle {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 30px;
    height: 30px;

    &:before {
        content: '';
        position: relative;
        display: block;
        width: 300%;
        height: 300%;
        box-sizing: border-box;
        margin-left: -100%;
        margin-top: -100%;
        border-radius: 45px;
        background-color: red;
        animation: pulse-ring 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
    }

    &:after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        display: block;
        width: 100%;
        height: 100%;
        background-color: red;
        border-radius: 15px;
        box-shadow: 0 0 8px rgba(0, 0, 0, .3);
        animation: pulse-dot 1.25s cubic-bezier(0.455, 0.03, 0.515, 0.955) -.4s infinite;
    }
}

@keyframes pulse-ring {
    0% {
        transform: scale(.33);
    }
    80%,
    100% {
        opacity: 0;
    }
}

@keyframes pulse-dot {
    0% {
        transform: scale(.8);
    }
    50% {
        transform: scale(1);
    }
    100% {
        transform: scale(.8);
    }
}

.dot {
    height: 25px;
    width: 25px;
    background-color: red;
    border-radius: 15px;
    box-shadow: 0 0 8px rgba(0, 0, 0, .3);
    display: inline-block;
}
</style>