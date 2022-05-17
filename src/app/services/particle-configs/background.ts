import { OutMode } from 'tsparticles-engine';

export let backgroundParticles = {
  fpsLimit: 60,
  particles: {
    color: {
      value: "#8c8c8c"
    },
    links: {
      enable: true,
      color: "#a8a8a8",
      distance: 150,
    },
    move: {
      enable: true,
      outModes: OutMode.bounce
    },
    number: {
      value: 10,
    }
  },
  fullScreen: {
    enable: false,
    zIndex: 0,
  }
};