
let currentEffect: effects.ScreenEffect = effects.snowball;
// effects.snowflakes.startScreenEffect();

let setCurrentEffect = (ef: effects.ScreenEffect) => {
    currentEffect = ef;
    ef.startScreenEffect(1500);
}
controller.A.onEvent(ControllerButtonEvent.Pressed, () => setCurrentEffect(effects.snowball));

controller.B.onEvent(ControllerButtonEvent.Pressed, () => setCurrentEffect(effects.holidayCookies));

controller.left.onEvent(ControllerButtonEvent.Pressed, () => setCurrentEffect(effects.snowflakes));

controller.right.onEvent(ControllerButtonEvent.Pressed, () => setCurrentEffect(effects.candyCanes));

game.onUpdateInterval(4000, () => {
    if (currentEffect) {
        currentEffect.startScreenEffect(1500)
    }
});