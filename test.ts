
let currentEffect: effects.ScreenEffect = wintereffects.snowball;
// effects.snowflakes.startScreenEffect();

let setCurrentEffect = (ef: effects.ScreenEffect) => {
    currentEffect = ef;
    ef.startScreenEffect(1500);
}
controller.A.onEvent(ControllerButtonEvent.Pressed, () => setCurrentEffect(wintereffects.snowball));

controller.B.onEvent(ControllerButtonEvent.Pressed, () => setCurrentEffect(wintereffects.holidayCookies));

controller.left.onEvent(ControllerButtonEvent.Pressed, () => setCurrentEffect(wintereffects.snowflakes));

controller.right.onEvent(ControllerButtonEvent.Pressed, () => setCurrentEffect(wintereffects.candyCanes));

game.onUpdateInterval(4000, () => {
    if (currentEffect) {
        currentEffect.startScreenEffect(1500)
    }
});