if (typeof yasp == 'undefined') yasp = { };

(function () {

  /**
   * Displays the hardware in the debugger
   * @param container the DOM-element to place the hardware in
   * @param communicator EmulatorCommunicator
   * @param type the breadboard-type to generate
   * @constructor
   */
  yasp.BreadBoard = function (container, communicator, type) {
    this.container = $(container);
    this.communicator = communicator;
    this.type = type;
  };

  /**
   * @function Generates this breadboard
   */
  yasp.BreadBoard.prototype.build = function () {
    this.container.empty();

    this.communicator.subscribe('IO_CHANGED',
      (function (data) {
        var payload = data.payload;

        for (var i = 0; i < this.type.hardware.length; i++) {
          if(this.type.hardware[i].pin === payload.pin)
            this.hardware[i].receiveStateChange(payload.state);
        }
      }).bind(this)
    );

    var $innerContainer = $('<div>');
    $innerContainer.css('position', 'relative');
    this.container.append($innerContainer);

    this.buildImage($innerContainer, this.type.image);

    this.hardware = [];
    for (var i = 0; i < this.type.hardware.length; i++) {
      this.buildPiece($innerContainer, this.type.hardware[i]);
    }
  };

  /**
   * @function Generates a image and adds it to the DOM
   * @param $container jQuery-Object of the container to place the image in
   * @param image the image to generate
   */
  yasp.BreadBoard.prototype.buildImage = function ($container, image) {
    var $image = $('<img style="position: absolute; top: 0; left: 0; z-index: 1;">');
    $image.attr('src', image.url);
    $image.css('height', image.height);
    $image.css('width', image.width);
    $container.append($image);
  };

  /**
   * @function Generates a given piece of hardware, adds it to the DOM and attaches event-handlers
   * @param $container jQuery-Object of the container to place the hardware in
   * @param definition this pieces definition from the breadboard-type
   */
  yasp.BreadBoard.prototype.buildPiece = function ($container, definition) {
    var appear = definition.appearance;

    if(appear.zindex === undefined)
      appear.zindex = 2;

    var $wrapper = $('<div style="position: absolute; box-sizing: content-box !important;">');
    $wrapper.css('z-index', appear.zindex);
    $wrapper.css('top', appear.top);
    $wrapper.css('left', appear.left);
    if(appear.height)
      $wrapper.css('height', appear.height);
    if(appear.width)
      $wrapper.css('width', appear.width);

    var hardware = new yasp.Hardware({
      cb: function(button) { },
      container: $wrapper,
      type: yasp.HardwareType[definition.type],
      params: definition.params
    });

    this.hardware.push(hardware);
    $container.append($wrapper);
  };

  /**
   * @function redraws all hardware elements
   */
  yasp.BreadBoard.prototype.render = function () {
    for (var i = 0; i < this.hardware.length; i++) {
      this.hardware[i].render();
    }
  };

  /**
   * @function removes all the hardware from the DOM and removes the event-handlers from the emulator
   */
  yasp.BreadBoard.prototype.destroy = function () {
    this.container.empty();

  };
})();