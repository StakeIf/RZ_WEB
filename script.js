let canvas, ctx, W, H;

let h1 = document.getElementsByTagName('h1')[0];

let sec = 0;
let f = 1;
let test = 1;
let t;

let popLimit = 30;
let DefSpeed = 1;
let DefRad = 10;

let OldX = 0, OldY = 0;

//Человек
class Human {
    constructor(x, y, vx, vy, exp) {
        this.x = x;
        this.y = y;

        this.radius = DefRad;

        this.vx = vx;
        this.vy = vy;

        this.exp = exp;
        this.time = 0;

        this.isCollide = false;
    }
    initChild(exp2, x2, y2) {

        let rnd = Math.random() * 10 + 40;

        let xx, yy;

        if (this.x > x2 && this.x + 100 < W) {
            xx = this.x + rnd;
            yy = this.y;
        }
        else {
            xx = x2 - rnd;
            yy = y2;
        }

        if (this.y - 100 > 0)
            yy -= rnd;
        else
            yy += rnd;

        let xV = parseInt(Math.random() * 2);
        let yV = parseInt(Math.random() * 2);

        xV == 0 ? xV = 1 : xV = -1;
        yV == 0 ? yV = 1 : yV = -1;

        let h = new Human(xx, yy, xV, yV, (this.exp + exp2) / 2);

        population.push(h);
    }
    initPOP() {
        for (let i = 0; i < populationCount; i++) {

            let rndX = Math.random() * (W - 60) + 30;
            let rndY = Math.random() * (H - 60) + 30;

            let xV = parseInt(Math.random() * 2);
            let yV = parseInt(Math.random() * 2);

            xV == 0 ? xV = 1 : xV = -1;
            yV == 0 ? yV = 1 : yV = -1;

            let h = new Human(rndX, rndY, xV, yV, 0);

            population.push(h);
        }
    }
}
//Хорошее обстоятельство
class good {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.radius = 8;

        this.isCollide = false;
    }
    initPOP() {
        for (let i = 0; i < GoodCount; i++) {

            let rndX = Math.random() * (W - 60) + 30;
            let rndY = Math.random() * (H - 60) + 30;

            let t = new good(rndX, rndY);

            popGood.push(t);
        }
    }
}
//Плохое обстоятельство
class bad {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.radius = 8;

        this.isCollide = false;
    }
    initPOP() {
        for (let i = 0; i < badCount; i++) {

            let rndX = Math.random() * (W - 60) + 30;
            let rndY = Math.random() * (H - 60) + 30;

            let b = new bad(rndX, rndY);

            popBad.push(b);
        }
    }
}

//КНОПКИ
let start = document.getElementById('strt');
let stop = document.getElementById('stp');
let speed = document.getElementById('spd2');
let speed0 = document.getElementById('spd0');

//Функция кнопки СТАРТ
start.onclick = function () {
    f = 1;
    sec = 0;
    DefSpeed = 1;
    h1.textContent = sec + ' г.';

    populationCount = parseInt(document.getElementById('fieldPopulation').value);
    if (!populationCount) populationCount = 20;

    popLimit = parseInt(document.getElementById('fieldMAX').value);
    if (!popLimit) popLimit = 60;

    GoodCount = parseInt(document.getElementById('fieldGood').value);
    if (!GoodCount) GoodCount = 5;

    badCount = parseInt(document.getElementById('fieldBad').value);
    if (!badCount) badCount = 5;

    population = [];
    popGood = [];
    popBad = [];

    window.cancelAnimationFrame(null);
    delPopulation();
    new Human().initPOP();

    new bad().initPOP();
    new good().initPOP();

    if (test) {
        timer();
        initDraw();
    }

    test = 0;
}

//Функция кнопки Х2
speed.onclick = function () {
    DefSpeed = 2;
}
//Функция кнопки Х1
speed0.onclick = function () {
    DefSpeed = 1;
}
//Функция кнопки СТОП
stop.onclick = function () {
    f = 0;
    test = 1;
    clearTimeout(t);
    stopDraw();
}

//Инициализация окна
function init() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext('2d');
    W = canvas.width;
    H = canvas.height;
}

