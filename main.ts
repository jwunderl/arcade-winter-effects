//% weight=88.5
//% color="#1382d1"
//% icon="\uf2dc"
//% block="winter fun"
namespace wintereffects {

    export enum SpawningDirection {
        Top,
        Bottom,
        Left,
        Right,
        TopLeft,
        TopRight,
        BottomLeft,
        BottomRight,
    };

    class ScaledShapeFactory extends particles.SprayFactory {
        protected sources: Image[];
        protected ox: Fx8;
        protected oy: Fx8;
        protected galois: Math.FastRandom;
        minPercent: number;
        maxPercent: number;
        particleLifespan: number;
        rotateImagesRate: number;
        growthRate: number;
        randomlySwitchDirectionsRate: number;
        spawnDirection: SpawningDirection;

        constructor(particleSpeed: number, arcCenter: number, arcDegrees: number, sources: Image[]) {
            super(
                particleSpeed, // particle speed
                arcCenter, // arc center degrees
                arcDegrees  // arc degrees 
            );
            this.sources = sources;
            this.minPercent = 30;

            this.maxPercent = 180;
            this.particleLifespan = 2000;

            // Base offsets off of initial shape
            this.ox = Fx8(sources[0].width >> 1);
            this.oy = Fx8(sources[0].height >> 1);
            this.galois = new Math.FastRandom();
        }

        createParticle(anchor: particles.ParticleAnchor) {
            const p = super.createParticle(anchor);
            p.color = this.galois.randomRange(0, this.sources.length - 1);
            const pImage = this.sources[Math.floor(p.color)]
            p.data = this.galois.randomRange(this.minPercent, this.maxPercent) / 100;
            this.positionParticle(anchor, p, pImage);
            p.lifespan = this.particleLifespan;
            return p;
        }

        positionParticle(anchor: particles.ParticleAnchor, p: particles.Particle, pImage: Image) {
            switch (this.spawnDirection) {
                case SpawningDirection.Top:
                    p._y = Fx8(anchor.y - (anchor.height >> 1));
                    p._x = Fx8(this.galois.randomRange(anchor.x - (anchor.width >> 1), anchor.x + (anchor.width >> 1)));
                    break;
                case SpawningDirection.Bottom:
                    break;
                case SpawningDirection.Left:
                    break;
                case SpawningDirection.Right:
                    break;
                case SpawningDirection.TopRight:
                    break;
                case SpawningDirection.BottomLeft:
                    break;
                case SpawningDirection.BottomRight:
                    break;
                case SpawningDirection.TopLeft:
                    break;
                default:
                    p._x = Fx8(anchor.x - (anchor.width >> 1) + ((pImage.width * p.data) >> 1));
                    p._y = Fx8(anchor.y - (anchor.height >> 1) + ((pImage.height * p.data) >> 1));
                    break;
            }
        }

        drawParticle(p: particles.Particle, x: Fx8, y: Fx8) {
            if (this.rotateImagesRate) {
                p.color = (p.color + this.rotateImagesRate) % this.sources.length;
            }

            if (this.randomlySwitchDirectionsRate) {
                p.color += this.randomlySwitchDirectionsRate;
                if (this.galois.percentChance(Math.floor(((p.color * 100) % 100) + (100 * this.randomlySwitchDirectionsRate)))) {
                    p.color = Math.floor(p.color);
                    if (this.spawnDirection === SpawningDirection.Left || this.spawnDirection === SpawningDirection.Right) {
                        p.vy = Fx.neg(p.vy);
                    } else {
                        p.vx = Fx.neg(p.vx);
                    }
                }
            }
            if (this.growthRate) {
                p.data += this.growthRate;
            }
            const pImage = this.sources[Math.floor(p.color)];
            const width = pImage.width * p.data;
            const height = pImage.height * p.data;

            screen.blit(
                // dst rect in screen
                Fx.toInt(Fx.sub(x, this.ox)), Fx.toInt(Fx.sub(y, this.oy)),
                // dst dimensions
                width, height,
                // src rect in sprite image
                pImage,
                0, 0,
                pImage.width, pImage.height,
                true,
                false
            );
        }
    }

