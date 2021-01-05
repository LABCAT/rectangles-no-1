import React, { useEffect } from "react";
import './globals';
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";
import audio from '../audio/rectangles-no-1.mp3'


const P5Sketch = () => {

    const Sketch = p5 => {

        p5.canvas = null;

        p5.framesPerSecond = 48;

        p5.canvasWidth = window.innerWidth;

        p5.canvasHeight = window.innerHeight;

        p5.centerX = window.innerWidth / 4;

        p5.centerY= window.innerHeight / 2;

        p5.a = 0;

        p5.b = 0;

        p5.amp = window.innerWidth / 4;
        
        p5.song = null;

        p5.tempo = 60;
        
        p5.semiQuaversArray = [];

        p5.beatPerBar = 4;
        p5.framesPerBar = (p5.framesPerSecond * 60 / p5.tempo) * p5.beatPerBar;
        p5.framesPerBeat = p5.framesPerBar / p5.beatPerBar;

        p5.setup = () => {
            p5.song = p5.loadSound(audio);
            p5.colorMode(p5.HSL);
            p5.canvas = p5.createCanvas(p5.canvasWidth, p5.canvasHeight); 
            p5.background(0,0,94);
            p5.smooth();
            p5.noFill();
            p5.strokeWeight(2);
            p5.frameRate(p5.framesPerSecond);
            console.log(p5.framesPerBeat);
        };

        //https://www.openprocessing.org/sketch/988880
        p5.draw = () => {
            let currentBar = p5.getSongBar();
            
            // p5.blendMode(p5.SCREEN);

            // //console.log('currentBar', currentBar);
            // if (p5.song._lastPos > 0 && currentBar >= 0 && p5.song.isPlaying()) {

            //     if (currentBar > 201) {
            //         currentBar = 201;
            //         p5.canvas.addClass('fade-out');
            //         console.log('Music By: https://github.com/LABCAT');
            //         console.log('Animation By: https://github.com/LABCAT');
            //         console.log('Code Inspiration: https://www.openprocessing.org/sketch/988880');
            //         //p5.song.stop()
            //     }
                
            // }

            
            p5.a = p5.centerX + p5.random(p5.amp) * (180 / p5.TWO_PI);
            p5.b = p5.centerY + p5.random(p5.amp) * (180 / p5.TWO_PI);

            for (var i = 0; i <= 360; i += .1 ) {

                p5.x = p5.centerX - p5.amp * p5.sin(p5.a * i * p5.TWO_PI / 180);
                p5.y = p5.centerY - p5.amp * p5.sin(p5.b * i * p5.TWO_PI / 180);

                p5.stroke(120, 100, 25, 1);
                p5.point(p5.x, p5.y);
                p5.point(p5.y, p5.x);

                p5.stroke(240, 100, 25, 1);
                p5.point(p5.x + (p5.centerX * 2) , p5.y);
                p5.point(p5.y, p5.x + (p5.centerX * 2));

            }

            if (p5.frameCount % (p5.framesPerBeat / 8) == 0) {
                p5.amp *= .75;
            }

            // if (frameCount > width * 1.5) {
            //     textFont(createFont("Helvetica", 11));
            //     fill(0);
            //     text("squared PT2", 3, height - 5);

            //     noLoop();
            // }   
            
        };


        p5.getSongBar = () => {
            if (p5.song && p5.song.buffer){
                const beatPerBar = 0.5;
                const barAsBufferLength = (p5.song.buffer.sampleRate * 60 / p5.tempo) * beatPerBar;
                return Math.floor(p5.song._lastPos / barAsBufferLength);
            }
            return -1;
        }

        p5.mousePressed = () => {
            if (p5.song.isPlaying()) {
                p5.song.pause();
            } else {
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
        <></>
    );
};

export default P5Sketch;