//Тик для таймера
function tick() {
    sec += 3;
    h1.textContent = sec + ' г.';
    for (let i = 0; i < population.length; i++) {
        let h = population[i];
        h.time++;
    }
    timer();
}
//Таймер
function timer() {
    t = setTimeout(tick, 1000 / DefSpeed);
}
//Удалить все популяции
function delPopulation() {
    population.splice(0, population.length);
    popGood.splice(0, popGood.length);
    popBad.splice(0, popBad.length);
}
//Отрисовка, анимация
function initDraw() {
    ctx.clearRect(0, 0, W, H);
    detectCollisions();
    DetectGB();

    if (!population.length) {
        alert('Популяция вымерла');
        stop.onclick();
    }

    for (let j = 0; j < popGood.length; j++) {
        let t = popGood[j];

        ctx.beginPath();
        ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2, 0);
        ctx.closePath();

        ctx.fillStyle = 'green';
        ctx.strokeStyle = 'black';
        ctx.fill();
    }

    for (let j = 0; j < popBad.length; j++) {
        let b = popBad[j];

        ctx.beginPath();
        ctx.arc(b.x, b.y, t.radius, 0, Math.PI * 2, 0);
        ctx.closePath();

        ctx.fillStyle = 'maroon';
        ctx.strokeStyle = 'black';
        ctx.fill();
    }

    for (let i = 0; i < population.length; i++) {
        let h = population[i];
        if (h.time >= 25) {
            population.splice(i, 1);
            i--;
            continue;
        }

        h.x += DefSpeed * 0.6 * h.vx;
        h.y += DefSpeed * 0.6 * h.vy;

        if (h.x - h.radius <= 0 || h.x + h.radius >= W)
            h.vx = -h.vx;

        if (h.y - h.radius <= 0 || h.y + h.radius >= H)
            h.vy = -h.vy;

        ctx.beginPath();
        ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2, 0);
        ctx.closePath();

        if (h.x - h.radius - 20 > 0 && h.x + h.radius + 20 < W && h.y - h.radius - 20 > 0 && h.y + h.radius + 20 < H) {
            if (h.time >= 5 && h.time < 10)
                h.radius = DefRad + 5;

            if (h.time >= 10 && h.time < 15)
                h.radius = DefRad + 10;

            if (h.time >= 15 && h.time < 20)
                h.radius = DefRad + 15;

            if (h.time >= 20 && h.time < 25)
                h.radius = DefRad + 20;
        }


        if (h.exp <= -75) {
            ctx.fillStyle = 'black';
            ctx.strokeStyle = 'black';
            ctx.fill();
        }
        if (h.exp > -75 && h.exp <= -50) {
            ctx.fillStyle = 'DimGray';
            ctx.strokeStyle = 'black';
            ctx.fill();
        }
        if (h.exp > -50 && h.exp <= -30) {
            ctx.fillStyle = 'DarkGray ';
            ctx.strokeStyle = 'black';
            ctx.fill();
        }
        if (h.exp > -30 && h.exp <= -10) {
            ctx.fillStyle = 'Gainsboro';
            ctx.strokeStyle = 'black';
            ctx.fill();
        }
        if (h.exp > -10 && h.exp <= 10) {
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.stroke();
        }
        if (h.exp > 10 && h.exp <= 30) {
            ctx.fillStyle = 'yellow';
            ctx.strokeStyle = 'black';
            ctx.fill();
        }
        if (h.exp > 30 && h.exp <= 50) {
            ctx.fillStyle = 'gold';
            ctx.strokeStyle = 'black';
            ctx.fill();
        }
        if (h.exp > 50 && h.exp <= 75) {
            ctx.fillStyle = 'orange';
            ctx.strokeStyle = 'black';
            ctx.fill();
        }
        if (h.exp > 75) {
            ctx.fillStyle = 'orangered';
            ctx.strokeStyle = 'black';
            ctx.fill();
        }
    }
    if (f)
        window.requestAnimationFrame(initDraw);

}
//Очистка поля
function stopDraw() {
    ctx.clearRect(0, 0, W, H);
}

