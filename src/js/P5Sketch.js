import React, { useEffect } from "react";
import PlayIcon from './PlayIcon.js';
import './globals';
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";
import audio from '../audio/rectangles-no-1.mp3'


const P5Sketch = () => {

    const Sketch = p5 => {

        p5.canvas = null;

        p5.framesPerSecond = 24;

        p5.canvasWidth = window.innerWidth;

        p5.canvasHeight = window.innerHeight;

        p5.centerX = window.innerWidth / 4;

        p5.centerY= window.innerHeight / 2;

        p5.baseHue = 120;

        p5.leftSaturation = 25;
        
        p5.rightSaturation = 75;

        p5.a = 0;

        p5.b = 0;

        p5.amp = window.innerWidth / 4;
        
        p5.song = null;

        p5.tempo = 101;
        
        p5.previousBeat = 0;

        p5.setup = () => {
            p5.song = p5.loadSound(audio);
            p5.colorMode(p5.HSL);
            p5.canvas = p5.createCanvas(p5.canvasWidth, p5.canvasHeight); 
            p5.background(0,0,94);
            p5.smooth();
            p5.noFill();
            p5.strokeWeight(2);
        };

        p5.draw = () => {
            let currentBar = p5.getSongBar();
            let currentBeat = p5.getSongBeat();
            console.log(currentBar);

            if (p5.song._lastPos > 0 && currentBar >= 0 && p5.song.isPlaying()) {

                if (currentBar > 201) {
                    console.log('Music By: https://github.com/LABCAT');
                    console.log('Animation By: https://github.com/LABCAT');
                    console.log('Code Inspiration: https://www.openprocessing.org/sketch/937878');
                    //p5.song.stop()
                }

                p5.a = p5.centerX + p5.random(p5.amp) * (180 / p5.TWO_PI);
                p5.b = p5.centerY + p5.random(p5.amp) * (180 / p5.TWO_PI);

                for (var i = 0; i <= 360; i += .1) {

                    p5.x = p5.centerX - p5.amp * p5.sin(p5.a * i * p5.TWO_PI / 180);
                    p5.y = p5.centerY - p5.amp * p5.sin(p5.b * i * p5.TWO_PI / 180);

                    p5.stroke(p5.baseHue, 100, p5.leftSaturation, 1);
                    p5.point(p5.x, p5.y);
                    p5.point(p5.y, p5.x);

                    p5.stroke(p5.baseHue + 120, 100, p5.rightSaturation, 1);
                    p5.point(p5.x + (p5.centerX * 2), p5.y);
                    p5.point(p5.y, p5.x + (p5.centerX * 2));

                }
                
                if (currentBeat !== p5.previousBeat) {
                    p5.amp *= .75;
                    p5.previousBeat = currentBeat;
                }

                if (currentBeat % 12 == 0 && currentBar < 24) {
                    p5.clear();
                    p5.rotate(p5.TWO_PI / 90);
                    p5.amp = window.innerWidth / 4;
                    p5.baseHue = p5.baseHue + 60;
                    if (p5.baseHue > 360) {
                        p5.baseHue = p5.baseHue - 360;
                    }
                }
                
            }
          
        };

        p5.beatPerBar = 4;

        p5.getSongBeat = () => {
            if (p5.song && p5.song.buffer) {
                const barAsBufferLength = (p5.song.buffer.sampleRate * 60 / p5.tempo);
                return Math.floor(p5.song._lastPos / barAsBufferLength) + 1;
            }
            return -1;
        }


        p5.getSongBar = () => {
            if (p5.song && p5.song.buffer){
                const barAsBufferLength = (p5.song.buffer.sampleRate * 60 / p5.tempo) * p5.beatPerBar;
                return Math.floor(p5.song._lastPos / barAsBufferLength) + 1;
            }
            return -1;
        }

        p5.mousePressed = () => {
            if (p5.song.isPlaying()) {
                p5.song.pause();
            } else {
                document.getElementById("play-icon").classList.add("fade-out");
                p5.canvas.addClass('fade-in');
                p5.song.play();
            }
        };

        p5.updateCanvasDimensions = () => {
            p5.canvasWidth = window.innerWidth;
            p5.canvasHeight = window.innerHeight;
            p5.createCanvas(p5.canvasWidth, p5.canvasHeight);
            p5.redraw();
        }

        if (window.attachEvent) {
            window.attachEvent(
                'onresize',
                function () {
                    p5.updateCanvasDimensions();
                }
            );
        }
        else if (window.addEventListener) {
            window.addEventListener(
                'resize',
                function () {
                    p5.updateCanvasDimensions();
                },
                true
            );
        }
        else {
            //The browser does not support Javascript event binding
        }
    };

    useEffect(() => {
        new p5(Sketch);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <PlayIcon />
        </>
    );
};

export default P5Sketch;
