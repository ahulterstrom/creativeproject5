var app = new Vue({
    el: '#app',
    data: {
        divs: [],
        planets: [
            []
        ],
        captureToggle: false,
        windowwidth: '',
        windowheight: '',
        x: 0,
        y: 0,
        mousex: 0,
        mousey: 0,
        zoom: 1,
        zoomamount: 0.2,
        galaxysize: 40,
        tilesizeinpx: 500,
        galaxyborder: -20,
        playerscore: 0,
        pizzanumber: 20,
        componentKey: 0,
        highscores: '',

        // zoom: 0.500001,
    },
    methods: {
        setSize() {
            this.windowwidth = document.getElementById("window").offsetWidth;
            this.windowheight = document.getElementById("window").offsetHeight;
        },
        mo: function(evt) {
            if (this.captureToggle) {
                this.x += (evt.x - this.mousex);
                this.y += (evt.y - this.mousey);
                this.mousex = evt.x;
                this.mousey = evt.y;
            }
        },
        captureOn: function(evt) {
            this.captureToggle = true;
            this.mousex = evt.x;
            this.mousey = evt.y;
        },
        captureOff: function() {
            this.captureToggle = false;
        },
        zoomin() {
            if (this.zoom < 2.0) {
                this.zoom = (parseFloat(this.zoom) + this.zoomamount / 2).toFixed(1);
                var xoffset = (this.centerPoint.x * (1 - ((this.zoom - this.zoomamount / 2) / this.zoom)));
                var yoffset = (this.centerPoint.y * (1 - ((this.zoom - this.zoomamount / 2) / this.zoom)));
                this.x = parseFloat((this.x + xoffset).toFixed(0));
                this.y = parseFloat((this.y + yoffset).toFixed(0));
            }
        },
        zoomout() {
            if (this.zoom > 0.7) {
                this.zoom = (parseFloat(this.zoom) - this.zoomamount / 2).toFixed(1);
                var xoffset = (this.centerPoint.x * (1 - ((this.zoom - this.zoomamount / 2) / this.zoom)));
                var yoffset = (this.centerPoint.y * (1 - ((this.zoom - this.zoomamount / 2) / this.zoom)));
                this.x = parseFloat((this.x - xoffset).toFixed(0));
                this.y = parseFloat((this.y - yoffset).toFixed(0));
            }
        },
        createarray() {
            var stars = [];
            var planets = [];
            var bgidprefix = "stars";
            for (var j = 0; j < this.galaxysize; j++) {
                var starsrow = [];
                var planetsrow = [];
                for (var i = 0; i < this.galaxysize; i++) {
                    starsrow.push(bgidprefix + Math.floor(Math.random() * 5 + 1));
                    planetsrow.push("");
                }
                stars.push(starsrow);
                planets.push(planetsrow);
            }
            this.divs = stars;
            this.planets = planets;


            this.generatepizza()
            // this.planets[2][2] = "images/pizza.png ";
            // this.planets[9][1] = "images/pizza.png";
            // this.planets[2][9] = "images/pizza.png";
            // this.planets[3][6] = "images/pizza.png";
            // this.planets[16][16] = "images/tile.png";
        },
        generatepizza() {
            console.log("generating pizza");
            for (var j = 0; j < this.galaxysize; j++) {
                for (var i = 0; i < this.galaxysize; i++) {
                    this.planets[j][i] = "";
                }
            }
            for (j = 0; j < this.pizzanumber; j++) {
                this.planets[Math.floor(Math.random() * 40)][Math.floor(Math.random() * 40)] = "images/pizza.png";
            }
            this.componentKey++;
        },
        pizzaclicked(row) {
            console.log("pizzaclick(" + row + ")");
            this.playerscore++;
            this.generatepizza();

            this.postScore();
        },
        pizzaHover() {
            console.log("pizzahover");
        },
        async getScores() {
            if (this.waiting == true) {
                console.log("Still waiting for response...");
                return;
            }
            console.log("requesting scores...");
            this.waiting = true;
            var url = "http://cs260.andrewhulterstrom.com:3010/scores";
            try {
                var response = await axios.get(url);
                var data = response.data;
                this.highscores = data;
            }
            catch (err) {
                console.log("Could not get posts");
            }
            this.waiting = false;
        },
        // async submitOne(i) {
        //     let response = await axios.put("/scores/" + this.user[i]._id, {});
        // },
        async postScore() {
            console.log("postScore()");
            var url = "http://cs260.andrewhulterstrom.com:3010/scores";
            try {
                var response = await axios.post(url, {
                    userid: "id",
                    username: "name",
                    score: this.score,
                });
                // this.getScores();
            }
            catch (err) {
                console.log("error");
            }
        },
    },
    computed: {
        styleObject: function() {
            if (this.x > this.galaxyborder) {
                this.x = this.galaxyborder;
            }
            if (this.y > this.galaxyborder) {
                this.y = this.galaxyborder;
            }

            if (this.x < this.maxx) {
                this.x = this.maxx;
            }
            if (this.y < this.maxy) {
                this.y = this.maxy;
            }
            return {
                left: (this.x) + "px",
                top: (this.y) + "px",
            };
        },
        zoomStyleObject: function() {
            return {
                transform: "scale(" + this.zoom + ")",
            };
        },
        centerPoint() {
            return {
                x: this.x - (this.windowwidth / 2),
                y: this.y - (this.windowheight / 2),
            };
        },
        galaxywidth() {
            return this.galaxysize * this.tilesizeinpx;
        },
        galaxyheight() {
            return this.galaxysize * this.tilesizeinpx;
        },
        maxx() {
            return -(this.galaxywidth * this.zoom) + this.windowwidth - this.galaxyborder;
        },
        maxy() {
            return -(this.galaxyheight * this.zoom) + this.windowheight - this.galaxyborder;
        },
    },

    created() {
        this.setSize();
        this.createarray();
        window.addEventListener("resize", this.setSize);
        this.x = -8000;
        this.y = -8000;
        // window.addEventListener('scroll', this.zoom);
    },
});
