import React, { useEffect, useRef } from "react";
import PlayIcon from './PlayIcon.js';
import './globals';
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";
import audio from '../audio/rectangles-no-1.mp3'
import cues from './cues.js'


const P5Sketch = () => {

    const sketchRef = useRef();

    const Sketch = p => {

        p.canvas = null;

        p.canvasWidth = window.innerWidth;

        p.canvasHeight = window.innerHeight;

        p.centerX = window.innerWidth / 4;

        p.centerY= window.innerHeight / 2;

        p.baseHue = 120;

        p.leftSaturation = 25;
        
        p.rightSaturation = 75;

        p.a = 0;

        p.b = 0;

        p.amp = window.innerWidth / 4;
        
        p.song = null;

        p.cuesCompleted = [];

        p.setup = () => {
            p.canvas = p.createCanvas(p.canvasWidth, p.canvasHeight); 
            p.colorMode(p.HSL);
            p.background(0,0,94);
            p.smooth();
            p.noFill();
            p.strokeWeight(2);

            p.song = p.loadSound(audio);
            p.song.onended(p.logCredits);
            for (let i = 0; i < cues.length; i++) {
                p.song.addCue(cues[i].time, p.executeCue, (i + 1));
            }
        };

        p.draw = () => {

            if (p.song._lastPos > 0 && p.song.isPlaying()) {
                
            }
          
        };

        p.executeCue = (currentCue) => {
            if (!p.cuesCompleted.includes(currentCue)) {
                p.cuesCompleted.push(currentCue);

                if (currentCue % 12 === 1 && currentCue > 1) {
                    p.clear();
                    p.amp = window.innerWidth / 4;
                    p.baseHue = p.baseHue + 60;
                    if (p.baseHue > 360) {
                        p.baseHue = p.baseHue - 360;
                    }
                }

                p.a = p.centerX + p.random(p.amp) * (180 / p.TWO_PI);
                p.b = p.centerY + p.random(p.amp) * (180 / p.TWO_PI);

                for (var i = 0; i <= 540; i += .1) {

                    p.x = p.centerX - p.amp * p.sin(p.a * i * p.TWO_PI / 180);
                    p.y = p.centerY - p.amp * p.sin(p.b * i * p.TWO_PI / 180);

                    //left rectangle
                    p.stroke(p.baseHue, 100, p.leftSaturation, 1);
                    p.point(p.x, p.y);
                    p.point(p.y, p.x);

                    //right rectangle
                    p.stroke(p.baseHue + 120, 100, p.rightSaturation, 1);
                    p.point(p.x + (p.centerX * 2), p.y);
                    p.point(p.y, p.x + (p.centerX * 2));

                }

                if (currentCue % 12 !== 11) {
                    p.amp *= .85;
                }
            }
        }

        p.mousePressed = () => {
            if (p.song.isPlaying()) {
                p.song.pause();
            } else {
                if (parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)) {
                    p.reset();
                }
                document.getElementById("play-icon").classList.add("fade-out");
                p.canvas.addClass('fade-in');
                p.song.play();
            }
        };

        p.creditsLogged = false;

        p.logCredits = () => {
            if (!p.creditsLogged && parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)) {
                p.creditsLogged = true;
                console.log(
                    'Music By: http://labcat.nz/',
                    '\n',
                    'Animation By: https://github.com/LABCAT/rectangles-no-1',
                    '\n',
                    'Code Inspiration: https://www.openprocessing.org/sketch/937878'
                );
                p.song.stop();
            }
        }

        p.reset = () => {
            p.clear();
            p.cuesCompleted = [];
            p.amp = window.innerWidth / 4;
        };

        p.updateCanvasDimensions = () => {
            p.canvasWidth = window.innerWidth;
            p.canvasHeight = window.innerHeight;
            p.createCanvas(p.canvasWidth, p.canvasHeight);
            p.redraw();
        }

        if (window.attachEvent) {
            window.attachEvent(
                'onresize',
                function () {
                    p.updateCanvasDimensions();
                }
            );
        }
        else if (window.addEventListener) {
            window.addEventListener(
                'resize',
                function () {
                    p.updateCanvasDimensions();
                },
                true
            );
        }
        else {
            //The browser does not support Javascript event binding
        }
    };

    useEffect(() => {
        new p5(Sketch, sketchRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div ref={sketchRef}>
            <PlayIcon />
        </div>
    );
};

export default P5Sketch;
