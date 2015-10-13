/** This is the master i-flicks object which controls uploads, playing and editing videos
 */
window.iflicks = (function iflicks(settings) {
    'use strict';
    function ajax(url, payload, contentType, method, callback) {
        try {
            var r = new XMLHttpRequest();
            r.open(method, url, true);
            if (contentType === 'json') {
                r.setRequestHeader('Content-Type', 'application/json');
            }
            r.onreadystatechange = function () {
                if (r.readyState !== 4 || r.status !== 200) { return; }
                callback(null, r.responseText);
            };
            r.send(payload);
            r.onerror = function (err) { callback('Network error.' + err, null); };
        } catch (ex) {
            callback(ex.message, null);
        }
    }
    function getJSON(url, callback) {
        ajax(url, undefined, 'json', 'GET', function (err, json) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, JSON.parse(json));
            }
        });
    }

    function getCookie(k) { return (document.cookie.match('(^|; )' + k + '=([^;]*)') || 0)[2]; }
    function setCookie(n, v, d) {
        var e, dd;
        if (d) {
            dd = new Date();
            dd.setTime(dd.getTime() + (d * 24 * 60 * 60 * 1000));
            e = "; expires=" + dd.toGMTString();
        } else { e = ""; }
        document.cookie = n + "=" + v + e + "; path=/";
    }

    function cookieCheck() {
        if (getCookie('cookeiConsent') === 'true') {
            document.getElementById('cookieBanner').className = 'hide';
        }
    }
    function cookieAccept() {
        document.getElementById('cookieBanner').className = 'hide';
        setCookie('cookeiConsent', 'true', 365);
    }

    function showImage(imageArray, index) {
        var imgContainer, img, carousel = document.getElementById('carousel');
        if (imageArray[index].img !== undefined) {
            img = imageArray[index].img;
        } else {
            img = document.createElement('img');
            img.src = 'photos/' + imageArray[index].src;
            img.className = 'hide1 carouselImage';
            imageArray[index].img = img;
        }
        if (carousel.firstChild !== undefined && carousel.firstChild !== null) {
            carousel.appendChild(img);
            carousel.firstChild.classList.remove('show');
            carousel.firstChild.classList.add('hide1');
            setTimeout(function () { 
                carousel.removeChild(carousel.firstChild); 
                img.classList.remove('hide1');
                img.classList.add('show');
            }, 400);
        } else { // initial load
            carousel.appendChild(img);
            setTimeout(function () { 
                img.classList.add('show');
            }, 50);
        }
        

        if (imageArray.length > index + 1) {
            index++;
        } else {
            index = 0;
        }
        setTimeout(showImage, 3000, imageArray, index);
    }
    function showImages() {
        var carousel = document.getElementById('carousel');
        while (carousel.firstChild) {
            carousel.removeChild(carousel.firstChild);
        }
        getJSON('images', function (err, images) {
            showImage(images, 0);
        });
    }

    function start() {
        document.getElementById('submitCookieAccept').onclick = cookieAccept;
        cookieCheck();
        showImages();
    }

    if (document.addEventListener !== undefined) {
        document.addEventListener('DOMContentLoaded', function () {
            start();
        });
    } else {
        start();
    }
}({}));