    function snowballShapes() {
        return [
            img`
                . . . . . 1 9 9 9 9 1 . . . . . 
                . . . 1 9 9 1 1 1 1 9 9 9 . . . 
                . . 1 9 1 1 1 1 1 1 1 1 9 9 . . 
                . 1 9 1 1 1 d 1 1 1 1 1 1 9 9 . 
                . 9 1 1 1 d 1 1 1 1 1 1 1 1 6 . 
                1 9 1 1 d 1 1 1 1 1 1 1 1 1 9 6 
                9 1 1 1 1 1 1 1 1 1 1 1 1 1 d 6 
                9 1 1 1 1 1 1 1 1 1 1 1 1 d d 6 
                9 1 1 1 1 1 1 1 1 1 1 1 1 d d 6 
                9 1 1 1 1 1 1 1 1 1 1 1 1 d b 6 
                9 9 1 1 1 1 1 1 1 1 1 1 d d 6 6 
                . 6 d 1 1 1 1 1 1 1 1 d d b 8 . 
                . 6 9 d d 1 1 1 1 d d d b 6 8 . 
                . . 6 9 d d d d d d d b 6 8 . . 
                . . . 6 8 6 b d d b 6 8 8 . . . 
                . . . . . 8 8 8 8 8 8 . . . . . 
            `, img`
                . . . . . . . 1 9 9 1 . . . . .
                . . . . . 1 9 9 1 1 9 9 9 . . .
                . . . . 1 9 1 1 1 1 1 1 9 9 . .
                . . . 1 9 1 1 1 1 1 1 1 1 9 9 .
                . . . 9 1 1 1 1 1 1 1 1 1 1 6 .
                . . 1 9 1 1 1 1 1 1 1 1 1 1 9 6
                . . 9 1 1 1 d 1 1 1 1 1 1 1 d 6
                . . 9 1 1 1 1 d 1 1 1 1 1 d d 6
                . . 9 1 1 1 1 1 d d 1 1 1 d d 6
                . . 9 1 1 1 1 1 1 1 1 1 1 d b 6
                . . 9 9 1 1 1 1 1 1 1 1 d d 6 6
                . . . 6 d 1 1 1 1 1 1 d d b 8 .
                . . . 6 9 d d 1 1 d d d b 6 8 .
                . . . . 6 9 d d d d d b 6 8 . .
                . . . . . 6 8 6 b b 6 8 8 . . .
                . . . . . . . 8 8 8 8 . . . . .
            `, img`
                . . . . . 1 9 9 9 9 1 . . . . .
                . . . 1 9 9 1 1 1 1 9 9 9 . . .
                . . 1 9 1 1 1 1 1 1 1 1 9 9 . .
                . 1 9 1 1 1 1 1 d d 1 1 1 9 9 .
                . 9 1 1 1 1 1 1 1 1 d 1 1 1 6 .
                1 9 1 1 1 1 1 1 1 1 1 1 1 1 9 6
                9 1 1 1 1 1 1 1 1 1 1 1 1 d d 6
                9 1 1 1 1 1 1 1 1 1 1 1 1 d b 6
                9 9 1 1 1 1 1 1 1 1 1 1 d d 6 6
                . 6 d 1 1 1 1 1 1 1 1 d d b 8 .
                . 6 9 d d 1 1 1 1 d d d b 6 8 .
                . . 6 9 d d d d d d d b 6 8 . .
                . . . 6 8 6 b d d b 6 8 8 . . .
                . . . . . 8 8 8 8 8 8 . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
            `
        ];
    }

    //% fixedInstance whenUsed block="snowball"
    export const snowball = new effects.ScreenEffect(15, 250, 0, function (anchor: particles.ParticleAnchor, particlesPerSecond: number) {
        const factory = new ScaledShapeFactory(
            100, // particle speed
            45, // arc center degrees
            92, // arc degrees
            snowballShapes()
        );
        const src = new particles.ParticleSource(anchor, particlesPerSecond, factory);
        return src;
    });