//Столкновение с обстоятельствами
function DetectGB() {
    let h, t, b;

    for (let i = 0; i < population.length; i++) {
        population[i].isCollide = false;
    }
    for (let i = 0; i < popGood.length; i++) {
        popGood[i].isCollide = false;
    }
    for (let i = 0; i < popBad.length; i++) {
        popBad[i].isCollide = false;
    }

    for (let i = 0; i < population.length; i++) {
        h = population[i];

        for (let j = 0; j < popGood.length; j++) {
            t = popGood[j];

            let dx = h.x - t.x;
            let dy = h.y - t.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < h.radius + t.radius) {
                h.exp += 5;
                t.x = Math.random() * (W - 60) + 30;
                t.y = Math.random() * (H - 60) + 30;
            }
        }
        for (let j = 0; j < popBad.length; j++) {
            b = popBad[j];

            let bdx = h.x - b.x;
            let bdy = h.y - b.y;
            let bdistance = Math.sqrt(bdx * bdx + bdy * bdy);

            if (bdistance < h.radius + b.radius) {
                h.exp -= 5;
                b.x = Math.random() * (W - 60) + 30;
                b.y = Math.random() * (H - 60) + 30;
            }
        }
    }
}
//Столкновение людей
function detectCollisions() {
    let h1, h2;

    for (let i = 0; i < population.length; i++) {
        population[i].isCollide = false;
    }

    for (let i = 0; i < population.length; i++) {
        h1 = population[i];

        for (let j = i + 1; j < population.length; j++) {
            h2 = population[j];

            let dx = h1.x - h2.x;
            let dy = h1.y - h2.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < h1.radius + h2.radius) {

                let srX = (h1.x + h2.x) / 2;
                let srY = (h1.y + h2.y) / 2;

                if (srX < OldX - 20 || srX > OldX + 20 || srY < OldY - 20 || srY > OldY + 20) {
                    //Передача опыта
                    let hh = h1.exp;

                    if (h1.time >= 1 && h2.time >= 1) {
                        if (h1.exp * h2.exp >= 0) { //Если одного знака
                            if (Math.abs(h2.exp) > Math.abs(h1.exp))
                                if (Math.abs(h1.exp) + Math.abs(h2.exp) / 10 <= 100 && Math.abs(h1.exp) + Math.abs(h2.exp) / 10 <= Math.abs(h2.exp))
                                    h1.exp += h2.exp / 10;
                                else {
                                    if (Math.abs(h2.exp) + Math.abs(h1.exp) / 10 <= 100 && Math.abs(h2.exp) + Math.abs(h1.exp) / 10 <= Math.abs(h2.exp))
                                        h2.exp += hh / 10;
                                }
                        }
                        else {
                            h1.exp += h2.exp / 10;
                            h2.exp += hh / 10;
                        }
                    }

                    //Появление потомка
                    let rndRod = Math.random() * 100;

                    if (((h1.time >= 6 && h1.time < 10 && h2.time >= 6 && h2.time < 10) || (h1.time >= 11 && h1.time < 15 && h2.time >= 11 && h2.time < 15)) && population.length <= popLimit && rndRod <= 90) {
                        h1.initChild(h2.exp, h2.x, h2.y);
                    }
                }

                OldX = srX;
                OldY = srY;

                h1.isCollide = true;
                h2.isCollide = true;

                let collision = {
                    x: h2.x - h1.x,
                    y: h2.y - h1.y
                };

                let collisionNormal = {
                    x: collision.x / distance,
                    y: collision.y / distance
                };

                let relV = {
                    x: h1.vx - h2.vx,
                    y: h1.vy - h2.vy
                };

                let speedV = relV.x * collisionNormal.x + relV.y * collisionNormal.y;

                if (speedV < 0)
                    break;

                h1.vx -= speedV * collisionNormal.x;
                h1.vy -= speedV * collisionNormal.y;

                h2.vx += speedV * collisionNormal.x;
                h2.vy += speedV * collisionNormal.y;

                if (Math.abs(h1.vx) < 0.5) {
                    if (h1.vx < 0) {
                        h1.vx = -1;
                    }
                    else {
                        h1.vx = 1;
                    }
                }
                if (Math.abs(h1.vy) < 0.5) {
                    if (h1.vy < 0) {
                        h1.vy = -1;
                    }
                    else {
                        h1.vy = 1;
                    }
                }


                if (Math.abs(h2.vx) < 0.5) {
                    if (h2.vx < 0) {
                        h2.vx = -1;
                    }
                    else {
                        h2.vx = 1;
                    }
                }
                if (Math.abs(h2.vy) < 0.5) {
                    if (h2.vy < 0) {
                        h2.vy = -1;
                    }
                    else {
                        h2.vy = 1;
                    }
                }
            }
        }
    }
}


window.onload = init;