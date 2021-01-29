import React, { useEffect, useRef } from "react";
import PlayIcon from './PlayIcon.js';
import './globals';
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";
import audio from '../audio/rectangles-no-12.ogg'
import cueSet1 from './cueSet1.js'
import cueSet2 from './cueSet2.js'
import cueSet3 from './cueSet3.js'



const P5Sketch = () => {

    const sketchRef = useRef();

    const Sketch = p => {

        p.canvas = null;

        p.canvasWidth = window.innerWidth;

        p.canvasHeight = window.innerHeight;
        
        p.song = null;

        p.cueSet1Completed = [];

        p.cueSet2Completed = [];
        
        p.cueSet3Completed = [];

        p.centerX = window.innerWidth / 4;

        p.centerY = window.innerHeight / 2;

        p.leftAmp = window.innerWidth / 4;
        
        p.rightAmp = window.innerWidth / 4;

        p.baseHue = p.random([60, 120, 180, 240, 300, 360]);

        p.lightnessIndex = 1;

        p.setup = () => {
            p.canvas = p.createCanvas(p.canvasWidth, p.canvasHeight); 
            p.colorMode(p.HSL);
            p.background(0,0,94);
            p.smooth();
            p.noFill();
            p.strokeWeight(2);

            p.song = p.loadSound(audio);
            p.song.onended(p.logCredits);
            for (let i = 0; i < cueSet1.length; i++) {
                p.song.addCue(cueSet1[i].time, p.executeCueSet1, (i + 1));
            }
            for (let i = 0; i < cueSet2.length; i++) {
                p.song.addCue(cueSet2[i].time, p.executeCueSet2, (i + 1));
            }
            for (let i = 0; i < cueSet3.length; i++) {
                p.song.addCue(cueSet3[i].time, p.executeCueSet3, (i + 1));
            }
        };

        p.draw = () => {

            if (p.song._lastPos > 0 && p.song.isPlaying()) {
                
            }
          
        };

        p.executeCueSet1 = (currentCue) => {
            if (!p.cueSet1Completed.includes(currentCue)) {
                p.cueSet1Completed.push(currentCue);

                if (currentCue > 1) {
                    p.clear();
                    p.rightAmp = window.innerWidth / 4;
                    p.leftAmp = window.innerWidth / 4;
                    p.lightnessIndex = 1;
                    p.baseHue = p.baseHue + 60;
                    if (p.baseHue > 360) {
                        p.baseHue = p.baseHue - 360;
                    }
                }
            }
        }

        p.executeCueSet2 = (currentCue) => {
            if (!p.cueSet2Completed.includes(currentCue)) {
                p.cueSet2Completed.push(currentCue);


                p.rightA = p.centerX + p.random(p.rightAmp) * (180 / p.TWO_PI);
                p.rightB = p.centerY + p.random(p.rightAmp) * (180 / p.TWO_PI);
                p.leftA = p.centerX + p.random(p.leftAmp) * (180 / p.TWO_PI);
                p.leftB = p.centerY + p.random(p.leftAmp) * (180 / p.TWO_PI);

                for (var i = 0; i <= 360; i += .1) {

                    p.rightX = p.centerX - p.rightAmp * p.sin(p.rightA * i * p.TWO_PI / 180) + (p.centerX * 2);
                    p.rightY = p.centerY - p.rightAmp * p.sin(p.rightB * i * p.TWO_PI / 180);
                    p.leftX = (p.centerX - p.leftAmp * p.sin(p.leftA * i * p.TWO_PI / 180));
                    p.leftY = p.centerY - p.leftAmp * p.sin(p.leftB * i * p.TWO_PI / 180);

                    //left rectangle
                    p.stroke(p.baseHue + 120, 100, 60, 1);
                    p.point(p.leftX, p.rightY);
                    p.point(p.rightY, p.leftX);

                    if (currentCue < 24) {
                        //right rectangle
                        p.stroke(p.baseHue, 100, 20, 1);
                        p.point(p.rightX, p.rightY);
                        p.point(p.rightY, p.rightX);
                    }

                }

                if (currentCue % 12 !== 11) {
                    p.leftAmp *= .9;

                    if (currentCue < 24) {
                        p.rightAmp *= .8;
                    }
                }
            }
        }

        p.executeCueSet3 = (currentCue) => {
            if (!p.cueSet3Completed.includes(currentCue)) {
                p.cueSet3Completed.push(currentCue);

                p.rightA = p.centerX + p.random(p.rightAmp) * (180 / p.TWO_PI);
                p.rightB = p.centerY + p.random(p.rightAmp) * (180 / p.TWO_PI);

                for (var i = 0; i <= 360; i += .1) {

                    p.rightX = p.centerX - p.rightAmp * p.sin(p.rightA * i * p.TWO_PI / 180) + (p.centerX * 2);
                    p.rightY = p.centerY - p.rightAmp * p.sin(p.rightB * i * p.TWO_PI / 180);

                    //right rectangle
                    p.stroke(p.baseHue, 100, 80 - (5 * p.lightnessIndex), 1);
                    p.point(p.rightX, p.rightY);
                    p.point(p.rightY, p.rightX);

                }

                p.lightnessIndex++;
                p.rightAmp *= .80;
                
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
            p.cueSet1Completed = [];
            p.cueSet2Completed = [];
            p.cueSet3Completed = [];
            p.baseHue = p.random([60, 120, 180, 240, 300, 360]);
            p.rightAmp = window.innerWidth / 4;
            p.leftAmp = window.innerWidth / 4;
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
