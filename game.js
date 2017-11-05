var gameOfLife = {

    width: 12,
    height: 12,
    stepInterval: null, // should be used to hold reference to an interval that is "playing" the game

    createAndShowBoard: function () {

      // create <table> element
      var goltable = document.createElement("tbody");

      // build Table HTML
      var tablehtml = '';
      for (var h = 0; h < this.height; h++) {
        tablehtml += "<tr id='row+" + h + "'>";
        for (var w = 0; w < this.width; w++) {
          tablehtml += "<td data-status='dead' id='" + w + "-" + h + "'></td>";
        }
        tablehtml += "</tr>";
      }
      goltable.innerHTML = tablehtml;

      // add table to the #board element
      var board = document.getElementById('board');
      board.appendChild(goltable);

      // once html elements are added to the page, attach events to them
      this.setupBoardEvents();
    },

    forEachCell: function (iteratorFunc) {
      for (var i = 0; i < this.width; i++) {
        for (var j = 0; j < this.height; j++) {
          var cell = document.getElementById(j + "-" + i);
          iteratorFunc(cell, j, i);
        }
      }
    },

    aliveCells: [],

    setupBoardEvents: function () {
      var onCellClick = function (e) {
        if (this.dataset.status == 'dead') {
          this.className = 'alive';
          this.dataset.status = 'alive';
          gameOfLife.aliveCells.push(this);
        } else {
          this.className = 'dead';
          this.dataset.status = 'dead';
        }
      };

      var onCellHover = function (e) {
        if (this.dataset.status == 'dead') {
          this.className = 'hover';
          this.dataset.status = 'hover';
          gameOfLife.aliveCells.push(this);
        } else {
          this.className = 'dead';
          this.dataset.status = 'dead';
        }
      };

      // this.forEachCell((cell) => cell.addEventListener('mouseenter', onCellHover.bind(cell)));
      // this.forEachCell((cell) => cell.addEventListener('mouseout', onCellHover.bind(cell)));
      this.forEachCell((cell) => cell.addEventListener('click', onCellClick.bind(cell)));

      let clearBtn = document.getElementById('clear_btn');
      clearBtn.addEventListener('click', () => {
        this.aliveCells.forEach(function(cell){
          cell.className = 'dead';
          cell.dataset.status = 'dead';
        });
      });

      let resetBtn = document.getElementById('reset_btn');
      resetBtn.addEventListener('click', () => {
        this.forEachCell(function(cell){
          let randomNum = Math.random();
          if (randomNum > 0.5) {
            cell.className = 'alive';
            cell.dataset.status = 'alive';
            gameOfLife.aliveCells.push(cell);
          } else {
            cell.className = 'dead';
            cell.dataset.status = 'dead';
          }
        });
      });

      let stepBtn = document.getElementById('step_btn');
      stepBtn.addEventListener('click', () => this.step());

      let playBtn = document.getElementById('play_btn');
      playBtn.addEventListener('click', () => this.enableAutoPlay());
    },

    createNeighbors: function(cell1, x, y){
      let neighbors = [[x+1,y],[x-1,y],[x,y+1],[x,y-1],[x-1,y-1],[x+1,y+1],[x+1,y-1], [x-1, y+1]]
      .filter(function(cell){
        if (cell[0] >= 0 && cell[1] >= 0 && cell[1] < gameOfLife.height && cell[0] < gameOfLife.width){
          return cell;
        }
      });
      return neighbors;
    },

    aliveNeighbors: function(neighborArr){
      let neighbors = neighborArr.filter(function(neighbor){
        let cell = document.getElementById(neighbor.join('-').split(','));
        if (cell.className === 'alive' && cell.dataset.status === 'alive'){
          return neighbor;
        }
      });
      return neighbors;
    },

    changeArray: [],

    step: function () {
      this.forEachCell((cell, x, y) => {
        let neighbors = this.createNeighbors(cell, x, y);
        let livingNeighbors = this.aliveNeighbors(neighbors);
        if (cell.dataset.status === 'alive' && (livingNeighbors.length > 3 || livingNeighbors.length < 2)) this.changeArray.push(cell);
        else if (cell.dataset.status === 'dead' && livingNeighbors.length === 3) {
          this.changeArray.push(cell);
        }
      });

      this.changeArray.forEach((cell) => {
        if (cell.dataset.status === 'alive') {
          cell.className = 'dead';
          cell.dataset.status = 'dead';
        } else {
          cell.className = 'alive';
          cell.dataset.status = 'alive';
          this.aliveCells.push(cell);
        }
      });
      this.changeArray = [];
    },

    enableAutoPlay: function () {
      if (this.stepInterval){
        clearInterval(this.stepInterval);
        this.stepInterval = null;
      } else {
        this.stepInterval = setInterval(() => this.step(), 400);
      }
    }

  };

  gameOfLife.createAndShowBoard();

