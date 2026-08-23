/**
 * @file resources.js
 * @version 1.0.0
 */

const resources = {
    font: {
        name: 'DefaultFont',
        path: '../fonts/Recursive-SemiBold.ttf',
    },
    models: {
        world: {
            path: '../models/world.glb',
            type: 'gltf',
        },
    },
    sounds: {
        music__ending: {
            path: '../sounds/music__ending.wav',
            count: 1,
            baseVolume: 0.4,
            type: 'audio/wav',
        },
        music__ingame: {
            path: '../sounds/music__ingame.mp3',
            count: 1,
            baseVolume: 0.5,
            type: 'audio/mp3',
        },
        sound__alarm: {
            path: '../sounds/sound__alarm.wav',
            count: 1,
            baseVolume: 1,
            type: 'audio/wav',
        },
        sound__creak: {
            path: '../sounds/sound__creak.wav',
            count: 1,
            baseVolume: 0.5,
            type: 'audio/wav',
        },
        sound__button_press: {
            path: '../sounds/sound__button_press.wav',
            count: 3,
            baseVolume: 1,
            type: 'audio/wav',
        },
        sound__button_release: {
            path: '../sounds/sound__button_release.wav',
            count: 3,
            baseVolume: 1,
            type: 'audio/wav',
        },
        sound__correct: {
            path: '../sounds/sound__correct.wav',
            count: 1,
            baseVolume: 0.8,
            type: 'audio/wav',
        },
        sound__countdown: {
            path: '../sounds/sound__countdown.wav',
            count: 3,
            baseVolume: 0.3,
            type: 'audio/wav',
        },
        sound__flood: {
            path: '../sounds/sound__flood.mp3',
            count: 1,
            baseVolume: 0.6,
            type: 'audio/mp3',
        },
        sound__surface: {
            path: '../sounds/sound__surface.wav',
            count: 1,
            baseVolume: 1,
            type: 'audio/wav',
        },
        sound__switch: {
            path: '../sounds/sound__switch.wav',
            count: 3,
            baseVolume: 0.7,
            type: 'audio/wav',
        },
        sound__underwater: {
            path: '../sounds/sound__underwater.wav',
            count: 1,
            baseVolume: 1,
            type: 'audio/wav',
        },
        sound__wrong: {
            path: '../sounds/sound__wrong.wav',
            count: 1,
            baseVolume: 1,
            type: 'audio/wav',
        },
        sound__spider: {
            path: '../sounds/sound__spider.wav',
            count: 1,
            baseVolume: 1,
            type: 'audio/wav',
        },
        sound__scare: {
            path: '../sounds/sound__scare.wav',
            count: 1,
            baseVolume: 1,
            type: 'audio/wav',
        },
    },
};

export default resources;
