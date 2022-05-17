import { MoveDirection, OutMode, SizeMode, ShapeType, RotateDirection, TiltDirection } from 'tsparticles-engine';

export let winParticles = {
  fpsLimit: 60,
  // Default particles (we don't want since we're just using emitter)
  particles: {
    number: {
      value: 0
    }
  },

  emitters: {
    direction: MoveDirection.none,
    position: { "x": 50, "y": 50 },
    size: {
      width: 50,
      height: 50,
      mode: SizeMode.precise,
    },
    rate: {
      quantity: 1,
      delay: .1,
    },

    particles: {
      color: {
        value: ["#06070E", "#29524A", "#94A187", "#C5AFA0", "#E9BCB7"],
       animation: {
          h: {
            count: 0,
            enable: true,
            offset: 0,
            speed: 30,
            sync: true
          },
          s: {
            enable: false,
          },
          l: {
            enable: false,
          },
        }
      },
      links: {
        enable: false,
        color: "#a8a8a8",
        distance: 150,
      },
      move: {
        enable: true,
        outModes: OutMode.destroy,
      },
      rotate: {
        direction: RotateDirection.random,
        value: {
          min: -180,
          max: 180,
        },
        animation: {
          enable: true,
          speed: 3,
          sync: false,
        },
      },
      shape: {
        type: ShapeType.char,
        "character": {
          "value": "abcdefghijklmnopqrstuvwxyz".split(''),
        },
      },
      size: {
        value: 10,
      },
      wobble: {
        enable: true,
        distance: {
          min: -30,
          max: 30,
        },
        speed: {
          min: -15,
          max: 15,
        }
      },
    },
    fullScreen: {
      enable: false,
      zIndex: 0,
    },
  }
};