    function candyCaneShapes() {
        return [
            img`
                0 0 0 0 0 0 0 F F F F F F F 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 F 1 1 1 1 1 2 2 F 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 F 1 1 1 1 1 1 2 2 2 F 0 0 0 0 0 0 0 0
                0 0 0 0 F 2 2 1 1 1 1 2 2 2 2 2 F 0 0 0 0 0 0 0
                0 0 0 0 F 2 2 2 2 1 1 2 2 2 2 2 F 0 0 0 0 0 0 0
                0 0 0 0 F 2 2 2 2 F F 2 2 2 2 1 F 0 0 0 0 0 0 0
                0 0 0 0 F 2 2 2 F 0 0 F 2 1 1 1 F 0 0 0 0 0 0 0
                0 0 0 0 F 1 1 1 F 0 0 F 1 1 1 1 F 0 0 0 0 0 0 0
                0 0 0 0 F 1 1 1 F 0 0 F 1 1 1 1 F 0 0 0 0 0 0 0
                0 0 0 0 0 F 1 F 0 0 0 F 2 2 2 2 F 0 0 0 0 0 0 0
                0 0 0 0 0 0 F 0 0 0 0 F 2 2 2 2 F 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 F 2 2 2 2 F 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 F 2 2 2 2 F 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 F 1 1 1 1 F 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 F 1 1 1 1 F 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 F 2 2 2 2 F 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 F 2 2 2 2 F 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 F 2 2 2 2 F 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 F 1 1 1 1 F 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 F 1 1 1 1 F 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 F 1 1 1 1 F 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 F 2 2 2 2 F 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 F 2 2 F 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 F F 0 0 0 0 0 0 0 0 0
            `, img`
                0 0 0 0 0 0 0 0 0 0 0 0 F F F F F F F 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 F F 2 1 1 1 F F F 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 F F 2 2 2 1 1 1 F F F 0 0 0
                0 0 0 0 0 0 0 0 0 F F 2 2 2 2 1 1 1 1 F F F 0 0
                0 0 0 0 0 0 0 0 0 F 1 1 2 2 2 1 1 1 1 1 F F F 0
                0 0 0 0 0 0 0 0 0 F 1 1 1 2 F 1 1 1 2 2 2 F 0 0
                0 0 0 0 0 0 0 0 0 F 1 1 F F F F 2 2 2 2 2 F 0 0
                0 0 0 0 0 0 0 0 F F F F F 0 0 F 2 2 2 2 2 F 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 F F 2 2 2 2 2 F 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 F F 1 1 1 2 2 F F 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 F F 2 1 1 1 1 F F F 0 0
                0 0 0 0 0 0 0 0 0 0 0 F F 2 2 2 1 1 F F F 0 0 0
                0 0 0 0 0 0 0 0 0 0 F F 2 2 2 2 2 F F F 0 0 0 0
                0 0 0 0 0 0 0 0 0 F F 1 2 2 2 2 F F F 0 0 0 0 0
                0 0 0 0 0 0 0 0 F F 1 1 1 2 2 F F F 0 0 0 0 0 0
                0 0 0 0 0 0 0 F F 2 2 1 1 1 F F F 0 0 0 0 0 0 0
                0 0 0 0 0 0 F F 2 2 2 2 1 F F F 0 0 0 0 0 0 0 0
                0 0 0 0 0 F F 1 1 2 2 2 F F F 0 0 0 0 0 0 0 0 0
                0 0 0 0 F F 1 1 1 1 2 F F F 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 F 2 2 1 1 1 F F F 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 F F 2 2 1 F F F 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 F F 2 2 F F F 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 F F F F F 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
            `, img`
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 F F F F F F 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 F 1 1 2 2 2 2 F 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 F 1 1 1 2 2 2 2 1 F 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 F 1 1 2 2 2 1 1 1 F
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 F F F 2 2 1 1 1 F
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 F 1 1 1 1 F
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 F 1 1 1 1 F
                0 0 F F F F F F F F F F F F F F F F 2 2 2 1 1 F
                0 F 2 1 1 1 2 2 2 1 1 2 2 2 2 1 1 2 2 2 2 2 2 F
                F 2 2 1 1 1 2 2 2 1 1 2 2 2 2 1 1 1 2 2 2 2 2 F
                F 2 2 1 1 1 2 2 2 1 1 2 2 2 2 1 1 1 2 2 2 2 F 0
                0 F 2 1 1 1 2 2 2 1 1 2 2 2 2 1 1 1 1 2 2 F 0 0
                0 0 F F F F F F F F F F F F F F F F F F F 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
            `, img`
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 F F F F 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 F F F 2 F F F 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 F F 2 2 1 F F F 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 F 2 1 1 1 F F F 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 F 1 1 1 1 2 2 F F 0 0 0 0 0 0 F 0 0 0 0 0 0
                0 0 F F 1 1 2 2 2 2 F F 0 0 0 0 F F F F F 0 0 0
                0 0 0 F F 2 2 2 2 2 1 F F 0 0 0 F 1 1 1 F F 0 0
                0 0 0 0 F F 2 2 2 1 1 2 F F 0 0 F F 1 1 2 F F 0
                0 0 0 0 0 F F 2 1 1 2 2 2 F F 0 0 F 1 2 2 2 F F
                0 0 0 0 0 0 F F 1 2 2 2 2 2 F F 0 F F 2 2 2 2 F
                0 0 0 0 0 0 0 F F 2 2 2 2 2 1 F F 0 F 2 2 2 1 F
                0 0 0 0 0 0 0 0 F F 2 2 2 1 1 1 F F F 1 1 1 1 F
                0 0 0 0 0 0 0 0 0 F F 2 1 1 1 2 2 2 1 1 1 1 1 F
                0 0 0 0 0 0 0 0 0 0 F F 1 1 1 2 2 2 2 1 1 1 F F
                0 0 0 0 0 0 0 0 0 0 0 F F 1 1 2 2 2 2 1 1 F F F
                0 0 0 0 0 0 0 0 0 0 0 0 F F 2 2 2 2 2 2 F F F 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 F F 2 2 2 2 F F F 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 F F F F F F F 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 F 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
            `, img`
                0 0 0 0 0 0 0 0 0 F F 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 F 2 2 F 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 F 2 2 2 2 F 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 F 1 1 1 1 F 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 F 1 1 1 1 F 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 F 1 1 1 1 F 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 F 2 2 2 2 F 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 F 2 2 2 2 F 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 F 2 2 2 2 F 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 F 1 1 1 1 F 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 F 1 1 1 1 F 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 F 2 2 2 2 F 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 F 2 2 2 2 F 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 F 2 2 2 2 F 0 0 0 0 F 0 0 0 0 0 0
                0 0 0 0 0 0 0 F 2 2 2 2 F 0 0 0 F 1 F 0 0 0 0 0
                0 0 0 0 0 0 0 F 1 1 1 1 F 0 0 F 1 1 1 F 0 0 0 0
                0 0 0 0 0 0 0 F 1 1 1 1 F 0 0 F 1 1 1 F 0 0 0 0
                0 0 0 0 0 0 0 F 1 1 1 2 F 0 0 F 2 2 2 F 0 0 0 0
                0 0 0 0 0 0 0 F 1 2 2 2 2 F F 2 2 2 2 F 0 0 0 0
                0 0 0 0 0 0 0 F 2 2 2 2 2 1 1 2 2 2 2 F 0 0 0 0
                0 0 0 0 0 0 0 F 2 2 2 2 2 1 1 1 1 2 2 F 0 0 0 0
                0 0 0 0 0 0 0 0 F 2 2 2 1 1 1 1 1 1 F 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 F 2 2 1 1 1 1 1 F 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 F F F F F F F 0 0 0 0 0 0 0
            `, img`
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 F F 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 F F F F F F 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 F F 1 2 2 2 F 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 F F 1 1 1 2 2 F 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 F F 2 1 1 1 1 F F 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 F F 2 2 2 1 1 1 F F 0 0 0 0
                0 0 0 0 0 0 0 0 0 F F 1 2 2 2 2 1 F F 0 0 0 0 0
                0 0 0 0 0 0 0 0 F F 1 1 1 2 2 2 F F 0 0 0 0 0 0
                0 0 0 0 0 0 0 F F 2 2 1 1 1 2 F F 0 0 0 0 0 0 0
                0 0 0 0 0 0 F F 2 2 2 2 1 1 F F 0 0 0 0 0 0 0 0
                0 0 0 0 0 F F 2 2 2 2 2 2 F F 0 0 0 0 0 0 0 0 0
                0 0 0 0 F F 1 1 2 2 2 2 F F 0 0 0 0 0 0 0 0 0 0
                0 0 0 F F 1 1 1 1 2 2 F F 0 0 0 0 0 0 0 0 0 0 0
                0 0 F F 2 1 1 1 1 1 F F 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 F F 2 2 2 2 1 F F 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 F 2 2 2 2 2 F F 0 0 F F F F 0 0 0 0 0 0 0 0
                0 0 F 2 2 2 2 2 F F F F F 1 1 F 0 0 0 0 0 0 0 0
                0 0 F 2 2 2 2 1 1 F F 1 1 1 1 F 0 0 0 0 0 0 0 0
                0 0 F F 2 1 1 1 1 2 2 2 1 1 F F 0 0 0 0 0 0 0 0
                0 0 F F F 1 1 1 1 2 2 2 2 1 F 0 0 0 0 0 0 0 0 0
                0 0 0 F F F 1 1 1 1 2 2 2 F F 0 0 0 0 0 0 0 0 0
                0 0 0 0 F F F 1 1 1 2 2 F F 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 F F F F F F F F 0 0 0 0 0 0 0 0 0 0 0
            `, img`
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 F F F F F F F F F F F F F F F F F F F 0 0
                0 0 F 2 2 1 1 1 1 2 2 2 2 1 1 2 2 2 1 1 1 2 F 0
                0 F 2 2 2 2 1 1 1 2 2 2 2 1 1 2 2 2 1 1 1 2 2 F
                F 2 2 2 2 2 1 1 1 2 2 2 2 1 1 2 2 2 1 1 1 2 2 F
                F 2 2 2 2 2 2 1 1 2 2 2 2 1 1 2 2 2 1 1 1 2 F 0
                F 1 1 2 2 2 F F F F F F F F F F F F F F F F 0 0
                F 1 1 1 1 F 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                F 1 1 1 1 F 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                F 1 1 1 2 2 F F F 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                F 1 1 1 2 2 2 1 1 F 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 F 1 2 2 2 2 1 1 1 F 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 F 2 2 2 2 1 1 F 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 F F F F F F 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
            `, img`
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 F F F F F F 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 F F F 2 2 2 F F 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 F F 2 2 2 2 2 2 F F 0 0 0 0 0 0 0 0 0 0 0 0
                0 F F 1 1 2 2 2 2 2 1 F F 0 0 0 0 0 0 0 0 0 0 0
                F F 1 1 1 1 2 2 2 1 1 1 F F 0 0 0 0 0 0 0 0 0 0
                F 1 1 1 1 1 2 2 2 1 1 1 1 F F 0 0 0 0 0 0 0 0 0
                F 1 1 1 1 1 F F 2 1 1 1 2 2 F F 0 0 0 0 0 0 0 0
                F 1 1 2 2 F F F F 1 1 2 2 2 2 F F 0 0 0 0 0 0 0
                F 2 2 2 2 F F 0 F F 2 2 2 2 2 1 F F 0 0 0 0 0 0
                F F 2 2 2 2 F F 0 F F 2 2 2 1 1 1 F F 0 0 0 0 0
                0 F F 2 2 1 1 F 0 0 F F 2 1 1 1 2 2 F F 0 0 0 0
                0 0 F F 1 1 1 F 0 0 0 F F 1 1 2 2 2 2 F F 0 0 0
                0 0 0 F F 1 1 F 0 0 0 0 F F 2 2 2 2 1 1 F F 0 0
                0 0 0 0 F F F F 0 0 0 0 0 F F 2 2 1 1 1 1 F F 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 F F F 1 1 1 1 2 F 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 F F F 1 1 2 2 F 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 F F F 2 2 F F 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 F F F F F 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
            `
        ];
    }

