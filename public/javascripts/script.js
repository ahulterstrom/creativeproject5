var app = new Vue({
    el: '#app',
    data: {
        divs: [],
        planets: [],
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
            this.zoom = (parseFloat(this.zoom) + this.zoomamount).toFixed(1);
            var xoffset = (this.centerPoint.x * (1 - ((this.zoom - this.zoomamount) / this.zoom)));
            var yoffset = (this.centerPoint.y * (1 - ((this.zoom - this.zoomamount) / this.zoom)));
            this.x = parseFloat((this.x + xoffset).toFixed(0));
            this.y = parseFloat((this.y + yoffset).toFixed(0));
        },
        zoomout() {
            this.zoom = (parseFloat(this.zoom) - this.zoomamount).toFixed(1);
            var xoffset = (this.centerPoint.x * (1 - ((this.zoom - this.zoomamount) / this.zoom)));
            var yoffset = (this.centerPoint.y * (1 - ((this.zoom - this.zoomamount) / this.zoom)));
            this.x = parseFloat((this.x - xoffset).toFixed(0));
            this.y = parseFloat((this.y - yoffset).toFixed(0));
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

            this.planets[2][2] = "images/tile.png";
            this.planets[9][1] = "images/tile.png";
            this.planets[2][9] = "images/tile.png";
            this.planets[3][6] = "images/tile.png";
            // this.planets[16][16] = "images/tile.png";
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
        // window.addEventListener('scroll', this.zoom);
    },
});