    //% fixedInstance whenUsed block="candy cane"
    export const candyCanes = new effects.ScreenEffect(15, 35, 0, function (anchor: particles.ParticleAnchor, particlesPerSecond: number) {
        const factory = new ScaledShapeFactory(
            100, // particle speed
            45, // arc center degrees
            92, // arc degrees
            candyCaneShapes()
        );

        factory.minPercent = 15;
        factory.maxPercent = 150;
        factory.rotateImagesRate = .25;

        const src = new particles.ParticleSource(anchor, particlesPerSecond, factory);
        return src;
    });

    function cookieShapes() {
        return [
            img`
                . . . . . f f f f f f . . . . .
                . . . f f b b b 7 b b f f . . .
                . . f b b b b b b b b b b f . .
                . f b b b b 7 b 2 b b 7 b b f .
                . f b b b b b b b b b b b b f .
                f b b 2 b b b b 7 b b 7 b b b f
                f b b b b b b b b b b b 2 b b f
                f b b b b 7 b b 2 b b b b b b f
                f b 7 b b b b b b b b b b b b f
                f b b b b b b b b b 7 b b b d f
                f b b 7 b b b 2 b b b b b b d f
                . f b b b b b b b b b b b d f .
                . f b b b 2 b b b 7 b b d d f .
                . . f d b b b b b b b d d f . .
                . . . f f d d b b d d f f . . .
                . . . . . f f f f f f . . . . .
            `, img`
                . . . . . f f f f f f . . . . .
                . . . f f 3 3 1 3 3 3 f f . . .
                . . f 3 1 3 3 3 3 3 1 3 3 f . .
                . f 3 3 3 3 1 3 3 1 3 3 3 3 f .
                . f 1 3 1 2 2 2 2 2 2 3 1 3 f .
                f 3 3 3 2 2 2 2 2 2 2 2 3 3 1 f
                f 3 1 2 2 2 2 2 2 2 2 2 2 1 3 f
                f 3 3 2 2 2 2 2 2 2 2 2 2 3 3 f
                f 1 3 2 2 2 2 2 2 2 2 2 2 3 3 f
                f 3 1 2 2 2 2 2 2 2 2 2 2 1 3 f
                f 3 3 3 2 2 2 2 2 2 2 2 3 3 1 f
                . f 1 1 3 2 2 2 2 2 2 3 1 3 f .
                . f 3 3 3 3 3 1 3 3 3 3 1 3 f .
                . . f 3 1 3 1 3 1 3 1 3 3 f . .
                . . . f f 3 3 1 3 3 3 f f . . .
                . . . . . f f f f f f . . . . .
            `, img`
                . . . . . f f f f f f . . . . .
                . . . f f 1 1 1 1 1 1 f f . . .
                . . f 1 1 1 1 6 7 1 1 1 1 f . .
                . f 1 1 1 1 1 6 7 1 1 1 1 1 f .
                . f 1 1 1 1 6 7 7 7 1 1 1 1 f .
                f 1 1 1 1 1 1 6 7 1 1 1 1 1 1 f
                f 1 1 1 1 6 6 2 7 7 7 1 1 1 1 f
                f 1 1 1 1 1 6 7 7 7 1 1 1 1 1 f
                f 1 1 1 1 6 2 7 7 3 7 1 1 1 1 f
                f 1 1 1 6 7 7 7 2 7 7 7 1 1 1 f
                f 1 1 1 1 1 1 e e 1 1 1 1 1 1 f
                . f 1 1 1 1 1 e e 1 1 1 1 1 f .
                . f 1 1 1 1 1 1 1 1 1 1 1 1 f .
                . . f 1 1 1 1 1 1 1 1 1 1 f . .
                . . . f f 1 1 1 1 1 1 f f . . .
                . . . . . f f f f f f . . . . .
            `, img`
                . . . . . f f f f f f . . . . .
                . . . f f e e e e e e f f . . .
                . . f e e 1 1 1 1 1 1 e e f . .
                . f e 1 1 1 1 1 1 1 1 1 1 e f .
                . f e 1 1 1 1 1 1 1 1 1 1 e f .
                f e 1 1 1 f 1 1 1 1 f 1 1 1 e f
                f e 1 1 1 1 1 1 1 1 1 1 1 1 e f
                f e 1 1 1 1 1 4 4 1 1 1 1 1 e f
                f e 1 1 1 1 1 4 4 4 4 1 1 1 e f
                f e 1 1 1 1 1 1 1 1 1 1 1 1 e f
                f e 1 1 1 f 1 1 1 1 f 1 1 1 e f
                . f e 1 1 1 f f f f 1 1 1 e f .
                . f e 1 1 1 1 1 1 1 1 1 1 e f .
                . . f e e 1 1 1 1 1 1 e e f . .
                . . . f f e e e e e e f f . . .
                . . . . . f f f f f f . . . . .
            `, img`
                . . . . . f f f f f f . . . . .
                . . . . f e d d d e e f . . . .
                . . . . f d f e e f e f . . . .
                . . . . f d e e e e e f . . . .
                . . . . f d f e e f e f . . . .
                . f f f . f e f f e f . f f f .
                f d d e f f 7 7 7 7 f f e e e f
                f d e e 1 e e 2 2 7 e 1 e e e f
                f f f 1 e e e e 7 e e e 1 f f f
                . . f f f e e 2 2 e e f f f . .
                . . . . f e e e e e e f . . . .
                . f f . f e e 2 2 e e f . f f .
                f d d f f e e f f e e f f e e f
                f d e e e 1 e f f e 1 e e e e f
                f d e e e e 1 f f 1 e e e e e f
                . f f f f f f . . f f f f f f .
            `, img`
                . . . . . f f f f f f . . . . .
                . . . f f 1 1 1 1 1 1 f f . . .
                . . f 1 1 1 1 1 1 1 1 1 1 f . .
                . f 1 1 1 1 6 6 6 1 1 1 1 1 f .
                . f 1 1 1 1 6 6 6 1 1 1 1 1 f .
                f 1 1 1 1 1 6 6 6 1 1 1 1 1 1 f
                f 1 1 6 6 6 6 6 6 6 6 6 1 1 1 f
                f 1 1 6 6 6 6 1 1 6 6 6 1 1 1 f
                f 1 1 6 6 6 6 6 1 6 6 6 1 1 1 f
                f 1 1 6 6 6 6 6 1 6 6 6 1 1 1 f
                f 1 1 1 6 6 1 1 1 6 6 1 1 1 1 f
                . f 1 1 1 6 6 6 6 6 1 1 1 1 f .
                . f 1 1 1 1 6 6 6 1 1 1 1 1 f .
                . . f 1 1 1 1 1 1 1 1 1 1 f . .
                . . . f f 1 1 1 1 1 1 f f . . .
                . . . . . f f f f f f . . . . .
            `, img`
                . . . . . f f f f f f . . . . .
                . . . f f 2 2 2 2 2 2 f f . . .
                . . f 2 2 2 2 2 2 2 2 2 2 f . .
                . f 2 2 2 2 2 2 2 2 2 2 2 2 f .
                . f 2 2 2 2 2 2 2 2 2 2 2 2 f .
                f f f f f f f f f f f f f f f f
                f f f f f f f f f f f f f f f f
                f f f f f f f f f f f f f f f f
                f f f f f f f f f f f f f f f f
                f f f f f f f f f f f f f f f f
                f f f f f f f f f f f f f f f f
                . f 7 7 7 7 7 7 7 7 7 7 7 7 f .
                . f 7 7 7 7 7 7 7 7 7 7 7 7 f .
                . . f 7 7 7 7 7 7 7 7 7 7 f . .
                . . . f f 7 7 7 7 7 7 f f . . .
                . . . . . f f f f f f . . . . .
            `,
        ];
    }

    //% fixedInstance whenUsed block="holiday cookies"
    export const holidayCookies = new effects.ScreenEffect(15, 70, 0, function (anchor: particles.ParticleAnchor, particlesPerSecond: number) {
        const factory = new ScaledShapeFactory(
            135, // particle speed
            0, // arc center degrees
            35, // arc degrees
            cookieShapes()
        );
        factory.spawnDirection = SpawningDirection.Top;
        factory.minPercent = 1;
        factory.maxPercent = 40;
        factory.growthRate = 0.07;
        const src = new particles.ParticleSource(anchor, particlesPerSecond, factory);
        return src;
    });

    function snowflakeShapes() {
        return [
            img`1`,
            img`9`,
            img`
                9 1
                1 .
            `,
            img`
                . . 1
                . 1 9
                1 9 1
            `, img`
                . 1
                1 9
            `,
            img`
                1 . .
                9 1 .
                1 9 1
            `,
            img`
                1 9 1
                9 1 .
                1 . .
            `,
            img`
                1 9 1
                . 1 9
                . . 1
            `,
            img`1 9`,
            img`9 1`,
            img`1 1`,
            img`
                9 9
            `,
            img`
                1
                9
            `,
            img`
                9
                1
            `,
            img`
                9 .
                . 1
            `,
            img`
                . 1
                9 .
            `,
        ];
    }

    //% fixedInstance whenUsed block="snowflakes"
    export const snowflakes = new effects.ScreenEffect(15, 80, 0, function (anchor: particles.ParticleAnchor, particlesPerSecond: number) {
        const factory = new ScaledShapeFactory(
            30, // particle speed
            0, // arc center degrees
            35, // arc degrees
            snowflakeShapes()
        );

        factory.spawnDirection = SpawningDirection.Top;
        factory.randomlySwitchDirectionsRate = 0.01;
        factory.minPercent = 50;
        factory.maxPercent = 200;
        factory.particleLifespan = 5000;

        const src = new particles.ParticleSource(anchor, particlesPerSecond, factory);
        return src;
    });

    //% block
    export function stub() {

    }
}